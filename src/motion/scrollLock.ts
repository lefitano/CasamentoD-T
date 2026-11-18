import type Lenis from 'lenis'

/** Instância ativa do Lenis (null no toque com movimento reduzido ou antes de montar). */
let activeLenis: Lenis | null = null

export function registerLenis(lenis: Lenis | null) {
  activeLenis = lenis
}

/** Trava a rolagem da página (ex.: menu em tela cheia aberto). */
export function lockScroll() {
  activeLenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function unlockScroll() {
  document.documentElement.style.overflow = ''
  activeLenis?.start()
}
