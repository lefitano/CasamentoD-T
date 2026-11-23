import { useRef, useState } from 'react'
import { Button } from '@/components/Button/Button'
import { Monogram } from '@/components/Monogram/Monogram'
import { couple, event, sectionTexts } from '@/content'
import { formatLongDate } from '@/lib/date'
import { whatsappUrl } from '@/lib/whatsapp'
import { edgeReveal, fadeSlide } from '@/motion/edgeReveal'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/motion/gsap'
import styles from './Footer.module.css'

/** RF08 — Rodapé: mensagem final, contato com os noivos e monograma. */
export function Footer() {
  const root = useRef<HTMLElement>(null)
  // "Falar com os noivos" abre a escolha: falar com o noivo ou com a noiva
  const [contactsOpen, setContactsOpen] = useState(false)

  // Mesma entrada dos capítulos, item por item, ligada à rolagem
  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return
      gsap.utils
        .toArray<HTMLElement>(':scope > *', root.current)
        .forEach((element) => edgeReveal(element, fadeSlide(element)))
    },
    { scope: root },
  )

  return (
    <footer ref={root} className={styles.footer}>
      <p className={styles.closing}>{couple.closingMessage}</p>

      <div className={styles.contact}>
        <Button
          variant="secondary"
          aria-expanded={contactsOpen}
          aria-controls="contatos-noivos"
          onClick={() => setContactsOpen((open) => !open)}
        >
          {sectionTexts.footer.contactCta}
        </Button>

        {/* Fechado: invisível e fora do teclado (inert); aberto: surge com um leve deslize */}
        <div
          id="contatos-noivos"
          className={styles.contacts}
          data-open={contactsOpen}
          inert={!contactsOpen}
          // A página muda de altura: recalcula os efeitos de rolagem (monograma e data abaixo)
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && e.propertyName === 'opacity') {
              ScrollTrigger.refresh()
            }
          }}
        >
          <div className={styles.contactsInner}>
            <p className={styles.hint}>{sectionTexts.footer.contactHint}</p>
            <div className={styles.people}>
              {couple.contacts.map((person) => (
                <Button
                  key={person.phone}
                  href={whatsappUrl(person.phone, person.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  aria-label={`Falar com ${person.name} no WhatsApp`}
                >
                  {person.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Monogram className={styles.monogram} />
      <p className={styles.date}>{formatLongDate(event.date)}</p>
    </footer>
  )
}
