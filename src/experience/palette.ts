import { Color } from 'three'

/**
 * Cores da cena, espelhando a paleta B de src/styles/tokens.css.
 * `Color` converte de sRGB para o espaço linear usado nos shaders.
 */
export const scenePalette = {
  background: new Color('#0a1222'),
  veilDeep: new Color('#0c172b'),
  veilMid: new Color('#22385f'), // entre o marinho e o azul real: tecido na penumbra
  sheen: new Color('#6c8ebf'),
}

export const BACKGROUND_HEX = '#0a1222'
