import { gsap, ScrollTrigger } from './gsap'

/** Fração da altura da tela, em cada borda, onde o efeito acontece. O meio fica sempre nítido. */
const EDGE_ZONE = 0.18

const clamp01 = gsap.utils.clamp(0, 1)
/** Desacelera no fim: o elemento "pousa" suave ao terminar de entrar */
const easeOut = (t: number) => 1 - (1 - t) ** 3

/**
 * Chamado a cada mudança de rolagem com dois valores de 0 a 1:
 * - enter: 0 quando o elemento ainda está abaixo da tela, 1 quando já entrou pela borda de baixo
 * - exit: 1 enquanto o elemento está na tela, 0 quando já saiu pela borda de cima
 * Funciona nos dois sentidos: rolando para cima, quem volta pela borda de cima "entra" de novo.
 */
export type EdgeApply = (enter: number, exit: number) => void

/**
 * Liga um efeito à posição do elemento nas bordas da tela.
 * Deve ser chamado dentro de useGSAP, que desfaz tudo ao desmontar.
 */
export function edgeReveal(trigger: Element, apply: EdgeApply): ScrollTrigger {
  const update = (self: ScrollTrigger) => {
    const distance = self.end - self.start // altura da tela + altura do elemento
    const zone = Math.min(window.innerHeight * EDGE_ZONE, distance / 2)
    const scrolled = self.progress * distance
    apply(easeOut(clamp01(scrolled / zone)), easeOut(clamp01((distance - scrolled) / zone)))
  }

  const st = ScrollTrigger.create({
    trigger,
    start: 'top bottom', // topo do elemento encosta na borda de baixo da tela
    end: 'bottom top', // base do elemento sai pela borda de cima
    onUpdate: update,
    onRefresh: update,
  })
  update(st)
  return st
}

/** Efeito padrão para blocos de texto: sobe/desce um pouco e ganha opacidade nas bordas. */
export function fadeSlide(element: HTMLElement, distance = 32): EdgeApply {
  const setY = gsap.quickSetter(element, 'y', 'px')
  return (enter, exit) => {
    element.style.opacity = String(Math.min(enter, exit))
    setY((1 - enter) * distance - (1 - exit) * distance)
  }
}
