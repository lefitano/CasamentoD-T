import { gsap, ScrollTrigger } from './gsap'

/** Fração da altura da tela, em cada borda, onde o efeito acontece. O meio fica sempre nítido. */
const EDGE_ZONE = 0.3
/**
 * Tempo (s) que o efeito leva para alcançar a posição da rolagem. Em vez de seguir a rolagem
 * quadro a quadro (sensação mecânica, aos saltos no celular), o elemento "chega" com suavidade.
 */
const SMOOTHING = 0.9

const clamp01 = gsap.utils.clamp(0, 1)
/** Desacelera no fim, de forma suave: o elemento "pousa" ao terminar de entrar */
const easeOut = (t: number) => 1 - (1 - t) ** 2

/**
 * Chamado com dois valores de 0 a 1:
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
  const state = { enter: 0, exit: 1 }
  const render = () => apply(state.enter, state.exit)

  const targetOf = (self: ScrollTrigger) => {
    const distance = self.end - self.start // altura da tela + altura do elemento
    const zone = Math.min(window.innerHeight * EDGE_ZONE, distance / 2)
    const scrolled = self.progress * distance
    return {
      enter: easeOut(clamp01(scrolled / zone)),
      exit: easeOut(clamp01((distance - scrolled) / zone)),
    }
  }

  // Ao rolar: o efeito persegue a posição com suavidade.
  // quickTo reaproveita a mesma animação a cada quadro (leve no celular).
  const smooth = { duration: SMOOTHING, ease: 'power2.out', onUpdate: render }
  const toEnter = gsap.quickTo(state, 'enter', smooth)
  const toExit = gsap.quickTo(state, 'exit', smooth)
  const follow = (self: ScrollTrigger) => {
    const target = targetOf(self)
    toEnter(target.enter)
    toExit(target.exit)
  }

  // Ao carregar ou redimensionar: posiciona na hora, sem animar
  const jump = (self: ScrollTrigger) => {
    const target = targetOf(self)
    toEnter(target.enter, target.enter)
    toExit(target.exit, target.exit)
    Object.assign(state, target)
    render()
  }

  const st = ScrollTrigger.create({
    trigger,
    start: 'top bottom', // topo do elemento encosta na borda de baixo da tela
    end: 'bottom top', // base do elemento sai pela borda de cima
    onUpdate: follow,
    onRefresh: jump,
  })
  jump(st)
  return st
}

/** Efeito padrão para blocos de texto: sobe/desce um pouco e ganha opacidade nas bordas. */
export function fadeSlide(element: HTMLElement, distance = 20): EdgeApply {
  const setY = gsap.quickSetter(element, 'y', 'px')
  return (enter, exit) => {
    element.style.opacity = String(Math.min(enter, exit))
    setY((1 - enter) * distance - (1 - exit) * distance)
  }
}
