import { useEffect } from 'react'
import { advance, Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { CameraRig } from './CameraRig'
import { HeroPhoto } from './HeroPhoto'
import { BACKGROUND_HEX } from './palette'
import { PerformanceGuard } from './PerformanceGuard'
import { QUALITY_SETTINGS, type Quality } from './quality'
import { Veil } from './Veil'

interface ExperienceProps {
  quality: Exclude<Quality, 'static'>
  /** Chamado quando a cena e a foto já estão prontas para aparecer. Precisa ser estável. */
  onReady: () => void
  onDegrade: () => void
}

/** A cena 3D completa. Carregada sob demanda (ver Background). */
export default function Experience({ quality, onReady, onDegrade }: ExperienceProps) {
  const settings = QUALITY_SETTINGS[quality]

  // Relógio único: a cena avança no mesmo quadro que o Lenis e o ScrollTrigger
  useEffect(() => {
    // O relógio da cena começa em zero quando ela monta (o do GSAP já vinha contando)
    const start = gsap.ticker.time
    const tick = (time: number) => advance(time - start)
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <Canvas
      frameloop="never"
      flat
      dpr={[1, settings.maxDpr]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.1, far: 60, position: [0, 0.9, 6] }}
    >
      <color attach="background" args={[BACKGROUND_HEX]} />
      <CameraRig />
      <Veil segments={settings.veilSegments} />
      <HeroPhoto onLoaded={onReady} />
      <PerformanceGuard onDegrade={onDegrade} />
    </Canvas>
  )
}
