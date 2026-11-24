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
  /** Foto de fundo da Home (vertical: tela cheia no celular, painel lateral no computador) */
  heroImage: {
    /** A mesma foto em larguras diferentes (gerada por `npm run fotos`) */
    sources: { src: string; width: number }[]
    /** Largura ÷ altura da foto (ex.: 1239 / 2201 para uma foto vertical) */
    aspectRatio: number
    alt: string
    /**
     * Ponto que nunca pode ser cortado, de 0 a 1 a partir do canto superior esquerdo
     * (ex.: a torre da igreja). Equivale ao object-position do CSS.
     */
    focus: { x: number; y: number }
  }
  quote: {
    text: string
    /** Autor ou referência, ex.: 'Rute 1:16' */
    source?: string
  }
  /** Contatos no WhatsApp: o convidado escolhe com quem falar */
  contacts: {
    /** Nome no botão, ex.: 'Danilo' */
    name: string
    /** Só dígitos, com DDI e DDD, ex.: '5585999999999' */
    phone: string
    /** Mensagem que já vem escrita ao abrir a conversa */
    message: string
  }[]
  closingMessage: string
}

export interface Venue {
  name: string
  address: string
  /** Horário de início; vazio enquanto não estiver definido */
  startsAt?: IsoDateTime
  /** Coordenadas para os botões de rota; vazio enquanto o local não estiver definido */
  coordinates?: Coordinates
}

export interface EventInfo {
  /**
   * Data do casamento. Enquanto o horário não estiver definido, use meia-noite
   * (ex.: '2027-02-23T00:00:00-03:00') e deixe `ceremony.startsAt` vazio.
   */
  date: IsoDateTime
  ceremony: Venue
  reception: Venue
  dressCode: string
  notes: string[]
}

/** Data sem horário, no formato AAAA-MM-DD, ex.: '2019-03-14' */
export type IsoDate = string

/** Um momento da história dos noivos: data, foto e breve descrição. */
export interface Moment {
  /** Data específica do momento; vazio = a definir */
  date?: IsoDate
  title: string
  /** Breve: até ~200 caracteres, para não ocupar demais a tela do celular */
  description: string
  photo?: Image
}

export interface RsvpConfig {
  /**
   * Último momento para confirmar; depois disso o formulário fecha. Vazio = a definir.
   * Atenção: o script da planilha tem a própria DATA_LIMITE (docs/guia-planilha.md); manter iguais.
   */
  deadline?: IsoDateTime
  intro: string
  /** Aviso de que cada convidado confirma por si (sem acompanhantes no mesmo formulário) */
  individualNote: string
  privacyNotice: string
  closedMessage: string
  /** Textos do formulário */
  form: {
    name: string
    phone: string
    attending: string
    yes: string
    no: string
    message: string
    submit: string
    sending: string
  }
  /** Agradecimento depois do envio, conforme a resposta */
  successYes: string
  successNo: string
  errorMessage: string
  answerAgain: string
  /** Aviso para quem já respondeu neste aparelho */
  alreadyAnswered: string
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

export type SectionId = 'inicio' | 'historia' | 'evento' | 'local' | 'confirmar' | 'presentes'

export interface NavItem {
  id: SectionId
  label: string
}
