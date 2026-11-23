import type { EventInfo } from './types'

/** Texto exibido no lugar de qualquer informação ainda não definida */
export const TO_BE_DEFINED = 'A definir'

// Data confirmada: 23/02/2027. Cerimônia confirmada em 23/11. Horários, recepção, traje: a definir.
export const event: EventInfo = {
  date: '2027-02-23T00:00:00-03:00',
  ceremony: {
    name: 'Igreja de São Pedro Apóstolo',
    // Endereço de diretório (buser.com.br), compatível com as coordenadas: CONFIRMAR com os noivos
    address: 'Av. Almirante Barroso, 1091 — Praia de Iracema, Fortaleza/CE',
    // Coordenadas exatas do local no link do Google Maps enviado pelos noivos
    coordinates: { lat: -3.7198813, lng: -38.5137611 },
  },
  reception: {
    name: TO_BE_DEFINED,
    address: 'Endereço a definir',
  },
  dressCode: TO_BE_DEFINED,
  notes: [],
}
