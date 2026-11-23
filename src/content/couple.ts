import type { Couple } from './types'

// PROVISÓRIO: nomes, citação e WhatsApp a confirmar com os noivos.
export const couple: Couple = {
  partner1: 'D',
  partner2: 'T',
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
    text: 'O amor é paciente, o amor é bondoso. Tudo sofre, tudo crê, tudo espera, tudo suporta.',
    source: '1 Coríntios 13:4,7',
  },
  whatsapp: {
    phone: '5500000000000',
    message: 'Olá! Vi o site do casamento e queria falar com vocês.',
  },
  closingMessage: 'Mal podemos esperar para celebrar esse dia com você.',
}
