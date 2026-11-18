import type { RsvpConfig } from './types'

// PROVISÓRIO: data limite fictícia até os noivos definirem.
export const rsvp: RsvpConfig = {
  deadline: '2027-04-15T23:59:59-03:00',
  intro: 'Sua presença é muito importante para nós. Por favor, confirme até a data abaixo.',
  privacyNotice:
    'Usamos seu telefone só para identificar sua resposta. As respostas ficam visíveis apenas para os noivos.',
  successMessage: 'Obrigado por responder! Sua confirmação foi recebida.',
  closedMessage:
    'O prazo para confirmar presença terminou. Se precisar, fale com os noivos pelo WhatsApp.',
}
