import type { Coordinates } from '@/content'

/** Abre a rota até o destino no Google Maps (no celular, abre o app). */
export function googleMapsRouteUrl({ lat, lng }: Coordinates): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

/** Abre a navegação até o destino no Waze (no celular, abre o app). */
export function wazeRouteUrl({ lat, lng }: Coordinates): string {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
}
