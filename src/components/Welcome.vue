<template>
  <div class="welcome">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <span class="md-title">My Title</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" class="md-scrollbar">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Inbox</span>
          </md-list-item>

          <md-list-item>
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Sent Mail</span>
          </md-list-item>

          <md-list-item>
            <md-icon>delete</md-icon>
            <span class="md-list-item-text">Trash</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">Spam</span>
          </md-list-item>
        </md-list>

        <md-button class="md-primary md-raised">Button</md-button>
      </md-app-drawer>

      <md-app-content>
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

                  <md-table-empty-state md-icon="playlist_add" md-label="Add Rejections" md-description="Lorem ipsum dolor sit amet. Aperiam aliquid, adipisci tempora nemo accusamus dicta aspernatur."></md-table-empty-state>

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
                  <md-button class="md-icon-button md-dense md-input-action" :class="reject.prodkind.locked ? 'md-accent' : 'md-primary'" @click="reject.prodkind.locked = !reject.prodkind.locked">
                    <md-icon>{{ reject.prodkind.locked ? 'lock_outline' : 'lock_open' }}</md-icon>
                    <md-tooltip md-delay="300">Lock product kind for </md-tooltip>
                  </md-button>
                </md-field>

                <div class="md-subheading" style="margin-bottom: 20px;">Colorways</div>
                <md-content class="options-list md-scrollbar">
                  <md-checkbox v-for="colorway in reject.colorways.choices" :key="colorway.id" v-model="active.colorways.selected" :value="colorway.id" class="md-primary">{{ colorway.name }}</md-checkbox>
                </md-content>
              </div>

              <div class="options-item accessories">
                <div class="md-subheading">Accessories</div>
                <md-field md-clearable>
                  <label>Custom</label>
                  <md-input v-model="active.accessories.custom"></md-input>
                </md-field>

                <md-content class="options-list md-scrollbar">
                  <md-checkbox v-for="accessory in reject.accessories.choices" :key="accessory.id" v-model="active.accessories.selected" :value="accessory.id" :class="{'md-primary': accessory.defined_by === 'admin'}">{{ accessory.name }}</md-checkbox>
                </md-content>
              </div>

              <div class="options-item rejections">
                  <div class="md-subheading">
                    <span>Rejections</span>
                    <md-menu md-size="auto">
                      <md-button class="md-dense md-raised" md-menu-trigger>{{ reject.rejections.filter }}</md-button>
                      <md-menu-content>
                        <md-menu-item @click="reject.rejections.filter = 'general'">General</md-menu-item>
                        <md-menu-item @click="reject.rejections.filter = 'tqc'">TQC</md-menu-item>
                        <md-menu-item @click="reject.rejections.filter = 'cu3'">CU3</md-menu-item>
                        <md-menu-item @click="reject.rejections.filter = 'csl'">CSL</md-menu-item>
                        <md-menu-item @click="reject.rejections.filter = 'pdp'">PDP</md-menu-item>
                      </md-menu-content>
                    </md-menu>
                    <span class="btn-options">
                      <md-button v-if="active.id === null" class="md-dense md-raised md-primary" @click="addRejection">Add</md-button>
                      <md-button v-else class="md-dense md-raised md-primary" @click="updateRejection">Save</md-button>
                      <md-button class="md-dense md-raised md-accent" @click="clearRejection">Clear Fields</md-button>
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
                    <md-radio v-for="rejection in reject.rejections.choices" :key="rejection.id" v-model="active.rejections.selected" :value="rejection.id" :class="{'md-primary': rejection.defined_by === 'admin'}">{{ rejection.name }}</md-radio>
                  </md-content>
              </div>
            </md-content>
          </div>
        </md-content>
      </md-app-content>
    </md-app>
    <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="preview.clipboard_copied.visible">
      <span>{{ preview.clipboard_copied.msg }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import marked from 'marked'
import trelloMarked from '@/components/formatters/trello-marked'

export default {
  name: 'welcome',
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
          accessories: '_',
          rejections: ''
        }
      },
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
        id_counter: 1,
        clipboard_copied: {
          visible: false,
          msg: ''
        },
        rejects: [
          {
            id: 1,
            prodkind: 'HYC',
            colorways: {
              selected: [7, 4, 3]
            },
            accessories: {
              selected: [2, 1],
              custom: 'stamp'
            },
            rejections: {
              selected: 1,
              custom: '',
              screenshot: 'https://screenshot-a.com'
            }
          },
          {
            id: 2,
            prodkind: 'HMC',
            colorways: {
              selected: [1, 3]
            },
            accessories: {
              selected: [5],
              custom: 'liner'
            },
            rejections: {
              selected: 1,
              custom: ' and font size',
              screenshot: 'https://screenshot-b.com'
            }
          },
          {
            id: 3,
            prodkind: 'HMC',
            colorways: {
              selected: []
            },
            accessories: {
              selected: [1],
              custom: 'stamp'
            },
            rejections: {
              selected: 1,
              custom: '',
              screenshot: 'https://screenshot.com'
            }
          },
          {
            id: 4,
            prodkind: '',
            colorways: {
              selected: []
            },
            accessories: {
              selected: [],
              custom: ''
            },
            rejections: {
              selected: 1,
              custom: '',
              screenshot: 'https://screenshot.com'
            }
          },
          {
            id: 5,
            prodkind: 'HMC',
            colorways: {
              selected: [1, 8]
            },
            accessories: {
              selected: [2],
              custom: 'stamp'
            },
            rejections: {
              selected: 1,
              custom: '',
              screenshot: 'https://screenshot.com'
            }
          },
          {
            id: 6,
            prodkind: 'HMC',
            colorways: {
              selected: [5, 1]
            },
            accessories: {
              selected: [2],
              custom: 'stamp'
            },
            rejections: {
              selected: 2,
              custom: '',
              screenshot: 'https://screenshot.com'
            }
          },
          {
            id: 7,
            prodkind: 'HMC',
            colorways: {
              selected: [7, 4]
            },
            accessories: {
              selected: [],
              custom: 'liner'
            },
            rejections: {
              selected: 1,
              custom: '',
              screenshot: 'https://screenshot.com'
            }
          },
          {
            id: 8,
            prodkind: 'HMC',
            colorways: {
              selected: [2, 4]
            },
            accessories: {
              selected: [2],
              custom: 'ty_open'
            },
            rejections: {
              selected: 1,
              custom: ' and so on',
              screenshot: 'https://screenshot.com'
            }
          },
          {
            id: 9,
            prodkind: 'HMC',
            colorways: {
              selected: [2, 4]
            },
            accessories: {
              selected: [1],
              custom: 'stamp'
            },
            rejections: {
              selected: 2,
              custom: '',
              screenshot: 'https://screenshot.com'
            }
          }
        ]
      },
      reject: {
        prodkind: {
          locked: false
        },
        colorways: {
          choices: [
            {
              id: 1,
              name: 'A',
              defined_by: 'admin'
            },
            {
              id: 2,
              name: 'B',
              defined_by: 'admin'
            },
            {
              id: 3,
              name: 'C',
              defined_by: 'admin'
            },
            {
              id: 4,
              name: 'D',
              defined_by: 'admin'
            },
            {
              id: 5,
              name: 'E',
              defined_by: 'admin'
            },
            {
              id: 6,
              name: 'F',
              defined_by: 'admin'
            },
            {
              id: 7,
              name: 'G',
              defined_by: 'admin'
            },
            {
              id: 8,
              name: 'H',
              defined_by: 'admin'
            }
          ]
        },
        accessories: {
          choices: [
            {
              id: 1,
              name: 'Front',
              value: 'frt',
              defined_by: 'admin'
            },
            {
              id: 2,
              name: 'Stamp',
              value: 'stamp',
              defined_by: 'user'
            }
          ]
        },
        rejections: {
          filter: 'general',
          choices: [
            {
              id: 1,
              name: 'Round off colour values',
              value: 'please round off colour values',
              defined_by: 'admin'
            },
            {
              id: 2,
              name: 'Round off font size',
              value: 'please round off font size',
              defined_by: 'user'
            }
          ]
        }
      }
    }
  },
  computed: {
    generated_preview () {
      let reject = null
      let format = this.user.format
      let colorwaysChoices = this.reject.colorways.choices
      let accessoriesChoices = this.reject.accessories.choices
      let rejectionsChoices = this.reject.rejections.choices
      let rejects = []
      let prodkind = ''
      let colorways = ''
      let accessories = ''
      let rejections = ''
      let fuse = ''

      for (let i = 0; i < this.preview.rejects.length; i++) {
        reject = this.preview.rejects[i]

        prodkind = reject.prodkind.trim()

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
        accessories += !reject.accessories.custom ? '' : '/' + (this.user.format.accessories === '_' ? reject.accessories.custom.replace(/_/g, '\\_') : reject.accessories.custom).trim()

        rejections = !reject.rejections.selected ? '' : rejectionsChoices.find(choice => choice.id === reject.rejections.selected).value
        rejections += reject.rejections.custom
        rejections += !reject.rejections.screenshot ? '' : ' > ' + reject.rejections.screenshot

        fuse += !prodkind ? '' : format.prodkind + prodkind + format.prodkind + ' '
        fuse += !colorways ? '' : format.colorways + colorways + format.colorways + ' '
        fuse += !accessories ? '' : format.accessories + accessories + format.accessories + ' '
        fuse += !prodkind && !colorways && !accessories ? rejections : ' - ' + rejections

        rejects.push({
          id: i,
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
      //
    },
    updateRejection () {
      //
    },
    selectRejection (item) {
      /* eslint curly: "off" */

      if (!item) this._setActiveDefault()
      else
        this.active = {
          id: item.raw.id,
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
    clearRejection () {
      this._setActiveDefault()
    },
    removeAllRejections () {
      if (this.active.id) this._setActiveDefault()

      this.preview.rejects = []
    },
    removeRejection (reject) {
      if (this.active.id) this._setActiveDefault()

      this.preview.rejects.splice(this.preview.rejects.indexOf(reject), 1)
      this.preview.id_counter = 1
    },
    copyAllRejections () {
      document.getElementById('reject-all').select()
      document.execCommand('copy')
      this.preview.clipboard_copied.msg = 'Copied all rejections to clipboard.'
      this.preview.clipboard_copied.visible = true
    },
    copyRejections (id) {
      document.getElementById(id).select()
      document.execCommand('copy')
      this.preview.clipboard_copied.msg = 'Copied rejection to clipboard.'
      this.preview.clipboard_copied.visible = true
    },
    _setActiveDefault () {
      this.active = {
        id: null,
        prodkind: this.reject.prodkind.locked ? this.active.prodkind : '',
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

<style lang="scss" scoped>
  $preview-height: 470px;

  .md-app-drawer {
    height: 100vh;
    width: 250px;
  }

  .md-app /deep/ .md-app-container {
    height: 100vh;
  }

  .md-app-content {
    position: relative;
    padding: 0;

    > .md-content {
      min-height: 820px;
      position: absolute;
      overflow-x: hidden;
      overflow-y: hidden;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
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
