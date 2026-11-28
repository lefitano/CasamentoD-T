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

/**
 * Data sem horário: dia ('2019-03-14'), mês ('2019-03'), ano ('2019') ou período ('2018-2019')
 */
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
  /** Identificador sem acentos nem espaços; também é o nome da foto (fotos-originais/presentes/<id>.jpg) */
  id: string
  name: string
  /** Descrição breve (1 ou 2 linhas no celular) */
  description: string
  /** Valor em reais, ex.: 150 */
  amount: number
  image?: Image
  /** Link de pagamento com cartão deste presente (a definir); sem ele, o cartão aparece como "em breve" */
  cardUrl?: string
}

export interface PaymentConfig {
  /** Dados do Pix dos noivos: o código "copia e cola" de cada presente é gerado com o valor dele */
  pix: {
    /** Chave Pix (e-mail, telefone com +55, CPF ou chave aleatória). Vazia = Pix "em breve" */
    key: string
    /** Nome de quem recebe (até 25 caracteres) */
    receiverName: string
    /** Cidade de quem recebe (até 15 caracteres) */
    city: string
  }
  texts: {
    give: string
    close: string
    pixTitle: string
    pixHint: string
    copy: string
    copied: string
    copyFailed: string
    pixSoon: string
    card: string
    /** Aviso sob o botão do cartão: o pagamento abre no site da InfinitePay */
    cardHint: string
    cardSoon: string
  }
}

export type SectionId =
  'inicio' | 'historia' | 'evento' | 'local' | 'confirmar' | 'manual' | 'presentes'

export interface NavItem {
  id: SectionId
  label: string
}

/** Música de fundo: só toca quando o convidado pede (botão no menu) */
export interface MusicConfig {
  /** Caminho do arquivo em public/ (ex.: '/audio/turning-page.m4a'). Vazio: o botão não aparece */
  src: string
  title: string
  artist: string
  /** Volume final do fade-in, de 0 a 1 */
  volume: number
  texts: {
    /** Convite ao lado do botão, só na Home e só até o primeiro toque */
    invite: string
    play: string
    pause: string
  }
}

/** Uma recomendação do Manual dos convidados */
export interface GuestTip {
  title: string
  text: string
}

export interface GuestManualConfig {
  intro: string
  /** Recomendações dos noivos. Vazia: a seção mostra o aviso "Em construção" */
  tips: GuestTip[]
  pending: { label: string; message: string }
}
