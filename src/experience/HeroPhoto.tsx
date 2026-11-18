import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  LinearFilter,
  MathUtils,
  SRGBColorSpace,
  TextureLoader,
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
  uniform float uScreenAspect;
  uniform float uTime;
  uniform float uProgress;

  varying vec2 vUv;

  ${simplexNoise3D}

  // Equivalente ao object-fit: cover
  vec2 coverUv(vec2 uv) {
    vec2 scale = uScreenAspect > uImageAspect
      ? vec2(1.0, uImageAspect / uScreenAspect)
      : vec2(uScreenAspect / uImageAspect, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    float p = uProgress;
    float t = uTime * 0.05;
    vec2 uv = vUv;

    // Aproxima devagar ao rolar
    uv = (uv - 0.5) / (1.0 + p * 0.08) + 0.5;

    // Fluidez: ondulação suave visível parada, que cresce ao rolar
    vec2 flow = vec2(snoise(vec3(uv * 2.5, t * 1.4)), snoise(vec3(uv * 2.5 + 7.3, t * 1.4)));
    uv += flow * (0.006 + p * 0.03);

    vec3 color = texture2D(uMap, coverUv(uv)).rgb;

    // Escurece em cima (menu) e embaixo (texto e botões) para garantir leitura
    float shade = mix(0.45, 1.0, smoothstep(0.0, 0.55, vUv.y));
    shade *= mix(1.0, 0.7, smoothstep(0.75, 1.0, vUv.y));
    color *= shade * 0.9;

    // Dissolução líquida: a foto se desfaz em manchas orgânicas ao rolar
    float n = snoise(vec3(vUv * 1.8, t * 2.0)) * 0.5 + 0.5;
    float edge = n * 0.6 + 0.2;
    float alpha = 1.0 - smoothstep(edge - 0.2, edge + 0.2, p * 1.4);

    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`

function pickSource() {
  const portrait = window.matchMedia('(orientation: portrait)').matches
  return portrait ? couple.heroImage.portrait : couple.heroImage.landscape
}

/**
 * Foto dos noivos na Home, viva: ondula de leve e, ao rolar, se dissolve
 * de forma líquida revelando o véu atrás. Fica fixa enquanto o conteúdo sobe.
 */
export function HeroPhoto({ onLoaded }: { onLoaded: () => void }) {
  const mesh = useRef<Mesh>(null)
  const material = useRef<ShaderMaterial>(null)
  const [texture, setTexture] = useState<Texture | null>(null)
  const size = useThree((state) => state.size)

  useEffect(() => {
    let loaded: Texture | null = null
    new TextureLoader().load(
      pickSource(),
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

  const uniforms = useMemo(
    () => ({
      uMap: { value: null as Texture | null },
      uImageAspect: { value: 1 },
      uScreenAspect: { value: 1 },
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }),
    [],
  )

  useFrame((_, delta) => {
    const u = material.current?.uniforms
    if (!u || !texture) return
    const image = texture.image as { width: number; height: number }
    u.uMap.value = texture
    u.uImageAspect.value = image.width / image.height
    u.uScreenAspect.value = size.width / size.height
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
