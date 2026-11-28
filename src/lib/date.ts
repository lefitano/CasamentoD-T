import type { IsoDate, IsoDateTime } from '@/content'

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

/**
 * Data de um momento, com a precisão que os noivos tiverem:
 * - '2019-03-14' → '14 de março de 2019'
 * - '2019-03'    → 'março de 2019'
 * - '2019'       → '2019'
 * - '2018-2019'  → '2018–2019' (período)
 * Qualquer outro texto aparece como está: um formato inesperado nunca derruba o site.
 * Formatada em UTC de propósito: sem isso, a meia-noite UTC viraria o dia anterior no Brasil.
 */
export function formatCalendarDate(isoDate: IsoDate): string {
  const value = isoDate.trim()
  const format = (options: Intl.DateTimeFormatOptions, iso: string) =>
    new Intl.DateTimeFormat(LOCALE, { ...options, timeZone: 'UTC' }).format(new Date(iso))

  if (/^\d{4}$/.test(value)) return value
  const range = /^(\d{4})\s*[-–]\s*(\d{4})$/.exec(value)
  if (range) return `${range[1]}–${range[2]}`
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(value))
    return format({ month: 'long', year: 'numeric' }, `${value}-01T00:00:00Z`)
  const date = new Date(`${value}T00:00:00Z`)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()))
    return format({ day: 'numeric', month: 'long', year: 'numeric' }, `${value}T00:00:00Z`)
  return value
}

/** Valor aceito no atributo `datetime` do <time> (dia, mês ou ano); senão, nenhum */
export function machineDate(isoDate: IsoDate): string | undefined {
  const value = isoDate.trim()
  return /^\d{4}(-\d{2}(-\d{2})?)?$/.test(value) ? value : undefined
}
