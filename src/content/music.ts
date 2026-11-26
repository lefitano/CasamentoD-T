import type { MusicConfig } from './types'

/*
 * Música escolhida pela noiva: Turning Page (Instrumental), de Sleeping At Last
 * (faixa bônus do EP "Neighbors Volume One").
 * Arquivo: compre a faixa (ex.: iTunes Store), salve como public/audio/turning-page.m4a
 * e preencha `src` abaixo. Enquanto `src` estiver vazio, o botão de música não aparece.
 */
export const music: MusicConfig = {
  src: 'public/audio/musica.aac',
  title: 'Turning Page (Instrumental)',
  artist: 'Sleeping At Last',
  volume: 0.6,
  texts: {
    invite: 'Ouça nossa música',
    play: 'Tocar a música',
    pause: 'Pausar a música',
  },
}
