import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { scrollState } from '@/motion/scrollState'

const lookTarget = new Vector3()

/** Câmera calma: desliza pouco e devagar sobre o véu conforme a rolagem. */
export function CameraRig() {
  useFrame(({ camera }, delta) => {
    const targetZ = 6 - scrollState.progress * 10
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 1.5, delta)
    lookTarget.set(0, camera.position.y - 0.8, camera.position.z - 10)
    camera.lookAt(lookTarget)
  })

  return null
}
