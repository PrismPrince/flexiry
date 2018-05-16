<template>
  <div class="qc-rejection">
    <md-content>
      <div class="md-layout preview">
        <div class="md-layout-item">
          <md-content class="md-scrollbar">
            <md-table v-model="generated_preview" :md-height="302" md-card md-fixed-header @md-selected="selectRejection">
              <md-table-toolbar>
                <div class="md-toolbar-section-start">
                  <div class="md-subheading">Preview</div>
                </div>

                <div class="md-toolbar-section-end">
                  <textarea id="reject-all" :value="parse_generated_preview"></textarea>
                  <md-button v-if="preview.rejects.length" class="md-icon-button md-dense md-raised" @click="copyAllRejections">
                    <md-icon>content_copy</md-icon>
                    <md-tooltip md-delay="300">Copy All Rejections</md-tooltip>
                  </md-button>
                  <md-button v-if="preview.rejects.length" class="md-icon-button md-dense md-raised md-primary" @click="removeAllRejections">
                    <md-icon>clear_all</md-icon>
                    <md-tooltip md-delay="300">Remove All Rejections</md-tooltip>
                  </md-button>
                </div>
              </md-table-toolbar>

              <md-table-empty-state md-icon="playlist_add" md-label="Add Rejections" md-description="Your rejections will appear here."></md-table-empty-state>

              <md-table-row slot="md-table-row" slot-scope="{ item }" class="md-primary" md-selectable="single">
                <md-table-cell md-label="Styled">
                  <trello-marked :html="item.marked"></trello-marked>
                </md-table-cell>
                <md-table-cell md-label="Formated">{{ item.plain }}</md-table-cell>
                <md-table-cell md-label="Action">
                  <input :id="'reject-' + item.raw.id" type="text" :value="item.plain">
                  <md-button class="md-icon-button md-dense md-raised" @click.stop="copyRejections('reject-' + item.raw.id)">
                    <md-icon>content_copy</md-icon>
                    <md-tooltip md-delay="300">Copy</md-tooltip>
                  </md-button>
                  <md-button class="md-icon-button md-dense md-raised md-accent" @click.stop="removeRejection(item.raw)">
                    <md-icon>close</md-icon>
                    <md-tooltip md-delay="300">Remove</md-tooltip>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-content>
        </div>
      </div>

      <div class="md-layout options">
        <md-content class="md-scrollbar">
          <div class="options-item product-kind-colorway">
            <div class="md-subheading">Product Kind</div>
            <md-field md-clearable>
              <label>Custom</label>
              <md-input v-model="active.prodkind"></md-input>
              <md-button class="md-icon-button md-dense md-input-action" :class="preview.locked_prodkind ? 'md-accent' : 'md-primary'" @click="preview.locked_prodkind = !preview.locked_prodkind">
                <md-icon>{{ preview.locked_prodkind ? 'lock_outline' : 'lock_open' }}</md-icon>
                <md-tooltip md-delay="300">Locking product kind prevents clearing the value</md-tooltip>
              </md-button>
            </md-field>

            <div class="md-subheading" style="margin-bottom: 20px;">Colorways</div>
            <md-content class="options-list md-scrollbar">
              <md-list>
                <md-list-item v-for="colorway in colorways" :key="colorway.id">
                  <md-checkbox v-model="active.colorways.selected" :value="colorway.id" class="md-primary"></md-checkbox>
                  <span class="md-list-item-text">{{ colorway.name }}</span>
                </md-list-item>
              </md-list>
            </md-content>
          </div>

          <div class="options-item accessories">
            <div class="md-subheading">Accessories</div>
            <md-field md-clearable>
              <label>Custom</label>
              <md-input v-model="active.accessories.custom"></md-input>
            </md-field>

            <md-content class="options-list md-scrollbar">
              <md-list>
                <md-list-item v-for="accessory in accessories" :key="accessory.id">
                  <md-checkbox v-model="active.accessories.selected" :value="accessory.id" :class="{'md-primary': accessory.defined_by === 'admin'}"></md-checkbox>
                  <span class="md-list-item-text">
                    {{ accessory.name }}
                    <md-tooltip md-delay="150">{{ accessory.value }}</md-tooltip>
                  </span>
                </md-list-item>
              </md-list>
            </md-content>
          </div>

          <div class="options-item rejections">
              <div class="md-subheading">
                <span>Rejections</span>
                <md-menu md-size="auto">
                  <md-button class="md-dense md-raised" md-menu-trigger>{{ preview.filter }}</md-button>
                  <md-menu-content>
                    <md-menu-item @click="preview.filter = 'general'">General</md-menu-item>
                    <md-menu-item @click="preview.filter = 'tqc'">TQC</md-menu-item>
                    <md-menu-item @click="preview.filter = 'cu3'">CU3</md-menu-item>
                    <md-menu-item @click="preview.filter = 'csl'">CSL</md-menu-item>
                    <md-menu-item @click="preview.filter = 'pdp'">PDP</md-menu-item>
                  </md-menu-content>
                </md-menu>
                <span class="btn-options">
                  <md-button v-if="active.id === null" class="md-dense md-raised md-primary" @click="addRejection" :disabled="!(active.rejections.selected.length || active.rejections.custom.length || active.rejections.screenshot.length)">Add</md-button>
                  <md-button v-else class="md-dense md-raised md-primary" @click="updateRejection">Save</md-button>
                  <md-button class="md-dense md-raised md-accent" @click="clearRejection" :disabled="!((active.prodkind.length && !preview.locked_prodkind) || active.colorways.selected.length || active.accessories.selected.length || active.accessories.custom.length || active.rejections.selected.length || active.rejections.custom.length || active.rejections.screenshot.length)">Clear Fields</md-button>
                </span>
              </div>

              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-75">
                  <md-field md-clearable>
                    <label>Custom</label>
                    <md-input v-model="active.rejections.custom"></md-input>
                  </md-field>
                </div>

                <div class="md-layout-item md-size-25">
                  <md-field md-clearable>
                    <label>Screenshot</label>
                    <md-input v-model="active.rejections.screenshot"></md-input>
                  </md-field>
                </div>
              </div>

              <md-content class="options-list md-scrollbar">
                <md-list>
                  <md-list-item v-for="rejection in rejections.filter(choice => choice.filters.includes(preview.filter))" :key="rejection.id">
                    <md-radio v-model="active.rejections.selected" :value="rejection.id" :class="{'md-primary': rejection.defined_by === 'admin'}"></md-radio>
                    <span class="md-list-item-text">
                      {{ rejection.name }}
                      <md-tooltip md-delay="150">{{ rejection.value }}</md-tooltip>
                    </span>
                  </md-list-item>
                </md-list>
              </md-content>
          </div>
        </md-content>
      </div>
    </md-content>

    <md-snackbar md-position="center" :md-duration="snackbar.duration" :md-active.sync="snackbar.visible">
      <span>{{ snackbar.msg }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import marked from 'marked'
import trelloMarked from '@/components/formatters/trello-marked'
import { __DB__ } from '../main'

export default {
  name: 'qc-rejection',
  components: {
    trelloMarked
  },
  data () {
    return {
      user: {
        data: null,
        format: {
          prodkind: '`',
          colorways: '**',
          accessories: '*',
          rejections: ''
        }
      },
      colorways: [],
      accessories: [],
      rejections: [],
      active: {
        id: null,
        prodkind: '',
        colorways: {
          selected: []
        },
        accessories: {
          selected: [],
          custom: ''
        },
        rejections: {
          selected: '',
          custom: '',
          screenshot: ''
        }
      },
      preview: {
        filter: 'general',
        id_counter: 1,
        locked_prodkind: false,
        rejects: []
      },
      snackbar: {
        duration: 1500,
        visible: false,
        msg: ''
      }
    }
  },
  firestore () {
    return {
      colorways: __DB__.collection('colorways').orderBy('name'),
      accessories: __DB__.collection('accessories').orderBy('name'),
      rejections: __DB__.collection('rejections').orderBy('name')
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.preview.rejects.length) {
      let answer = confirm('Do you really want to leave? You have still have rejections!')

      if (answer) next()
      else next(false)
    } else next()
  },
  computed: {
    generated_preview () {
      let reject = null
      let format = this.user.format
      let colorwaysChoices = this.colorways
      let accessoriesChoices = this.accessories
      let rejectionsChoices = this.rejections
      let rejects = []
      let prodkind = ''
      let colorways = ''
      let accessories = ''
      let rejections = ''
      let fuse = ''

      for (let i = 0; i < this.preview.rejects.length; i++) {
        reject = this.preview.rejects[i]

        prodkind = reject.prodkind.trim().toUpperCase()

        colorways = colorwaysChoices.filter(choice =>
          choice.id === reject.colorways.selected.find(selected =>
            selected === choice.id
          )
        ).map(colorway => colorway.name).sort().join('')

        accessories = accessoriesChoices.filter(choice =>
          choice.id === reject.accessories.selected.find(selected =>
            selected === choice.id
          )
        ).map(accessory => accessory.value).sort().join('/')
        accessories += !reject.accessories.custom ? '' : (!reject.accessories.selected.length ? '' : '/') + reject.accessories.custom.trim().replace(/\s+/g, '\\_').replace(/^\//, '').replace(/\/$/, '')

        rejections = !reject.rejections.selected ? '' : rejectionsChoices.find(choice => choice.id === reject.rejections.selected).value
        rejections += reject.rejections.custom
        rejections += !reject.rejections.screenshot ? '' : (!rejections ? '' : ' > ') + reject.rejections.screenshot

        fuse += !prodkind ? '' : format.prodkind + prodkind + format.prodkind + ' '
        fuse += !colorways ? '' : format.colorways + colorways + format.colorways + ' '
        fuse += !accessories ? '' : format.accessories + accessories + format.accessories + ' '
        fuse += !prodkind && !colorways && !accessories ? rejections : ' - ' + rejections

        rejects.push({
          id: this.preview.rejects[i].id,
          raw: reject,
          plain: fuse,
          marked: marked(fuse).trim().replace(/^<p>/, '').replace(/<\/p>$/, '')
        })

        reject = null
        fuse = ''
      }

      return rejects
    },
    parse_generated_preview () {
      return this.generated_preview.map(reject => reject.plain).join('\n')
    }
  },
  methods: {
    addRejection () {
      let active = this.active

      this.preview.rejects.push({
        id: this.preview.id_counter++,
        prodkind: active.prodkind,
        colorways: active.colorways,
        accessories: active.accessories,
        rejections: active.rejections
      })

      this._setActiveDefault()

      this.snackbar.msg = 'Rejection added to list.'
      this.snackbar.visible = true
    },
    selectRejection (item) {
      /* eslint curly: "off" */

      if (!item) this._setActiveDefault()
      else
        this.active = {
          id: item.id,
          prodkind: item.raw.prodkind,
          colorways: {
            selected: item.raw.colorways.selected
          },
          accessories: {
            selected: item.raw.accessories.selected,
            custom: item.raw.accessories.custom
          },
          rejections: {
            selected: item.raw.rejections.selected,
            custom: item.raw.rejections.custom,
            screenshot: item.raw.rejections.screenshot
          }
        }
    },
    updateRejection () {
      let reject = this.preview.rejects[this.preview.rejects.indexOf(this.preview.rejects.find(selected => selected.id === this.active.id))]

      reject.prodkind = this.active.prodkind
      reject.colorways.selected = this.active.colorways.selected
      reject.accessories.selected = this.active.accessories.selected
      reject.accessories.custom = this.active.accessories.custom
      reject.rejections.selected = this.active.rejections.selected
      reject.rejections.custom = this.active.rejections.custom
      reject.rejections.screenshot = this.active.rejections.screenshot

      this._setActiveDefault()

      this.snackbar.msg = 'Rejection updated.'
      this.snackbar.visible = true
    },
    clearRejection () {
      this._setActiveDefault()

      this.snackbar.msg = 'Edit cleared.'
      this.snackbar.visible = true
    },
    removeAllRejections () {
      if (this.active.id) this._setActiveDefault()

      this.preview.rejects = []
      this.preview.id_counter = 1
      this.snackbar.msg = 'All rejections are removed.'
      this.snackbar.visible = true
    },
    removeRejection (reject) {
      if (this.active.id) this._setActiveDefault()

      this.preview.rejects.splice(this.preview.rejects.indexOf(reject), 1)
      this.snackbar.msg = 'Rejection removed.'
      this.snackbar.visible = true
    },
    copyAllRejections () {
      document.getElementById('reject-all').select()
      document.execCommand('copy')

      this.snackbar.msg = 'Copied all rejections to clipboard.'
      this.snackbar.visible = true
    },
    copyRejections (id) {
      document.getElementById(id).select()
      document.execCommand('copy')

      this.snackbar.msg = 'Copied rejection to clipboard.'
      this.snackbar.visible = true
    },
    _setActiveDefault () {
      this.active = {
        id: null,
        prodkind: this.preview.locked_prodkind ? this.active.prodkind : '',
        colorways: {
          selected: []
        },
        accessories: {
          selected: [],
          custom: ''
        },
        rejections: {
          selected: '',
          custom: '',
          screenshot: ''
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .md-app-content {
    position: relative;
  }
</style>

<style lang="scss" scoped>
  $preview-height: 470px;

  .qc-rejection > .md-content {
    min-height: 820px;
    position: absolute;
    overflow-x: hidden;
    overflow-y: hidden;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  input[id^="reject-"], textarea#reject-all {
    height: .1px;
    width: .1px;
    margin: 0;
    border: 0;
    padding: 0;
  }

  .preview {
    width: 100%;
    height: $preview-height;
    margin: 0;

    .md-toolbar-section-end .md-button {
      margin-left: 10px
    }

    .md-table {
      margin: 24px 16px;

      .md-table-empty-state {
        padding: 12px 16px 12px 4px;

        /deep/ .md-empty-state-icon {
          min-width: 140px;
          height: 140px;
          font-size: 140px;
        }
      }
    }

    .md-table-row.md-selected-single {
      font-weight: normal;

      /deep/ a:not(.md-button) {
        color: #ff5252;

        &:hover {
          color: rgba(#ff5252, .8);
        }
      }
    }

    .md-table-cell:last-child /deep/ .md-table-cell-container {
      white-space: nowrap;
    }
  }

  .options {
    width: auto;
    height: calc(100% - #{$preview-height});
    margin: 0;
    position: relative;

    > .md-content {
      position: absolute;
      overflow-x: auto;
      overflow-y: hidden;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      white-space: nowrap;
      margin-bottom: 10px;
      padding-bottom: 10px;
    }

    &-item {
      display: inline-block;
      margin: 0 10px;
      height: 100%;
      overflow-x: hidden;
      overflow-y: hidden;
      vertical-align: top;

      &:first-child {
        margin-left: 20px;
      }

      &.product-kind-colorway {
        width: 150px;

        .md-field {

          /deep/ .md-clear {
            right: 32px;
          }
        }

        .options-list {
          height: calc(100% - 144px);
          overflow-x: auto;
          overflow-y: auto;
        }
      }

      &.accessories {
        width: 200px;

        .options-list {
          height: calc(100% - 100px);
          overflow-x: auto;
          overflow-y: auto;
        }
      }

      &.rejections {
        width: calc(100% - 440px);
        min-width: 700px;

        .md-button {
          height: 24px;
          margin: 0 0 0 8px;
        }

        .btn-options {
          float: right;
        }

        .options-list {
          height: calc(100% - 100px);
          overflow-x: auto;
          overflow-y: auto;
        }
      }
    }
  }

  .md-field {

    > input {
      width: 100%;
    }
  }

  .md-checkbox, .md-radio {
    display: flex;

    /deep/ label {
      white-space: nowrap;
    }
  }
</style>
