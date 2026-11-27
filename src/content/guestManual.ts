import type { GuestManualConfig } from './types'

/*
 * Manual dos convidados: recomendações dos noivos para o grande dia.
 * PROVISÓRIO: as recomendações ainda vão chegar. Enquanto `tips` estiver vazia,
 * a seção mostra o aviso "Em construção". Para preencher, acrescente itens assim:
 *   { title: 'Pontualidade', text: 'A cerimônia começa no horário; chegue com 30 minutos de antecedência.' },
 */
export const guestManual: GuestManualConfig = {
  intro: 'Algumas recomendações para aproveitarmos juntos cada momento do nosso dia.',
  tips: [],
  pending: {
    label: 'Em construção',
    message: 'Os noivos estão preparando este manual com carinho. Volte em breve!',
  },
}
