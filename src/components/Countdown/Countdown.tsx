import type { IsoDateTime } from '@/content'
import { useCountdown } from '@/hooks/useCountdown'
import styles from './Countdown.module.css'

const UNITS = [
  { key: 'days', label: 'Dias' },
  { key: 'hours', label: 'Horas' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Seg' },
] as const

export function Countdown({ target, className }: { target: IsoDateTime; className?: string }) {
  const remaining = useCountdown(target)
  const classes = [styles.countdown, className].filter(Boolean).join(' ')

  if (remaining.isPast) return <p className={classes}>Chegou o grande dia!</p>

  return (
    // aria-live desligado: leitores de tela não anunciam a mudança a cada segundo
    <dl className={classes} aria-label="Contagem regressiva para o casamento" aria-live="off">
      {UNITS.map(({ key, label }) => (
        <div key={key} className={styles.unit}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>{String(remaining[key]).padStart(2, '0')}</dd>
        </div>
      ))}
    </dl>
  )
}
