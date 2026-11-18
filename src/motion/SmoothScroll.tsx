import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { registerLenis } from './scrollLock'
import { scrollState } from './scrollState'

gsap.registerPlugin(ScrollTrigger)

/**
 * Rolagem fluida e relógio único do site.
 * - Lenis suaviza mouse e trackpad; no toque a rolagem continua nativa (padrão do Lenis).
 * - Lenis, ScrollTrigger e a cena 3D atualizam no mesmo quadro, pelo ticker do GSAP.
 * - Com "reduzir movimento" ligado no sistema, o Lenis não é criado.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = reduceMotion ? null : new Lenis({ autoRaf: false, anchors: true, lerp: 0.09 })
    lenis?.on('scroll', ScrollTrigger.update)
    registerLenis(lenis)

    let lastY = window.scrollY
    const tick = (time: number) => {
      lenis?.raf(time * 1000)

      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollState.progress = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0
      scrollState.heroProgress = Math.min(Math.max(y / window.innerHeight, 0), 1)
      scrollState.velocity = lenis ? lenis.velocity : y - lastY
      lastY = y
    }

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      registerLenis(null)
      lenis?.destroy()
    }
  }, [])

  return null
}
