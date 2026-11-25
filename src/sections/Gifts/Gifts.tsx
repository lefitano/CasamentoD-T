import { useState } from 'react'
import { Section } from '@/components/Section/Section'
import { gifts, sectionTexts } from '@/content'
import { GiftCard } from './GiftCard'
import styles from './Gifts.module.css'

/**
 * RF07 — Lista de presentes: vitrine em 2 colunas, como numa loja, com todos os
 * presentes à mostra. "Presentear" abre o Pix copia e cola e a opção de cartão.
 */
export function Gifts() {
  // Um presente aberto por vez, para a vitrine não virar uma lista de painéis
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Section id="presentes" eyebrow={sectionTexts.gifts.eyebrow} title={sectionTexts.gifts.title}>
      <p className={styles.intro}>{sectionTexts.gifts.intro}</p>
      <ul role="list" className={styles.grid} data-reveal-children>
        {gifts.map((gift) => (
          <GiftCard
            key={gift.id}
            gift={gift}
            open={openId === gift.id}
            onToggle={() => setOpenId((current) => (current === gift.id ? null : gift.id))}
          />
        ))}
      </ul>
    </Section>
  )
}
