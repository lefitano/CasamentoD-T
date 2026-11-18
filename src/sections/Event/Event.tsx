import { Section } from '@/components/Section/Section'
import { event, type Venue } from '@/content'
import { formatLongDate, formatTime, formatWeekday } from '@/lib/date'

function VenueCard({ label, venue }: { label: string; venue: Venue }) {
  return (
    <article>
      <h3>{label}</h3>
      <p>{formatTime(venue.startsAt)}</p>
      <p>{venue.name}</p>
      <address>{venue.address}</address>
    </article>
  )
}

/** RF04 — O grande dia: data, horários, locais e informações do dia. */
export function Event() {
  return (
    <Section id="evento" eyebrow="O grande dia" title={formatLongDate(event.date)}>
      <p>{formatWeekday(event.date)}</p>
      <VenueCard label="Cerimônia" venue={event.ceremony} />
      <VenueCard label="Recepção" venue={event.reception} />
      <h3>Traje</h3>
      <p>{event.dressCode}</p>
      <ul>
        {event.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </Section>
  )
}
