import { useId, useMemo, useState } from 'react'
import { Button } from '@/components/Button/Button'
import { payment, type Gift } from '@/content'
import { formatBRL } from '@/lib/currency'
import { pixCopyPaste } from '@/lib/pix'
import { ScrollTrigger } from '@/motion/gsap'
import styles from './GiftCard.module.css'

/** Copia para a área de transferência; em navegadores antigos, usa o método de seleção */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      area.remove()
      return ok
    } catch {
      return false
    }
  }
}

/** Ícone de presente (traço fino) para quando a foto ainda não existe */
function GiftPlaceholder() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.placeholderIcon}
    >
      <rect x={8} y={19} width={32} height={23} rx={1.5} />
      <path d="M6 13h36v6H6zM24 13v29M24 13c-3-6-11-7-11-2 0 3 6 2 11 2zM24 13c3-6 11-7 11-2 0 3-6 2-11 2z" />
    </svg>
  )
}

interface GiftCardProps {
  gift: Gift
  open: boolean
  onToggle: () => void
}

/**
 * Um presente da vitrine: foto, nome, descrição e valor.
 * "Presentear" se abre ali mesmo com o Pix copia e cola (valor já preenchido)
 * e a opção de pagar com cartão.
 */
export function GiftCard({ gift, open, onToggle }: GiftCardProps) {
  const panelId = useId()
  const [photoFailed, setPhotoFailed] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [showCardNote, setShowCardNote] = useState(false)
  const { texts, pix } = payment
  // Só aceita link https completo: um link colado pela metade não vira botão quebrado
  const cardUrl = gift.cardUrl?.trim().startsWith('https://') ? gift.cardUrl.trim() : ''

  const pixCode = useMemo(
    () =>
      pix.key
        ? pixCopyPaste({
            key: pix.key,
            receiverName: pix.receiverName,
            city: pix.city,
            amount: gift.amount,
            txid: gift.id,
          })
        : '',
    [pix.key, pix.receiverName, pix.city, gift.amount, gift.id],
  )

  async function handleCopy() {
    const ok = await copyText(pixCode)
    setCopyState(ok ? 'copied' : 'failed')
    if (ok) window.setTimeout(() => setCopyState('idle'), 2500)
  }

  return (
    <li className={styles.card} data-open={open}>
      <div className={styles.media}>
        {gift.image?.src && !photoFailed ? (
          <img
            src={gift.image.src}
            alt={gift.image.alt}
            loading="lazy"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <GiftPlaceholder />
        )}
      </div>

      {/* Filhos diretos do card: cada um ocupa uma linha da grade da vitrine (subgrid),
          então nome, descrição, valor e botão ficam alinhados com o vizinho da linha */}
      <h3 className={styles.name}>{gift.name}</h3>
      <p className={styles.description}>{gift.description}</p>
      <p className={styles.amount}>{formatBRL(gift.amount)}</p>

      <div className={styles.actions}>
        <Button
          variant={open ? 'primary' : 'secondary'}
          className={styles.give}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          {open ? texts.close : texts.give}
        </Button>

        {/* O botão "se estende": as opções de pagamento abrem logo abaixo dele */}
        <div
          id={panelId}
          className={styles.panel}
          data-open={open}
          inert={!open}
          onTransitionEnd={(e) => {
            // a altura da página mudou: recalcula os efeitos de rolagem abaixo
            if (e.target === e.currentTarget && e.propertyName === 'opacity')
              ScrollTrigger.refresh()
          }}
        >
          <div className={styles.panelInner}>
            {pixCode ? (
              <div className={styles.option}>
                <p className={styles.optionTitle}>{texts.pixTitle}</p>
                <code className={styles.code}>
                  {/* o corte em 2 linhas fica no texto, não na caixa (senão uma 3ª linha vaza no espaçamento) */}
                  <span className={styles.codeText}>{pixCode}</span>
                </code>
                <Button variant="primary" className={styles.optionButton} onClick={handleCopy}>
                  {copyState === 'copied' ? texts.copied : texts.copy}
                </Button>
                {copyState === 'failed' && <p className={styles.note}>{texts.copyFailed}</p>}
                <p className={styles.hint}>{texts.pixHint}</p>
              </div>
            ) : (
              <p className={styles.note}>{texts.pixSoon}</p>
            )}

            <div className={styles.option}>
              {cardUrl ? (
                <>
                  <Button
                    href={cardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    className={styles.optionButton}
                  >
                    {texts.card}
                  </Button>
                  <p className={styles.hint}>{texts.cardHint}</p>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className={styles.optionButton}
                    onClick={() => setShowCardNote(true)}
                  >
                    {texts.card}
                  </Button>
                  {showCardNote && <p className={styles.note}>{texts.cardSoon}</p>}
                </>
              )}
            </div>

            {/* Avisa leitores de tela quando o código é copiado */}
            <p className="visually-hidden" aria-live="polite">
              {copyState === 'copied' ? texts.copied : ''}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}
