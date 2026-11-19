import { useRef } from 'react'
import { Button } from '@/components/Button/Button'
import { Monogram } from '@/components/Monogram/Monogram'
import { couple, event, sectionTexts } from '@/content'
import { formatLongDate } from '@/lib/date'
import { whatsappUrl } from '@/lib/whatsapp'
import { edgeReveal, fadeSlide } from '@/motion/edgeReveal'
import { gsap, prefersReducedMotion, useGSAP } from '@/motion/gsap'
import styles from './Footer.module.css'

/** RF08 — Rodapé: mensagem final, contato pelo WhatsApp e monograma. */
export function Footer() {
  const root = useRef<HTMLElement>(null)

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
      <Button
        href={whatsappUrl(couple.whatsapp.phone, couple.whatsapp.message)}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
      >
        {sectionTexts.footer.whatsappCta}
      </Button>
      <Monogram className={styles.monogram} />
      <p className={styles.date}>{formatLongDate(event.date)}</p>
    </footer>
  )
}
