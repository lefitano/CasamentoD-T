import { Section } from '@/components/Section/Section'
import { rsvp } from '@/content'
import { formatLongDate, isPast } from '@/lib/date'

/** RF06 — Confirme sua presença. O formulário (Netlify Forms) entra na Fase 3. */
export function Rsvp() {
  const closed = isPast(rsvp.deadline)

  return (
    <Section id="confirmar" eyebrow="Convite" title="Confirme sua presença">
      {closed ? (
        <p>{rsvp.closedMessage}</p>
      ) : (
        <>
          <p>{rsvp.intro}</p>
          <p>
            Confirme até <strong>{formatLongDate(rsvp.deadline)}</strong>.
          </p>
          <p>Formulário em construção.</p>
          <p>{rsvp.privacyNotice}</p>
        </>
      )}
    </Section>
  )
}
