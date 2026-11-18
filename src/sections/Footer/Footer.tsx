import { Button } from '@/components/Button/Button'
import { couple } from '@/content'
import { whatsappUrl } from '@/lib/whatsapp'

/** RF08 — Rodapé: mensagem final e contato pelo WhatsApp. */
export function Footer() {
  return (
    <footer>
      <p>{couple.closingMessage}</p>
      <Button
        href={whatsappUrl(couple.whatsapp.phone, couple.whatsapp.message)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Falar com os noivos no WhatsApp
      </Button>
      <p>{couple.initials}</p>
    </footer>
  )
}
