import { Button } from '@/components/Button/Button'
import { Section } from '@/components/Section/Section'
import { gifts } from '@/content'
import { formatBRL } from '@/lib/currency'

/** RF07 — Lista de presentes em cotas. O modal de registro e o pagamento entram na Fase 3. */
export function Gifts() {
  return (
    <Section id="presentes" eyebrow="Lista de presentes" title="Presenteie os noivos">
      <ul>
        {gifts.map((gift) => (
          <li key={gift.id}>
            <h3>{gift.name}</h3>
            <p>{formatBRL(gift.amount)}</p>
            <Button>Presentear</Button>
          </li>
        ))}
      </ul>
    </Section>
  )
}
