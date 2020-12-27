import useStore from '@/helpers/store'
import MyBox from '@/components/canvas/MyBox/MyBox'
import Head from 'next/head'
import { editable as e } from 'react-three-editable'

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
  // console.log(e)
  // if (!e) {
  //   return <></>
  // }
  return (
    <e.group uniqueName='Box Group' position={[0, 0, -20]}>
      <MyBox uniqueName='Box 1' position={[10, 0, -5]} />
      <MyBox uniqueName='Box 2' position={[-10, 0, -5]} />
      <MyBox uniqueName='Box 3' position={[0, 10, 0]} />
      <MyBox uniqueName='Box 4' position={[0, -5, 5]} />
    </e.group>
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
