import type { Couple } from './types'

// PROVISÓRIO: nomes, citação e WhatsApp a confirmar com os noivos.
export const couple: Couple = {
  partner1: 'D',
  partner2: 'T',
  initials: 'D&T',
  // PROVISÓRIO: foto de banco gratuito (Unsplash via picsum.photos) até a foto dos noivos chegar.
  heroImage: {
    landscape: '/images/provisorio/hero-horizontal.jpg',
    portrait: '/images/provisorio/hero-vertical.jpg',
    alt: 'Foto dos noivos',
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
