import { useCallback, useEffect, useRef, useState } from 'react'
import { Monogram } from '@/components/Monogram/Monogram'
import { MusicToggle } from '@/components/MusicToggle/MusicToggle'
import { navigation, type SectionId } from '@/content'
import { lockScroll, unlockScroll } from '@/motion/scrollLock'
import styles from './Header.module.css'

/** Seção visível no meio da tela, para destacar o link correspondente no menu. */
function useActiveSection(): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId)
        }
      },
      // Faixa estreita no meio da tela: a seção que a cruza é a ativa
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return active
}

/** true depois que a Home sai quase toda da tela */
function usePastHero(): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return past
}

/**
 * Menu fixo. Transparente sobre a foto; depois da Home ganha fundo translúcido.
 * No celular, abre em tela cheia pelo botão; no computador, os links ficam à vista.
 */
export function Header() {
  const active = useActiveSection()
  const pastHero = usePastHero()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  // Destrava a rolagem já no clique: a navegação até a âncora acontece logo em seguida
  const close = useCallback(() => {
    unlockScroll()
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return

    lockScroll()
    firstLinkRef.current?.focus()
    // O resto da página fica inacessível ao teclado e a leitores de tela enquanto o menu está aberto
    const outside = document.querySelectorAll<HTMLElement>('main, footer')
    outside.forEach((el) => (el.inert = true))

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)

    const toggle = toggleRef.current
    return () => {
      window.removeEventListener('keydown', onKey)
      outside.forEach((el) => (el.inert = false))
      unlockScroll()
      toggle?.focus()
    }
  }, [open])

  return (
    <header className={styles.header} data-solid={pastHero} data-open={open}>
      <a href="#inicio" className={styles.brand} aria-label="Voltar ao início" onClick={close}>
        <Monogram />
      </a>

      <MusicToggle onHero={!pastHero} className={styles.music} />

      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="menu-principal"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="visually-hidden">{open ? 'Fechar menu' : 'Abrir menu'}</span>
        <span className={styles.toggleIcon} aria-hidden="true" />
      </button>

      <nav id="menu-principal" className={styles.nav} aria-label="Seções do site">
        <ul role="list" className={styles.list}>
          {navigation.map((item, index) => (
            <li key={item.id}>
              <a
                ref={index === 0 ? firstLinkRef : undefined}
                href={`#${item.id}`}
                className={styles.link}
                aria-current={active === item.id ? 'location' : undefined}
                onClick={close}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
