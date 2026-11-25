/**
 * Pix "copia e cola" (BR Code estático, padrão EMV do Banco Central).
 * O código leva a chave, o recebedor e o VALOR do presente: o convidado cola no app
 * do banco e o valor já vem preenchido.
 *
 * Referência: Manual de Padrões para Iniciação do Pix (BCB), QR Code estático.
 */

export interface PixInput {
  /** Chave Pix: e-mail, telefone (+55…), CPF/CNPJ ou chave aleatória */
  key: string
  /** Nome de quem recebe (até 25 caracteres) */
  receiverName: string
  /** Cidade de quem recebe (até 15 caracteres) */
  city: string
  /** Valor em reais; sem valor, o convidado digita no app */
  amount?: number
  /** Identificador do pagamento (até 25 caracteres, letras e números); padrão: *** */
  txid?: string
}

/** Campo EMV: id (2 dígitos) + tamanho (2 dígitos) + valor */
function field(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, '0')}${value}`
}

/** Sem acentos e só caracteres aceitos pelos bancos (o padrão pede ASCII) */
function clean(value: string, max: number): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 .\-@]/g, '')
    .trim()
    .slice(0, max)
}

/** CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF), em hexadecimal maiúsculo */
export function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function pixCopyPaste({ key, receiverName, city, amount, txid }: PixInput): string {
  const account = field('00', 'br.gov.bcb.pix') + field('01', key.trim())
  const reference = (txid ?? '').replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || '***'

  const payload =
    field('00', '01') +
    field('26', account) +
    field('52', '0000') +
    field('53', '986') +
    (amount && amount > 0 ? field('54', amount.toFixed(2)) : '') +
    field('58', 'BR') +
    field('59', clean(receiverName, 25)) +
    field('60', clean(city, 15)) +
    field('62', field('05', reference)) +
    '6304'

  return payload + crc16(payload)
}
