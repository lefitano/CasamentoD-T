import { couple } from '@/content'
import styles from './Monogram.module.css'

/**
 * Monograma dos noivos. Enquanto o arquivo não chega, mostra as iniciais
 * com o "&" em cursiva; depois, basta preencher `couple.monogram` em src/content.
 */
export function Monogram({ className }: { className?: string }) {
  const classes = [styles.monogram, className].filter(Boolean).join(' ')

  if (couple.monogram?.src) {
    return <img className={classes} src={couple.monogram.src} alt={couple.monogram.alt} />
  }

  const [first, second] = couple.initials.split('&')
  return (
    <span className={classes} aria-label={`${couple.partner1} e ${couple.partner2}`}>
      <span aria-hidden="true">
        {first}
        <span className={styles.amp}>&amp;</span>
        {second}
      </span>
    </span>
  )
}
