const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Ex.: 150 → 'R$ 150,00' */
export function formatBRL(amount: number): string {
  return brl.format(amount)
}
