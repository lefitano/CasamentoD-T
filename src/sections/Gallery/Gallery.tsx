import { Section } from '@/components/Section/Section'
import { gallery } from '@/content'

/** RF03 — Galeria: fotos dos noivos (otimização e lazy loading na Fase 2). */
export function Gallery() {
  return (
    <Section id="momentos" eyebrow="Galeria" title="Nossos momentos">
      <ul>
        {gallery.map((photo) => (
          <li key={photo.alt} data-orientation={photo.orientation}>
            {photo.src ? <img src={photo.src} alt={photo.alt} loading="lazy" /> : photo.alt}
          </li>
        ))}
      </ul>
    </Section>
  )
}
