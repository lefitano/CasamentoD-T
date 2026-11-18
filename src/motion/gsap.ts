import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/** true quando o sistema pede menos movimento: as animações de entrada são puladas. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Curva padrão das entradas: rápida no começo, pousa suave (equivale a --ease-out-expo). */
export const EASE_OUT = 'expo.out'

export { gsap, ScrollTrigger, SplitText, useGSAP }
