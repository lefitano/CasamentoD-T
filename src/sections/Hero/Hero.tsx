import { useRef, useState } from 'react'
import { Button } from '@/components/Button/Button'
import { Countdown } from '@/components/Countdown/Countdown'
import { couple, event, sectionTexts } from '@/content'
import { formatLongDate, formatTime } from '@/lib/date'
import { EASE_OUT, gsap, prefersReducedMotion, SplitText, useGSAP } from '@/motion/gsap'
import styles from './Hero.module.css'

const { heroImage } = couple

/** RF01 — Home: foto dos noivos, nomes, data, citação, contagem regressiva e chamadas. */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  const names = useRef<HTMLHeadingElement>(null)
  // Sem a foto (arquivo ausente ou falha), a Home fica com o fundo azul, sem ícone quebrado
  const [photoFailed, setPhotoFailed] = useState(false)

  // Abertura (uma vez): nomes sobem linha a linha por trás de uma máscara;
  // o resto surge em sequência, subindo de leve e saindo do desfoque.
  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion() || !names.current || !contextSafe) return
      const items = gsap.utils.toArray<HTMLElement>('[data-intro]', root.current)
      gsap.set([names.current, ...items], { autoAlpha: 0 })

      const play = contextSafe(() => {
        if (!names.current) return
        const split = SplitText.create(names.current, { type: 'lines', mask: 'lines' })
        gsap.set(names.current, { autoAlpha: 1 })

        gsap
          .timeline({
            defaults: { ease: EASE_OUT },
            // Desfaz as máscaras das linhas ao final: elas cortariam a sombra das letras,
            // deixando um retângulo escuro visível atrás dos nomes
            onComplete: () => split.revert(),
          })
          .from(split.lines, { yPercent: 110, duration: 1.5, stagger: 0.12 }, 0.15)
          .fromTo(
            items,
            { autoAlpha: 0, y: 18, filter: 'blur(6px)' },
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.2,
              stagger: 0.08,
              clearProps: 'filter,transform',
            },
            0.35,
          )
      })

      // Espera as fontes para quebrar as linhas no tamanho certo, mas no máximo 1,2 s:
      // num 4G lento, o convidado não fica olhando a Home sem texto
      const fontsOrTimeout = Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 1200)),
      ])
      void fontsOrTimeout.then(play)
    },
    { scope: root },
  )

  return (
    <section ref={root} id="inicio" aria-labelledby="inicio-titulo" className={styles.hero}>
      {/*
        Foto em HTML: aparece na hora e é a versão estática.
        Quando a cena 3D fica pronta, a versão viva (HeroPhoto) assume no mesmo lugar.
      */}
      {!photoFailed && (
        <div className={styles.photo} data-hero-photo>
          <img
            src={heroImage.sources[0].src}
            srcSet={heroImage.sources.map((s) => `${s.src} ${s.width}w`).join(', ')}
            // Celular: tela cheia; computador: painel lateral (ver Hero.module.css)
            sizes="(min-width: 64rem) max(42vw, 56vh), max(100vw, 56vh)"
            alt={heroImage.alt}
            fetchPriority="high"
            style={{ objectPosition: `${heroImage.focus.x * 100}% ${heroImage.focus.y * 100}%` }}
            onError={() => setPhotoFailed(true)}
          />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.top}>
          <p className={styles.date} data-intro>
            <time dateTime={event.ceremony.startsAt ?? event.date}>
              {formatLongDate(event.date)}
              {event.ceremony.startsAt && ` · ${formatTime(event.ceremony.startsAt)}`}
            </time>
          </p>

          <h1 ref={names} id="inicio-titulo" className={styles.names}>
            {/* "& Tereza" não se separa: no celular a quebra fica "Danilo / & Tereza" */}
            <span className={styles.nowrap}>{couple.partner1}</span>{' '}
            <span className={styles.nowrap}>
              <span className={styles.amp}>&amp;</span> {couple.partner2}
            </span>
          </h1>

          <blockquote className={styles.quote} data-intro>
            <p>“{couple.quote.text}”</p>
            {couple.quote.source && <cite>{couple.quote.source}</cite>}
          </blockquote>
        </div>

        <div className={styles.bottom}>
          <p className={styles.lead} data-intro>
            {sectionTexts.hero.lead}
          </p>
          <div data-intro>
            {/* Até o horário ser definido, conta até o início do dia */}
            <Countdown target={event.ceremony.startsAt ?? event.date} />
          </div>
          {/* Um só convite, com contorno para não cobrir a foto: leva ao próximo capítulo */}
          <div className={styles.actions} data-intro>
            <Button href="#historia" variant="secondary" className={styles.cta}>
              {sectionTexts.hero.cta}
              <span className={styles.ctaArrow} aria-hidden="true">
                ↓
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
