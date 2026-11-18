import { Button } from '@/components/Button/Button'
import { Countdown } from '@/components/Countdown/Countdown'
import { couple, event } from '@/content'
import { formatLongDate, formatTime } from '@/lib/date'
import styles from './Hero.module.css'

/** RF01 — Home: foto dos noivos, nomes, data, citação, contagem regressiva e chamadas. */
export function Hero() {
  return (
    <section id="inicio" aria-labelledby="inicio-titulo" className={styles.hero}>
      {/*
        Foto em HTML: aparece na hora e é a versão estática.
        Quando a cena 3D fica pronta, a versão viva (HeroPhoto) assume no mesmo lugar.
      */}
      <picture className={styles.photo}>
        <source media="(orientation: portrait)" srcSet={couple.heroImage.portrait} />
        <img src={couple.heroImage.landscape} alt={couple.heroImage.alt} fetchPriority="high" />
      </picture>

      <div className={styles.content}>
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
      </div>
    </section>
  )
}
