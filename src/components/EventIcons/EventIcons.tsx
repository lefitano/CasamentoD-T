import type { SVGProps } from 'react'
import styles from './EventIcons.module.css'

/*
 * Ícones de traço fino da seção "O grande dia".
 * Todo traço tem pathLength={1}: assim o efeito de "desenhar" é o mesmo para qualquer
 * forma (ver useDrawIcons). Sem animação (movimento reduzido), aparecem prontos.
 */

type IconProps = SVGProps<SVGSVGElement>

function Frame({ children, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={[styles.icon, className].filter(Boolean).join(' ')}
      data-draw-icon
      {...props}
    >
      {children}
    </svg>
  )
}

/** Cerimônia: igreja com torre e cruz. Ao terminar de desenhar, a cruz brilha. */
export function ChurchIcon(props: IconProps) {
  return (
    <Frame {...props} data-icon="church">
      {/* cruz */}
      <g className={styles.cross}>
        <path pathLength={1} d="M24 3v8" />
        <path pathLength={1} d="M21 6h6" />
      </g>
      {/* torre e telhado */}
      <path pathLength={1} d="M19 19l5-7 5 7" />
      <path pathLength={1} d="M19 19v8M29 19v8" />
      <circle pathLength={1} cx={24} cy={21.5} r={1.8} />
      {/* nave */}
      <path pathLength={1} d="M7 44V33l12-7M29 26l12 7v11" />
      <path pathLength={1} d="M5 44h38" />
      {/* porta em arco */}
      <path pathLength={1} d="M21 44v-6a3 3 0 0 1 6 0v6" />
      {/* janelas */}
      <path pathLength={1} d="M12 41v-3M36 41v-3" />
    </Frame>
  )
}

/** Recepção: duas taças. Ao terminar de desenhar, fazem um brinde. */
export function ToastIcon(props: IconProps) {
  return (
    <Frame {...props} data-icon="toast">
      <g className={styles.glassLeft}>
        <path pathLength={1} d="M13 9h8l-1 12a3 3 0 0 1-6 0z" />
        <path pathLength={1} d="M13.6 14h6.8" />
        <path pathLength={1} d="M17 24v13M13 37h8" />
      </g>
      <g className={styles.glassRight}>
        <path pathLength={1} d="M27 9h8l-1 12a3 3 0 0 1-6 0z" />
        <path pathLength={1} d="M27.6 14h6.8" />
        <path pathLength={1} d="M31 24v13M27 37h8" />
      </g>
      {/* faísca do brinde */}
      <g className={styles.sparkle}>
        <path pathLength={1} d="M24 2v3M20.5 3.5l1.5 2M27.5 3.5l-1.5 2" />
      </g>
    </Frame>
  )
}

/** Traje: vestido e terno lado a lado. Ao terminar de desenhar, balançam de leve. */
export function AttireIcon(props: IconProps) {
  return (
    <Frame {...props} data-icon="attire">
      {/* vestido */}
      <g className={styles.dress}>
        <path pathLength={1} d="M12 7l1.5 4M18 7l-1.5 4" />
        <path pathLength={1} d="M13.5 11h3L17 19l5 22H8l5-22z" />
        <path pathLength={1} d="M13 19h4" />
      </g>
      {/* terno com gravata-borboleta */}
      <g className={styles.suit}>
        <path pathLength={1} d="M28 12l4-4 3 4 3-4 4 4v29H28z" />
        <path pathLength={1} d="M32 8l3 12 3-12" />
        <path pathLength={1} d="M33 12.5l2 1 2-1v2l-2-1-2 1z" />
        <path pathLength={1} d="M35 20v21" />
        <circle pathLength={1} cx={35} cy={27} r={0.6} />
        <circle pathLength={1} cx={35} cy={32} r={0.6} />
      </g>
    </Frame>
  )
}
