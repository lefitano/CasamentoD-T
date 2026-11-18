import { useEffect, useState } from 'react'
import type { IsoDateTime } from '@/content'
import { getTimeRemaining, type TimeRemaining } from '@/lib/date'

/** Contagem regressiva até `target`, atualizada a cada segundo. Para sozinha quando a data chega. */
export function useCountdown(target: IsoDateTime): TimeRemaining {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(target))

  useEffect(() => {
    if (remaining.isPast) return
    const id = window.setInterval(() => setRemaining(getTimeRemaining(target)), 1000)
    return () => window.clearInterval(id)
  }, [target, remaining.isPast])

  return remaining
}
