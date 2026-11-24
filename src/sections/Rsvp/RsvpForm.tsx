import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/Button/Button'
import { rsvp } from '@/content'
import { FormError, sendForm } from '@/lib/forms'
import { formatPhone, isValidPhone, phoneDigits } from '@/lib/phone'
import { ScrollTrigger } from '@/motion/gsap'
import styles from './RsvpForm.module.css'

type Attending = 'sim' | 'nao'
type Field = 'name' | 'phone' | 'attending'
type Status = 'idle' | 'sending' | 'success' | 'error'

/** Marca, neste aparelho, que o convidado já respondeu (só para um aviso gentil) */
const ANSWERED_KEY = 'casamento-rsvp-respondido'

function readAnswered(): boolean {
  try {
    return window.localStorage.getItem(ANSWERED_KEY) === '1'
  } catch {
    return false
  }
}

function saveAnswered() {
  try {
    window.localStorage.setItem(ANSWERED_KEY, '1')
  } catch {
    // navegação privada ou armazenamento bloqueado: segue sem o aviso
  }
}

/** Rótulo + campo + mensagem de erro, ligados entre si para leitores de tela */
function FieldBox({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-dica`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-erro`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}

/** RF06 — formulário de confirmação de presença, enviado à planilha dos noivos. */
export function RsvpForm() {
  const uid = useId()
  const ids = {
    name: `${uid}-nome`,
    phone: `${uid}-telefone`,
    message: `${uid}-recado`,
    attending: `${uid}-comparece`,
  }

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [attending, setAttending] = useState<Attending | null>(null)
  const [message, setMessage] = useState('')
  const [trap, setTrap] = useState('')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [failure, setFailure] = useState('')
  const [answeredBefore] = useState(readAnswered)

  const wrapper = useRef<HTMLDivElement>(null)
  const successTitle = useRef<HTMLParagraphElement>(null)
  const nameInput = useRef<HTMLInputElement>(null)
  const phoneInput = useRef<HTMLInputElement>(null)
  const attendingGroup = useRef<HTMLFieldSetElement>(null)

  // A altura do formulário muda (campos que aparecem, agradecimento): recalcula os
  // efeitos de rolagem das seções abaixo
  useEffect(() => {
    const el = wrapper.current
    if (!el) return
    let timer = 0
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (status === 'success') successTitle.current?.focus()
  }, [status])

  function validate() {
    const found: Partial<Record<Field, string>> = {}
    if (name.trim().length < 2) found.name = 'Informe seu nome completo.'
    if (!isValidPhone(phone)) found.phone = 'Informe o telefone com DDD, ex.: (85) 99999-9999.'
    if (!attending) found.attending = 'Escolha se vai comparecer.'
    return found
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (found.name) return nameInput.current?.focus()
    if (found.phone) return phoneInput.current?.focus()
    if (found.attending) return attendingGroup.current?.querySelector('input')?.focus()

    setStatus('sending')
    setFailure('')
    try {
      await sendForm({
        tipo: 'confirmacao',
        nome: name.trim(),
        telefone: phoneDigits(phone),
        comparece: attending as Attending,
        // Confirmação individual: sempre 1 pessoa (mantido para o script antigo continuar aceitando)
        pessoas: attending === 'sim' ? 1 : 0,
        recado: message.trim(),
        website: trap,
      })
      saveAnswered()
      setStatus('success')
    } catch (error) {
      const code = error instanceof FormError ? error.code : 'desconhecido'
      setFailure(code === 'prazo_encerrado' ? rsvp.closedMessage : rsvp.errorMessage)
      setStatus('error')
    }
  }

  /** Ao mexer num campo, a mensagem de erro dele some (sem esperar o próximo envio) */
  function clearError(field: Field) {
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }

  function answerAgain() {
    setStatus('idle')
    setErrors({})
  }

  const describedBy = (id: string, field: Field, hasHint = false) =>
    errors[field] ? `${id}-erro` : hasHint ? `${id}-dica` : undefined

  return (
    <div ref={wrapper} className={styles.wrapper}>
      {status === 'success' ? (
        <div className={styles.success} role="status">
          <p ref={successTitle} tabIndex={-1} className={styles.successText}>
            {attending === 'sim' ? rsvp.successYes : rsvp.successNo}
          </p>
          <Button variant="secondary" onClick={answerAgain}>
            {rsvp.answerAgain}
          </Button>
        </div>
      ) : (
        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <p className={styles.note}>{rsvp.individualNote}</p>
          {answeredBefore && <p className={styles.note}>{rsvp.alreadyAnswered}</p>}

          <FieldBox id={ids.name} label={rsvp.form.name} error={errors.name}>
            <input
              ref={nameInput}
              id={ids.name}
              className={styles.input}
              type="text"
              autoComplete="name"
              maxLength={120}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearError('name')
              }}
              aria-invalid={!!errors.name}
              aria-describedby={describedBy(ids.name, 'name')}
            />
          </FieldBox>

          <FieldBox id={ids.phone} label={rsvp.form.phone} error={errors.phone}>
            <input
              ref={phoneInput}
              id={ids.phone}
              className={styles.input}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(85) 99999-9999"
              value={phone}
              onChange={(e) => {
                setPhone(formatPhone(e.target.value))
                clearError('phone')
              }}
              aria-invalid={!!errors.phone}
              aria-describedby={describedBy(ids.phone, 'phone')}
            />
          </FieldBox>

          <fieldset
            ref={attendingGroup}
            className={styles.field}
            aria-invalid={!!errors.attending}
            aria-describedby={errors.attending ? `${ids.attending}-erro` : undefined}
          >
            <legend className={styles.label}>{rsvp.form.attending}</legend>
            <div className={styles.choices}>
              {(['sim', 'nao'] as const).map((value) => (
                <label key={value} className={styles.choice}>
                  <input
                    type="radio"
                    name={ids.attending}
                    value={value}
                    checked={attending === value}
                    onChange={() => {
                      setAttending(value)
                      clearError('attending')
                    }}
                  />
                  <span>{value === 'sim' ? rsvp.form.yes : rsvp.form.no}</span>
                </label>
              ))}
            </div>
            {errors.attending && (
              <p id={`${ids.attending}-erro`} className={styles.error}>
                {errors.attending}
              </p>
            )}
          </fieldset>

          <FieldBox id={ids.message} label={rsvp.form.message}>
            <textarea
              id={ids.message}
              className={`${styles.input} ${styles.textarea}`}
              rows={3}
              maxLength={1000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </FieldBox>

          {/* Campo-armadilha: invisível para pessoas; robôs costumam preencher e são descartados */}
          <div className={styles.trap} aria-hidden="true">
            <label>
              Site
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
              />
            </label>
          </div>

          {status === 'error' && (
            <p className={styles.failure} role="alert">
              {failure}
            </p>
          )}

          <Button type="submit" disabled={status === 'sending'} className={styles.submit}>
            {status === 'sending' ? rsvp.form.sending : rsvp.form.submit}
          </Button>
        </form>
      )}
    </div>
  )
}
