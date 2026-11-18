import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

/** Quadros ignorados no início: o navegador ainda está compilando shaders e subindo texturas */
const WARMUP_FRAMES = 90
const SAMPLE_SECONDS = 2
const LOWER_DPR_BELOW_FPS = 45
const GIVE_UP_BELOW_FPS = 28
/** Quadros mais longos que isso (aba em segundo plano, travada pontual) não entram na média */
const MAX_FRAME_SECONDS = 0.25

/**
 * Vigia a fluidez durante o uso. Se o aparelho não aguentar:
 * 1º reduz a resolução; 2º se ainda assim travar, pede para trocar pela versão estática.
 */
export function PerformanceGuard({ onDegrade }: { onDegrade: () => void }) {
  const setDpr = useThree((state) => state.setDpr)
  const sample = useRef({ warmup: 0, elapsed: 0, frames: 0, lowered: false, gaveUp: false })

  useFrame((_, delta) => {
    const s = sample.current
    if (s.gaveUp) return
    if (s.warmup < WARMUP_FRAMES) {
      s.warmup += 1
      return
    }
    if (delta > MAX_FRAME_SECONDS) return

    s.elapsed += delta
    s.frames += 1
    if (s.elapsed < SAMPLE_SECONDS) return

    const fps = s.frames / s.elapsed
    s.elapsed = 0
    s.frames = 0

    if (!s.lowered && fps < LOWER_DPR_BELOW_FPS) {
      s.lowered = true
      setDpr(1)
      if (import.meta.env.DEV) console.info(`[cena] ${fps.toFixed(0)} fps: resolução reduzida`)
    } else if (s.lowered && fps < GIVE_UP_BELOW_FPS) {
      s.gaveUp = true
      if (import.meta.env.DEV)
        console.warn(`[cena] ${fps.toFixed(0)} fps: trocando pela versão estática`)
      onDegrade()
    }
  })

  return null
}
