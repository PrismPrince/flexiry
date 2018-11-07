<template>
  <v-container class="imgur" grid-list-lg fluid>
    <v-layout row>
      <v-toolbar color="teal" dark>
        <v-tooltip bottom>
          <span>Crop <kbd>C</kbd></span>
          <v-btn slot="activator" fab flat small :outline="draw.tool === 'crop'" @click="draw.tool = draw.tool !== 'crop' ? 'crop' : null" :disabled="!draw.active">
            <v-icon>crop</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Freehand <kbd>H</kbd></span>
          <v-btn slot="activator" fab flat small :outline="draw.tool === 'free'" @click="draw.tool = draw.tool !== 'free' ? 'free' : null" :disabled="!draw.active">
            <v-icon>brush</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Line <kbd>L</kbd></span>
          <v-btn slot="activator" fab flat small :outline="draw.tool === 'line'" @click="draw.tool = draw.tool !== 'line' ? 'line' : null" :disabled="!draw.active">
            <v-icon>show_chart</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Rectangle <kbd>R</kbd></span>
          <v-btn slot="activator" fab flat small :outline="draw.tool === 'rect'" @click="draw.tool = draw.tool !== 'rect' ? 'rect' : null" :disabled="!draw.active">
            <v-icon>crop_square</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Ellipse <kbd>E</kbd></span>
          <v-btn slot="activator" fab flat small :outline="draw.tool === 'circ'" @click="draw.tool = draw.tool !== 'circ' ? 'circ' : null" :disabled="!draw.active">
            <v-icon>panorama_fish_eye</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Undo <kbd>Ctrl</kbd> + <kbd>Z</kbd></span>
          <v-btn slot="activator" fab flat small @click="undo" :disabled="!draw.active || draw.history.undo.length <= 1">
            <v-icon>undo</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Redo <kbd>Ctrl</kbd> + <kbd>Y</kbd></span>
          <v-btn slot="activator" fab flat small @click="redo" :disabled="!draw.active || draw.history.redo.length === 0">
            <v-icon>redo</v-icon>
          </v-btn>
        </v-tooltip>

        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <span>Stroke <kbd>S</kbd></span>
          <v-menu slot="activator" :close-on-content-click="false" :nudge-width="300" :nudge-bottom="45" :nudge-left="150" :disabled="!draw.active" light>
            <v-btn slot="activator" :color="strokeColor" :disabled="!draw.active" fab small offset-y
              :outline="!draw.stroke.has"
              :dark="draw.stroke.color.r + draw.stroke.color.g + draw.stroke.color.b < 383"
              :light="draw.stroke.color.r + draw.stroke.color.g + draw.stroke.color.b >= 383">
              <v-icon>border_style</v-icon>
            </v-btn>

            <v-card>
              <v-card-text>
                <v-layout align-center justify-space-between row>
                  <v-responsive :style="{ background: `rgb(${draw.stroke.color.r}, ${draw.stroke.color.g}, ${draw.stroke.color.b})` }" :height="`${draw.stroke.size}px`"></v-responsive>
                  <v-tooltip top>
                    <span>{{ draw.stroke.has ? 'Remove stroke' : 'Add stroke' }}</span>
                    <v-btn slot="activator" color="teal" icon flat small dark @click="draw.stroke.has = !draw.stroke.has">
                      <v-icon>{{ draw.stroke.has ? 'invert_colors_off' : 'invert_colors' }}</v-icon>
                    </v-btn>
                  </v-tooltip>
                </v-layout>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-text>
                <v-layout align-center justify-space-between row>
                  <v-flex shrink>
                    <v-slider v-model="draw.stroke.color.r" label="R" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="red"></v-slider>
                  </v-flex>
                  <v-flex shrink>
                    <v-text-field class="mt-0" v-model="draw.stroke.color.r" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-center justify-space-between row>
                  <v-flex shrink>
                    <v-slider v-model="draw.stroke.color.g" label="G" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="green"></v-slider>
                  </v-flex>
                  <v-flex shrink>
                    <v-text-field class="mt-0" v-model="draw.stroke.color.g" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-center justify-space-between row>
                  <v-flex shrink>
                    <v-slider v-model="draw.stroke.color.b" label="B" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="blue"></v-slider>
                  </v-flex>
                  <v-flex shrink>
                    <v-text-field class="mt-0" v-model="draw.stroke.color.b" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-text>
                <v-layout align-center justify-space-between row>
                  <v-flex shrink>
                <v-slider class="stroke-size" v-model="draw.stroke.size" label="Size" :thumb-size="24" always-dirty thumb-label="" :min="1" :max="30" color="teal"></v-slider>
                  </v-flex>
                  <v-flex shrink>
                    <v-text-field class="mt-0" v-model="draw.stroke.size" type="number" min="1" max="30"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Fill <kbd>F</kbd></span>
          <v-menu slot="activator" :close-on-content-click="false" :nudge-width="300" :nudge-bottom="45" :nudge-left="150" :disabled="!draw.active" light>
            <v-btn slot="activator" :color="fillColor" :disabled="!draw.active" fab small offset-y
              :outline="!draw.fill.has"
              :dark="draw.fill.color.r + draw.fill.color.g + draw.fill.color.b < 383"
              :light="draw.fill.color.r + draw.fill.color.g + draw.fill.color.b >= 383">
              <v-icon>format_color_fill</v-icon>
            </v-btn>

            <v-card>
              <v-card-text>
                <v-layout align-center justify-space-between row>
                  <v-responsive :style="{ background: `rgb(${draw.fill.color.r}, ${draw.fill.color.g}, ${draw.fill.color.b})` }" height="20px"></v-responsive>
                  <v-tooltip top>
                    <span>{{ draw.fill.has ? 'Remove fill' : 'Add fill' }}</span>
                    <v-btn slot="activator" color="teal" icon flat small dark @click="draw.fill.has = !draw.fill.has">
                      <v-icon>{{ draw.fill.has ? 'invert_colors_off' : 'invert_colors' }}</v-icon>
                    </v-btn>
                  </v-tooltip>
                </v-layout>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-text>
                <v-layout align-center justify-space-between row>
                  <v-flex shrink>
                    <v-slider v-model="draw.fill.color.r" label="R" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="red"></v-slider>
                  </v-flex>
                  <v-flex shrink>
                    <v-text-field class="mt-0" v-model="draw.fill.color.r" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-center justify-space-between row>
                  <v-flex shrink>
                    <v-slider v-model="draw.fill.color.g" label="G" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="green"></v-slider>
                  </v-flex>
                  <v-flex shrink>
                    <v-text-field class="mt-0" v-model="draw.fill.color.g" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-center justify-space-between row>
                  <v-flex shrink>
                    <v-slider v-model="draw.fill.color.b" label="B" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="blue"></v-slider>
                  </v-flex>
                  <v-flex shrink>
                    <v-text-field class="mt-0" v-model="draw.fill.color.b" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-tooltip>

        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <span>100% <kbd>=</kbd> / <kbd>0</kbd></span>
          <v-btn slot="activator" @click="draw.zoom = 100" fab flat small :style="{ visibility: draw.zoom !== 100 ? 'visible' : 'hidden' }" :disabled="!draw.active">
            <v-icon>crop_free</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Zoom In <kbd>+</kbd> / <kbd>I</kbd></span>
          <v-btn slot="activator" @click="draw.zoom += 10" fab flat small :disabled="!draw.active || draw.zoom >= 300">
            <v-icon>zoom_in</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Zoom Out <kbd>-</kbd> / <kbd>O</kbd></span>
          <v-btn slot="activator" @click="draw.zoom -= 10" fab flat small :disabled="!draw.active || draw.zoom <= 10">
            <v-icon>zoom_out</v-icon>
          </v-btn>
        </v-tooltip>

        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <span>Restart <kbd>Q</kbd></span>
          <v-btn slot="activator" @click="reset" fab flat small :disabled="!draw.active">
            <v-icon>replay</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Upload to Imgur</span>
          <v-btn slot="activator" @click="uploadToImgur" fab flat small :disabled="!draw.active">
            <v-icon>cloud_upload</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom>
          <span>Save As</span>
          <v-btn slot="activator" @click="saveAs" fab flat small :disabled="!draw.active">
            <v-icon>save</v-icon>
          </v-btn>
        </v-tooltip>
      </v-toolbar>
    </v-layout>

    <v-slide-y-transition>
      <v-layout v-if="!draw.active" class="text-xs-center draw-inactive" align-center row>
        <v-flex xs4 d-flex child-flex fill-height>
          <v-card color="deep-orange" dark>
            <v-card-text class="display-3 font-weight-thin text-xs-center">Paste an Image</v-card-text>
            <v-card-text class="title font-weight-light">Paste image data from clipboard to start</v-card-text>
            <v-card-text class="font-weight-light">
              <v-divider></v-divider>
              <v-layout row>
                <v-flex class="text-xs-left">
                  <span>Copy Full Screenshot</span>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex class="text-xs-right">
                  <span><kbd>PrtScn</kbd></span>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row>
                <v-flex class="text-xs-left">
                  <span>Copy Window Screenshot</span>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex class="text-xs-right">
                  <span><kbd>Alt</kbd> + <kbd>PrtScn</kbd></span>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row>
                <v-flex class="text-xs-left">
                  <span>Paste</span>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex class="text-xs-right">
                  <span><kbd>Ctrl</kbd> + <kbd>V</kbd></span>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs4 d-flex child-flex fill-height>
          <v-card color="pink" dark>
            <v-card-text class="display-3 font-weight-thin text-xs-center">Start From Scratch</v-card-text>
            <v-card-text class="title font-weight-light">Create a blank canvas to draw on</v-card-text>
            <v-card-text>
              <v-layout row>
                <v-flex>
                  <v-select v-model="draw.custom.size" label="Canvas Size" color="pink" :items="['720 x 480', '1024 x 768', '1024 x 1024', '1920 x 1080', '2048 x 2048', 'Custom...']" hide-details solo-inverted></v-select>
                </v-flex>
              </v-layout>

              <v-layout v-if="draw.custom.size === 'Custom...'" row>
                <v-flex>
                  <v-text-field v-model="draw.custom.width" type="number" color="white" label="Width" suffix="px" hide-details></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-model="draw.custom.height" type="number" color="white" label="Height" suffix="px" hide-details></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout justify-center row>
                <v-flex md8>
                  <v-btn color="pink lighten-1" block @click="createCanvas" :disabled="draw.custom.size === 'Custom...' ? draw.custom.height <= 0 || draw.custom.width <= 0 : draw.custom.size === null">Create Canvas</v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs4 d-flex child-flex fill-height>
          <v-card color="purple" dark>
            <v-card-text class="display-3 font-weight-thin text-xs-center">History</v-card-text>
            <v-card-text class="title font-weight-light">You can see your past uploads here
              <v-tooltip max-width="300" :nudge-left="125" bottom>
                <v-icon slot="activator" size="21px">help</v-icon>
                <p>Flexiry stores your uploads to your local computer and you can manage it here!<br><br>Flexiry only keep 100 uploads for smooth experience.</p>
              </v-tooltip>
            </v-card-text>
            <v-card-text class="font-weight-light">(This feature is available soon!)</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>

    <v-layout row>
      <v-flex id="container">
        <canvas id="draw" class="elevation-3" @mousedown.left.prevent="startPlot($event)" @mouseup.left.prevent="endPlot($event)" @mousemove="move($event)" @mouseout="endPlot($event)" :style="{zoom: `${draw.zoom}%`}" height="0" width="0"></canvas>
      </v-flex>
    </v-layout>

    <v-dialog v-model="popup.active" width="400" hide-overlay :persistent="popup.persistent">
      <v-card :color="popup.color" dark>
        <v-card-text class="text-xs-center">
          {{ popup.note }}
          <v-progress-linear v-if="popup.progress" class="mb-0" color="white" indeterminate></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="draw.uploaded.active" width="1000">
      <v-card>
        <v-card-title class="headline teal white--text" primary-title>Uploaded to Imgur</v-card-title>
        <v-card-text>
          <v-layout justify-space-between row fill-height>
            <v-flex sm8>
              <v-img v-if="draw.uploaded.link !== null" :src="draw.uploaded.link" :lazy-src="draw.uploaded.img" class="grey lighten-2" :height="'auto'" :width="'100%'" max-height="500" contain>
                <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                  <v-progress-circular indeterminate color="grey lighten-4"></v-progress-circular>
                </v-layout>
              </v-img>
            </v-flex>
            <v-flex class="ml-3" sm4>
              <v-text-field id="img-view-link" v-model="draw.uploaded.link" color="teal" label="Image view link" readonly>
                <v-tooltip slot="append" top>
                  <v-btn slot="activator" @click="copyImageViewLink" color="teal" flat small icon>
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                  <span>Copy</span>
                </v-tooltip>
                <v-tooltip slot="append-outer" top>
                  <v-btn slot="activator" @click="openImageViewLink" color="teal" flat small icon>
                    <v-icon>launch</v-icon>
                  </v-btn>
                  <span>Open New Tab</span>
                </v-tooltip>
              </v-text-field>
              <v-text-field id="img-delete-link" v-model="draw.uploaded.deleteLink" color="teal" label="Image delete link" readonly>
                <v-tooltip slot="append" top>
                  <v-btn slot="activator" @click="copyImageDeleteLink" color="teal" flat small icon>
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                  <span>Copy</span>
                </v-tooltip>
                <v-tooltip slot="append-outer" top>
                  <v-btn slot="activator" @click="openImageDeleteLink" color="teal" flat small icon>
                    <v-icon>launch</v-icon>
                  </v-btn>
                  <span>Open New Tab</span>
                </v-tooltip>
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Firebase from '@/services/firebase'
import imgur from '@/services/imgur'

const database = Firebase.firestore()

export default {
  name: 'imgur',
  data () {
    return {
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
        history: {
          undo: [],
          redo: []
        },
        custom: {
          size: null,
          width: 0,
          height: 0
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
          color: {
            r: 0,
            g: 0,
            b: 0
          }
        },
        fill: {
          has: true,
          color: {
            r: 0,
            g: 0,
            b: 0
          }
        }
      }
    }
  },
  created () {
    if (window.localStorage.getItem('imgur-draw-stroke') !== null)
      this.draw.stroke = JSON.parse(window.localStorage.getItem('imgur-draw-stroke'))

    if (window.localStorage.getItem('imgur-draw-fill') !== null)
      this.draw.fill = JSON.parse(window.localStorage.getItem('imgur-draw-fill'))
  },
  mounted () {
    this.canvas = document.getElementById('draw')
    this.ctx = this.canvas.getContext('2d')

    document.addEventListener('paste', (e) => { this.paste(e) }, false)
    document.addEventListener('keypress', (e) => { this.handleKeypress(e) }, false)
  },
  beforeDestroy () {
    document.removeEventListener('paste', (e) => { this.paste(e) }, false)
    document.removeEventListener('keypress', (e) => { this.handleKeypress(e) }, false)
  },
  watch: {
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
    }
  },
  computed: {
    fillColor () {
      let { r, g, b } = this.draw.fill.color

      return `rgb(${r}, ${g}, ${b})`
    },
    strokeColor () {
      let { r, g, b } = this.draw.stroke.color

      return `rgb(${r}, ${g}, ${b})`
    }
  },
  methods: {
    createCanvas () {

      switch (this.draw.custom.size) {
        case '720 x 480':
          this.canvas.width = 720
          this.canvas.height = 480

          this.ctx.rect(0, 0, 720, 480)

          this.ctx.fillStyle = 'rgb(255, 255, 255)'

          this.ctx.fill()
          break
        case '1024 x 768':
          this.canvas.width = 1024
          this.canvas.height = 768

          this.ctx.rect(0, 0, 1024, 768)

          this.ctx.fillStyle = 'rgb(255, 255, 255)'

          this.ctx.fill()
          break
        case '1024 x 1024':
          this.canvas.width = 1024
          this.canvas.height = 1024

          this.ctx.rect(0, 0, 1024, 1024)

          this.ctx.fillStyle = 'rgb(255, 255, 255)'

          this.ctx.fill()
          break
        case '1920 x 1080':
          this.canvas.width = 1920
          this.canvas.height = 1080

          this.ctx.rect(0, 0, 1920, 1080)

          this.ctx.fillStyle = 'rgb(255, 255, 255)'

          this.ctx.fill()
          break
        case '2048 x 2048':
          this.canvas.width = 2048
          this.canvas.height = 2048

          this.ctx.rect(0, 0, 2048, 2048)

          this.ctx.fillStyle = 'rgb(255, 255, 255)'

          this.ctx.fill()
          break
        case 'Custom...':
          if (this.draw.custom.width <= 0 || this.draw.custom.height <= 0) return

          this.canvas.width = this.draw.custom.width
          this.canvas.height = this.draw.custom.height

          this.ctx.rect(0, 0, this.draw.custom.width, this.draw.custom.height)

          this.ctx.fillStyle = 'rgb(255, 255, 255)'

          this.ctx.fill()
          break
      }

      this.draw.history.undo.push(this.canvas.toDataURL())

      this.draw.active = true
    },
    paste (event) {
      let items, blob, source, objURL = window.URL || window.webkitURL
      let image = this._initImage(() => {
        this.canvas.width = image.width
        this.canvas.height = image.height

        this.ctx.drawImage(image, 0, 0)
        this.draw.history.undo.push(this.canvas.toDataURL())

        this.draw.active = true
        this.popup.active = false
      })

      this.draw.uploaded.active = false
      this.popup.active = false
      this.popup.persistent = true
      this.popup.progress = true
      this.popup.note = 'Pasting...'
      this.popup.active = true

      if (event.clipboardData) {
        items = event.clipboardData.items

        if (!items) {
          this.popup.active = false
          return
        }

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            blob = items[i].getAsFile()
            source = objURL.createObjectURL(blob)
            image.src = source
          } else this.popup.active = false

          event.preventDefault()
        }
      } else this.popup.active = false
    },
    handleKeypress (event) {
      if (!this.draw.active) return

      if (event.ctrlKey && !event.shiftKey && event.keyCode === 25) this.redo()
      else if (event.ctrlKey && event.shiftKey && event.keyCode === 26) this.redo()
      else if (event.ctrlKey && !event.shiftKey && event.keyCode === 26) this.undo()
      else switch (event.keyCode) {
        case 67:
        case 99:
          this.draw.tool = this.draw.tool !== 'crop' ? 'crop' : null
          break
        case 72:
        case 104:
          this.draw.tool = this.draw.tool !== 'free' ? 'free' : null
          break
        case 76:
        case 108:
          this.draw.tool = this.draw.tool !== 'line' ? 'line' : null
          break
        case 82:
        case 114:
          this.draw.tool = this.draw.tool !== 'rect' ? 'rect' : null
          break
        case 69:
        case 101:
          this.draw.tool = this.draw.tool !== 'circ' ? 'circ' : null
          break
        case 83:
        case 115:
          this.draw.stroke.has = !this.draw.stroke.has
          break
        case 70:
        case 102:
          this.draw.fill.has = !this.draw.fill.has
          break
        case 61:
        case 48:
          this.draw.zoom = 100
          break
        case 43:
        case 73:
        case 105:
          if (this.draw.zoom < 300) this.draw.zoom += 10
          break
        case 45:
        case 79:
        case 111:
          if (this.draw.zoom > 10) this.draw.zoom -= 10
          break
        case 81:
        case 113:
          this.reset()
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

        this.ctx.moveTo(this.draw.dimen.startX, this.draw.dimen.startY)
      }
    },
    move (event) {
      let { startX, startY } = this.draw.dimen
      let x, y, w, h, t, r, b, l, tr, br, bl, tl, image

      if (this.draw.dimen.active) {
        switch (this.draw.tool) {
          case 'crop':
            image = this._initImage(() => {
              this.ctx.drawImage(image, 0, 0)

              ;({ x, y, w, h } = this._findXYWH(startX, startY, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY)))

              if (w === 0 || h === 0) return

              this.ctx.beginPath()
              this.ctx.rect(x, y, w, h)
              this.ctx.setLineDash([10, 5])

              this.ctx.strokeStyle = 'rgb(34, 34, 34)'
              this.ctx.lineWidth = 2

              this.ctx.stroke()
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
            break
          case 'free':
            if (!this.draw.stroke.has) return

            this.freeHand(this._fixZoom(event.offsetX), this._fixZoom(event.offsetY))
            break
          case 'line':
            if (!this.draw.stroke.has) return

            if (startX === this._fixZoom(event.offsetX) && startY === this._fixZoom(event.offsetY)) return

            image = this._initImage(() => {
              this.ctx.drawImage(image, 0, 0)
              this.ctx.beginPath()
              this.plotLine(startX, startY, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY))

              this.ctx.lineCap = 'round'
              this.ctx.strokeStyle = this.strokeColor
              this.ctx.lineWidth = this.draw.stroke.size

              if (this.draw.stroke.has) this.ctx.stroke()
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
            break
          case 'rect':
            if (!this.draw.stroke.has && !this.draw.fill.has) return

            if (startX === this._fixZoom(event.offsetX) && startY === this._fixZoom(event.offsetY)) return

            image = this._initImage(() => {
              this.ctx.drawImage(image, 0, 0)
              this.ctx.beginPath()
              this.plotRect(startX, startY, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY))
              this.ctx.setLineDash([])

              this.ctx.fillStyle = this.fillColor
              this.ctx.strokeStyle = this.strokeColor
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
            this.ctx.drawImage(image, 0, 0)
            this.ctx.beginPath()
            this.plotCirc(startX, startY, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY))
            this.ctx.setLineDash([])

            this.ctx.fillStyle = this.fillColor
            this.ctx.strokeStyle = this.strokeColor
            this.ctx.lineWidth = this.draw.stroke.size

            if (this.draw.fill.has) this.ctx.fill()

            if (this.draw.stroke.has) this.ctx.stroke()
          })

          image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
        }
      }
    },
    endPlot (event) {
      let startX, startY, endX, endY, image

      if (!this.draw.dimen.active) return

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

            this.ctx.drawImage(image, 0, 0)
            this.crop(startX, startY, endX, endY)

            this.draw.history.undo.push(this.canvas.toDataURL())

            this.draw.history.redo = []
          })

          image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

          return
        case 'free':
          if (!this.draw.stroke.has) return

          if (startX === endX && startY === endY) return

          this.draw.history.undo.push(this.canvas.toDataURL())

          this.draw.history.redo = []

          return
        case 'line':
          if (!this.draw.stroke.has) return

          if (startX === endX && startY === endY) return

          image = this._initImage(() => {
            this.canvas.width = image.width
            this.canvas.height = image.height

            this.ctx.drawImage(image, 0, 0)
            this.plotLine(startX, startY, endX, endY)
            this.ctx.setLineDash([])

            this.ctx.lineCap = 'round'
            this.ctx.strokeStyle = this.strokeColor
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

            this.ctx.drawImage(image, 0, 0)
            this.plotRect(startX, startY, endX, endY)
            this.ctx.setLineDash([])

            this.ctx.fillStyle = this.fillColor
            this.ctx.strokeStyle = this.strokeColor
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

            this.ctx.drawImage(image, 0, 0)
            this.plotCirc(startX, startY, endX, endY)
            this.ctx.setLineDash([])

            this.ctx.fillStyle = this.fillColor
            this.ctx.strokeStyle = this.strokeColor
            this.ctx.lineWidth = this.draw.stroke.size

            if (this.draw.fill.has) this.ctx.fill()

            if (this.draw.stroke.has) this.ctx.stroke()

            this.draw.history.undo.push(this.canvas.toDataURL())

            this.draw.history.redo = []
          })

          image.src = this.draw.history.undo[this.draw.history.undo.length - 1]

          return
      }
    },
    crop (startX, startY, endX, endY) {
      let { x, y, w, h } = this._findXYWH(startX, startY, endX, endY)
      let tempCanvas, tempCtx

      this.ctx.drawImage(this.canvas, x, y, w, h, 0, 0, w, h)

      tempCanvas = document.createElement('canvas')
      tempCanvas.width = w
      tempCanvas.height = h
      tempCtx = tempCanvas.getContext('2d')

      tempCtx.drawImage(this.canvas, 0, 0)

      this.canvas.width = w
      this.canvas.height = h

      this.ctx.drawImage(tempCanvas, 0, 0)

      this.draw.tool = null
    },
    freeHand (x, y) {
      this.ctx.lineTo(x, y)

      this.ctx.lineCap = 'round'
      this.ctx.lineJoin = 'round'
      this.ctx.strokeStyle = this.strokeColor
      this.ctx.lineWidth = this.draw.stroke.size

      this.ctx.stroke()
    },
    plotLine (startX, startY, endX, endY) {
      this.ctx.moveTo(startX, startY)
      this.ctx.lineTo(endX, endY)
    },
    plotRect (startX, startY, endX, endY) {
      let { x, y, w, h } = this._findXYWH(startX, startY, endX, endY)

      this.ctx.rect(x, y, w, h)
    },
    plotCirc (startX, startY, endX, endY) {
      let { x, y, w, h } = this._findXYWH(startX, startY, endX, endY)
      let t, r, b, l, tr, br, bl, tl

      t = [(w / 2) + x, y]
      r = [x + w, (h / 2) + y]
      b = [(w / 2) + x, y + h]
      l = [x, (h / 2) + y]

      tr = [x + w, y]
      br = [x + w, y + h]
      bl = [x, y + h]
      tl = [x, y]

      this.ctx.beginPath()
      this.ctx.moveTo(t[0], t[1])
      this.ctx.quadraticCurveTo(tr[0], tr[1], r[0], r[1])
      this.ctx.quadraticCurveTo(br[0], br[1], b[0], b[1])
      this.ctx.quadraticCurveTo(bl[0], bl[1], l[0], l[1])
      this.ctx.quadraticCurveTo(tl[0], tl[1], t[0], t[1])
    },
    drawPlot () {
      this.ctx.fillStyle = this.fillColor
      this.ctx.strokeStyle = this.strokeColor
      this.ctx.lineWidth = this.draw.stroke.size

      if (this.draw.fill.has) this.ctx.fill()

      if (this.draw.stroke.has) this.ctx.stroke()
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
      }).catch((e) => {
        let res = JSON.parse(e.request.response)

        this.popup.progress = false
        this.popup.persistent = false
        this.popup.color = 'error darken-1'
        this.popup.note = res.data.error.message
      })
    },
    saveAs () {
      let dateStr, date = new Date()
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
    copyImageViewLink () {
      document.getElementById('img-view-link').select()
      document.execCommand('copy')
    },
    copyImageDeleteLink () {
      document.getElementById('img-delete-link').select()
      document.execCommand('copy')
    },
    openImageViewLink () {
      window.open(this.draw.uploaded.link, '_blank')
    },
    openImageDeleteLink () {
      window.open('https://imgur.com/delete/' + this.draw.uploaded.deletehash, '_blank')
    },
    _initImage (onload = () => {}) {
      let image = new Image()

      image.onload = onload

      return image
    },
    _findXYWH (startX, startY, endX, endY) {
      let x, y, w, h

      x = startX < endX ? startX : endX
      y = startY < endY ? startY : endY
      w = Math.abs(startX - endX)
      h = Math.abs(startY - endY)

      return { x, y, w, h }
    },
    _fixZoom (val) {
      return val * 100 / this.draw.zoom
    }
  }
}
</script>

<style lang="scss" scoped>
  #container {
    overflow: auto;
    max-height: calc(100vh - 200px);

    canvas {
      background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      background-repeat: repeat;
      display: block;
      margin: auto;
    }
  }

  .draw-inactive {
    height: calc(100vh - 200px);
  }

  .slider-value {
    width: 60px;
  }
</style>
