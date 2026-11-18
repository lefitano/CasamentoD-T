import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { detectQuality, type Quality } from './quality'
import styles from './Background.module.css'

const Experience = lazy(() => import('./Experience'))

/**
 * Fundo do site, fixo atrás do conteúdo.
 * Mostra primeiro um degradê; depois que a página já apareceu, baixa o 3D
 * e faz a transição. Aparelhos sem condições ficam só com o degradê.
 *
 * Quando a cena (com a foto da Home) está pronta, marca <html data-scene="ready">,
 * e a foto em HTML da Home dá lugar à versão viva da cena.
 */
export function Background() {
  const [quality, setQuality] = useState<Quality>(detectQuality)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (quality === 'static') return
    const start = () => setShouldLoad(true)
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(start, 600)
    return () => clearTimeout(id)
  }, [quality])

  useEffect(() => {
    const root = document.documentElement
    if (ready && quality !== 'static') root.dataset.scene = 'ready'
    else delete root.dataset.scene
  }, [ready, quality])

  const handleReady = useCallback(() => setReady(true), [])
  const handleDegrade = useCallback(() => setQuality('static'), [])

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.fallback} />
      {shouldLoad && quality !== 'static' && (
        <Suspense fallback={null}>
          <div className={styles.canvas} data-ready={ready}>
            <Experience quality={quality} onReady={handleReady} onDegrade={handleDegrade} />
          </div>
        </Suspense>
      )}
    </div>
  )
}
