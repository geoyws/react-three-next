import { createRef } from 'react'
import create from 'zustand'
import { configure, EditorStore } from 'react-three-editable'

const bind = configure({
  localStorageNamespace: process.env.projectNameSpace + '',
})

const useStore = create((set, get) => {
  return {
    loading: false,
    dom: null,
    router: null,
    gl: null,
    scene: null,
    r3e: null,
    editable: null,
    updateScene: (scene) => {
      set({ scene })
      if (scene) {
        if (process.env.NODE_ENV === 'development') {
          // bind()({ state: editable, gl: useStore.getState().gl, scene })
          console.log(EditorStore)
          // EditorStore.createSnapshot()
          // console.log(useStore.getState().scene.children)
        }
      }
    },
    bindEditable: (gl, scene) => {
      // import(`react-three-editable`).then((e) => {

      // const bind = configure({
      //   enablePersistence: true,
      //   localStorageNamespace: process.env.projectNameSpace + '',
      // })
      // console.log(scene)
      // set({ r3e: e, editable: e.editable })
      // console.log(get().editable)
      // useStore.setState({ editable: e.editable })

      console.log('yeah !')
      // })
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

export default useStore
