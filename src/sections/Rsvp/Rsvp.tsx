import { Section } from '@/components/Section/Section'
import { rsvp, sectionTexts } from '@/content'
import { formatLongDate, isPast } from '@/lib/date'
import { RsvpForm } from './RsvpForm'
import styles from './Rsvp.module.css'

/** RF06 — Confirme sua presença: formulário enviado à planilha dos noivos (ver lib/forms). */
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
          <RsvpForm />
          <p className={styles.notice}>{rsvp.privacyNotice}</p>
        </>
      )}
    </Section>
  )
}
