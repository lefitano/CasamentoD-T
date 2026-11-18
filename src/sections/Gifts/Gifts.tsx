import { Button } from '@/components/Button/Button'
import { Section } from '@/components/Section/Section'
import { gifts, sectionTexts } from '@/content'
import { formatBRL } from '@/lib/currency'
import styles from './Gifts.module.css'

/** RF07 — Lista de presentes em cotas. O modal de registro e o pagamento entram na Fase 3. */
export function Gifts() {
  return (
    <Section id="presentes" eyebrow={sectionTexts.gifts.eyebrow} title={sectionTexts.gifts.title}>
      <p className={styles.intro}>{sectionTexts.gifts.intro}</p>
      <ul role="list" className={styles.list}>
        {gifts.map((gift) => (
          <li key={gift.id} className={styles.item}>
            <h3 className={styles.name}>{gift.name}</h3>
            <p className={styles.amount}>{formatBRL(gift.amount)}</p>
            <Button variant="secondary">Presentear</Button>
          </li>
        ))}
      </ul>
    </Section>
  )
}
