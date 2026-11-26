import { useEffect, useRef, useState } from 'react'
import { music } from '@/content'
import styles from './MusicToggle.module.css'

const FADE_IN_MS = 2500
const FADE_OUT_MS = 800
const INVITE_SEEN_KEY = 'musica:convite-visto'

function readInviteSeen(): boolean {
  try {
    return localStorage.getItem(INVITE_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function saveInviteSeen() {
  try {
    localStorage.setItem(INVITE_SEEN_KEY, '1')
  } catch {
    /* sem armazenamento (aba anônima etc.): o convite volta na próxima visita */
  }
}

/**
 * Leva o volume até `to` aos poucos. No iPhone o volume não pode ser mudado por código
 * (fica sempre 1): lá a música simplesmente começa e para, sem o fade.
 */
function fadeVolume(audio: HTMLAudioElement, to: number, ms: number, done?: () => void) {
  const from = audio.volume
  const start = performance.now()
  let frame = 0
  const step = (now: number) => {
    // o horário do quadro pode vir um pouco antes de `start`: limita t e o volume a 0–1
    const t = Math.min(Math.max((now - start) / ms, 0), 1)
    audio.volume = Math.min(Math.max(from + (to - from) * t, 0), 1)
    if (t < 1) frame = requestAnimationFrame(step)
    else done?.()
  }
  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

interface MusicToggleProps {
  /** true enquanto a Home está na tela: só ali aparece o convite escrito */
  onHero: boolean
  className?: string
}

/**
 * Botão de música do menu. Nada toca sozinho (os navegadores nem permitem som antes de
 * um toque, e o convidado pode estar num lugar silencioso): a música começa no toque,
 * entra aos poucos, se repete e pausa sozinha quando o convidado sai da aba.
 * O arquivo só é baixado no primeiro toque.
 */
export function MusicToggle({ onHero, className }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cancelFadeRef = useRef<() => void>(() => {})
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const [inviteSeen, setInviteSeen] = useState(readInviteSeen)

  // Pausa quando o convidado troca de aba ou bloqueia o celular; volta ao retornar
  useEffect(() => {
    let resumeOnReturn = false
    const onVisibility = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden) {
        resumeOnReturn = !audio.paused
        cancelFadeRef.current()
        audio.pause()
      } else if (resumeOnReturn) {
        resumeOnReturn = false
        audio.volume = 0
        audio
          .play()
          .then(() => (cancelFadeRef.current = fadeVolume(audio, music.volume, FADE_IN_MS)))
          .catch(() => setPlaying(false))
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Para a música se o componente sair da página
  useEffect(() => () => audioRef.current?.pause(), [])

  if (!music.src || failed) return null

  function getAudio() {
    if (!audioRef.current) {
      const audio = new Audio(music.src)
      audio.loop = true
      audio.preload = 'auto'
      audio.addEventListener('error', () => {
        setPlaying(false)
        setFailed(true)
      })
      audioRef.current = audio
    }
    return audioRef.current
  }

  function toggle() {
    const audio = getAudio()
    cancelFadeRef.current()

    if (!inviteSeen) {
      setInviteSeen(true)
      saveInviteSeen()
    }

    if (playing) {
      setPlaying(false)
      cancelFadeRef.current = fadeVolume(audio, 0, FADE_OUT_MS, () => audio.pause())
      return
    }

    setPlaying(true)
    if (audio.paused) audio.volume = 0
    audio
      .play()
      .then(() => (cancelFadeRef.current = fadeVolume(audio, music.volume, FADE_IN_MS)))
      .catch(() => setPlaying(false))
  }

  const showInvite = onHero && !inviteSeen

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(' ')}
      data-playing={playing}
      onClick={toggle}
      title={`${music.title} · ${music.artist}`}
    >
      <span className={styles.invite} data-visible={showInvite} aria-hidden="true">
        {music.texts.invite}
      </span>
      <span className="visually-hidden">
        {playing ? music.texts.pause : music.texts.play}: {music.title}, {music.artist}
      </span>
      {/* Quatro traços finos: parados quando pausada, ondulando devagar quando toca */}
      <span className={styles.bars} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  )
}
