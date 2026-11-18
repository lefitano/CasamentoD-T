import type { EventInfo } from './types'

/** Texto exibido no lugar de qualquer informação ainda não definida */
export const TO_BE_DEFINED = 'A definir'

// Data confirmada: 23/02/2027. Horários, locais, traje e observações: a definir.
export const event: EventInfo = {
  date: '2027-02-23T00:00:00-03:00',
  ceremony: {
    name: TO_BE_DEFINED,
    address: 'Endereço a definir',
  },
  reception: {
    name: TO_BE_DEFINED,
    address: 'Endereço a definir',
  },
  dressCode: TO_BE_DEFINED,
  notes: [],
}
