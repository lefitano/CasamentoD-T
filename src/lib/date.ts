import type { IsoDateTime } from '@/content'

/** Datas sempre exibidas no horário de Brasília, independentemente do fuso do aparelho. */
const TIME_ZONE = 'America/Sao_Paulo'
const LOCALE = 'pt-BR'

/** Ex.: '15 de maio de 2027' */
export function formatLongDate(iso: IsoDateTime): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).format(new Date(iso))
}

/** Ex.: 'sábado' */
export function formatWeekday(iso: IsoDateTime): string {
  return new Intl.DateTimeFormat(LOCALE, { weekday: 'long', timeZone: TIME_ZONE }).format(
    new Date(iso),
  )
}

/** Ex.: '16h' ou '16h30' */
export function formatTime(iso: IsoDateTime): string {
  const parts = new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: TIME_ZONE,
  }).formatToParts(new Date(iso))
  const hour = Number(parts.find((p) => p.type === 'hour')?.value)
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
  return minute === '00' ? `${hour}h` : `${hour}h${minute}`
}

export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** true quando a data já passou */
  isPast: boolean
}

/** Tempo que falta até `target`. Depois da data, tudo zera e `isPast` fica true. */
export function getTimeRemaining(target: IsoDateTime, now: Date = new Date()): TimeRemaining {
  const diff = new Date(target).getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }

  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    isPast: false,
  }
}

export function isPast(iso: IsoDateTime, now: Date = new Date()): boolean {
  return new Date(iso).getTime() <= now.getTime()
}
