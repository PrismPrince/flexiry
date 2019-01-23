import imgur from '@/services/imgur'
import ColorPicker from './_components/Color-Picker'
import ToolBtn from './_components/Tool-Btn'
import UploadDialog from './_components/Upload-Dialog'

export default {
  name: 'imgur',
  components: { ColorPicker, ToolBtn, UploadDialog },
  data () {
    return {
      windowSize: {
        height: 0,
        width: 0
      },
      canvas: null,
      ctx: null,
      popup: {
        active: false,
        persistent: false,
        color: 'teal',
        note: null,
        progress: false
      },
      draw: {
        active: false,
        tool: null,
        zoom: 100,
        free: {
          activated: false,
          points: []
        },
        text: {
          active: false,
          field: false,
          text: null,
          align: 'center', // left, center, right, start, end
          baseline: 'middle', // alphabetic, top, hanging, middle, ideographic, bottom
          font: {
            style: [], // normal, italic, oblique <degree>
            variant: 'normal', // unchanged: normal, small-caps
            weight: 400, // 400, 100, 300, 500, 700, 900
            size: '1', // 14px, 12px, 16px, 20px, 24px, 34px, 45px, 56px, 112px
            lineHeight: 'normal', // unchanged: normal, <number> (unitless), <length>, <percentage>
            family: 'Roboto' // unchanged
          }
        },
        history: {
          undo: [],
          redo: []
        },
        custom: {
          size: null,
          width: 0,
          height: 0,
          background: {
            has: true,
            color: { hex: '#ffffff' }
          }
        },
        uploaded: {
          active: false,
          id: null,
          img: null,
          link: null,
          deletehash: null,
          deleteLink: null
        },
        dimen: {
          active: false,
          startX: 0,
          startY: 0,
          endX: 0,
          endY: 0
        },
        stroke: {
          has: true,
          size: 5,
          color: { hex: '#000000' }
        },
        fill: {
          has: true,
          color: { hex: '#000000' }
        }
      },
      history: []
    }
  },
  created () {
    let align, baseline, font

    if (window.localStorage.getItem('imgur-draw-stroke') !== null) {
      this.draw.stroke = JSON.parse(window.localStorage.getItem('imgur-draw-stroke'))
      this.draw.stroke.color.hex = this.draw.stroke.color.hex || '#000000'
    }

    if (window.localStorage.getItem('imgur-draw-fill') !== null) {
      this.draw.fill = JSON.parse(window.localStorage.getItem('imgur-draw-fill'))
      this.draw.fill.color.hex = this.draw.fill.color.hex || '#000000'
    }

    if (window.localStorage.getItem('imgur-draw-text') !== null) {
      ({ align, baseline, font } = JSON.parse(window.localStorage.getItem('imgur-draw-text')))

      this.draw.text.align = align
      this.draw.text.baseline = baseline
      this.draw.text.font = font
    }

    if (window.localStorage.getItem('imgur-history') !== null) this.history = JSON.parse(window.localStorage.getItem('imgur-history'))
  },
  mounted () {
    this.windowSize.width = window.innerWidth
    this.windowSize.height = window.innerHeight
    this.canvas = document.getElementById('draw')
    this.ctx = this.canvas.getContext('2d')

    window.addEventListener('resize', this.handleResize, false)
    document.addEventListener('paste', this.handlePaste, false)
    document.addEventListener('keypress', this.handleKeypress, false)

    console.log('Event added!')
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize, false)
    document.removeEventListener('paste', this.handlePaste, false)
    document.removeEventListener('keypress', this.handleKeypress, false)

    console.log('Event removed!')
  },
  watch: {
    windowSize: {
      deep: true,
      handler (size) {
        if (size.width < 960 || size.height < 500) {
          this.popup.active = true
          this.popup.persistent = true
          this.popup.color = 'grey darken-4'
          this.popup.note = 'Please make your browser larger so the Flexiry interface can work reliably.'
        } else this.popup.active = false
      }
    },
    'draw.stroke': {
      deep: true,
      handler (stroke) {
        window.localStorage.setItem('imgur-draw-stroke', JSON.stringify(stroke))
      }
    },
    'draw.fill': {
      deep: true,
      handler (fill) {
        window.localStorage.setItem('imgur-draw-fill', JSON.stringify(fill))
      }
    },
    'draw.text': {
      deep: true,
      handler (options) {
        let text = {
          align: options.align,
          baseline: options.baseline,
          font: options.font
        }

        window.localStorage.setItem('imgur-draw-text', JSON.stringify(text))
      }
    },
    'popup.active' (status) {
      if (!status) {
        this.popup.persistent = false
        this.popup.color = 'teal'
        this.popup.note = null
        this.popup.progress = false
      }
    },
    'draw.uploaded.active' (status) {
      if (!status) {
        this.draw.uploaded.id = null
        this.draw.uploaded.img = null
        this.draw.uploaded.link = null
        this.draw.uploaded.deletehash = null
        this.draw.uploaded.deleteLink = null
      }
    },
    history (history) {
      window.localStorage.setItem('imgur-history', JSON.stringify(history))
    }
  },
  methods: {
    handleResize () {
      console.log('Resize:', window.innerWidth, window.innerHeight)

      this.windowSize.width = window.innerWidth
      this.windowSize.height = window.innerHeight
    },
    setCanvasBackground (hex) {
      if (hex === 'transparent') {
        this.draw.custom.background.has = false
      } else {
        this.draw.custom.background.has = true
        this.draw.custom.background.color.hex = hex
      }
    },
    createCanvas () {
      switch (this.draw.custom.size) {
        case '720 x 480':
          this._drawCanvas(720, 480)
          break
        case '1024 x 768':
          this._drawCanvas(1024, 768)
          break
        case '1024 x 1024':
          this._drawCanvas(1024, 1024)
          break
        case '1920 x 1080':
          this._drawCanvas(1920, 1080)
          break
        case '2048 x 2048':
          this._drawCanvas(2048, 2048)
          break
        case 'Custom...':
          if (this.draw.custom.width <= 0 || this.draw.custom.height <= 0) return

          this._drawCanvas(this.draw.custom.width, this.draw.custom.height)
          break
      }

      this.draw.history.undo.push(this.canvas.toDataURL())

      this.draw.active = true
    },
    handlePaste (event) {
      let items
      let blob
      let source
      let objURL = window.URL || window.webkitURL
      let image = this._initImage(() => {
        this.canvas.width = image.width
        this.canvas.height = image.height

        this.ctx.drawImage(image, 0, 0)
        this.draw.history.undo.push(this.canvas.toDataURL())

        this.draw.active = true
        this.popup.active = false

        console.log('Image pasted!')
      })

      console.log('Pasting image...')

      if (this.draw.text.field) return

      if (this.windowSize.width < 960 || this.windowSize.height < 500) {
        console.warn('Image not pasted: window size limit')
        return
      }

      this.draw.uploaded.active = false
      this.popup.active = false
      this.popup.persistent = true
      this.popup.progress = true
      this.popup.note = 'Pasting...'
      this.popup.active = true

      if (event.clipboardData) {
        items = event.clipboardData.items

        if (!items) {
          console.warn('No items on clipboard', items)
          this.popup.active = false
          return
        }

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            blob = items[i].getAsFile()
            source = objURL.createObjectURL(blob)
            image.src = source
          } else {
            console.warn('No image on clipboard items', items)
            this.popup.active = false
          }

          event.preventDefault()
        }
      } else {
        console.warn('clipboardData not supported')
        this.popup.active = false
      }
    },
    handleKeypress (event) {
      let image = this._initImage(() => {
        this.canvas.width = image.width
        this.canvas.height = image.height

        this.ctx.clearRect(0, 0, image.width, image.height)
        this.ctx.drawImage(image, 0, 0)
        console.log('canvas cleared')
      })

      if (!this.draw.active) return

      if (this.draw.text.field) return

      console.log('Keypress fired!')

      if (event.ctrlKey && !event.shiftKey && event.keyCode === 25) {
        this.redo()

        console.log('Keypress: Ctrl + Y', event.ctrlKey, event.shiftKey, event.keyCode)
      } else if (event.ctrlKey && event.shiftKey && event.keyCode === 26) {
        this.redo()

        console.log('Keypress: Ctrl + Shift + Z', event.ctrlKey, event.shiftKey, event.keyCode)
      } else if (event.ctrlKey && !event.shiftKey && event.keyCode === 26) {
        this.undo()

        console.log('Keypress: Ctrl + Z', event.ctrlKey, event.shiftKey, event.keyCode)
      } else {

        switch (event.keyCode) {
          case 67:
          case 99:
            if (this.draw.tool === 'text') image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

            this.draw.tool = this.draw.tool !== 'crop' ? 'crop' : null

            console.log('Keypress: C', event.keyCode)
            break
          case 72:
          case 104:
            if (this.draw.tool === 'text') image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

            this.draw.tool = this.draw.tool !== 'free' ? 'free' : null

            console.log('Keypress: H', event.keyCode)
            break
          case 76:
          case 108:
            if (this.draw.tool === 'text') image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

            this.draw.tool = this.draw.tool !== 'line' ? 'line' : null

            console.log('Keypress: L', event.keyCode)
            break
          case 82:
          case 114:
            if (this.draw.tool === 'text') image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

            this.draw.tool = this.draw.tool !== 'rect' ? 'rect' : null

            console.log('Keypress: R', event.keyCode)
            break
          case 69:
          case 101:
            if (this.draw.tool === 'text') image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

            this.draw.tool = this.draw.tool !== 'circ' ? 'circ' : null

            console.log('Keypress: E', event.keyCode)
            break
          case 84:
          case 116:
            if (this.draw.tool === 'text') image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

            this.draw.tool = this.draw.tool !== 'text' ? 'text' : null

            console.log('Keypress: T', event.keyCode)
            break
          case 83:
          case 115:
            this.draw.stroke.has = !this.draw.stroke.has

            console.log('Keypress: S', event.keyCode)
            break
          case 70:
          case 102:
            this.draw.fill.has = !this.draw.fill.has

            console.log('Keypress: F', event.keyCode)
            break
          case 61:
          case 48:
            this.draw.zoom = 100

            console.log('Keypress: 0 / =', event.keyCode)
            break
          case 43:
          case 73:
          case 105:
            if (this.draw.zoom < 300) this.draw.zoom += 10

            console.log('Keypress: + / I', event.keyCode)
            break
          case 45:
          case 79:
          case 111:
            if (this.draw.zoom > 10) this.draw.zoom -= 10

            console.log('Keypress: - / O', event.keyCode)
            break
          case 81:
          case 113:
            this.reset()

            console.log('Keypress: Q', event.keyCode)
        }
      }
    },
    setTool (tool) {
      this.draw.tool = tool
    },
    setStrokeColor (hex) {
      if (hex === 'transparent') this.draw.stroke.has = false
      else {
        this.draw.stroke.has = true
        this.draw.stroke.color.hex = hex
      }
    },
    setFillColor (hex) {
      if (hex === 'transparent') this.draw.fill.has = false
      else {
        this.draw.fill.has = true
        this.draw.fill.color.hex = hex
      }
    },
    startPlot (event) {
      if (!this.draw.tool) return

      this.draw.dimen.active = true
      this.draw.dimen.startX = this._fixZoom(event.offsetX)
      this.draw.dimen.startY = this._fixZoom(event.offsetY)

      this.ctx.beginPath()

      if (this.draw.tool === 'free') {
        if (!this.draw.stroke.has) return

        this.draw.free.points = []
        this.draw.free.points.push({ x: this.draw.dimen.startX, y: this.draw.dimen.startY })
      } else if (this.draw.tool === 'text') this.draw.text.active = true
    },
    move (event) {
      let x, y, w, h
      let image, mask = { canvas: null, ctx: null }
      let { startX, startY } = this.draw.dimen

      if (this.draw.dimen.active) {
        switch (this.draw.tool) {
          case 'crop':
            image = this._initImage(() => {
              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)

              mask.canvas = document.createElement('canvas')
              mask.canvas.width = image.width
              mask.canvas.height = image.height
              mask.ctx = mask.canvas.getContext('2d')
              mask.ctx.fillStyle = 'rgba(0, 0, 0, .8)'

              mask.ctx.fillRect(0, 0, image.width, image.height)

              mask.ctx.globalCompositeOperation = 'xor'

              x = startX
              y = startY
              w = this._fixZoom(event.offsetX) - startX
              h = this._fixZoom(event.offsetY) - startY

              if (event.shiftKey) {
                if (Math.abs(w) > Math.abs(h)) {
                  if ((w < 0 && h < 0) || (w >= 0 && h >= 0)) h = w
                  else if ((w < 0 && h >= 0) || (w >= 0 && h < 0)) h = 0 - w
                } else {
                  if ((w < 0 && h < 0) || (w >= 0 && h >= 0)) w = h
                  else if ((w < 0 && h >= 0) || (w >= 0 && h < 0)) w = 0 - h
                }
              }

              if (event.ctrlKey) {
                x = startX - w
                y = startY - h
                w *= 2
                h *= 2
              }

              mask.ctx.clearRect(x, y, w, h)

              this.ctx.drawImage(mask.canvas, 0, 0)
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
            break
          case 'free':
            if (!this.draw.stroke.has) return

            image = this._initImage(() => {
              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this.ctx.beginPath()
              this._freeHand()

              this.ctx.lineCap = 'round'
              this.ctx.lineJoin = 'round'
              this.ctx.strokeStyle = this.draw.stroke.color.hex
              this.ctx.lineWidth = this.draw.stroke.size

              if (this.draw.stroke.has) this.ctx.stroke()
            })

            this.draw.free.activated = true
            this.draw.free.points.push({ x: this._fixZoom(event.offsetX), y: this._fixZoom(event.offsetY) })
            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
            break
          case 'line':
            if (!this.draw.stroke.has) return

            if (startX === this._fixZoom(event.offsetX) && startY === this._fixZoom(event.offsetY)) return

            image = this._initImage(() => {
              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this.ctx.beginPath()
              this._plotLine(startX, startY, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY), event.ctrlKey, event.shiftKey)

              this.ctx.lineCap = 'round'
              this.ctx.lineJoin = 'round'
              this.ctx.strokeStyle = this.draw.stroke.color.hex
              this.ctx.lineWidth = this.draw.stroke.size

              if (this.draw.stroke.has) this.ctx.stroke()
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
            break
          case 'rect':
            if (!this.draw.stroke.has && !this.draw.fill.has) return

            if (startX === this._fixZoom(event.offsetX) && startY === this._fixZoom(event.offsetY)) return

            image = this._initImage(() => {
              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this.ctx.beginPath()
              this._plotRect(this.ctx, startX, startY, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY), event.ctrlKey, event.shiftKey)
              this.ctx.setLineDash([])

              this.ctx.lineJoin = 'round'
              this.ctx.fillStyle = this.draw.fill.color.hex
              this.ctx.strokeStyle = this.draw.stroke.color.hex
              this.ctx.lineWidth = this.draw.stroke.size

              if (this.draw.fill.has) this.ctx.fill()

              if (this.draw.stroke.has) this.ctx.stroke()
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
            break
          case 'circ':
            if (!this.draw.stroke.has && !this.draw.fill.has) return

            if (startX === this._fixZoom(event.offsetX) && startY === this._fixZoom(event.offsetY)) return

            image = this._initImage(() => {
              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this.ctx.beginPath()
              this._plotCirc(startX, startY, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY), event.ctrlKey, event.shiftKey)
              this.ctx.setLineDash([])

              this.ctx.fillStyle = this.draw.fill.color.hex
              this.ctx.strokeStyle = this.draw.stroke.color.hex
              this.ctx.lineWidth = this.draw.stroke.size

              if (this.draw.fill.has) this.ctx.fill()

              if (this.draw.stroke.has) this.ctx.stroke()
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
            break
        }
      }

      if (this.draw.tool === 'text') {
        image = this._initImage(() => {
          this.ctx.clearRect(0, 0, image.width, image.height)
          this.ctx.drawImage(image, 0, 0)
          this.ctx.beginPath()
          this._formatText()

          if (this.draw.fill.has && this.draw.text.text !== null) this.ctx.fillText(this.draw.text.text, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY))

          if (this.draw.stroke.has && this.draw.text.text !== null) this.ctx.strokeText(this.draw.text.text, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY))
        })

        image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
      }
    },
    endPlot (event) {
      let startX, startY, endX, endY, image
      let { style, variant, weight, size, lineHeight, family } = this.draw.text.font

      if (this.draw.dimen.active) {
        this.draw.dimen.endX = this._fixZoom(event.offsetX)
        this.draw.dimen.endY = this._fixZoom(event.offsetY)
        this.draw.dimen.active = false

        ;({ startX, startY, endX, endY } = this.draw.dimen)

        switch (this.draw.tool) {
          case 'crop':
            if (startX === endX && startY === endY) return

            image = this._initImage(() => {
              this.canvas.width = image.width
              this.canvas.height = image.height

              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this._crop(startX, startY, endX, endY, event.ctrlKey, event.shiftKey)

              this.draw.history.undo.push(this.canvas.toDataURL())

              this.draw.history.redo = []
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

            return
          case 'free':
            if (!this.draw.stroke.has) return

            if (!this.draw.free.activated) return

            this.draw.history.undo.push(this.canvas.toDataURL())

            this.draw.free.activated = false
            this.draw.history.redo = []

            return
          case 'line':
            if (!this.draw.stroke.has) return

            if (startX === endX && startY === endY) return

            image = this._initImage(() => {
              this.canvas.width = image.width
              this.canvas.height = image.height

              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this._plotLine(startX, startY, endX, endY, event.ctrlKey, event.shiftKey)
              this.ctx.setLineDash([])

              this.ctx.lineCap = 'round'
              this.ctx.fillStyle = this.draw.fill.color.hex
              this.ctx.strokeStyle = this.draw.stroke.color.hex
              this.ctx.lineWidth = this.draw.stroke.size

              this.ctx.stroke()
              this.draw.history.undo.push(this.canvas.toDataURL())

              this.draw.history.redo = []
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

            return
          case 'rect':
            if (!this.draw.stroke.has && !this.draw.fill.has) return

            if (startX === endX && startY === endY) return

            image = this._initImage(() => {
              this.canvas.width = image.width
              this.canvas.height = image.height

              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this._plotRect(this.ctx, startX, startY, endX, endY, event.ctrlKey, event.shiftKey)
              this.ctx.setLineDash([])

              this.ctx.lineJoin = 'round'
              this.ctx.fillStyle = this.draw.fill.color.hex
              this.ctx.strokeStyle = this.draw.stroke.color.hex
              this.ctx.lineWidth = this.draw.stroke.size

              if (this.draw.fill.has) this.ctx.fill()

              if (this.draw.stroke.has) this.ctx.stroke()

              this.draw.history.undo.push(this.canvas.toDataURL())

              this.draw.history.redo = []
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

            return
          case 'circ':
            if (!this.draw.stroke.has && !this.draw.fill.has) return

            if (startX === endX && startY === endY) return

            image = this._initImage(() => {
              this.canvas.width = image.width
              this.canvas.height = image.height

              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this._plotCirc(startX, startY, endX, endY, event.ctrlKey, event.shiftKey)
              this.ctx.setLineDash([])

              this.ctx.fillStyle = this.draw.fill.color.hex
              this.ctx.strokeStyle = this.draw.stroke.color.hex
              this.ctx.lineWidth = this.draw.stroke.size

              if (this.draw.fill.has) this.ctx.fill()

              if (this.draw.stroke.has) this.ctx.stroke()

              this.draw.history.undo.push(this.canvas.toDataURL())

              this.draw.history.redo = []
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
        }
      }

      if (this.draw.text.active) {
        image = this._initImage(() => {
          this.canvas.width = image.width
          this.canvas.height = image.height

          this.ctx.clearRect(0, 0, image.width, image.height)
          this.ctx.drawImage(image, 0, 0)
          this.ctx.beginPath()
          this._formatText()

          if (this.draw.fill.has && this.draw.text.text !== null) this.ctx.fillText(this.draw.text.text, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY))

          if (this.draw.stroke.has && this.draw.text.text !== null) this.ctx.strokeText(this.draw.text.text, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY))

          this.draw.history.undo.push(this.canvas.toDataURL())

          this.draw.history.redo = []
          this.draw.text.active = false
        })

        image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
      } else {
        image = this._initImage(() => {
          this.canvas.width = image.width
          this.canvas.height = image.height

          this.ctx.clearRect(0, 0, image.width, image.height)
          this.ctx.drawImage(image, 0, 0)
        })

        image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
      }
    },
    undo () {
      let image = new Image()

      if (this.draw.history.undo.length <= 1) return

      image.onload = () => {
        this.canvas.width = image.width
        this.canvas.height = image.height

        this.ctx.drawImage(image, 0, 0)

        this.draw.history.redo.push(this.draw.history.undo[this.draw.history.undo.length - 1])
        this.draw.history.undo.pop()
      }

      image.src = this.draw.history.undo[this.draw.history.undo.length - 2]
    },
    redo () {
      let image = new Image()

      if (this.draw.history.redo.length === 0) return

      image.onload = () => {
        this.canvas.width = image.width
        this.canvas.height = image.height

        this.ctx.drawImage(image, 0, 0)

        this.draw.history.undo.push(this.draw.history.redo[this.draw.history.redo.length - 1])
        this.draw.history.redo.pop()
      }

      image.src = this.draw.history.redo[this.draw.history.redo.length - 1]
    },
    reset () {
      this.canvas.width = 0
      this.canvas.height = 0
      this.draw.active = false
      this.draw.tool = null
      this.draw.zoom = 100
      this.draw.text.text = null
      this.draw.dimen = {
        active: false,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
      }
      this.draw.history = {
        undo: [],
        redo: []
      }
    },
    uploadToImgur () {
      this.popup.persistent = true
      this.popup.progress = true
      this.popup.note = 'Uploading...'
      this.popup.active = true
      this.draw.uploaded.img = this.canvas.toDataURL()

      imgur({
        url: '/image',
        method: 'post',
        data: {
          image: this.canvas.toDataURL().split(',')[1],
          type: 'base64'
        }
      }).then((img) => {
        let { data: { data } } = img

        this.reset()

        this.popup.active = false
        this.draw.uploaded.id = data.id
        this.draw.uploaded.link = data.link
        this.draw.uploaded.deletehash = data.deletehash
        this.draw.uploaded.deleteLink = 'https://imgur.com/delete/' + data.deletehash
        this.draw.uploaded.active = true

        this._saveHistory(data)
      }).catch((e) => {
        let res = e.request.response ? JSON.parse(e.request.response) : null

        this.popup.progress = false
        this.popup.persistent = false
        this.popup.color = 'error darken-1'
        this.popup.note = res.data.error.message || 'Opps! Something unexpected happen.'
      })
    },
    saveAs () {
      let dateStr
      let date = new Date()
      let link = document.createElement('a')

      dateStr = [
        date.getFullYear(),
        `0${date.getMonth() + 1}`.slice(-2),
        `0${date.getDate()}`.slice(-2),
        '-',
        `0${date.getHours()}`.slice(-2),
        `0${date.getMinutes()}`.slice(-2),
        `0${date.getSeconds()}`.slice(-2)
      ].join('')

      link.href = this.canvas.toDataURL()
      link.download = `flexiry_${dateStr}.png`
      link.click()

      this.popup.note = 'Image downloaded!'
      this.popup.active = true

      setTimeout(() => {
        this.popup.active = false
      }, 3000)
    },
    removeHistory (key) {
      this.history.splice(key, 1)
    },
    _crop (startX, startY, endX, endY, centered, exact) {
      let x, y, w, h, tempCanvas, tempCtx

      x = startX < endX ? startX : endX
      y = startY < endY ? startY : endY
      w = Math.abs(endX - startX)
      h = Math.abs(endY - startY)

      if (exact) {
        if (w > h) h = w
        else w = h

        x = startX < endX ? startX : (startX - w)
        y = startY < endY ? startY : (startY - h)
      }

      if (centered) {
        x = startX - w
        y = startY - h
        w *= 2
        h *= 2
      }

      tempCanvas = document.createElement('canvas')
      tempCanvas.width = w
      tempCanvas.height = h
      tempCtx = tempCanvas.getContext('2d')

      tempCtx.drawImage(this.canvas, x, y, w, h, 0, 0, w, h)

      this.canvas.width = w
      this.canvas.height = h

      this.ctx.clearRect(0, 0, w, h)
      this.ctx.drawImage(tempCanvas, 0, 0)

      this.draw.tool = null
    },
    _freeHand () {
      let { points } = this.draw.free
      let x, y, i = 0

      if (points.length < 3) {
        this.ctx.moveTo(points[0].x, points[0].y)
        this.ctx.lineTo(points[1].x, points[1].y)
        return
      }

      this.ctx.moveTo(points[0].x, points[0].y)

      for (i; i < points.length - 2; i++) {
        x = (points[i].x + points[i + 1].x) / 2
        y = (points[i].y + points[i + 1].y) / 2

        this.ctx.quadraticCurveTo(points[i].x, points[i].y, x, y)
      }

      this.ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
    },
    _plotLine (startX, startY, endX, endY, centered, exact) {
      let w, h, x1, x2, x3, y1, y2, y3

      x1 = startX
      y1 = startY
      x3 = endX
      y3 = endY

      if (centered) {
        x2 = x1
        y2 = y1
        x1 = 2 * x2 - x3
        y1 = 2 * y2 - y3
      }

      if (exact) {
        w = (x2 || x3) - x1
        h = (y2 || y3) - y1

        if (this._getDegree(Math.abs(w), Math.abs(h)) >= 0 && this._getDegree(Math.abs(w), Math.abs(h)) <= 30) {
          y1 = y2 || y1
          y3 = y1
        } else if (this._getDegree(Math.abs(w), Math.abs(h)) >= 60 && this._getDegree(Math.abs(w), Math.abs(h)) <= 90) {
          x1 = x2 || x1
          x3 = x1
        } else if ((x1 > x3 && y1 > y3) || (x1 < x3 && y1 < y3)) {
          x3 = (x2 || x1) + (w > h ? w : h)
          y3 = (y2 || y1) + (w > h ? w : h)

          if (centered) {
            x1 = 2 * x2 - x3
            y1 = 2 * y2 - y3
          }
        } else if (x1 > x3 && y1 < y3) {
          x3 = (x2 || x1) - (w > h ? w : h)
          y3 = (y2 || y1) + (w > h ? w : h)

          if (centered) {
            x1 = 2 * x2 - x3
            y1 = 2 * y2 - y3
          }
        } else if (x1 < x3 && y1 > y3) {
          x3 = (x2 || x1) + (w > h ? w : h)
          y3 = (y2 || y1) - (w > h ? w : h)

          if (centered) {
            x1 = 2 * x2 - x3
            y1 = 2 * y2 - y3
          }
        }
      }

      this.ctx.moveTo(x1, y1)
      this.ctx.lineTo(x3, y3)
    },
    _plotRect (ctx, startX, startY, endX, endY, centered, exact) {
      let x, y, w, h

      x = startX
      y = startY
      w = endX - startX
      h = endY - startY

      if (exact) {
        if (Math.abs(w) > Math.abs(h)) {
          if ((w < 0 && h < 0) || (w >= 0 && h >= 0)) h = w
          else if ((w < 0 && h >= 0) || (w >= 0 && h < 0)) h = 0 - w
        } else {
          if ((w < 0 && h < 0) || (w >= 0 && h >= 0)) w = h
          else if ((w < 0 && h >= 0) || (w >= 0 && h < 0)) w = 0 - h
        }
      }

      if (centered) {
        x = startX - w
        y = startY - h
        w *= 2
        h *= 2
      }

      ctx.rect(x, y, w, h)
    },
    _plotCirc (startX, startY, endX, endY, centered, exact) {
      let x, y, radX, radY, w, h

      w = endX - startX
      h = endY - startY

      if (exact) {
        if (Math.abs(w) > Math.abs(h)) {
          if ((w < 0 && h < 0) || (w >= 0 && h >= 0)) h = w
          else if ((w < 0 && h >= 0) || (w >= 0 && h < 0)) h = 0 - w
        } else {
          if ((w < 0 && h < 0) || (w >= 0 && h >= 0)) w = h
          else if ((w < 0 && h >= 0) || (w >= 0 && h < 0)) w = 0 - h
        }
      }

      x = centered ? startX : startX + w / 2
      y = centered ? startY : startY + h / 2

      if (centered && exact) {
        radX = radY = Math.abs(w) >= Math.abs(h) ? Math.abs(w) : Math.abs(h)
      } else if (centered && !exact) {
        radX = Math.abs(w)
        radY = Math.abs(h)
      } else if (!centered && exact) {
        radX = radY = Math.abs(w) >= Math.abs(h) ? Math.abs(w) / 2 : Math.abs(h) / 2
      } else {
        radX = Math.abs(w) / 2
        radY = Math.abs(h) / 2
      }

      this.ctx.ellipse(x, y, radX, radY, 0, 0, 2 * Math.PI)
    },
    _formatText () {
      let { style, variant, weight, size, lineHeight, family } = this.draw.text.font

      this.ctx.font = `${style.length > 0 ? 'italic' : 'normal'} ${variant} ${weight} ${['12px', '14px', '16px', '20px', '24px', '34px', '45px', '56px', '112px'][size]}/${lineHeight} "${family}"`
      this.ctx.textAlign = this.draw.text.align
      this.ctx.textBaseline = this.draw.text.baseline
      this.ctx.lineCap = 'round'
      this.ctx.lineJoin = 'round'
      this.ctx.strokeStyle = this.draw.stroke.color.hex
      this.ctx.fillStyle = this.draw.fill.color.hex
      this.ctx.lineWidth = this.draw.stroke.size
    },
    _initImage (onload = () => {}) {
      let image = new Image()

      image.onload = onload

      return image
    },
    _drawCanvas (width, height) {
      this.canvas.width = width
      this.canvas.height = height

      if (this.draw.custom.background.has) {
        this.ctx.beginPath()
        this.ctx.rect(0, 0, width, height)

        this.ctx.fillStyle = this.draw.custom.background.color.hex

        this.ctx.fill()
      }
    },
    _fixZoom (val) {
      return val * 100 / this.draw.zoom
    },
    _saveHistory ({ id, link, deletehash, datetime }) {
      this.history.unshift({ id, link, deletehash, datetime })

      if (this.history.length > 500) this.history.pop()
    },
    _getDegree (adj, opp) {
      return Math.asin(opp / Math.sqrt(opp * opp + adj * adj)) * 180 / Math.PI
    }
  },
  filters: {
    formatDate (datetime) {
      let hh, mm, ampm, today, date, todayObj, dateObj

      today = new Date()
      date = new Date(new Date(0).setUTCSeconds(datetime))
      todayObj = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        date: today.getDate()
      }
      dateObj = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate()
      }

      if (todayObj.year === dateObj.year && todayObj.month === dateObj.month && todayObj.date === dateObj.date) {
        hh = date.getHours() > 12 ? date.getHours() - 12 : date.getHours() === 0 ? 12 : date.getHours()
        mm = `0${date.getMinutes()}`.slice(-2)
        ampm = date.getHours() < 12 ? 'am' : 'pm'

        return `${hh}:${mm} ${ampm}`
      } else return `${date.getMonth() + 1}/${date.getDate()}`
    }
  }
}
