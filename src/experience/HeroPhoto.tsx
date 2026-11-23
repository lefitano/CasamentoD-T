import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  LinearFilter,
  MathUtils,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector4,
  type Mesh,
  type ShaderMaterial,
  type Texture,
} from 'three'
import { couple } from '@/content'
import { scrollState } from '@/motion/scrollState'
import { simplexNoise3D } from './shaders/noise'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Ocupa a tela inteira, independentemente da câmera
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uImageAspect;
  /** Área da foto na tela (x0, y0, x1, y1), de 0 a 1, com y de baixo para cima */
  uniform vec4 uRect;
  uniform float uRectAspect;
  /** Ponto que nunca é cortado, em coordenadas da textura */
  uniform vec2 uFocus;
  /** Borda esquerda suave (fração da largura da área); 0 = sem borda */
  uniform float uFeather;
  /** 1 quando há texto sobre a foto (celular): escurece mais em cima e embaixo */
  uniform float uTextOver;
  uniform float uTime;
  uniform float uProgress;

  varying vec2 vUv;

  ${simplexNoise3D}

  // Equivalente ao object-fit: cover + object-position (uFocus)
  vec2 coverUv(vec2 uv) {
    vec2 scale = uRectAspect > uImageAspect
      ? vec2(1.0, uImageAspect / uRectAspect)
      : vec2(uRectAspect / uImageAspect, 1.0);
    return uv * scale + (1.0 - scale) * uFocus;
  }

  void main() {
    // Coordenadas dentro da área da foto; fora dela, nada é desenhado
    vec2 local = (vUv - uRect.xy) / (uRect.zw - uRect.xy);
    if (local.x < 0.0 || local.x > 1.0 || local.y < 0.0 || local.y > 1.0) discard;

    float p = uProgress;
    float t = uTime * 0.05;
    vec2 uv = local;

    // Aproxima devagar ao rolar
    uv = (uv - 0.5) / (1.0 + p * 0.08) + 0.5;

    // Fluidez: ondulação suave visível parada, que cresce ao rolar
    vec2 flow = vec2(snoise(vec3(uv * 2.5, t * 1.4)), snoise(vec3(uv * 2.5 + 7.3, t * 1.4)));
    uv += flow * (0.006 + p * 0.03);

    vec3 color = texture2D(uMap, coverUv(uv)).rgb;

    // Escurecimento para leitura (igual ao do HTML em Hero.module.css)
    float bottom = mix(mix(0.7, 0.45, uTextOver), 1.0, smoothstep(0.0, 0.5, local.y));
    float topShade = mix(1.0, mix(0.75, 0.5, uTextOver), smoothstep(0.5, 1.0, local.y));
    color *= bottom * topShade;

    // Dissolução líquida: a foto se desfaz em manchas orgânicas ao rolar
    float n = snoise(vec3(vUv * 1.8, t * 2.0)) * 0.5 + 0.5;
    float edge = n * 0.6 + 0.2;
    float alpha = 1.0 - smoothstep(edge - 0.2, edge + 0.2, p * 1.4);

    // Borda esquerda suave do painel (computador)
    if (uFeather > 0.0) alpha *= smoothstep(0.0, uFeather, local.x);

    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`

interface PhotoLayout {
  /** Área da foto na tela, em frações (0 a 1), y de baixo para cima */
  rect: Vector4
  widthPx: number
  heightPx: number
  /** Computador: painel lateral com borda suave e sem texto por cima */
  panel: boolean
}

/**
 * Mede onde a foto da Home fica na página (o elemento HTML [data-hero-photo]),
 * para a versão 3D ocupar exatamente o mesmo lugar: tela cheia no celular,
 * painel lateral no computador. Mede como se a página estivesse no topo.
 */
function measureLayout(): PhotoLayout {
  const W = window.innerWidth
  const H = window.innerHeight
  const el = document.querySelector('[data-hero-photo]')
  const r = el?.getBoundingClientRect()
  if (!r || r.width === 0) {
    return { rect: new Vector4(0, 0, 1, 1), widthPx: W, heightPx: H, panel: false }
  }
  const top = r.top + window.scrollY
  const bottom = Math.min(top + r.height, H)
  return {
    rect: new Vector4(r.left / W, 1 - bottom / H, r.right / W, 1 - top / H),
    widthPx: r.width,
    heightPx: bottom - top,
    panel: r.left > 1,
  }
}

/** Escolhe a menor versão da foto que cobre a área com nitidez */
function pickSource(layout: PhotoLayout): string {
  const { sources, aspectRatio } = couple.heroImage
  // Para cobrir a área, a foto precisa da largura da área ou da altura × proporção
  const needed =
    Math.max(layout.widthPx, layout.heightPx * aspectRatio) * Math.min(window.devicePixelRatio, 2)
  const sorted = [...sources].sort((a, b) => a.width - b.width)
  return (sorted.find((s) => s.width >= needed) ?? sorted.at(-1))?.src ?? ''
}

/**
 * Foto da Home, viva: ondula de leve e, ao rolar, se dissolve de forma líquida
 * revelando o véu atrás. Fica fixa enquanto o conteúdo sobe.
 */
export function HeroPhoto({ onLoaded }: { onLoaded: () => void }) {
  const mesh = useRef<Mesh>(null)
  const material = useRef<ShaderMaterial>(null)
  const [texture, setTexture] = useState<Texture | null>(null)
  const size = useThree((state) => state.size)
  // Medida da área da foto; refeita quando a tela muda de tamanho (inclui girar o celular)
  const layout = useRef<{ forSize: typeof size; value: PhotoLayout } | null>(null)

  useEffect(() => {
    let loaded: Texture | null = null
    new TextureLoader().load(
      pickSource(measureLayout()),
      (tex) => {
        tex.colorSpace = SRGBColorSpace
        tex.minFilter = LinearFilter
        tex.generateMipmaps = false
        loaded = tex
        setTexture(tex)
        onLoaded()
      },
      undefined,
      // Sem foto, a cena segue só com o véu
      () => onLoaded(),
    )
    return () => loaded?.dispose()
  }, [onLoaded])

  const { focus } = couple.heroImage
  const uniforms = useMemo(
    () => ({
      uMap: { value: null as Texture | null },
      uImageAspect: { value: 1 },
      uRect: { value: new Vector4(0, 0, 1, 1) },
      uRectAspect: { value: 1 },
      // na textura, y cresce de baixo para cima
      uFocus: { value: new Vector2(focus.x, 1 - focus.y) },
      uFeather: { value: 0 },
      uTextOver: { value: 1 },
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }),
    [focus.x, focus.y],
  )

  useFrame((_, delta) => {
    const u = material.current?.uniforms
    if (!u || !texture) return
    if (layout.current?.forSize !== size) layout.current = { forSize: size, value: measureLayout() }
    const area = layout.current.value
    const image = texture.image as { width: number; height: number }
    u.uMap.value = texture
    u.uImageAspect.value = image.width / image.height
    u.uRect.value.copy(area.rect)
    u.uRectAspect.value = area.widthPx / area.heightPx
    u.uFeather.value = area.panel ? 0.18 : 0
    u.uTextOver.value = area.panel ? 0 : 1
    u.uTime.value += delta
    u.uProgress.value = MathUtils.damp(u.uProgress.value, scrollState.heroProgress, 6, delta)
    // Depois de dissolvida, para de desenhar
    if (mesh.current) mesh.current.visible = u.uProgress.value < 0.99
  })

  if (!texture) return null

  return (
    <mesh ref={mesh} renderOrder={1} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}
