import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'light'

type ButtonAsLink = { href: string; variant?: Variant } & AnchorHTMLAttributes<HTMLAnchorElement>
type ButtonAsButton = {
  href?: undefined
  variant?: Variant
} & ButtonHTMLAttributes<HTMLButtonElement>

type ButtonProps = ButtonAsLink | ButtonAsButton

/** Verificação explícita: com `href` é link; funciona em qualquer versão do TypeScript. */
function isLink(props: ButtonProps): props is ButtonAsLink {
  return typeof props.href === 'string'
}

/** Botão do site. Com `href` vira link (ex.: âncora, WhatsApp, rota); sem `href`, é um botão. */
export function Button(props: ButtonProps) {
  if (isLink(props)) {
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
