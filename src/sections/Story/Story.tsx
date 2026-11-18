import { Section } from '@/components/Section/Section'
import { story } from '@/content'

/** RF02 — Nossa história: marcos do relacionamento em linha do tempo. */
export function Story() {
  return (
    <Section id="historia" eyebrow="Nossa história" title="Como tudo começou">
      <ol>
        {story.map((milestone) => (
          <li key={milestone.title}>
            <p>{milestone.when}</p>
            <h3>{milestone.title}</h3>
            <p>{milestone.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
