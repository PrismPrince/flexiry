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
          <div class="md-layout md-gutter preview">
            <div class="md-layout-item">
              <md-content>
                <md-table v-model="generated_preview" @md-selected="select">
                  <md-table-row slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
                    <md-table-cell md-label="Styled Preview" md-sort-by="marked" v-html="item.marked"></md-table-cell>
                    <md-table-cell md-label="Formated Preview" md-sort-by="plain">{{ item.plain }}</md-table-cell>
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
                  <md-input v-model="reject.prodkind.custom"></md-input>
                  <md-button class="md-icon-button md-dense md-input-action" :class="reject.prodkind.locked ? 'md-accent' : 'md-primary'" @click="reject.prodkind.locked = !reject.prodkind.locked">
                    <md-icon>{{ reject.prodkind.locked ? 'lock_outline' : 'lock_open' }}</md-icon>
                  </md-button>
                </md-field>

                <div class="md-subheading" style="margin-bottom: 20px;">Colorways</div>
                <md-content class="options-list md-scrollbar">
                  <md-checkbox v-for="(colorway, key) in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']" :key="key" v-model="reject.colorways.selected" :value="colorway">{{ colorway }}</md-checkbox>
                </md-content>
              </div>

              <div class="options-item accessories">
                <div class="md-subheading">Accessories</div>
                <md-field md-clearable>
                  <label>Custom</label>
                  <md-input v-model="reject.accessories.custom"></md-input>
                </md-field>

                <md-content class="options-list md-scrollbar">
                  <md-checkbox v-for="accessory in reject.accessories.choices.predefined" :key="accessory.id" v-model="reject.accessories.selected" :value="accessory.id" class="md-primary">{{ accessory.name }}</md-checkbox>
                  <md-checkbox v-for="accessory in reject.accessories.choices.userdefined" :key="accessory.id" v-model="reject.accessories.selected" :value="accessory.id">{{ accessory.name }}</md-checkbox>
                </md-content>
              </div>

              <div class="options-item rejections">
                  <div class="md-subheading">
                    <span>Rejections</span>
                    <md-menu md-size="auto">
                      <md-button class="md-dense md-primary md-raised" md-menu-trigger>{{ reject.rejections.filter }}</md-button>
                      <md-menu-content>
                        <md-menu-item @click="reject.rejections.filter = 'general'">General</md-menu-item>
                        <md-menu-item @click="reject.rejections.filter = 'tqc'">TQC</md-menu-item>
                        <md-menu-item @click="reject.rejections.filter = 'cu3'">CU3</md-menu-item>
                        <md-menu-item @click="reject.rejections.filter = 'csl'">CSL</md-menu-item>
                        <md-menu-item @click="reject.rejections.filter = 'pdp'">PDP</md-menu-item>
                      </md-menu-content>
                    </md-menu>
                  </div>

                  <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-75">
                      <md-field md-clearable>
                        <label>Custom</label>
                        <md-input v-model="reject.rejections.custom"></md-input>
                      </md-field>
                    </div>

                    <div class="md-layout-item md-size-25">
                      <md-field md-clearable>
                        <label>Screenshot</label>
                        <md-input v-model="reject.rejections.screenshot"></md-input>
                      </md-field>
                    </div>
                  </div>

                  <md-content class="options-list md-scrollbar">
                    <md-checkbox v-for="rejection in reject.rejections.choices.predefined" :key="rejection.id" v-model="reject.rejections.selected" :value="rejection.id" class="md-primary">{{ rejection.name }}</md-checkbox>
                    <md-checkbox v-for="rejection in reject.rejections.choices.userdefined" :key="rejection.id" v-model="reject.rejections.selected" :value="rejection.id">{{ rejection.name }}</md-checkbox>
                  </md-content>
              </div>
            </md-content>
          </div>
        </md-content>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import marked from 'marked'

export default {
  name: 'welcome',
  data () {
    return {
      preview: {
        id_counter: 0,
        active: {
          id: 0,
          prodkind: '',
          colorways: ['B', 'A', 'D'],
          accessories: {
            selected: ['bkr', 'frt'],
            custom: 'stamp'
          },
          rejections: {
            selected: 'round off colour values',
            screenshot: 'https://screenshot.com'
          }
        },
        rejects: [
          {
            id: 0,
            prodkind: 'HYC',
            colorways: ['B', 'A', 'D'],
            accessories: {
              selected: ['bkr', 'frt'],
              custom: '/stamp'
            },
            rejections: {
              selected: 'round off colour values',
              screenshot: 'https://screenshot.com'
            }
          },
          {
            id: 2,
            prodkind: 'HMC',
            colorways: ['B', 'D'],
            accessories: {
              selected: ['frt'],
              custom: '/stamp'
            },
            rejections: {
              selected: 'round off font size',
              screenshot: 'https://screenshot.com'
            }
          }
        ]
      },
      reject: {
        prodkind: {
          locked: false,
          custom: ''
        },
        colorways: {
          selected: []
        },
        accessories: {
          selected: [],
          custom: '',
          choices: {
            predefined: [
              {
                id: 0,
                name: 'Front',
                value: 'frt'
              }
            ],
            userdefined: [
              {
                id: 1,
                name: 'Stamp',
                value: 'stamp'
              }
            ]
          }
        },
        rejections: {
          selected: [],
          filter: 'general',
          custom: '',
          screenshot: '',
          choices: {
            predefined: [
              {
                id: 0,
                name: 'Round off colour values',
                value: 'please round off colour values'
              }
            ],
            userdefined: [
              {
                id: 1,
                name: 'Round off font size',
                value: 'please round off font size'
              }
            ]
          }
        }
      }
    }
  },
  computed: {
    generated_preview () {
      let reject = null
      let rejects = []
      let prodkind = ''
      let colorways = ''
      let accessories = ''
      let rejections = ''
      let fuse = null

      for (let i = 0; i < this.preview.rejects.length; i++) {
        reject = this.preview.rejects[i]

        prodkind = reject.prodkind
        colorways = reject.colorways.sort().join('')
        accessories = reject.accessories.selected.join('/') + reject.accessories.custom
        rejections = reject.rejections.selected + (reject.rejections.screenshot === '' ? '' : ' > ' + reject.rejections.screenshot)

        fuse = '`' + prodkind + '` **' + colorways + '** ' + accessories + ' - ' + rejections

        rejects.push({
          id: i,
          plain: fuse,
          marked: marked(fuse).trim().replace(/^<p>/, '').replace(/<\/p>$/, '')
        })

        reject = null
        fuse = null
      }

      return rejects
    }
  },
  methods: {
    getClass: ({ id }) => ({
      'md-primary': id === 2,
      'md-accent': id === 3
    }),
    select (item) {
      this.preview.active = item
    },
    format_marked (reject) {
      return marked(this.format_plain(reject))
    },
    format_plain (reject) {
      let prodkind = reject.prodkind
      let colorways = reject.colorways.sort().join('')
      let accessories = reject.accessories.selected.join('/') + reject.accessories.custom
      let rejections = reject.rejections.selected + (reject.rejections.screenshot === '' ? '' : ' > ' + reject.rejections.screenshot)

      return '`' + prodkind + '` **' + colorways + '** ' + accessories + ' - ' + rejections
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-app-drawer {
    height: 100vh;
    width: 250px;
  }

  .md-app-content {
    position: relative;
    padding: 0;

    > .md-content {
      min-height: 750px;
      position: absolute;
      overflow-x: hidden;
      overflow-y: hidden;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }

  .preview {
    width: 100%;
    height: 350px;
    margin: 0;
  }

  .options {
    width: auto;
    height: calc(100% - 350px);
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

        .md-menu {
          float: right;

          .md-button {
            height: 24px;
          }
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

  .md-checkbox {
    display: flex;

    /deep/ label {
      white-space: nowrap;
    }
  }
</style>
