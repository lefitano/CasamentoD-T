# Guia: planilha de respostas e script do Google

Monta o "lado do Google" dos formulários do site (confirmação de presença e registro de presentes). Tempo: cerca de 15 minutos. Tudo é feito **logado na conta Gmail do projeto**.

## 1. Criar a planilha

1. Logado na conta do projeto, abra **[sheets.new](https://sheets.new)**.
2. Dê o nome **Casamento Danilo & Tereza — Respostas**.

## 2. Colar o script

1. Na planilha: **Extensões → Apps Script**.
2. No topo, renomeie o projeto para **Formulários do casamento**.
3. No arquivo **Código.gs**, apague tudo e cole o conteúdo de [`apps-script/Codigo.gs`](../apps-script/Codigo.gs).
4. Salve (ícone de disquete ou `Ctrl+S`).

## 3. Configurar a planilha (uma vez)

1. Na barra de cima, escolha a função **`configurar`** e clique em **Executar**.
2. O Google pede autorização:
   - **Revisar permissões** → escolha a conta do projeto;
   - aparece "O Google não verificou este app": é esperado, porque o app é seu. Clique em **Avançado → Acessar Formulários do casamento (não seguro)** → **Permitir**.
3. Volte à planilha. Devem existir três abas: **Resumo**, **Confirmações** e **Presentes**.

## 4. Testar

1. No Apps Script, escolha **`testarConfirmacao`** → **Executar**.
2. Confira:
   - a aba **Confirmações** ganhou a linha "Teste do Leonardo";
   - a aba **Resumo** mostra 1 resposta recebida e 1 em "Vão comparecer";
   - chegou um e-mail "✅ Teste do Leonardo confirmou presença" na conta do projeto.
3. Apague a linha de teste da aba **Confirmações** (a linha inteira).

## 5. Conferir as configurações

**Na instalação, não é preciso mudar nada:** o `configurar` (passo 3) já criou as duas propriedades. Só confira e siga para o passo 6.

Onde ficam: no Apps Script, **⚙ Configurações do projeto → Propriedades do script** (role a página até o fim).

| Propriedade | Como fica na instalação | Quando mudar |
|---|---|---|
| `AVISAR_EMAILS` | A conta do projeto | Quando chegarem os e-mails dos noivos: troque o **Valor** por eles, separados por vírgula (ex.: `fulano@gmail.com, ciclana@gmail.com`) |
| `DATA_LIMITE` | Vazio (sem limite) | Quando os noivos definirem o prazo: escreva no **Valor** a data neste formato, `2027-01-31T23:59:59-03:00` (31/01/2027, 23h59, horário de Brasília). Avise o Leonardo para colocar a mesma data no site (`src/content/rsvp.ts`) |

Depois de mudar, clique em **Salvar propriedades do script**. Vale na hora, sem publicar de novo.

## 6. Publicar (gera o endereço que o site usa)

1. **Implantar → Nova implantação**.
2. Na engrenagem ao lado de "Selecione o tipo", escolha **App da Web**.
3. Preencha:
   - Descrição: `v1`
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. **Implantar** e copie o **URL do app da Web** (termina em `/exec`).
5. **Me envie esse endereço.** Abrindo-o no navegador, aparece `{"ok":true,...}`: sinal de que está no ar.

## 7. Ligar ao site

**No Vercel:** projeto → **Settings → Environment Variables**:

- Name: `VITE_FORMS_URL`
- Value: o endereço do passo 6
- Environments: todos (Production, Preview, Development)

Depois, refaça o deploy (Deployments → ⋯ no último → **Redeploy**) ou faça um push.

**No seu computador** (para o `npm run dev` enviar de verdade): crie na raiz do projeto o arquivo `.env.local` com a linha abaixo. Ele não vai para o Git.

```
VITE_FORMS_URL=https://script.google.com/macros/s/…/exec
```

Sem esse arquivo, o `npm run dev` só **simula** o envio, para testar a tela sem gravar nada.

## 8. Compartilhar com os noivos

Quando tiver os e-mails pessoais deles: **Compartilhar** (canto superior direito) → e-mails → **Editor** → enviar.

- Eles editam livremente a coluna **Anotações dos noivos**; o resto das abas é preenchido só pelo site.
- Lembre de trocar `AVISAR_EMAILS` (passo 5) para os e-mails deles.

## Quando o script mudar

Se `apps-script/Codigo.gs` for alterado no projeto:

1. Cole o novo conteúdo em **Código.gs** e salve.
2. **Implantar → Gerenciar implantações → ✏ (editar)** → Versão: **Nova versão** → **Implantar**.

O endereço continua o mesmo; não é preciso mexer no site nem no Vercel.
