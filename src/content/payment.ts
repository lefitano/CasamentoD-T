import type { PaymentConfig } from './types'

export const payment: PaymentConfig = {
  // PROVISÓRIO: falta a chave Pix dos noivos. Sem ela, o site mostra "Pix em breve".
  pix: {
    key: 'daniloeterezanoivos@gmail.com',
    receiverName: 'Danilo e Tereza',
    city: 'Fortaleza',
  },
  texts: {
    give: 'Presentear',
    close: 'Fechar',
    pixTitle: 'Pix copia e cola',
    pixHint:
      'O valor já vem preenchido. No app do seu banco, escolha Pix › Copia e cola e cole o código.',
    copy: 'Copiar código Pix',
    copied: 'Código copiado!',
    copyFailed: 'Não foi possível copiar. Toque e segure no código para copiar.',
    pixSoon: 'O Pix estará disponível em breve.',
    card: 'Pagar com cartão',
    cardSoon: 'O pagamento com cartão estará disponível em breve.',
  },
}
