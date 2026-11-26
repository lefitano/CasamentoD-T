import type { MusicConfig } from './types'

/*
 * Música escolhida pela noiva: Turning Page (Instrumental), de Sleeping At Last
 * (faixa bônus do EP "Neighbors Volume One").
 * Arquivo em public/audio/. No `src`, o caminho começa em /audio (SEM "public"): tudo o que
 * está em public/ é publicado na raiz do site. Com `src` vazio, o botão de música não aparece.
 */
export const music: MusicConfig = {
  src: '/audio/musica.aac',
  title: 'Turning Page (Instrumental)',
  artist: 'Sleeping At Last',
  volume: 0.6,
  texts: {
    invite: 'Ouça nossa música',
    play: 'Tocar a música',
    pause: 'Pausar a música',
  },
}
