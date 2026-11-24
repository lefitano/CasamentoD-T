/** Só os dígitos, sem o DDI 55 (máximo 11: DDD + 9 dígitos) */
export function phoneDigits(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2)
  return digits.slice(0, 11)
}

/** Máscara enquanto digita: '85999998888' → '(85) 99999-8888' (fixo: '(85) 3333-4444') */
export function formatPhone(value: string): string {
  const d = phoneDigits(value)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Telefone completo: DDD + 8 (fixo) ou 9 (celular) dígitos */
export function isValidPhone(value: string): boolean {
  const length = phoneDigits(value).length
  return length === 10 || length === 11
}
