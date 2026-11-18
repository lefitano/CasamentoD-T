export type Quality = 'high' | 'medium' | 'static'

export interface QualitySettings {
  /** Subdivisões do véu (mais = ondulação mais suave) */
  veilSegments: number
  /** Resolução máxima do canvas em telas de alta densidade */
  maxDpr: number
}

export const QUALITY_SETTINGS: Record<Exclude<Quality, 'static'>, QualitySettings> = {
  high: { veilSegments: 128, maxDpr: 2 },
  medium: { veilSegments: 80, maxDpr: 1.5 },
}

interface NavigatorHints {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

/**
 * Escolhe a qualidade da cena pelo aparelho:
 * - static: movimento reduzido, economia de dados, sem WebGL ou aparelho fraco
 * - medium: celulares e tablets
 * - high: computadores
 * A cena ainda pode cair de qualidade sozinha durante o uso (ver PerformanceGuard).
 */
export function detectQuality(): Quality {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static'

  const nav = navigator as Navigator & NavigatorHints
  if (nav.connection?.saveData) return 'static'
  if (!supportsWebGL()) return 'static'

  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4 // Safari não informa; assume intermediário
  if (cores <= 2 || memory <= 2) return 'static'

  const isTouch = window.matchMedia('(pointer: coarse)').matches
  return isTouch ? 'medium' : 'high'
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}
