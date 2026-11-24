/**
 * Casamento Danilo & Tereza — recebe os formulários do site.
 *
 * Fica ligado à planilha (Extensões → Apps Script) e é publicado como "App da Web".
 * O site envia as respostas para o endereço da publicação; este script:
 *   1. confere o campo-armadilha (spam), os campos e a data limite;
 *   2. grava na planilha (aba "Confirmações" ou "Presentes");
 *   3. envia um e-mail de aviso aos noivos.
 *
 * Configurações (Configurações do projeto → Propriedades do script), sem mexer no código:
 *   AVISAR_EMAILS  e-mails que recebem os avisos, separados por vírgula
 *   DATA_LIMITE    último momento para confirmar, ex.: 2027-01-31T23:59:59-03:00 (vazio = sem limite)
 *
 * Confirmação individual: cada convidado responde por si (sem acompanhantes no mesmo envio).
 *
 * Passo a passo de instalação: docs/guia-planilha.md
 * Este arquivo é a fonte: depois de alterar aqui, copie de novo para o editor do Apps Script
 * e publique uma nova versão (Implantar → Gerenciar implantações → editar → Nova versão).
 */

const ABAS = {
  confirmacoes: 'Confirmações',
  presentes: 'Presentes',
  resumo: 'Resumo',
}

/**
 * Colunas de cada aba: título, largura (px) e formato.
 * quebra: o texto longo quebra em várias linhas em vez de ser cortado.
 */
const COLUNAS_CONFIRMACOES = [
  { titulo: 'Recebido em', largura: 150, formato: 'dd/mm/yyyy hh:mm' },
  { titulo: 'Atualizado em', largura: 150, formato: 'dd/mm/yyyy hh:mm' },
  { titulo: 'Nome', largura: 230 },
  { titulo: 'Telefone', largura: 140, formato: '@' }, // texto: não vira número
  { titulo: 'Vai comparecer?', largura: 140, centro: true },
  { titulo: 'Recado', largura: 340, quebra: true },
  { titulo: 'Anotações dos noivos', largura: 280, quebra: true },
]

const COLUNAS_PRESENTES = [
  { titulo: 'Recebido em', largura: 150, formato: 'dd/mm/yyyy hh:mm' },
  { titulo: 'Nome', largura: 230 },
  { titulo: 'Cota', largura: 240 },
  { titulo: 'Valor (R$)', largura: 120, formato: '"R$" #,##0.00' },
  { titulo: 'Recado', largura: 340, quebra: true },
  { titulo: 'Anotações dos noivos', largura: 280, quebra: true },
]

/** Cores da planilha, as mesmas do site */
const CORES = {
  marinho: '#14213d',
  marfim: '#fbfaf7',
  listra: '#f1f5fa',
  simFundo: '#e3f2e6',
  simTexto: '#1d6a38',
  naoFundo: '#fbe7e6',
  naoTexto: '#9c2f2a',
}

// ---------------------------------------------------------------------------
// Entrada: o site envia para cá
// ---------------------------------------------------------------------------

function doPost(e) {
  const trava = LockService.getScriptLock()
  try {
    const dados = JSON.parse((e && e.postData && e.postData.contents) || '{}')

    // Campo-armadilha preenchido = robô. Responde "ok" para ele não insistir, e não grava nada.
    if (dados.website) return resposta({ ok: true })

    trava.waitLock(10000) // evita duas respostas escrevendo na mesma linha ao mesmo tempo

    if (dados.tipo === 'confirmacao') return resposta(receberConfirmacao(dados))
    if (dados.tipo === 'presente') return resposta(receberPresente(dados))
    return resposta({ ok: false, erro: 'tipo_invalido' })
  } catch (erro) {
    console.error(erro)
    return resposta({ ok: false, erro: 'interno' })
  } finally {
    trava.releaseLock()
  }
}

/** Abrir o endereço no navegador mostra que o serviço está no ar */
function doGet() {
  return resposta({ ok: true, servico: 'casamento-danilo-tereza' })
}

// ---------------------------------------------------------------------------
// Confirmação de presença
// ---------------------------------------------------------------------------

function receberConfirmacao(dados) {
  const limite = propriedade('DATA_LIMITE')
  if (limite && new Date() > new Date(limite)) return { ok: false, erro: 'prazo_encerrado' }

  const nome = texto(dados.nome, 120)
  const telefone = normalizarTelefone(dados.telefone)
  // Confirmação individual (pedido dos noivos): cada convidado responde por si
  const vai = dados.comparece === 'sim'
  const recado = texto(dados.recado, 1000)

  if (nome.length < 2) return { ok: false, erro: 'nome' }
  if (!telefone) return { ok: false, erro: 'telefone' }
  if (dados.comparece !== 'sim' && dados.comparece !== 'nao')
    return { ok: false, erro: 'comparece' }

  const aba = planilha().getSheetByName(ABAS.confirmacoes)
  const agora = new Date()
  const linhaExistente = procurarTelefone(aba, telefone)
  const valores = [nome, telefone, vai ? 'Sim' : 'Não', recado].map(seguro)

  if (linhaExistente) {
    // Mesmo telefone: atualiza a resposta (mantém "Recebido em" e as anotações dos noivos)
    aba.getRange(linhaExistente, 2).setValue(agora)
    aba.getRange(linhaExistente, 3, 1, valores.length).setValues([valores])
  } else {
    aba.appendRow([agora, '', ...valores, ''])
  }

  avisarConfirmacao({
    nome,
    telefone,
    vai,
    recado,
    atualizou: !!linhaExistente,
  })
  return { ok: true, atualizado: !!linhaExistente }
}

function avisarConfirmacao(r) {
  const assunto = r.atualizou
    ? `🔁 ${r.nome} atualizou a resposta: ${r.vai ? 'vai' : 'não vai'}`
    : r.vai
      ? `✅ ${r.nome} confirmou presença`
      : `❌ ${r.nome} não poderá ir`
  const linhas = [
    `Nome: ${r.nome}`,
    `Telefone: ${formatarTelefone(r.telefone)}`,
    `Vai comparecer? ${r.vai ? 'Sim' : 'Não'}`,
    r.recado ? `\nRecado:\n${r.recado}` : null,
    `\nPlanilha completa: ${planilha().getUrl()}`,
  ]
  enviarAviso(assunto, linhas)
}

// ---------------------------------------------------------------------------
// Registro de presente (intenção; o pagamento é conferido no app de pagamento)
// ---------------------------------------------------------------------------

function receberPresente(dados) {
  const nome = texto(dados.nome, 120)
  const cota = texto(dados.cota, 120)
  const valor = Number(dados.valor)
  const recado = texto(dados.recado, 1000)

  if (nome.length < 2) return { ok: false, erro: 'nome' }
  if (!cota) return { ok: false, erro: 'cota' }
  if (!(valor > 0)) return { ok: false, erro: 'valor' }

  planilha()
    .getSheetByName(ABAS.presentes)
    .appendRow([new Date(), seguro(nome), seguro(cota), valor, seguro(recado), ''])

  enviarAviso(`🎁 ${nome} escolheu presentear: ${cota}`, [
    `Nome: ${nome}`,
    `Cota: ${cota} (R$ ${valor.toFixed(2).replace('.', ',')})`,
    recado ? `\nRecado:\n${recado}` : null,
    '\nAtenção: isto é a intenção de presentear. Confira o pagamento no app.',
    `\nPlanilha completa: ${planilha().getUrl()}`,
  ])
  return { ok: true }
}

// ---------------------------------------------------------------------------
// Instalação: rodar UMA vez pelo editor (Executar → configurar)
// ---------------------------------------------------------------------------

function configurar() {
  const ss = planilha()
  // Planilha em português do Brasil: "R$ 1.234,56", datas dd/mm, fuso de Fortaleza
  ss.setSpreadsheetLocale('pt_BR')
  ss.setSpreadsheetTimeZone('America/Fortaleza')

  const confirmacoes = prepararAba(ss, ABAS.confirmacoes, COLUNAS_CONFIRMACOES)
  destacarSimNao(confirmacoes, 'E')
  travarAba(confirmacoes, COLUNAS_CONFIRMACOES.length)

  const presentes = prepararAba(ss, ABAS.presentes, COLUNAS_PRESENTES)
  travarAba(presentes, COLUNAS_PRESENTES.length)

  const resumo = ss.getSheetByName(ABAS.resumo) || ss.insertSheet(ABAS.resumo)
  resumo.clear()
  const c = `'${ABAS.confirmacoes}'`
  const p = `'${ABAS.presentes}'`
  // Em português, as fórmulas separam argumentos com ";" (em inglês, com ",")
  const sep = ss.getSpreadsheetLocale().startsWith('en') ? ',' : ';'
  resumo.getRange('A1:B1').merge().setValue('Resumo do casamento')
  resumo
    .getRange('A1')
    .setFontSize(16)
    .setFontWeight('bold')
    .setFontColor(CORES.marfim)
    .setBackground(CORES.marinho)
    .setVerticalAlignment('middle')
  resumo.setRowHeight(1, 44)
  const itens = [
    ['Respostas recebidas', `=COUNTA(${c}!C2:C)`],
    ['Vão comparecer', `=COUNTIF(${c}!E2:E${sep}"Sim")`],
    ['Não poderão ir', `=COUNTIF(${c}!E2:E${sep}"Não")`],
    ['Presentes registrados', `=COUNTA(${p}!B2:B)`],
    ['Valor dos presentes registrados (intenção)', `=SUM(${p}!D2:D)`],
  ]
  resumo.getRange(3, 1, itens.length, 2).setValues(itens)
  resumo.getRange(3, 1, itens.length, 2).setFontSize(12).setVerticalAlignment('middle')
  resumo
    .getRange(3, 2, itens.length, 1)
    .setFontSize(14)
    .setFontWeight('bold')
    .setFontColor(CORES.marinho)
    .setHorizontalAlignment('right')
  resumo.getRange(3 + itens.length - 1, 2).setNumberFormat('"R$" #,##0.00') // valor, a última linha
  for (let linha = 3; linha < 3 + itens.length; linha++) resumo.setRowHeight(linha, 32)
  resumo.getBandings().forEach((b) => b.remove())
  resumo
    .getRange(3, 1, itens.length, 2)
    // sem linha de cabeçalho: senão a primeira linha fica cinza
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false)
    .setFirstRowColor('#ffffff')
    .setSecondRowColor(CORES.listra)
  resumo.setColumnWidth(1, 380)
  resumo.setColumnWidth(2, 170)
  resumo.setHiddenGridlines(true)
  travarAba(resumo, 0)

  // Remove a "Página1" vazia criada com a planilha
  const vazia = ss.getSheetByName('Página1') || ss.getSheetByName('Sheet1')
  if (vazia && ss.getSheets().length > 1 && vazia.getLastRow() === 0) ss.deleteSheet(vazia)
  ss.setActiveSheet(resumo)
  ss.moveActiveSheet(1)

  // Configurações iniciais (se ainda não existirem)
  const props = PropertiesService.getScriptProperties()
  if (!props.getProperty('AVISAR_EMAILS')) {
    props.setProperty('AVISAR_EMAILS', Session.getEffectiveUser().getEmail())
  }
  if (props.getProperty('DATA_LIMITE') === null) props.setProperty('DATA_LIMITE', '')

  SpreadsheetApp.flush()
  console.log('Pronto. Avisos para: ' + props.getProperty('AVISAR_EMAILS'))
}

/**
 * Teste pelo editor (Executar → testarConfirmacao): grava uma resposta de teste e envia
 * o e-mail. Serve também para autorizar o envio de e-mails. Apague a linha de teste depois.
 */
function testarConfirmacao() {
  const saida = doPost({
    postData: {
      contents: JSON.stringify({
        tipo: 'confirmacao',
        nome: 'Teste do Leonardo',
        telefone: '85900000000',
        comparece: 'sim',
        recado: 'Mensagem de teste — pode apagar esta linha.',
      }),
    },
  })
  console.log(saida.getContent())
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

function planilha() {
  return SpreadsheetApp.getActiveSpreadsheet()
}

function propriedade(chave) {
  return (PropertiesService.getScriptProperties().getProperty(chave) || '').trim()
}

/**
 * Cabeçalho marinho, larguras fixas por coluna, letra maior, linhas listradas.
 * Pode ser rodado de novo sem apagar respostas: só refaz o visual.
 */
function prepararAba(ss, nome, colunas) {
  const aba = ss.getSheetByName(nome) || ss.insertSheet(nome)
  const total = colunas.length
  const titulos = colunas.map((c) => c.titulo)

  // Estrutura de colunas mudou? Se a aba ainda não tem respostas, recomeça do zero;
  // se tem, para aqui, para nunca embaralhar dados reais.
  const atuais = aba
    .getRange(1, 1, 1, aba.getMaxColumns())
    .getValues()[0]
    .filter((v) => v !== '')
  const mudou = atuais.length > 0 && atuais.join('|') !== titulos.join('|')
  if (mudou && aba.getLastRow() > 1) {
    throw new Error(
      `A aba "${nome}" tem respostas e as colunas mudaram. Faça uma cópia da aba, apague as respostas e rode configurar de novo.`,
    )
  }
  if (mudou) {
    aba.showColumns(1, aba.getMaxColumns())
    aba.clear()
    aba.clearConditionalFormatRules()
  }
  const linhas = aba.getMaxRows()

  aba
    .getRange(1, 1, 1, total)
    .setValues([titulos])
    .setFontWeight('bold')
    .setFontSize(11)
    .setFontColor(CORES.marfim)
    .setBackground(CORES.marinho)
    .setVerticalAlignment('middle')
    .setWrap(true)
  aba.setRowHeight(1, 40)
  aba.setFrozenRows(1)

  // Dados: letra 11, alinhados ao topo (textos longos quebram para baixo)
  aba
    .getRange(2, 1, linhas - 1, total)
    .setFontSize(11)
    .setVerticalAlignment('top')

  colunas.forEach((coluna, i) => {
    const n = i + 1
    aba.setColumnWidth(n, coluna.largura)
    const dados = aba.getRange(2, n, linhas - 1, 1)
    if (coluna.formato) dados.setNumberFormat(coluna.formato)
    dados.setWrap(!!coluna.quebra)
    if (coluna.centro) {
      dados.setHorizontalAlignment('center')
      aba.getRange(1, n).setHorizontalAlignment('center')
    }
  })

  // Linhas listradas (o cabeçalho mantém o fundo marinho)
  aba.getBandings().forEach((b) => b.remove())
  aba
    .getRange(1, 1, linhas, total)
    .applyRowBanding()
    .setHeaderRowColor(CORES.marinho)
    .setFirstRowColor('#ffffff')
    .setSecondRowColor(CORES.listra)

  // Esconde as colunas vazias à direita: a aba termina onde os dados terminam
  const sobra = aba.getMaxColumns() - total
  if (sobra > 0) aba.hideColumns(total + 1, sobra)
  return aba
}

/** "Sim" em verde e "Não" em vermelho-claro, para ver de relance quem vem */
function destacarSimNao(aba, letra) {
  const faixa = aba.getRange(`${letra}2:${letra}`)
  const outras = aba
    .getConditionalFormatRules()
    .filter((r) => !r.getRanges().some((g) => g.getA1Notation() === faixa.getA1Notation()))
  aba.setConditionalFormatRules([
    ...outras,
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Sim')
      .setBackground(CORES.simFundo)
      .setFontColor(CORES.simTexto)
      .setBold(true)
      .setRanges([faixa])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Não')
      .setBackground(CORES.naoFundo)
      .setFontColor(CORES.naoTexto)
      .setBold(true)
      .setRanges([faixa])
      .build(),
  ])
}

/** Só o dono (a conta do projeto, e portanto o script) edita; a última coluna fica livre */
function travarAba(aba, totalColunas) {
  aba.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach((p) => p.remove())
  const protecao = aba.protect().setDescription('Preenchida pelo site. Use a coluna de anotações.')
  if (totalColunas > 0) {
    protecao.setUnprotectedRanges([aba.getRange(1, totalColunas, aba.getMaxRows(), 1)])
  }
  protecao.removeEditors(protecao.getEditors())
  if (protecao.canDomainEdit()) protecao.setDomainEdit(false)
}

function procurarTelefone(aba, telefone) {
  const ultima = aba.getLastRow()
  if (ultima < 2) return null
  const telefones = aba.getRange(2, 4, ultima - 1, 1).getValues()
  for (let i = 0; i < telefones.length; i++) {
    if (String(telefones[i][0]) === telefone) return i + 2
  }
  return null
}

/** Só dígitos, com DDI 55: 10 ou 11 dígitos nacionais */
function normalizarTelefone(valor) {
  let d = String(valor || '').replace(/\D/g, '')
  if (d.length >= 12 && d.startsWith('55')) d = d.slice(2)
  if (d.length < 10 || d.length > 11) return ''
  return '55' + d
}

function formatarTelefone(t) {
  const d = t.slice(2)
  return d.length === 11
    ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
}

function texto(valor, maximo) {
  return String(valor || '')
    .trim()
    .slice(0, maximo)
}

/** Impede que um texto começando com = + - @ vire fórmula na planilha */
function seguro(valor) {
  return typeof valor === 'string' && /^[=+\-@]/.test(valor) ? "'" + valor : valor
}

function enviarAviso(assunto, linhas) {
  const para = propriedade('AVISAR_EMAILS')
  if (!para) return
  MailApp.sendEmail({
    to: para,
    subject: assunto,
    body: linhas.filter((l) => l !== null).join('\n'),
    name: 'Site do casamento',
  })
}

function resposta(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
