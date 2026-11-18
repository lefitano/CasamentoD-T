import { Button } from '@/components/Button/Button'
import { Countdown } from '@/components/Countdown/Countdown'
import { couple, event } from '@/content'
import { formatLongDate, formatTime } from '@/lib/date'

/** RF01 — Home: nomes, monograma, data, citação, contagem regressiva e chamadas. */
export function Hero() {
  return (
    <section id="inicio" aria-labelledby="inicio-titulo">
      <p>
        {formatLongDate(event.date)} · {formatTime(event.date)}
      </p>
      <h1 id="inicio-titulo">
        {couple.partner1} &amp; {couple.partner2}
      </h1>
      <blockquote>
        <p>{couple.quote.text}</p>
        {couple.quote.source && <cite>{couple.quote.source}</cite>}
      </blockquote>
      <p>Estamos contando os dias para celebrar esse momento com você.</p>
      <Countdown target={event.date} />
      <Button href="#confirmar">Confirmar presença</Button>
      <Button href="#evento" variant="secondary">
        Ver informações
      </Button>
    </section>
  )
}
