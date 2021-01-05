import create from 'zustand'

const useStore = create((set, get) => {
  return {
    loading: false,
    dom: null,
    router: null,
    gl: null,
    scene: null,
    r3e: null,
    editable: null,
    setRoute: (route) => {
      set({ loading: true })
      const router = get().router
      console.log(router)

      if (!router) {
        return
      }
      router.push(route)
    },
  }
})

export default useStore
