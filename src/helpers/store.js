import { createRef } from 'react'
import create from 'zustand'

// import { editable as e, configure } from 'react-three-editable'

const useStore = create((set, get) => {
  return {
    loading: false,
    dom: null,
    router: null,
    gl: null,
    scene: null,
    r3e: null,
    editable: null,
    bindEditable: (gl, scene) => {
      import(`react-three-editable`).then((e) => {
        const bind = e.configure({
          enablePersistence: true,
          localStorageNamespace: process.env.projectNameSpace + '',
        })
        console.log(scene)
        set({ r3e: e, editable: e.editable })
        console.log(get().editable)
        // useStore.setState({ editable: e.editable })

        console.log('yeah !')
      })
    },
    setRoute: (route) => {
      set({ loading: true })
      const router = get().router
      if (!router) {
        return
      }
      router.push(route)

      // if (process.env.NODE_ENV === 'development') {
      //   const bind = get().r3e.configure({
      //     enablePersistence: true,
      //     localStorageNamespace: process.env.projectNameSpace + '',
      //   })

      //   bind()({ gl: get().gl, scene: get().scene })
      //   console.log(get().scene.children)
      //   console.log('nice update')
      // }
    },
    updateRoute: (router) => {
      // pre-loading events here ?
      set({ router })
    },
  }
})

useStore.subscribe(
  (scene) => {
    const r3e = useStore.getState().r3e
    console.log(scene)
    if (scene && r3e) {
      if (process.env.NODE_ENV === 'development') {
        const bind = r3e.configure({
          enablePersistence: true,
          localStorageNamespace: process.env.projectNameSpace + '',
        })
        bind()({ gl: useStore.getState().gl, scene: scene })
        console.log(useStore.getState().scene.children)
        console.log('nice update')
      }
    }
  },
  (state) => state.scene
)

export default useStore
