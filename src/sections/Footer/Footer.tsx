import { Button } from '@/components/Button/Button'
import { Monogram } from '@/components/Monogram/Monogram'
import { couple, event } from '@/content'
import { formatLongDate } from '@/lib/date'
import { whatsappUrl } from '@/lib/whatsapp'
import styles from './Footer.module.css'

/** RF08 — Rodapé: mensagem final, contato pelo WhatsApp e monograma. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.closing}>{couple.closingMessage}</p>
      <Button
        href={whatsappUrl(couple.whatsapp.phone, couple.whatsapp.message)}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
      >
        Falar com os noivos no WhatsApp
      </Button>
      <Monogram className={styles.monogram} />
      <p className={styles.date}>{formatLongDate(event.date)}</p>
    </footer>
  )
}
