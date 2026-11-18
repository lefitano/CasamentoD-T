import type { Moment } from './types'

/*
 * Momentos da história dos noivos (seção "Nossa história").
 * Cada um: data específica, uma foto e uma descrição BREVE (até ~200 caracteres),
 * para não ocupar demais a tela do celular.
 *
 * PROVISÓRIO: datas, textos e fotos chegam pelos noivos. As fotos atuais são
 * de banco gratuito (Unsplash via picsum.photos), só para visualizar o layout.
 */
export const moments: Moment[] = [
  {
    title: 'Como nos conhecemos',
    description: 'Texto breve sobre o primeiro encontro.',
    photo: { src: '/images/provisorio/momento-1027.jpg', alt: 'Foto do primeiro encontro' },
  },
  {
    title: 'O começo do namoro',
    description: 'Texto breve sobre o início do namoro.',
    photo: { src: '/images/provisorio/momento-64.jpg', alt: 'Foto do início do namoro' },
  },
  {
    title: 'Nossa primeira viagem',
    description: 'Texto breve sobre um momento marcante juntos.',
    photo: { src: '/images/provisorio/momento-338.jpg', alt: 'Foto da primeira viagem' },
  },
  {
    title: 'O pedido',
    description: 'Texto breve sobre o pedido de casamento.',
    photo: { src: '/images/provisorio/momento-1011.jpg', alt: 'Foto do pedido de casamento' },
  },
]
