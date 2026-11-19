import { useRef, useState } from 'react'
import { Section } from '@/components/Section/Section'
import { moments, sectionTexts, TO_BE_DEFINED, type Image } from '@/content'
import { formatCalendarDate } from '@/lib/date'
import { edgeReveal, fadeSlide } from '@/motion/edgeReveal'
import { gsap, prefersReducedMotion, useGSAP } from '@/motion/gsap'
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

  // Cada momento acompanha a rolagem, nos dois sentidos: a foto se abre como uma cortina
  // a partir da borda por onde entra (e se fecha pela borda por onde sai), saindo de um
  // leve zoom; o texto sobe/desce um pouco e ganha opacidade.
  useGSAP(
    () => {
      if (prefersReducedMotion() || !list.current) return
      gsap.utils.toArray<HTMLElement>('[data-moment]', list.current).forEach((moment) => {
        const frame = moment.querySelector<HTMLElement>('[data-frame]')
        const image = moment.querySelector<HTMLElement>('img')
        const text = moment.querySelector<HTMLElement>('[data-text]')
        const textEffect = text ? fadeSlide(text, 20) : null

        edgeReveal(moment, (enter, exit) => {
          if (frame) {
            frame.style.clipPath = `inset(${(1 - exit) * 100}% 0% ${(1 - enter) * 100}% 0%)`
          }
          if (image) {
            image.style.transform = `scale(${1 + 0.15 * (1 - Math.min(enter, exit))})`
          }
          textEffect?.(enter, exit)
        })
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
