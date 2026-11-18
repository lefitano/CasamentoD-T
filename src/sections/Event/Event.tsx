import { Section } from '@/components/Section/Section'
import { event, sectionTexts, TO_BE_DEFINED, type Venue } from '@/content'
import { formatLongDate, formatTime, formatWeekday } from '@/lib/date'
import styles from './Event.module.css'

function VenueRow({ label, venue }: { label: string; venue: Venue }) {
  return (
    <div className={styles.row}>
      {venue.startsAt ? (
        <p className={styles.time}>{formatTime(venue.startsAt)}</p>
      ) : (
        <p className={styles.timePending}>{TO_BE_DEFINED}</p>
      )}
      <div>
        <h3 className={styles.label}>{label}</h3>
        <p className={styles.name}>{venue.name}</p>
        <address className={styles.address}>{venue.address}</address>
      </div>
    </div>
  )
}

/** RF04 — O grande dia: data, horários, locais e informações do dia. */
export function Event() {
  return (
    <Section id="evento" {...sectionTexts.event} title={formatLongDate(event.date)}>
      <p className={styles.weekday}>{formatWeekday(event.date)}</p>
      <div className={styles.rows}>
        <VenueRow label="Cerimônia" venue={event.ceremony} />
        <VenueRow label="Recepção" venue={event.reception} />
        <div className={styles.row}>
          <p className={styles.time}>Traje</p>
          <div>
            <p className={styles.name}>{event.dressCode}</p>
            {event.notes.length > 0 && (
              <ul role="list" className={styles.notes}>
                {event.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}
