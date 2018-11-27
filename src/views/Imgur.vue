<template>
  <v-container class="imgur" grid-list-lg fluid>
    <v-layout row>
      <v-toolbar color="teal" dark>
        <v-tooltip bottom :disabled="!draw.active">
          <span>Crop <kbd>C</kbd></span>
          <v-btn slot="activator" fab flat small :outline="draw.tool === 'crop'" @click="draw.tool = draw.tool !== 'crop' ? 'crop' : null" :disabled="!draw.active">
            <v-icon>crop</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active">
          <span>Freehand <kbd>H</kbd></span>
          <v-btn slot="activator" fab flat small :outline="draw.tool === 'free'" @click="draw.tool = draw.tool !== 'free' ? 'free' : null" :disabled="!draw.active">
            <v-icon>brush</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active">
          <span>Line <kbd>L</kbd></span>
          <v-btn slot="activator" fab flat small :outline="draw.tool === 'line'" @click="draw.tool = draw.tool !== 'line' ? 'line' : null" :disabled="!draw.active">
            <v-icon>show_chart</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active">
          <span>Rectangle <kbd>R</kbd></span>
          <v-btn slot="activator" fab flat small :outline="draw.tool === 'rect'" @click="draw.tool = draw.tool !== 'rect' ? 'rect' : null" :disabled="!draw.active">
            <v-icon>crop_square</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active">
          <span>Ellipse <kbd>E</kbd></span>
          <v-btn slot="activator" fab flat small :outline="draw.tool === 'circ'" @click="draw.tool = draw.tool !== 'circ' ? 'circ' : null" :disabled="!draw.active">
            <v-icon>panorama_fish_eye</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active || draw.history.undo.length <= 1">
          <span>Undo <kbd>Ctrl</kbd> + <kbd>Z</kbd></span>
          <v-btn slot="activator" fab flat small @click="undo" :disabled="!draw.active || draw.history.undo.length <= 1">
            <v-icon>undo</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active || draw.history.redo.length === 0">
          <span>Redo <kbd>Ctrl</kbd> + <kbd>Y</kbd></span>
          <v-btn slot="activator" fab flat small @click="redo" :disabled="!draw.active || draw.history.redo.length === 0">
            <v-icon>redo</v-icon>
          </v-btn>
        </v-tooltip>

        <v-spacer></v-spacer>

        <v-tooltip bottom :disabled="!draw.active">
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
                  <v-responsive class="checkered-transparent elevation-1" :style="{ background: draw.stroke.has ? `rgb(${draw.stroke.color.r}, ${draw.stroke.color.g}, ${draw.stroke.color.b})` : '' }" :height="`${draw.stroke.size}px`"></v-responsive>
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
                  <v-flex xs9>
                    <v-slider v-model="draw.stroke.color.r" label="R" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="red"></v-slider>
                  </v-flex>
                  <v-flex class="ml-3" xs3>
                    <v-text-field class="mt-0" v-model="draw.stroke.color.r" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-center justify-space-between row>
                  <v-flex xs9>
                    <v-slider v-model="draw.stroke.color.g" label="G" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="green"></v-slider>
                  </v-flex>
                  <v-flex class="ml-3" xs3>
                    <v-text-field class="mt-0" v-model="draw.stroke.color.g" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-center justify-space-between row>
                  <v-flex xs9>
                    <v-slider v-model="draw.stroke.color.b" label="B" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="blue"></v-slider>
                  </v-flex>
                  <v-flex class="ml-3" xs3>
                    <v-text-field class="mt-0" v-model="draw.stroke.color.b" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-text>
                <v-layout align-center justify-space-between row>
                  <v-flex xs9>
                <v-slider class="stroke-size" v-model="draw.stroke.size" label="Size" :thumb-size="24" always-dirty thumb-label="" :min="1" :max="30" color="teal"></v-slider>
                  </v-flex>
                  <v-flex class="ml-3" xs3>
                    <v-text-field class="mt-0" v-model="draw.stroke.size" type="number" min="1" max="30"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active">
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
                  <v-responsive class="checkered-transparent elevation-1" :style="{ background: draw.fill.has ? `rgb(${draw.fill.color.r}, ${draw.fill.color.g}, ${draw.fill.color.b})` : '' }" height="20px"></v-responsive>
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
                  <v-flex xs9>
                    <v-slider v-model="draw.fill.color.r" label="R" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="red"></v-slider>
                  </v-flex>
                  <v-flex class="ml-3" xs3>
                    <v-text-field class="mt-0" v-model="draw.fill.color.r" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-center justify-space-between row>
                  <v-flex xs9>
                    <v-slider v-model="draw.fill.color.g" label="G" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="green"></v-slider>
                  </v-flex>
                  <v-flex class="ml-3" xs3>
                    <v-text-field class="mt-0" v-model="draw.fill.color.g" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-center justify-space-between row>
                  <v-flex xs9>
                    <v-slider v-model="draw.fill.color.b" label="B" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="blue"></v-slider>
                  </v-flex>
                  <v-flex class="ml-3" xs3>
                    <v-text-field class="mt-0" v-model="draw.fill.color.b" type="number" min="0" max="255"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-tooltip>

        <v-spacer></v-spacer>

        <v-tooltip bottom :disabled="!draw.active || draw.zoom === 100">
          <span>100% <kbd>=</kbd> / <kbd>0</kbd></span>
          <v-btn slot="activator" @click="draw.zoom = 100" fab flat small :style="{ visibility: draw.zoom !== 100 ? 'visible' : 'hidden' }" :disabled="!draw.active">
            <v-icon>crop_free</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active || draw.zoom >= 300">
          <span>Zoom In <kbd>+</kbd> / <kbd>I</kbd></span>
          <v-btn slot="activator" @click="draw.zoom += 10" fab flat small :disabled="!draw.active || draw.zoom >= 300">
            <v-icon>zoom_in</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active || draw.zoom <= 10">
          <span>Zoom Out <kbd>-</kbd> / <kbd>O</kbd></span>
          <v-btn slot="activator" @click="draw.zoom -= 10" fab flat small :disabled="!draw.active || draw.zoom <= 10">
            <v-icon>zoom_out</v-icon>
          </v-btn>
        </v-tooltip>

        <v-spacer></v-spacer>

        <v-tooltip bottom :disabled="!draw.active">
          <span>Restart <kbd>Q</kbd></span>
          <v-btn slot="activator" @click="reset" fab flat small :disabled="!draw.active">
            <v-icon>replay</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active">
          <span>Upload to Imgur</span>
          <v-btn slot="activator" @click="uploadToImgur" fab flat small :disabled="!draw.active">
            <v-icon>cloud_upload</v-icon>
          </v-btn>
        </v-tooltip>

        <v-tooltip bottom :disabled="!draw.active">
          <span>Save As</span>
          <v-btn slot="activator" @click="saveAs" fab flat small :disabled="!draw.active">
            <v-icon>save</v-icon>
          </v-btn>
        </v-tooltip>
      </v-toolbar>
    </v-layout>

    <v-slide-y-transition>
      <v-layout v-if="!draw.active" class="text-xs-center draw-inactive" align-center row>
        <v-flex xs4 d-flex fill-height>
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

        <v-flex xs4 d-flex fill-height>
          <v-card color="pink" dark>
            <v-card-text class="display-3 font-weight-thin text-xs-center">Start From Scratch</v-card-text>
            <v-card-text class="title font-weight-light">Create a blank canvas to draw on</v-card-text>
            <v-card-text>
              <v-layout row>
                <v-flex>
                  <v-select v-model="draw.custom.size" label="Canvas Size" color="pink" :items="['720 x 480', '1024 x 768', '1024 x 1024', '1920 x 1080', '2048 x 2048', 'Custom...']" hide-details solo-inverted></v-select>
                </v-flex>
              </v-layout>

              <v-layout v-if="draw.custom.size === 'Custom...'" row wrap>
                <v-flex xs12 md6>
                  <v-text-field v-model="draw.custom.width" type="number" min="1" color="white" label="Width" suffix="px" hide-details></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field v-model="draw.custom.height" type="number" min="1" color="white" label="Height" suffix="px" hide-details></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout justify-center row wrap>
                <v-flex xs12 md6>
                  <v-menu slot="activator" :close-on-content-click="false" :nudge-width="80" :nudge-bottom="45" :nudge-left="40" full-width light>
                    <v-btn slot="activator" :color="`rgb(${draw.custom.background.color.r}, ${draw.custom.background.color.g}, ${draw.custom.background.color.b})`" block
                      :outline="!draw.custom.background.has"
                      :dark="draw.custom.background.color.r + draw.custom.background.color.g + draw.custom.background.color.b < 383"
                      :light="draw.custom.background.color.r + draw.custom.background.color.g + draw.custom.background.color.b >= 383">
                      <v-icon class="mr-1">format_color_fill</v-icon>Canvas Background
                    </v-btn>

                    <v-card>
                      <v-card-text>
                        <v-layout align-center justify-space-between row>
                          <v-responsive class="checkered-transparent elevation-1" :style="{ background: draw.custom.background.has ? `rgb(${draw.custom.background.color.r}, ${draw.custom.background.color.g}, ${draw.custom.background.color.b})` : '' }" height="20px"></v-responsive>
                          <v-tooltip top>
                            <span>{{ draw.custom.background.has ? 'Remove background' : 'Add background' }}</span>
                            <v-btn slot="activator" color="teal" icon flat small dark @click="draw.custom.background.has = !draw.custom.background.has">
                              <v-icon>{{ draw.custom.background.has ? 'invert_colors_off' : 'invert_colors' }}</v-icon>
                            </v-btn>
                          </v-tooltip>
                        </v-layout>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-text>
                        <v-layout align-center justify-space-between row>
                          <v-flex xs9>
                            <v-slider v-model="draw.custom.background.color.r" label="R" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="red"></v-slider>
                          </v-flex>
                          <v-flex class="ml-3" xs3>
                            <v-text-field class="mt-0" v-model="draw.custom.background.color.r" type="number" min="0" max="255"></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout align-center justify-space-between row>
                          <v-flex xs9>
                            <v-slider v-model="draw.custom.background.color.g" label="G" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="green"></v-slider>
                          </v-flex>
                          <v-flex class="ml-3" xs3>
                            <v-text-field class="mt-0" v-model="draw.custom.background.color.g" type="number" min="0" max="255"></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout align-center justify-space-between row>
                          <v-flex xs9>
                            <v-slider v-model="draw.custom.background.color.b" label="B" :thumb-size="24" always-dirty thumb-label :min="0" :max="255" color="blue"></v-slider>
                          </v-flex>
                          <v-flex class="ml-3" xs3>
                            <v-text-field class="mt-0" v-model="draw.custom.background.color.b" type="number" min="0" max="255"></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </v-flex>

                <v-flex xs12 md6>
                  <v-btn color="pink lighten-1" block @click="createCanvas" :disabled="draw.custom.size === 'Custom...' ? draw.custom.height <= 0 || draw.custom.width <= 0 : draw.custom.size === null">Create Canvas</v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs4 d-flex fill-height>
          <v-card color="purple history-column" dark>
            <v-card-text class="display-3 font-weight-thin text-xs-center">History</v-card-text>
            <v-card-text class="title font-weight-light">You can see your past uploads here
              <v-tooltip max-width="300" :nudge-left="125" bottom>
                <v-icon slot="activator" size="21px">help_outline</v-icon>
                <span>Flexiry stores your uploads to your local computer and you can manage it here!<br>Flexiry only keep 500 uploads for smooth experience.</span>
              </v-tooltip>
            </v-card-text>
            <v-card-text v-if="history.length === 0" class="font-weight-light">Your history is empty. Upload some images!</v-card-text>
            <v-card-text v-else>
              <v-list class="purple lighten-1 elevation-1 history-list" three-lines dark>
                <v-subheader>
                  <span>Upload History</span>
                  <v-spacer></v-spacer>
                  <v-chip color="purple white--text" small disabled>{{ `${history.length} upload${ history.length > 1 ? 's' : '' }` }}</v-chip>
                </v-subheader>

                <v-divider></v-divider>

                <v-scale-transition group mode="out-in">
                  <v-list-tile v-for="(item, key) in history" :key="item.id" :href="item.link" target="_blank" avatar>
                    <v-list-tile-avatar>
                      <v-img :src="item.link" class="grey lighten-2" aspect-ratio="1">
                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                          <v-progress-circular indeterminate color="purple lighten-2" size="16"></v-progress-circular>
                        </v-layout>
                      </v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.link }}</v-list-tile-title>
                      <v-list-tile-sub-title>
                        <span>
                          <v-tooltip max-width="300" bottom>
                            <span>Delete image permanently on Imgur server. You cannot undo this action.<br>If you wish to remove this on your history, feel free to click the trash icon to the right.</span>
                            <v-icon slot="activator" class="mr-1" color="purple darken-2" size="15px">warning</v-icon>
                          </v-tooltip>
                          <a class="purple--text text--darken-3" :href="'https://imgur.com/delete/' + item.deletehash" target="_blank">Delete permanently</a>
                        </span>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-action-text class="caption grey--text text--lighten-2">{{ item.datetime | formatDate }}</v-list-tile-action-text>
                      <v-tooltip left>
                        <span>Remove from history</span>
                        <v-btn slot="activator" @click.prevent="removeHistory(key)" small icon>
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-tooltip>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-scale-transition>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>

    <v-layout row>
      <v-flex id="container">
        <canvas id="draw" class="checkered-transparent elevation-3" @mousedown.left.prevent="startPlot($event)" @mouseup.left.prevent="endPlot($event)" @mousemove="move($event)" @mouseout="endPlot($event)" :style="{zoom: `${draw.zoom}%`, cursor: draw.tool === 'crop' ? 'crosshair' : ''}" height="0" width="0"></canvas>
      </v-flex>
    </v-layout>

    <v-dialog v-model="popup.active" width="400" hide-overlay :persistent="popup.persistent">
      <v-card :color="popup.color" dark>
        <v-card-text class="text-xs-center">
          <v-menu v-if="popup.color === 'error darken-1'" :close-on-content-click="false" :max-width="350" :nudge-bottom="25" :nudge-left="150" close-delay="150" open-on-hover>
            <v-icon slot="activator" size="21px">error_outline</v-icon>
            <v-card dark>
              <v-card-text>
                Oops! Sorry about that. This is probably on <a class="white--text" href="https://imgur.com" target="_blank">Imgur</a> server. Click <a class="white--text" href="https://api.imgur.com/errorhandling" target="_blank">here</a> for more info.
              </v-card-text>
              <v-card-text class="pt-0">If you keep on seeing this, contact the developer.</v-card-text>
            </v-card>
          </v-menu>
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
                  <v-progress-circular indeterminate color="teal lighten-2"></v-progress-circular>
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
import imgur from '@/services/imgur'

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
          height: 0,
          background: {
            has: true,
            color: {
              r: 255,
              g: 255,
              b: 255
            }
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
      },
      history: []
    }
  },
  created () {
    if (window.localStorage.getItem('imgur-draw-stroke') !== null)
      this.draw.stroke = JSON.parse(window.localStorage.getItem('imgur-draw-stroke'))

    if (window.localStorage.getItem('imgur-draw-fill') !== null)
      this.draw.fill = JSON.parse(window.localStorage.getItem('imgur-draw-fill'))

    if (window.localStorage.getItem('imgur-history') !== null)
      this.history =  JSON.parse(window.localStorage.getItem('imgur-history'))
  },
  mounted () {
    this.canvas = document.getElementById('draw')
    this.ctx = this.canvas.getContext('2d')

    document.addEventListener('paste', this.paste, false)
    document.addEventListener('keypress', this.handleKeypress, false)

    console.log('Event added!')
  },
  beforeDestroy () {
    document.removeEventListener('paste', this.paste, false)
    document.removeEventListener('keypress', this.handleKeypress, false)

    console.log('Event removed!')
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
    },
    history (history) {
      window.localStorage.setItem('imgur-history', JSON.stringify(history))
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
    paste (event) {
      let items, blob, source, objURL = window.URL || window.webkitURL
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
      } else switch (event.keyCode) {
        case 67:
        case 99:
          this.draw.tool = this.draw.tool !== 'crop' ? 'crop' : null

          console.log('Keypress: C', event.keyCode)
          break
        case 72:
        case 104:
          this.draw.tool = this.draw.tool !== 'free' ? 'free' : null

          console.log('Keypress: H', event.keyCode)
          break
        case 76:
        case 108:
          this.draw.tool = this.draw.tool !== 'line' ? 'line' : null

          console.log('Keypress: L', event.keyCode)
          break
        case 82:
        case 114:
          this.draw.tool = this.draw.tool !== 'rect' ? 'rect' : null

          console.log('Keypress: R', event.keyCode)
          break
        case 69:
        case 101:
          this.draw.tool = this.draw.tool !== 'circ' ? 'circ' : null

          console.log('Keypress: E', event.keyCode)
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
              this.ctx.clearRect(0, 0, image.width, image.height)
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
              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this.ctx.beginPath()
              this.plotLine(startX, startY, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY), event.ctrlKey, event.shiftKey)

              this.ctx.lineCap = 'round'
              this.ctx.lineJoin = 'round'
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
              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this.ctx.beginPath()
              this.plotRect(startX, startY, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY), event.ctrlKey, event.shiftKey)
              this.ctx.setLineDash([])

              this.ctx.lineJoin = 'round'
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
              this.ctx.clearRect(0, 0, image.width, image.height)
              this.ctx.drawImage(image, 0, 0)
              this.ctx.beginPath()
              this.plotCirc(startX, startY, this._fixZoom(event.offsetX), this._fixZoom(event.offsetY), event.ctrlKey, event.shiftKey)
              this.ctx.setLineDash([])

              this.ctx.fillStyle = this.fillColor
              this.ctx.strokeStyle = this.strokeColor
              this.ctx.lineWidth = this.draw.stroke.size

              if (this.draw.fill.has) this.ctx.fill()

              if (this.draw.stroke.has) this.ctx.stroke()
            })

            image.src = this.draw.history.undo[this.draw.history.undo.length - 1]
            break
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

            this.ctx.clearRect(0, 0, image.width, image.height)
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

            this.ctx.clearRect(0, 0, image.width, image.height)
            this.ctx.drawImage(image, 0, 0)
            this.plotLine(startX, startY, endX, endY, event.ctrlKey, event.shiftKey)
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

            this.ctx.clearRect(0, 0, image.width, image.height)
            this.ctx.drawImage(image, 0, 0)
            this.plotRect(startX, startY, endX, endY, event.ctrlKey, event.shiftKey)
            this.ctx.setLineDash([])

            this.ctx.lineJoin = 'round'
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

            this.ctx.clearRect(0, 0, image.width, image.height)
            this.ctx.drawImage(image, 0, 0)
            this.plotCirc(startX, startY, endX, endY, event.ctrlKey, event.shiftKey)
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
    freeHand (x, y) {
      this.ctx.lineTo(x, y)

      this.ctx.lineCap = 'round'
      this.ctx.lineJoin = 'round'
      this.ctx.strokeStyle = this.strokeColor
      this.ctx.lineWidth = this.draw.stroke.size

      this.ctx.stroke()
    },
    plotLine (startX, startY, endX, endY, centered, exact) {
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
        w = (x2 ? x2 : x3) - x1
        h = (y2 ? y2 : y3) - y1

        if (this._getDegree(Math.abs(w), Math.abs(h)) >= 0 && this._getDegree(Math.abs(w), Math.abs(h)) <= 30) {
          y1 = y2 ? y2 : y1
          y3 = y1
        } else if (this._getDegree(Math.abs(w), Math.abs(h)) >= 60 && this._getDegree(Math.abs(w), Math.abs(h)) <= 90) {
          x1 = x2 ? x2 : x1
          x3 = x1
        } else if ((x1 > x3 && y1 > y3) || (x1 < x3 && y1 < y3)) {
            x3 = (x2 ? x2 : x1) + (w > h ? w : h)
            y3 = (y2 ? y2 : y1) + (w > h ? w : h)

            if (centered) {
              x1 = 2 * x2 - x3
              y1 = 2 * y2 - y3
            }
        } else if (x1 > x3 && y1 < y3) {
          x3 = (x2 ? x2 : x1) - (w > h ? w : h)
          y3 = (y2 ? y2 : y1) + (w > h ? w : h)

          if (centered) {
            x1 = 2 * x2 - x3
            y1 = 2 * y2 - y3
          }
        } else if (x1 < x3 && y1 > y3) {
          x3 = (x2 ? x2 : x1) + (w > h ? w : h)
          y3 = (y2 ? y2 : y1) - (w > h ? w : h)

          if (centered) {
            x1 = 2 * x2 - x3
            y1 = 2 * y2 - y3
          }
        }
      }

      this.ctx.moveTo(x1, y1)
      this.ctx.lineTo(x3, y3)
    },
    plotRect (startX, startY, endX, endY, centered, exact) {
      let x, y, w, h

      x = startX
      y = startY
      w = endX - startX
      h = endY - startY

      if (exact)
        if (Math.abs(w) > Math.abs(h)) {
          if (w < 0 && h < 0 || w >= 0 && h >= 0) h = w
          else if (w < 0 && h >= 0 || w >= 0 && h < 0) h = 0 - w
        } else {
          if (w < 0 && h < 0 || w >= 0 && h >= 0) w = h
          else if (w < 0 && h >= 0 || w >= 0 && h < 0) w = 0 - h
        }

      if (centered) {
        x = startX - w
        y = startY - h
        w *= 2
        h *= 2
      }

      this.ctx.rect(x, y, w, h)
    },
    plotCirc (startX, startY, endX, endY, centered, exact) {
      let x, y, radX, radY, w, h

      w = endX - startX
      h = endY - startY

      if (exact)
        if (Math.abs(w) > Math.abs(h)) {
          if (w < 0 && h < 0 || w >= 0 && h >= 0) h = w
          else if (w < 0 && h >= 0 || w >= 0 && h < 0) h = 0 - w
        } else {
          if (w < 0 && h < 0 || w >= 0 && h >= 0) w = h
          else if (w < 0 && h >= 0 || w >= 0 && h < 0) w = 0 - h
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

      this.ctx.beginPath()
      this.ctx.ellipse(x, y, radX, radY, 0, 0, 2 * Math.PI)
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

        this._saveHistory(data)
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
    removeHistory (key) {
      this.history.splice(key, 1)
    },
    _initImage (onload = () => {}) {
      let image = new Image()

      image.onload = onload

      return image
    },
    _drawCanvas (width, height) {
      let { r, g, b } = this.draw.custom.background.color

      this.canvas.width = width
      this.canvas.height = height

      if (this.draw.custom.background.has) {
        this.ctx.rect(0, 0, width, height)

        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

        this.ctx.fill()
      }
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
</script>

<style lang="scss" scoped>
  #container {
    overflow: auto;
    max-height: calc(100vh - 200px);
  }

  #draw {
    display: block;
    margin: auto;
  }

  .checkered-transparent {
    background-color: #eee;
    background-image: linear-gradient(45deg, #aaa 25%, transparent 25%), linear-gradient(-45deg, #aaa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #aaa 75%), linear-gradient(-45deg, transparent 75%, #aaa 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    background-repeat: repeat;
  }

  .draw-inactive {
    height: calc(100vh - 200px);
  }

  .slider-value {
    width: 60px;
  }

  .history-list {
    max-height: 50vh;
    overflow-y: auto;
  }
</style>
