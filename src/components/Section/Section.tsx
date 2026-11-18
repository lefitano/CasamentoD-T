import { useRef, type ReactNode } from 'react'
import type { SectionId } from '@/content'
import { EASE_OUT, gsap, prefersReducedMotion, SplitText, useGSAP } from '@/motion/gsap'
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

/**
 * Moldura padrão dos capítulos: âncora do menu, abertura (linha pequena, título, traço)
 * e conteúdo. Ao entrar na tela, o título sobe por trás de uma máscara com uma leve
 * inclinação 3D; o resto surge com um fade suave.
 */
export function Section({ id, title, eyebrow, align = 'start', children }: SectionProps) {
  const root = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleId = `${id}-titulo`

  useGSAP(
    () => {
      if (prefersReducedMotion() || !titleRef.current || !root.current) return

      SplitText.create(titleRef.current, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true, // refaz a quebra quando as fontes carregam ou a tela muda de tamanho
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            rotationX: -25,
            transformOrigin: '50% 100%',
            transformPerspective: 800,
            duration: 1.3,
            stagger: 0.1,
            ease: EASE_OUT,
            scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true },
          }),
      })

      const rest = gsap.utils.toArray<HTMLElement>(
        '[data-reveal], [data-content] > :not([data-reveal-self])',
        root.current,
      )
      gsap.from(rest, {
        autoAlpha: 0,
        y: 16,
        duration: 1,
        stagger: 0.08,
        ease: EASE_OUT,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      })
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
        <span className={styles.rule} aria-hidden="true" data-reveal />
      </header>
      <div className={styles.content} data-content>
        {children}
      </div>
    </section>
  )
}
