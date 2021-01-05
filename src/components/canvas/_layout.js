import { Suspense, useLayoutEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import useDarkMode from 'use-dark-mode'
import Effects from '@/components/canvas/_effects'
import useStore from '@/helpers/store'
// import dynamic from 'next/dynamic'
// const Effects = dynamic(() => import('@/components/canvas/_effects'), {
//   ssr: false,
// })

import { configure } from 'react-three-editable'
import editableJson from '@/helpers/editableJson.json'
import { Perf } from 'r3f-perf'

const bind = configure({
  enablePersistence: true,
  localStorageNamespace: process.env.projectNameSpace + '',
})

const UpdateSceneOnLoaded = () => {
  const router = useStore((state) => state.router)
  useLayoutEffect(() => {
    console.log('change Editable here')
  }, [router])
  return null
}

const LCanvas = ({ children }) => {
  const darkMode = useDarkMode()
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
        useStore.setState({ gl, scene })
        bind({
          state: Object.keys(editableJson).length === 0 ? null : editableJson,
        })({ gl, scene })
        gl.setClearColor(new THREE.Color(darkMode ? 0x111827 : 0xf9fafb))
      }}
    >
      <Perf />
      <Suspense fallback={null}>
        <UpdateSceneOnLoaded />
        <Effects />
      </Suspense>
      {children}
    </Canvas>
  )
}

export default LCanvas
