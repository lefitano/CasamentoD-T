import type { RsvpConfig } from './types'

// Data limite a definir com os noivos (precisa ser antes de 23/02/2027).
export const rsvp: RsvpConfig = {
  intro: 'Sua presença é muito importante para nós. Por favor, confirme assim que puder.',
  privacyNotice:
    'Usamos seu telefone só para identificar sua resposta. As respostas ficam visíveis apenas para os noivos.',
  successMessage: 'Obrigado por responder! Sua confirmação foi recebida.',
  closedMessage:
    'O prazo para confirmar presença terminou. Se precisar, fale com os noivos pelo WhatsApp.',
}
