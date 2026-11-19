import { useRef, useState } from 'react'
import { Section } from '@/components/Section/Section'
import { moments, sectionTexts, TO_BE_DEFINED, type Image } from '@/content'
import { formatCalendarDate } from '@/lib/date'
import { EASE_OUT, gsap, prefersReducedMotion, useGSAP } from '@/motion/gsap'
import styles from './Story.module.css'

/** Foto do momento; se não houver arquivo ou ele falhar, mostra um quadro vazio discreto. */
function MomentPhoto({ photo }: { photo?: Image }) {
  const [failed, setFailed] = useState(false)
  if (!photo?.src || failed) return <span className={styles.placeholder} aria-hidden="true" />
  return <img src={photo.src} alt={photo.alt} loading="lazy" onError={() => setFailed(true)} />
}

/**
 * RF02 + RF03 — Nossa história: momentos do casal em linha do tempo,
 * cada um com data, foto e breve descrição (a galeria foi unida à história).
 */
export function Story() {
  const list = useRef<HTMLOListElement>(null)

  // Cada momento entra ao rolar: a foto se revela de baixo para cima (máscara)
  // enquanto a imagem "assenta" do leve zoom; o texto surge com fade.
  useGSAP(
    () => {
      if (prefersReducedMotion() || !list.current) return
      gsap.utils.toArray<HTMLElement>('[data-moment]', list.current).forEach((moment) => {
        const frame = moment.querySelector('[data-frame]')
        const image = moment.querySelector('img')
        const text = moment.querySelector('[data-text]')
        const timeline = gsap.timeline({
          defaults: { ease: EASE_OUT },
          scrollTrigger: { trigger: moment, start: 'top 85%', once: true },
        })
        if (frame) {
          timeline.fromTo(
            frame,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3 },
          )
        }
        if (image) timeline.from(image, { scale: 1.15, duration: 1.6 }, 0)
        if (text) timeline.from(text, { autoAlpha: 0, y: 14, duration: 1 }, 0.25)
      })
    },
    { scope: list },
  )

  return (
    <Section id="historia" {...sectionTexts.story}>
      <ol ref={list} role="list" className={styles.list} data-reveal-self>
        {moments.map((moment) => (
          <li key={moment.title} className={styles.moment} data-moment>
            <div className={styles.frame} data-frame>
              <MomentPhoto photo={moment.photo} />
            </div>
            <div className={styles.text} data-text>
              <p className={styles.date}>
                {moment.date ? (
                  <time dateTime={moment.date}>{formatCalendarDate(moment.date)}</time>
                ) : (
                  `Data ${TO_BE_DEFINED.toLowerCase()}`
                )}
              </p>
              <h3 className={styles.title}>{moment.title}</h3>
              <p className={styles.description}>{moment.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
