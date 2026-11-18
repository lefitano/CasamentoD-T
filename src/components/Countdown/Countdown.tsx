import type { IsoDateTime } from '@/content'
import { useCountdown } from '@/hooks/useCountdown'

const UNITS = [
  { key: 'days', label: 'Dias' },
  { key: 'hours', label: 'Horas' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Seg' },
] as const

export function Countdown({ target }: { target: IsoDateTime }) {
  const remaining = useCountdown(target)

  if (remaining.isPast) return <p>Chegou o grande dia!</p>

  return (
    // aria-live desligado: leitores de tela não anunciam a mudança a cada segundo
    <dl aria-label="Contagem regressiva para o casamento" aria-live="off">
      {UNITS.map(({ key, label }) => (
        <div key={key}>
          <dt>{label}</dt>
          <dd>{String(remaining[key]).padStart(2, '0')}</dd>
        </div>
      ))}
    </dl>
  )
}
