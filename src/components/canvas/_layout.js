import { Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { PerspectiveCamera, ContactShadows } from '@react-three/drei'
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import useDarkMode from 'use-dark-mode'
import useStore from '@/helpers/store'

// import { configure } from 'react-three-editable/dist/store.d.ts'

// const configure = dynamic(() => import('react-three-editable'), {
//   ssr: false,
// })

// console.log(configure)

// const bind = configure({
//   // Enables persistence in development so your edits aren't discarded when you close the browser window
//   enablePersistence: true,
//   // Useful if you use r3e in multiple projects
//   localStorageNamespace: '',
// })

const Rig = () => {
  const { camera, mouse } = useThree()
  const vec = new THREE.Vector3()
  return useFrame(() =>
    camera.position.lerp(
      vec.set(mouse.x * 2, mouse.y * 1, camera.position.z),
      0.02
    )
  )
}

const CanvasTemplateAdds = () => {
  const darkMode = useDarkMode()
  const e = useStore((state) => state.editable)
  console.log(e)
  if (!e) {
    return <></>
  }
  const ECamera = e(PerspectiveCamera, 'perspectiveCamera')

  return (
    <>
      <ECamera makeDefault uniqueName='Camera' />
      <e.spotLight
        uniqueName='Key Light'
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        castShadow
      />
      <e.spotLight
        uniqueName='Fill Light'
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        castShadow
      />
      <fog attach='fog' args={[darkMode ? 0x111827 : 0xf9fafb, 60, 70]} />
      {/* <e.ambientLight
        color={new THREE.Color(darkMode ? 0x111827 : 0xf9fafb)}
        intensity={0.5}
      /> */}
      <ContactShadows
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -8, 0]}
        opacity={0.75}
        width={140}
        height={140}
        blur={1}
        far={9}
      />
      <EffectComposer>
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={0.4} />
      </EffectComposer>
      <Rig />
    </>
  )
}

const UpdateSceneOnLoaded = () => {
  const { scene } = useThree()
  // const loading = useStore((state) => state.loading)
  useEffect(() => {
    console.log(scene.children)
    useStore.setState({ scene: scene })
  }, [scene])
  return null
}

const LCanvas = ({ children }) => {
  const darkMode = useDarkMode()
  const bindEditable = useStore((state) => state.bindEditable)
  return (
    <Canvas
      concurrent
      colorManagement
      style={{
        position: 'absolute',
        top: 0,
      }}
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        stencil: false,
        depth: false,
        alpha: false,
      }}
      camera={{ position: [0, 0, 0], near: 5, far: 100 }}
      pixelRatio={1}
      onCreated={({ gl, scene }) => {
        useStore.setState({ gl: gl, scene: scene })
        bindEditable(gl, scene)
        //
        // import(`react-three-editable`).then((e) => {
        //   console.log(e)
        //   const bind =e.configure({
        //     enablePersistence: true,
        //     localStorageNamespace: process.env.projectNameSpace + '',
        //   })({ gl, scene })
        // })
        // bind({
        //   localStorageNamespace: process.env.projectNameSpace + '',
        // })({ gl, scene })
        gl.setClearColor(new THREE.Color(darkMode ? 0x111827 : 0xf9fafb))
      }}
    >
      <Suspense fallback={null}>
        <UpdateSceneOnLoaded />
        <CanvasTemplateAdds />
      </Suspense>
      {children}
    </Canvas>
  )
}

export default LCanvas
