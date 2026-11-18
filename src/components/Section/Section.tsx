import type { ReactNode } from 'react'
import type { SectionId } from '@/content'

interface SectionProps {
  id: SectionId
  title: string
  /** Linha pequena acima do título, ex.: 'Nossa história' */
  eyebrow?: string
  children: ReactNode
}

/** Moldura padrão das seções: âncora do menu, título e conteúdo. */
export function Section({ id, title, eyebrow, children }: SectionProps) {
  const titleId = `${id}-titulo`
  return (
    <section id={id} aria-labelledby={titleId}>
      {eyebrow && <p>{eyebrow}</p>}
      <h2 id={titleId}>{title}</h2>
      {children}
    </section>
  )
}
