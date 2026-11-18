import { Button } from '@/components/Button/Button'
import { Section } from '@/components/Section/Section'
import { event, type Venue } from '@/content'
import { googleMapsRouteUrl, wazeRouteUrl } from '@/lib/maps'

function RouteButtons({ label, venue }: { label: string; venue: Venue }) {
  return (
    <article>
      <h3>{label}</h3>
      <address>{venue.address}</address>
      <Button
        href={googleMapsRouteUrl(venue.coordinates)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir no Google Maps
      </Button>
      <Button
        href={wazeRouteUrl(venue.coordinates)}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
      >
        Abrir no Waze
      </Button>
    </article>
  )
}

/** RF05 — Como chegar: rota no Google Maps e no Waze para cada local. */
export function Location() {
  return (
    <Section id="local" eyebrow="Como chegar" title="Local">
      <RouteButtons label="Cerimônia" venue={event.ceremony} />
      <RouteButtons label="Recepção" venue={event.reception} />
    </Section>
  )
}
