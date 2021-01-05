import useStore from '@/helpers/store'
import MyBox from '@/components/canvas/MyBox/MyBox'
import Head from 'next/head'
import { editable as e } from 'react-three-editable'
import useMouseLookAround from '@/helpers/use/useMouseLookAround'
import { EditableCurve } from '@/components/canvas/EditableCurve'
import { PerspectiveCamera } from '@react-three/drei'
import useAnimateAlongCurve from '@/helpers/use/useAnimateAlongCurve'
import mergeRefs from 'react-merge-refs'
import useLookAt from '@/helpers/use/useLookAt'

// import dynamic from 'next/dynamic'
// const MyBox = dynamic(() => import('@/components/canvas/MyBox/MyBox'), {
//   ssr: false,
// })

const BoxesDom = () => {
  return (
    <h1 className='absolute z-10 w-full p-2 mx-auto text-3xl text-center text-gray-900 dark:text-gray-100'>
      R3F Next Starter - Click on a box to navigate
    </h1>
  )
}

const Dom = () => {
  return (
    <>
      <Head>
        <title>Welcome</title>
      </Head>
      <BoxesDom />
    </>
  )
}

const BoxGroup = () => {
  const balloonCameraLookAroundRef = useMouseLookAround()

  // Move the balloon stuff along a curve
  const { objectRef: balloonStuffRef, curveRef } = useAnimateAlongCurve({
    lookAhead: 10,
    loopTime: 30000,
    keepLevel: true,
  })

  // const { eyeRef: lookAt, targetRef: focus } = useLookAt()

  return (
    <>
      <mesh />
      <group ref={balloonStuffRef}>
        <e.group uniqueName='Camera'>
          <PerspectiveCamera
            makeDefault={true}
            far={300}
            ref={balloonCameraLookAroundRef}
          />
        </e.group>
      </group>
      <EditableCurve size={3} ref={curveRef} uniqueName='Curve' />
      <e.group uniqueName='Box Group'>
        <MyBox uniqueName='Box 1' />
        <MyBox uniqueName='Box 2' />
      </e.group>
    </>
  )
}

const Page = () => {
  useStore.setState({ loading: false })
  return (
    <>
      <BoxGroup r3f />
      <Dom />
    </>
  )
}

export default Page
