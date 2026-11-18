/**
 * Formato de todo o conteúdo do site.
 * Os dados ficam nos outros arquivos desta pasta; aqui só a "forma" de cada um.
 */

/** Data e hora em ISO 8601 com o fuso de Brasília, ex.: '2027-05-15T16:00:00-03:00' */
export type IsoDateTime = string

export interface Image {
  /** Caminho do arquivo (será preenchido quando as fotos chegarem) */
  src?: string
  /** Texto alternativo, lido por leitores de tela. Obrigatório. */
  alt: string
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface Couple {
  /** Nome como aparece na Home, ex.: 'Daniela' */
  partner1: string
  partner2: string
  /** Iniciais usadas enquanto o monograma (imagem) não chega, ex.: 'D&T' */
  initials: string
  monogram?: Image
  quote: {
    text: string
    /** Autor ou referência, ex.: 'Rute 1:16' */
    source?: string
  }
  whatsapp: {
    /** Só dígitos, com DDI e DDD, ex.: '5511999999999' */
    phone: string
    /** Mensagem que já vem escrita ao abrir a conversa */
    message: string
  }
  closingMessage: string
}

export interface Venue {
  name: string
  address: string
  startsAt: IsoDateTime
  coordinates: Coordinates
}

export interface EventInfo {
  /** Data e hora da cerimônia; base da contagem regressiva */
  date: IsoDateTime
  ceremony: Venue
  reception: Venue
  dressCode: string
  notes: string[]
}

export interface StoryMilestone {
  /** Texto livre exibido na linha do tempo, ex.: 'Março de 2018' */
  when: string
  title: string
  description: string
  image?: Image
}

export interface GalleryPhoto extends Image {
  /** Foto horizontal ou vertical; ajuda a montar a grade */
  orientation: 'landscape' | 'portrait'
}

export interface RsvpConfig {
  /** Último momento para confirmar; depois disso o formulário fecha */
  deadline: IsoDateTime
  intro: string
  privacyNotice: string
  successMessage: string
  closedMessage: string
}

export interface Gift {
  id: string
  name: string
  description?: string
  /** Valor em reais, ex.: 150 */
  amount: number
  image?: Image
  /** Link de pagamento (InfinitePay ou Mercado Pago, a definir) */
  paymentUrl?: string
}

export type SectionId =
  'inicio' | 'historia' | 'momentos' | 'evento' | 'local' | 'confirmar' | 'presentes'

export interface NavItem {
  id: SectionId
  label: string
}
