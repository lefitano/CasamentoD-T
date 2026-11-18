import type { EventInfo } from './types'

// PROVISÓRIO: data, locais e coordenadas fictícios até os noivos enviarem.
export const event: EventInfo = {
  date: '2027-05-15T16:00:00-03:00',
  ceremony: {
    name: 'Local da cerimônia',
    address: 'Endereço da cerimônia, número — Bairro, Cidade/UF',
    startsAt: '2027-05-15T16:00:00-03:00',
    coordinates: { lat: -23.55052, lng: -46.633308 },
  },
  reception: {
    name: 'Local da recepção',
    address: 'Endereço da recepção, número — Bairro, Cidade/UF',
    startsAt: '2027-05-15T18:00:00-03:00',
    coordinates: { lat: -23.55052, lng: -46.633308 },
  },
  dressCode: 'Traje a definir',
  notes: ['Informações sobre estacionamento', 'Outras observações do dia'],
}
