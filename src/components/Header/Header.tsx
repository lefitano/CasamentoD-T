import { couple, navigation } from '@/content'

/** Menu fixo. No celular vira botão de menu (etapa 1.5). */
export function Header() {
  return (
    <header>
      <a href="#inicio" aria-label="Voltar ao início">
        {couple.initials}
      </a>
      <nav aria-label="Seções do site">
        <ul>
          {navigation.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
