import type { Couple } from './types'

// PROVISÓRIO: citação a confirmar com a noiva. Nomes e contatos confirmados em 23/11.
export const couple: Couple = {
  partner1: 'Danilo',
  partner2: 'Tereza',
  initials: 'D&T',
  // Monograma enviado pelos noivos, convertido para marfim com fundo transparente (npm run fotos)
  monogram: { src: '/images/monograma.webp', alt: 'Monograma de T e D entrelaçados' },
  // Foto da igreja enviada pela noiva (23/11), com tratamento de cor para a paleta (npm run fotos)
  heroImage: {
    sources: [
      { src: '/images/home/igreja-640.webp', width: 640 },
      { src: '/images/home/igreja-960.webp', width: 960 },
      { src: '/images/home/igreja-1239.webp', width: 1239 },
    ],
    aspectRatio: 1239 / 2201,
    alt: 'Igreja do casamento ao entardecer',
    focus: { x: 0.62, y: 0.4 },
  },
  quote: {
    // Citação proposta por nós; a noiva aprova na primeira prévia.
    text: 'Para que todos vejam, e saibam, e considerem, e juntamente entendam que a mão do Senhor fez isto.',
    source: 'Isaías 41:20',
  },
  contacts: [
    {
      name: 'Danilo',
      phone: '5585996617652',
      message: 'Olá, Danilo! Vi o site do casamento e queria falar com você.',
    },
    {
      name: 'Tereza',
      phone: '5585996957590',
      message: 'Olá, Tereza! Vi o site do casamento e queria falar com você.',
    },
  ],
  closingMessage: 'Mal podemos esperar para celebrar esse dia com você.',
}
