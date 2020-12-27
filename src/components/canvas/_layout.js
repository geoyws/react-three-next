import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import useDarkMode from 'use-dark-mode'
import Effects from '@/components/canvas/_effects'
import useStore from '@/helpers/store'
// import dynamic from 'next/dynamic'
// const Effects = dynamic(() => import('@/components/canvas/_effects'), {
//   ssr: false,
// })
import { configure, editable } from 'react-three-editable'
import editableJson from '@/helpers/editableJson.json'

const bind = configure({
  enablePersistence: true,
  localStorageNamespace: process.env.projectNameSpace + '',
})

const UpdateSceneOnLoaded = () => {
  const { scene } = useThree()
  const updateScene = useStore((state) => state.updateScene)
  useEffect(() => {
    updateScene(scene)
  })
  return null
}

const LCanvas = ({ children }) => {
  const darkMode = useDarkMode()
  // const bindEditable = useStore((state) => state.bindEditable)
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
        antialias: true,
        stencil: false,
        depth: false,
        alpha: false,
      }}
      camera={{ position: [0, 0, 0], near: 5, far: 100 }}
      pixelRatio={1}
      onCreated={({ gl, scene }) => {
        useStore.setState({ gl: gl, scene: scene })
        // bindEditable(gl, scene)
        //
        // import(`react-three-editable`).then((e) => {
        //   console.log(e)
        //   const bind =e.configure({
        //     enablePersistence: true,
        //     localStorageNamespace: process.env.projectNameSpace + '',
        //   })({ gl, scene })
        // })
        bind({
          state: editableJson,
        })({ gl, scene })
        gl.setClearColor(new THREE.Color(darkMode ? 0x111827 : 0xf9fafb))
      }}
    >
      <Suspense fallback={null}>
        <UpdateSceneOnLoaded />
        <Effects />
      </Suspense>
      {children}
    </Canvas>
  )
}

export default LCanvas
