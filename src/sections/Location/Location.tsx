import { Button } from '@/components/Button/Button'
import { Section } from '@/components/Section/Section'
import { event, sectionTexts, type Venue } from '@/content'
import { googleMapsRouteUrl, wazeRouteUrl } from '@/lib/maps'
import styles from './Location.module.css'

function RouteRow({ label, venue }: { label: string; venue: Venue }) {
  return (
    <div className={styles.row}>
      <h3 className={styles.label}>{label}</h3>
      <p className={styles.name}>{venue.name}</p>
      <address className={styles.address}>{venue.address}</address>
      {venue.coordinates ? (
        <div className={styles.actions}>
          <Button
            href={googleMapsRouteUrl(venue.coordinates)}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            Google Maps
          </Button>
          <Button
            href={wazeRouteUrl(venue.coordinates)}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            Waze
          </Button>
        </div>
      ) : (
        <p className={styles.pending}>Rotas disponíveis assim que o local for definido</p>
      )}
    </div>
  )
}

/** RF05 — Como chegar: rota no Google Maps e no Waze para cada local. */
export function Location() {
  return (
    <Section id="local" {...sectionTexts.location} align="center">
      <div className={styles.rows}>
        <RouteRow label="Cerimônia" venue={event.ceremony} />
        <RouteRow label="Recepção" venue={event.reception} />
      </div>
    </Section>
  )
}
