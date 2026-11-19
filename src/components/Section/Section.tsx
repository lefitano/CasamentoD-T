import { useRef, type ReactNode } from 'react'
import type { SectionId } from '@/content'
import { edgeReveal, fadeSlide } from '@/motion/edgeReveal'
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '@/motion/gsap'
import styles from './Section.module.css'

interface SectionProps {
  id: SectionId
  title: string
  /** Linha pequena acima do título, ex.: 'Nossa história' */
  eyebrow?: string
  /** Alinhamento do capítulo; variar entre seções evita monotonia */
  align?: 'start' | 'center'
  children: ReactNode
}

/** Atraso de entrada entre linhas do título (fração do efeito) */
const LINE_STAGGER = 0.15

/**
 * Moldura padrão dos capítulos: âncora do menu, abertura (linha pequena, título, traço)
 * e conteúdo.
 *
 * Efeitos ligados à rolagem, nas duas direções (só nas bordas da tela):
 * - título: sobe por trás de uma máscara com leve inclinação 3D ao entrar; sai por ela no alto
 * - traço: se estende ao entrar
 * - demais blocos: sobem/descem um pouco e ganham opacidade
 * Para animar os itens de uma lista um a um, marque a lista com `data-reveal-children`.
 * Um bloco com animação própria (ex.: momentos da história) usa `data-reveal-self`.
 */
export function Section({ id, title, eyebrow, align = 'start', children }: SectionProps) {
  const root = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const titleId = `${id}-titulo`

  useGSAP(
    () => {
      if (prefersReducedMotion() || !titleRef.current || !root.current) return

      // Título: as linhas mudam quando a quebra é refeita (fontes, tamanho da tela)
      let lines: HTMLElement[] = []
      const applyTitle = (enter: number, exit: number) => {
        lines.forEach((line, i) => {
          const delay = Math.min(i * LINE_STAGGER, 0.6)
          const lineEnter = gsap.utils.clamp(0, 1, (enter - delay) / (1 - delay))
          gsap.set(line, {
            yPercent: (1 - lineEnter) * 105 - (1 - exit) * 105,
            rotationX: (1 - lineEnter) * -25 + (1 - exit) * 25,
          })
        })
      }
      const titleTrigger = edgeReveal(titleRef.current, applyTitle)
      SplitText.create(titleRef.current, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          lines = self.lines as HTMLElement[]
          gsap.set(lines, { transformPerspective: 800, transformOrigin: '50% 100%' })
          titleTrigger.refresh()
        },
      })

      // Traço: se estende da esquerda (ou do centro, nos capítulos centralizados)
      if (ruleRef.current) {
        const rule = ruleRef.current
        edgeReveal(rule, (enter, exit) => {
          const v = Math.min(enter, exit)
          rule.style.opacity = String(v)
          rule.style.transform = `scaleX(${v})`
        })
      }

      // Demais blocos, um a um
      gsap.utils
        .toArray<HTMLElement>(
          [
            '[data-reveal]',
            '[data-content] > :not([data-reveal-self]):not([data-reveal-children])',
            '[data-reveal-children] > *',
          ].join(', '),
          root.current,
        )
        .forEach((element) => edgeReveal(element, fadeSlide(element)))
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id={id}
      aria-labelledby={titleId}
      className={styles.section}
      data-align={align}
    >
      <header className={styles.head}>
        {eyebrow && (
          <p className={styles.eyebrow} data-reveal>
            {eyebrow}
          </p>
        )}
        <h2 ref={titleRef} id={titleId} className={styles.title}>
          {title}
        </h2>
        <span ref={ruleRef} className={styles.rule} aria-hidden="true" />
      </header>
      <div className={styles.content} data-content>
        {children}
      </div>
    </section>
  )
}
