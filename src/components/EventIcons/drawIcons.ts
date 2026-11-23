import { edgeReveal } from '@/motion/edgeReveal'
import { gsap } from '@/motion/gsap'

/** Defasagem entre o início de cada traço (fração do efeito), para parecer feito à mão */
const STROKE_SPREAD = 0.35

/**
 * "Desenha" os ícones [data-draw-icon] dentro de `root` conforme a rolagem, nos dois
 * sentidos: o traço aparece ao entrar pela borda da tela e se desfaz ao sair.
 * Quando o desenho termina, marca data-played="true" e a microanimação do ícone
 * (brilho, brinde, balanço) roda uma vez; ao sair da tela, ela pode rodar de novo.
 *
 * Chamar dentro de useGSAP (desfaz tudo ao desmontar) e só sem "reduzir movimento".
 */
export function drawIcons(root: Element) {
  gsap.utils.toArray<SVGSVGElement>('[data-draw-icon]', root).forEach((svg) => {
    const strokes = Array.from(svg.querySelectorAll<SVGGeometryElement>('[pathLength]'))
    const last = Math.max(strokes.length - 1, 1)

    // pathLength=1: o traço inteiro mede 1, então dasharray/dashoffset 1 = escondido
    strokes.forEach((stroke) => {
      stroke.style.strokeDasharray = '1 1'
      stroke.style.strokeDashoffset = '1'
    })

    edgeReveal(svg, (enter, exit) => {
      const v = Math.min(enter, exit)
      strokes.forEach((stroke, i) => {
        const start = (i / last) * STROKE_SPREAD
        const local = gsap.utils.clamp(0, 1, (v - start) / (1 - STROKE_SPREAD))
        stroke.style.strokeDashoffset = String(1 - local)
        // traço de comprimento zero com ponta redonda vira um pontinho: esconde
        stroke.style.opacity = local > 0.01 ? '1' : '0'
      })

      if (v > 0.98 && svg.dataset.played !== 'true') svg.dataset.played = 'true'
      else if (v < 0.2 && svg.dataset.played === 'true') delete svg.dataset.played
    })
  })
}
