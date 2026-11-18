import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'

type ButtonAsLink = { href: string; variant?: Variant } & AnchorHTMLAttributes<HTMLAnchorElement>
type ButtonAsButton = {
  href?: undefined
  variant?: Variant
} & ButtonHTMLAttributes<HTMLButtonElement>

/** Botão do site. Com `href` vira link (ex.: âncora, WhatsApp, rota); sem `href`, é um botão. */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  if (props.href !== undefined) {
    const { variant = 'primary', ...rest } = props
    return <a data-variant={variant} {...rest} />
  }
  const { variant = 'primary', type = 'button', ...rest } = props
  return <button data-variant={variant} type={type} {...rest} />
}
