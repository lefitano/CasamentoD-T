import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type ShaderMaterial } from 'three'
import { scrollState } from '@/motion/scrollState'
import { scenePalette } from './palette'
import { simplexNoise3D } from './shaders/noise'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;

  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  ${simplexNoise3D}

  // Altura do tecido: ondas largas e lentas, sem detalhes miúdos
  float elevation(vec2 p) {
    float t = uTime * 0.035;
    vec2 q = p * 0.09 + vec2(0.0, uScroll * 0.8);
    float e = snoise(vec3(q, t));
    e += snoise(vec3(q * 1.8 + 3.7, t * 1.2)) * 0.25;
    return e * 0.7;
  }

  void main() {
    vec3 pos = position;
    float e = elevation(pos.xy);

    // Normal por diferenças finitas, para a luz acompanhar as dobras
    float eps = 0.2;
    float ex = elevation(pos.xy + vec2(eps, 0.0));
    float ey = elevation(pos.xy + vec2(0.0, eps));
    vec3 n = normalize(vec3(-(ex - e) / eps, -(ey - e) / eps, 1.0));

    pos.z += e;
    vElevation = e;
    vNormal = normalize(normalMatrix * n);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uSheen;
  uniform vec3 uBackground;

  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(-vViewPosition);
    vec3 l = normalize(vec3(0.2, 0.9, 0.3));

    // Luz difusa e suave, sem brilho especular: acabamento fosco
    float diffuse = max(dot(n, l), 0.0);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 4.0);

    // Contraste baixo entre dobras e vales: o véu fica em segundo plano
    float shading = smoothstep(-0.6, 0.8, vElevation) * 0.5 + diffuse * 0.2;
    vec3 color = mix(uDeep, uMid, shading * 0.55);
    color += uSheen * rim * 0.04;

    // Neblina mais próxima: o véu se funde ao fundo mais cedo
    float fog = smoothstep(4.0, 18.0, length(vViewPosition));
    color = mix(color, uBackground, fog);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`

/** Véu de seda fosco na penumbra: só atmosfera, movimento lento e discreto. */
export function Veil({ segments }: { segments: number }) {
  const material = useRef<ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDeep: { value: scenePalette.veilDeep },
      uMid: { value: scenePalette.veilMid },
      uSheen: { value: scenePalette.sheen },
      uBackground: { value: scenePalette.background },
    }),
    [],
  )

  useFrame((_, delta) => {
    const u = material.current?.uniforms
    if (!u) return
    u.uTime.value += delta
    u.uScroll.value = MathUtils.damp(u.uScroll.value, scrollState.progress, 2, delta)
  })

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.8, -14]}>
      <planeGeometry args={[60, 60, segments, segments]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
