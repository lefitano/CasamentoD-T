import { Section } from '@/components/Section/Section'
import { guestManual, sectionTexts } from '@/content'
import styles from './GuestManual.module.css'

/**
 * Manual dos convidados: recomendações dos noivos para o dia (depois da confirmação).
 * Sem recomendações cadastradas, mostra o aviso "Em construção".
 */
export function GuestManual() {
  const { intro, tips, pending } = guestManual

  return (
    <Section id="manual" eyebrow={sectionTexts.manual.eyebrow} title={sectionTexts.manual.title}>
      <p className={styles.intro}>{intro}</p>

      {tips.length > 0 ? (
        <ol role="list" className={styles.tips} data-reveal-children>
          {tips.map((tip, index) => (
            <li key={tip.title} className={styles.tip}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className={styles.tipTitle}>{tip.title}</h3>
                <p className={styles.tipText}>{tip.text}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className={styles.pending}>
          <p className={styles.badge}>
            <span className={styles.dot} aria-hidden="true" />
            {pending.label}
          </p>
          <p className={styles.pendingMessage}>{pending.message}</p>
        </div>
      )}
    </Section>
  )
}
