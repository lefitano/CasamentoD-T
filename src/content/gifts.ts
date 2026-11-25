import type { Gift } from './types'

/*
 * Lista de presentes (cotas): título, legenda, valor e foto, enviados pelos noivos (25/11).
 * Fotos: coloque em fotos-originais/presentes/<id>.jpg e rode `npm run fotos`;
 * a versão otimizada vai para public/fotos-originais/presentes/<id>.png (caminho abaixo).
 * O `id` também identifica o presente no Pix: use letras sem acento, números e hífen.
 *
 * ORDEM MISTURADA DE PROPÓSITO (pedido da noiva): os valores não ficam em ordem crescente,
 * para o convidado percorrer a vitrine procurando o valor que pode dar. Em cada linha
 * (2 presentes), um valor menor e um maior se alternam. Ao incluir um presente, mantenha isso.
 *
 * PROVISÓRIO: fotos ainda vão vir.
 */
export const gifts: Gift[] = [
  {
    id: 'pastel',
    name: 'Comer pastel de Belém',
    description:
      'Para os noivos matarem a vontade de comer um Pastel de Belém sem precisar vender a aliança.',
    amount: 50,
    image: { src: '/fotos-originais/presentes/pastelBelem.png', alt: 'Pastel de Belém' },
  },
  {
    id: 'cachorro',
    name: 'Um irmão para o Sheik',
    description:
      'Porque filho único também sente falta de companhia. Ajude a aumentar a família de quatro patas!',
    amount: 250,
    image: { src: '/fotos-originais/presentes/yorkshire.png', alt: 'Um filhote de yorkshire' },
  },
  {
    id: 'fogao',
    name: 'O verdadeiro dote do casamento',
    description:
      'Um fogão para Tereza preparar o tão esperado feijão de Danilo. Porque amor é lindo, mas homem feliz também precisa comer.',
    amount: 500,
    image: { src: '/fotos-originais/presentes/fogao.png', alt: 'Um fogão' },
  },
  {
    id: 'terno',
    name: 'Elegância do noivo',
    description:
      'Um terno para Danilo finalmente se vestir à altura da mulher que conquistou. Ou pelo menos tentar.',
    amount: 300,
    image: { src: '/fotos-originais/presentes/terno.png', alt: 'Um terno para o noivo' },
  },
  {
    id: 'geladeira',
    name: 'Central de armazenamento de delivery',
    description:
      'Uma geladeira para guardar o restante do delivery, porque cozinhar todos os dias é uma promessa que não pretendemos cumprir.',
    amount: 1500,
    image: { src: '/fotos-originais/presentes/geladeira.png', alt: 'Uma geladeira' },
  },
  {
    id: 'combustivel',
    name: 'Combustível do amor',
    description:
      'Um tanque de gasolina para Danilo continuar levando Tereza aos lugares, porque amor não move carro e moto, mas dinheiro move.',
    amount: 100,
    image: { src: '/fotos-originais/presentes/combustivel.png', alt: 'Um tanque de gasolina' },
  },
  {
    id: 'jantar-lisboa',
    name: 'Romance à portuguesa',
    description:
      'Um jantar em Lisboa, com vista para o Tejo, porque boleto a gente paga depois, mas o amor merece uma vista bonita.',
    amount: 650,
    image: {
      src: '/fotos-originais/presentes/jantar.png',
      alt: 'Jantar em Lisboa com vista para o Tejo',
    },
  },
  {
    id: 'maquiagem',
    name: 'Kit sobrevivência da noiva',
    description:
      'Maquiagem completa para Tereza estar impecável até nos dias em que Danilo disser que ela está pronta há duas horas.',
    amount: 220,
    image: { src: '/fotos-originais/presentes/maquiagem.png', alt: 'Um kit de maquiagem' },
  },
  {
    id: 'viagem-europa',
    name: 'Operação fuga do calor',
    description:
      'Uma viagem para a Europa, porque o casal precisa passar frio junto e descobrir que perrengue internacional é muito mais elegante.',
    amount: 3000,
    image: { src: '/fotos-originais/presentes/viagem.png', alt: 'Viagem para a Europa' },
  },
  {
    id: 'sofa-sheik',
    name: 'Suíte presidencial do Sheik',
    description:
      'Um sofá exclusivo para o Sheik dormir com todo o conforto que merece. Afinal, quem manda na casa é ele.',
    amount: 400,
    image: { src: '/fotos-originais/presentes/sofa.png', alt: 'Um sofá para o Sheik' },
  },
  {
    id: 'harmonizacao',
    name: 'Projeto renovação da noiva',
    description:
      'Uma harmonização facial para Tereza continuar linda até quando estiver cobrando a louça lavada.',
    amount: 150,
    image: { src: '/fotos-originais/presentes/harmonizacao.png', alt: 'Harmonização facial' },
  },
  {
    // Título e legenda enviados pelos noivos; o presente em si ainda está em aberto
    id: 'fundo-emergencia',
    name: 'Fundo de emergência matrimonial',
    description:
      'Para cobrir os primeiros imprevistos do casamento, como a primeira discussão sobre quem vai lavar a louça.',
    amount: 1000,
    image: { src: '/fotos-originais/presentes/emergencia.png', alt: 'Fundo de emergência do casal' },
  },
  {
    id: 'cruzeiro',
    name: 'Viagem em cruzeiro',
    description:
      'Um cruzeiro para os noivos descobrirem que passar perrengue em alto-mar também pode ser romântico.',
    amount: 800,
    image: { src: '/fotos-originais/presentes/cruzeiro.png', alt: 'Um cruzeiro pela Europa' },
  },
  {
    // Título e legenda enviados pelos noivos; o presente em si ainda está em aberto
    id: 'sao-paulo',
    name: 'Patrocínio para um retorno para SP',
    description:
      'Uma contribuição para os noivos assistirem um jogo do Corinthians, além de reviverem as noites de São Paulo.',
    amount: 2000,
    image: { src: '/fotos-originais/presentes/sp.png', alt: 'Lua de mel' },
  },
  {
    // Título e legenda enviados pelos noivos; o presente em si ainda está em aberto
    id: 'terapia',
    name: 'Terapia preventiva para o casal',
    description:
      'Porque a vida a dois exige diálogo, paciência e, às vezes, um profissional para decidir quem está certo.',
    amount: 1200,
    image: { src: '/fotos-originais/presentes/terapia.png', alt: 'Terapia de casal' },
  },

  {
    id: 'gin',
    name: 'Um mês de gin para o Danilo',
    description: 
      'O noivo tem poucos luxos, um deles é poder tomar seu gin nos finais de semana para lembrar o quanto uma ressaca é boa.',
    amount: 420 ,
    image: {src: '/fotos-originais/presentes/gin.png', alt:'Gin' },
  },
]
