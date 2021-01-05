export default class GLBench {
  /** GLBench constructor
   * @param { WebGLRenderingContext | WebGL2RenderingContext } gl context
   * @param { Object | undefined } settings additional settings
   */
  constructor(settings = {}) {
    const canvas = window.document.createElement('canvas')

    const gl = canvas.getContext()

    this.paramLogger = () => {}
    this.chartLogger = () => {}
    this.chartLen = 20
    this.chartHz = 20

    this.names = []
    this.cpuAccums = []
    this.gpuAccums = []
    this.activeAccums = []
    this.chart = new Array(this.chartLen)
    this.now = () =>
      window.performance && window.performance.now
        ? window.performance.now()
        : Date.now()

    Object.assign(this, settings)
    this.detected = 0
    this.finished = []
    this.isFramebuffer = 0
    this.frameId = 0

    // 120hz device detection
    let rafId
    let n = 0
    let t0
    const loop = (t) => {
      if (++n < 20) {
        rafId = window.requestAnimationFrame(loop)
      } else {
        this.detected = Math.ceil((1e3 * n) / (t - t0) / 70)
        console.log(this.detected)
        window.cancelAnimationFrame(rafId)
      }
      if (!t0) t0 = t
    }
    window.requestAnimationFrame(loop)

    // attach gpu profilers
    if (gl) {
      console.log(gl)
      const glFinish = async (t, activeAccums) =>
        Promise.resolve(
          setTimeout(() => {
            gl.getError()
            const dt = this.now() - t
            activeAccums.forEach((active, i) => {
              if (active) this.gpuAccums[i] += dt
            })
          }, 0)
        )

      const addProfiler = (fn, self, target) =>
        function () {
          const t = self.now()
          fn.apply(target, arguments)
          if (self.trackGPU)
            self.finished.push(glFinish(t, self.activeAccums.slice(0)))
        }

      ;[
        'drawArrays',
        'drawElements',
        'drawArraysInstanced',
        'drawBuffers',
        'drawElementsInstanced',
        'drawRangeElements',
      ].forEach((fn) => {
        if (gl[fn]) gl[fn] = addProfiler(gl[fn], this, gl)
      })

      gl.getExtension = ((fn, self) =>
        function () {
          const ext = fn.apply(gl, arguments)
          if (ext) {
            ;['drawElementsInstancedANGLE', 'drawBuffersWEBGL'].forEach(
              (fn) => {
                if (ext[fn]) ext[fn] = addProfiler(ext[fn], self, ext)
              }
            )
          }
          return ext
        })(gl.getExtension, this)
    }
  }

  /**
   * Explicit UI add
   * @param { string | undefined } name
   */
  addUI(name) {
    if (this.names.indexOf(name) === -1) {
      this.names.push(name)
      if (this.dom) {
        this.dom.insertAdjacentHTML('beforeend', this.svg)
        this.updateUI()
      }
      this.cpuAccums.push(0)
      this.gpuAccums.push(0)
      this.activeAccums.push(false)
    }
  }

  /**
   * Increase frameID
   * @param { number | undefined } now
   */
  nextFrame(now) {
    this.frameId++
    const t = now || this.now()

    // params
    if (this.frameId <= 1) {
      this.paramFrame = this.frameId
      this.paramTime = t
    } else {
      const duration = t - this.paramTime
      if (duration >= 1e3) {
        const frameCount = this.frameId - this.paramFrame
        const fps = (frameCount / duration) * 1e3
        for (let i = 0; i < this.names.length; i++) {
          const cpu = (this.cpuAccums[i] / duration) * 100
          const gpu = (this.gpuAccums[i] / duration) * 100
          const mem =
            window.performance && window.performance.memory
              ? window.performance.memory.usedJSHeapSize / (1 << 20)
              : 0
          this.paramLogger(i, cpu, gpu, mem, fps, duration, frameCount)
          this.cpuAccums[i] = 0
          Promise.all(this.finished).then(() => {
            this.gpuAccums[i] = 0
            this.finished = []
          })
        }
        this.paramFrame = this.frameId
        this.paramTime = t
      }
    }

    // chart
    if (!this.detected || !this.chartFrame) {
      this.chartFrame = this.frameId
      this.chartTime = t
      this.circularId = 0
    } else {
      const timespan = t - this.chartTime
      let hz = (this.chartHz * timespan) / 1e3
      while (--hz > 0 && this.detected) {
        const frameCount = this.frameId - this.chartFrame
        const fps = (frameCount / timespan) * 1e3
        this.chart[this.circularId % this.chartLen] = fps
        for (let i = 0; i < this.names.length; i++) {
          this.chartLogger(i, this.chart, this.circularId)
        }
        this.circularId++
        this.chartFrame = this.frameId
        this.chartTime = t
      }
    }
  }

  /**
   * Begin named measurement
   * @param { string | undefined } name
   */
  begin(name) {
    this.updateAccums(name)
  }

  /**
   * End named measure
   * @param { string | undefined } name
   */
  end(name) {
    this.updateAccums(name)
  }

  updateAccums(name) {
    let nameId = this.names.indexOf(name)
    if (nameId === -1) {
      nameId = this.names.length
      this.addUI(name)
    }

    const t = this.now()
    const dt = t - this.t0
    for (let i = 0; i < nameId + 1; i++) {
      if (this.activeAccums[i]) {
        this.cpuAccums[i] += dt
      }
    }
    this.activeAccums[nameId] = !this.activeAccums[nameId]
    this.t0 = t
  }
}
