import { Section } from '@/components/Section/Section'
import { rsvp, sectionTexts } from '@/content'
import { formatLongDate, isPast } from '@/lib/date'
import styles from './Rsvp.module.css'

/** RF06 — Confirme sua presença. O formulário (Netlify Forms) entra na Fase 3. */
export function Rsvp() {
  const closed = rsvp.deadline ? isPast(rsvp.deadline) : false

  return (
    <Section id="confirmar" {...sectionTexts.rsvp} align="center">
      {closed ? (
        <p className={styles.intro}>{rsvp.closedMessage}</p>
      ) : (
        <>
          <p className={styles.intro}>{rsvp.intro}</p>
          {rsvp.deadline && (
            <p className={styles.deadline}>
              Confirme até <strong>{formatLongDate(rsvp.deadline)}</strong>
            </p>
          )}
          <p className={styles.placeholder}>Formulário em construção</p>
          <p className={styles.notice}>{rsvp.privacyNotice}</p>
        </>
      )}
    </Section>
  )
}
