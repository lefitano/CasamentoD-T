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
    image: { src: '/images/presentes/pastelbelem.webp', alt: 'Pastel de Belém' },
  },
  {
    id: 'cachorro',
    name: 'Um irmão para o Sheik',
    description: 'Porque filho único também sente falta de companhia. Ajude a aumentar a família!',
    amount: 250,
    image: { src: '/images/presentes/yorkshire.webp', alt: 'Um filhote de yorkshire' },
  },
  {
    id: 'fogao',
    name: 'O verdadeiro dote do casamento',
    description:
      'Um fogão para Tereza preparar o feijão do Danilo. Porque amor é lindo, mas homem feliz também precisa comer.',
    amount: 500,
    image: { src: '/images/presentes/fogao.webp', alt: 'Um fogão' },
  },
  {
    id: 'terno',
    name: 'Elegância do noivo',
    description:
      'Um terno para Danilo se vestir à altura da mulher que conquistou. Ou pelo menos tentar.',
    amount: 300,
    image: { src: '/images/presentes/terno.webp', alt: 'Um terno para o noivo' },
  },
  {
    id: 'geladeira',
    name: 'Central de armazenamento de delivery',
    description:
      'Uma geladeira para guardar o restante do delivery, porque cozinhar todos os dias é uma promessa que não pretendemos cumprir.',
    amount: 1500,
    image: { src: '/images/presentes/geladeira.webp', alt: 'Uma geladeira' },
  },
  {
    id: 'combustivel',
    name: 'Combustível do amor',
    description:
      'Um tanque de gasolina para Danilo continuar levando Tereza aos lugares, porque amor não move carro e moto, mas dinheiro move.',
    amount: 100,
    image: { src: '/images/presentes/combustivel.webp', alt: 'Um tanque de gasolina' },
  },
  {
    id: 'jantar-lisboa',
    name: 'Romance à portuguesa',
    description:
      'Um jantar em Lisboa, com vista para o Tejo, porque boleto a gente paga depois, mas o amor merece uma vista bonita.',
    amount: 650,
    image: {
      src: '/images/presentes/jantar.webp',
      alt: 'Jantar em Lisboa com vista para o Tejo',
    },
  },
  {
    id: 'show',
    name: 'Vaquinha Meteoro da Paixão',
    description:
      'Todo mundo sabe que a noiva é fã de carteirinha. Ajude a levar Tereza ao show do Luan Santana. O noivo promete pelo menos segurar a bolsa.',
    amount: 220,
    image: { src: '/images/presentes/luan.webp', alt: 'Show do Luan Santana' },
  },
  {
    id: 'viagem-europa',
    name: 'Operação fuga do calor',
    description:
      'Uma viagem para a Europa, porque o casal precisa passar frio junto e descobrir que perrengue internacional é muito mais elegante.',
    amount: 3000,
    image: { src: '/images/presentes/viagem.webp', alt: 'Viagem para a Europa' },
  },
  {
    id: 'sofa-sheik',
    name: 'Suíte presidencial do Sheik',
    description:
      'Um sofá exclusivo para o Sheik dormir com todo o conforto que merece. Afinal, quem manda na casa é ele.',
    amount: 400,
    image: { src: '/images/presentes/sofa.webp', alt: 'Um sofá para o Sheik' },
  },
  {
    id: 'harmonizacao',
    name: 'Projeto renovação da noiva',
    description:
      'Uma harmonização facial para Tereza continuar linda até quando estiver cobrando a louça lavada.',
    amount: 150,
    image: { src: '/images/presentes/harmonizacao.webp', alt: 'Harmonização facial' },
  },
  {
    // Título e legenda enviados pelos noivos; o presente em si ainda está em aberto
    id: 'fundo-emergencia',
    name: 'Fundo de emergência matrimonial',
    description:
      'Para cobrir os primeiros imprevistos do casamento, como a primeira discussão sobre quem vai lavar a louça.',
    amount: 1000,
    image: { src: '/images/presentes/emergencia.webp', alt: 'Fundo de emergência do casal' },
  },
  {
    id: 'cruzeiro',
    name: 'Viagem em cruzeiro',
    description:
      'Um cruzeiro para os noivos descobrirem que passar perrengue em alto-mar também pode ser romântico.',
    amount: 800,
    image: { src: '/images/presentes/cruzeiro.webp', alt: 'Um cruzeiro pela Europa' },
  },
  {
    // Título e legenda enviados pelos noivos; o presente em si ainda está em aberto
    id: 'sao-paulo',
    name: 'Patrocínio para um retorno para SP',
    description:
      'Uma contribuição para os noivos assistirem um jogo do Corinthians, além de reviverem as noites de São Paulo.',
    amount: 2000,
    image: { src: '/images/presentes/paulista.webp', alt: 'Lua de mel' },
  },
  {
    // Título e legenda enviados pelos noivos; o presente em si ainda está em aberto
    id: 'terapia',
    name: 'Terapia preventiva para o casal',
    description:
      'Porque a vida a dois exige diálogo, paciência e, às vezes, um profissional para decidir quem está certo.',
    amount: 1200,
    image: { src: '/images/presentes/terapia.webp', alt: 'Terapia de casal' },
  },

  {
    id: 'gin',
    name: 'Um mês de gin para o Danilo',
    description:
      'O noivo tem poucos luxos, um deles é poder tomar seu gin nos finais de semana para lembrar o quanto uma ressaca é boa.',
    amount: 420,
    image: { src: '/images/presentes/gin.webp', alt: 'Gin' },
  },
]
