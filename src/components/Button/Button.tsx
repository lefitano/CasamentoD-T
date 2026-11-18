import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary'

type ButtonAsLink = { href: string; variant?: Variant } & AnchorHTMLAttributes<HTMLAnchorElement>
type ButtonAsButton = {
  href?: undefined
  variant?: Variant
} & ButtonHTMLAttributes<HTMLButtonElement>

/** Botão do site. Com `href` vira link (ex.: âncora, WhatsApp, rota); sem `href`, é um botão. */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  if (props.href !== undefined) {
    const { variant = 'primary', className, ...rest } = props
    return <a data-variant={variant} className={cx(styles.button, className)} {...rest} />
  }
  const { variant = 'primary', type = 'button', className, ...rest } = props
  return (
    <button data-variant={variant} type={type} className={cx(styles.button, className)} {...rest} />
  )
}

function cx(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
