/**
 * Envio dos formulários para o script do Google (apps-script/Codigo.gs).
 * O endereço vem da variável VITE_FORMS_URL (Vercel ou .env.local; ver docs/guia-planilha.md).
 */

export type FormPayload =
  | {
      tipo: 'confirmacao'
      nome: string
      telefone: string
      comparece: 'sim' | 'nao'
      pessoas: number
      acompanhantes: string
      recado: string
      /** campo-armadilha: só robôs preenchem */
      website: string
    }
  | {
      tipo: 'presente'
      nome: string
      cota: string
      valor: number
      recado: string
      website: string
    }

export interface FormResult {
  ok: boolean
  /** true quando o mesmo telefone já tinha respondido e a resposta foi atualizada */
  atualizado?: boolean
  /** ex.: 'prazo_encerrado', 'telefone' */
  erro?: string
}

export class FormError extends Error {
  readonly code: string
  constructor(code: string) {
    super(`Falha no envio do formulário: ${code}`)
    this.code = code
  }
}

const FORMS_URL = import.meta.env.VITE_FORMS_URL as string | undefined

export async function sendForm(payload: FormPayload): Promise<FormResult> {
  if (!FORMS_URL) {
    if (import.meta.env.DEV) {
      // Modo de teste local: simula o envio sem gravar nada
      console.info('[formulário] modo de teste (sem VITE_FORMS_URL):', payload)
      await new Promise((resolve) => setTimeout(resolve, 900))
      return { ok: true }
    }
    throw new FormError('sem_endereco')
  }

  let response: Response
  try {
    // text/plain evita a "pré-verificação" de CORS, que o Apps Script não atende
    response = await fetch(FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new FormError('rede')
  }
  if (!response.ok) throw new FormError(`http_${response.status}`)

  const result = (await response.json()) as FormResult
  if (!result.ok) throw new FormError(result.erro ?? 'desconhecido')
  return result
}
