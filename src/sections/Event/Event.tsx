import { useRef, type ReactNode } from 'react'
import { drawIcons } from '@/components/EventIcons/drawIcons'
import { AttireIcon, ChurchIcon, ToastIcon } from '@/components/EventIcons/EventIcons'
import { Section } from '@/components/Section/Section'
import { event, sectionTexts, type Venue } from '@/content'
import { formatLongDate, formatTime, formatWeekday } from '@/lib/date'
import { prefersReducedMotion, useGSAP } from '@/motion/gsap'
import styles from './Event.module.css'

/** Uma linha do dia: ícone à esquerda; título (com horário) e detalhes à direita. */
function Row({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: ReactNode
  children: ReactNode
}) {
  return (
    <div className={styles.row}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <h3 className={styles.label}>{title}</h3>
        {children}
      </div>
    </div>
  )
}

/** "CERIMÔNIA · 16h" ou, sem horário definido, "CERIMÔNIA · horário a definir" */
function TitleWithTime({ label, venue }: { label: string; venue: Venue }) {
  return (
    <>
      {label}
      <span className={styles.time}>
        {' · '}
        {venue.startsAt ? (
          <time dateTime={venue.startsAt}>{formatTime(venue.startsAt)}</time>
        ) : (
          sectionTexts.event.timePending
        )}
      </span>
    </>
  )
}

/** RF04 — O grande dia: data, horários, locais e informações do dia. */
export function Event() {
  const rows = useRef<HTMLDivElement>(null)

  // Os ícones se desenham conforme a rolagem (ver drawIcons)
  useGSAP(
    () => {
      if (prefersReducedMotion() || !rows.current) return
      drawIcons(rows.current)
    },
    { scope: rows },
  )

  return (
    <Section id="evento" eyebrow={sectionTexts.event.eyebrow} title={formatLongDate(event.date)}>
      <p className={styles.weekday}>{formatWeekday(event.date)}</p>
      <div ref={rows} className={styles.rows} data-reveal-children>
        <Row
          icon={<ChurchIcon />}
          title={<TitleWithTime label="Cerimônia" venue={event.ceremony} />}
        >
          <p className={styles.name}>{event.ceremony.name}</p>
          <address className={styles.address}>{event.ceremony.address}</address>
        </Row>

        <Row
          icon={<ToastIcon />}
          title={<TitleWithTime label="Recepção" venue={event.reception} />}
        >
          <p className={styles.name}>{event.reception.name}</p>
          <address className={styles.address}>{event.reception.address}</address>
        </Row>

        <Row icon={<AttireIcon />} title="Traje">
          <p className={styles.name}>{event.dressCode}</p>
          {event.notes.length > 0 && (
            <ul role="list" className={styles.notes}>
              {event.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </Row>
      </div>
    </Section>
  )
}
