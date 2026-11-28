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
    date: '2018',
    title: 'Onde tudo começou',
    description: 'Entre aulas, trabalhos e tantos momentos compartilhados, nossos caminhos se cruzaram. Mal sabíamos que, em meio à rotina da sala de aula, começava uma história que nos levaria muito mais longe.',
    photo: { src: '/images/historia/momento-1027.jpg', alt: 'Foto do primeiro encontro' },
  },
  {
    date: '2018-2019',
    title: 'Antes do primeiro sim',
    description: 'Entre conversas na sala de aula, a nossa história foi ganhando novos capítulos. Faltavam poucas semanas para transformar aquela aproximação em um namoro e começar oficialmente a nossa história a dois.',
    photo: { src: '/images/historia/iniciodonamoro.jpg', alt: 'Foto do início do namoro' },
  },
  {
    date: '2019',
    title: 'Nossa primeira aventura',
    description: 'Porto Seguro marcou nossa primeira viagem sozinhos, ainda menores de idade, na viagem de formatura do terceiro ano. Entre descobertas, diversão e muitas histórias para contar, começávamos a colecionar momentos e perceber que viajar juntos seria uma das nossas coisas favoritas.',
    photo: { src: '/images/historia/primeiraviagemjuntos.jpg', alt: 'Foto da primeira viagem' },
  },
  {
    date: '2023',
    title: 'Nosso primeiro destino internacional',
    description: 'Buenos Aires foi o cenário da nossa primeira viagem internacional! Uma viagem especial, presente de aniversário de quatro anos de namoro, em que tivemos a alegria de conhecer um novo país e colecionar lembranças ainda mais especiais juntos.',
    photo: { src: '/images/historia/primeiraviageminter.jpg', alt: 'Foto da primeira viagem internacional' },
  },
  {
    date: '2023',
    title: 'Um novo capítulo, mas sempre lado a lado',
    description: 'Em meio a um período de tantas mudanças e sentimentos, começamos a compartilhar ainda mais a vida e a rotina, dando início à nossa experiência de morar juntos. Descobrimos que estar juntos também significa ser abrigo, apoio e companhia nos momentos mais difíceis.',
    photo: {src: '/images/historia/viagemneve.jpg', alt: 'Foto em uma viagem na neve'},
  },
  {
    date: '2026',
    title: 'Um sonho vivido a dois',
    description: 'São Paulo sempre esteve nos nossos planos e, finalmente, chegou a hora de realizar esse sonho juntos! Além de conhecer a cidade, tivemos a alegria de realizar um sonho antigo do Danilo: conhecer o estádio do Corinthians. Uma viagem cheia de significado, que ficará para sempre na nossa história.',
    photo: {src: '/images/historia/sonhos.jpg', alt: 'Foto no estádio do Corinthians'},
  },
  {
    date: '2026',
    title: 'O sim',
    description: 'Para celebrar nossos sete anos de namoro, Danilo planejou uma surpresa muito especial e escolheu essa data para fazer o pedido de casamento. Depois de tantas histórias, viagens e sonhos compartilhados, demos mais um passo juntos e começamos a escrever uma nova etapa da nossa história.',
    photo: {src: '/images/historia/pedidodecasamento.jpg', alt: 'Foto da noiva com a aliança'},
  }
]
