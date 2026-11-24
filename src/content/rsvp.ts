import type { RsvpConfig } from './types'

// Data limite a definir com os noivos (precisa ser antes de 23/02/2027).
export const rsvp: RsvpConfig = {
  intro: 'Sua presença é muito importante para nós. Por favor, confirme assim que puder.',
  // Pedido dos noivos (24/11): cada convidado confirma a própria presença
  individualNote:
    'A confirmação é individual: se você vier com alguém, peça que essa pessoa também confirme por aqui.',
  privacyNotice:
    'Usamos seu telefone só para identificar sua resposta. As respostas ficam visíveis apenas para os noivos.',
  closedMessage:
    'O prazo para confirmar presença terminou. Se precisar, fale com os noivos pelo WhatsApp.',
  form: {
    name: 'Nome completo',
    phone: 'Telefone (WhatsApp)',
    attending: 'Você vai comparecer?',
    yes: 'Sim, estarei lá',
    no: 'Não poderei ir',
    message: 'Recado para os noivos (opcional)',
    submit: 'Confirmar',
    sending: 'Enviando…',
  },
  successYes:
    'Que alegria! Sua presença está confirmada. Mal podemos esperar para celebrar com você.',
  successNo: 'Obrigado por avisar. Vamos sentir sua falta, e o carinho chegou até nós.',
  errorMessage:
    'Não conseguimos enviar agora. Confira sua conexão e tente de novo. Se continuar, fale com os noivos pelo WhatsApp, no fim da página.',
  answerAgain: 'Alterar minha resposta',
  alreadyAnswered:
    'Você já respondeu por este aparelho. Se enviar de novo com o mesmo telefone, sua resposta é atualizada.',
}
