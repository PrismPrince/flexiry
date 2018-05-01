<template>
  <div class="hello">
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
              <md-content v-html="previeMarked"></md-content>
            </div>

            <div class="md-layout-item">
              <md-content>
                <pre v-html="preview.raw"></pre>
              </md-content>
            </div>
          </div>

          <div class="md-layout options">
            <md-content class="md-scrollbar">
              <div class="options-item product-kind-colorway">
                <div class="md-subheading">Product Kind</div>
                <md-field md-clearable>
                  <label>Custom</label>
                  <md-input v-model="reject.pk.custom"></md-input>
                  <md-button class="md-icon-button md-dense md-input-action" :class="reject.pk.locked ? 'md-accent' : 'md-primary'" @click="reject.pk.locked = !reject.pk.locked">
                    <md-icon>{{ reject.pk.locked ? 'lock_outline' : 'lock_open' }}</md-icon>
                  </md-button>
                </md-field>
                <div class="md-subheading" style="margin-bottom: 20px;">Colorways</div>
                <md-content class="options-list md-scrollbar">
                  <md-checkbox v-model="reject.colorways" value="A">A</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="B">B</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="C">C</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="D">D</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="E">E</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="F">F</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="G">G</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="H">H</md-checkbox>
                </md-content>
              </div>

              <div class="options-item accessories">
                <div class="md-subheading">Accessories</div>
                <md-field md-clearable>
                  <label>Custom</label>
                  <md-input v-model="reject.accessories.custom"></md-input>
                </md-field>

                <md-content class="options-list md-scrollbar">
                  <md-checkbox v-for="(accessory, key) in reject.accessories.def" :key="key" v-model="reject.accessories.selected" :value="accessory.value" class="md-primary">{{ accessory.name }}</md-checkbox>
                  <md-checkbox v-for="(accessory, key) in reject.accessories.user" :key="key" v-model="reject.accessories.selected" :value="accessory.value">{{ accessory.name }}</md-checkbox>
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
                    <md-checkbox v-for="(rejection, key) in reject.rejections.def" :key="key" v-model="reject.rejections.selected" :value="rejection.value" class="md-primary">{{ rejection.name }}</md-checkbox>
                    <md-checkbox v-for="(rejection, key) in reject.rejections.user" :key="key" v-model="reject.rejections.selected" :value="rejection.value">{{ rejection.name }}</md-checkbox>
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
export default {
  name: 'HelloWorld',
  data () {
    return {
      preview: {
        raw: '`AIO` **ABC** frt - please set _"Anderson"_ as family name > https://screenshot.com :smiley:'
      },
      reject: {
        pk: {
          custom: '',
          locked: false
        },
        colorways: [],
        accessories: {
          custom: '',
          selected: [],
          def: [
            {
              name: 'Front',
              value: 'frt',
              position: 1
            },
            {
              name: 'Back',
              value: 'bkr',
              position: 2
            },
            {
              name: 'Liner',
              value: 'lin',
              position: 3
            },
            {
              name: 'Label',
              value: 'lbl',
              position: 4
            },
            {
              name: 'FRCP',
              value: 'frcp',
              position: 5
            },
            {
              name: 'Stamp',
              value: 'stamp',
              position: 6
            }
          ],
          user: [
            {
              name: 'Thank You Front',
              value: 'ty_frt',
              position: 7
            },
            {
              name: 'Thank You Open',
              value: 'ty_open',
              position: 8
            },
            {
              name: 'Mini Card Front',
              value: 'mini_frt',
              position: 9
            }
          ]
        },
        rejections: {
          filter: 'general',
          custom: '',
          screenshot: '',
          selected: [],
          def: [
            {
              name: 'Round off colour values',
              value: 'round off colour values'
            },
            {
              name: 'Remove swatches',
              value: 'remove swatches'
            }
          ],
          user: [
            {
              name: 'Round a font size',
              value: 'round a font size'
            },
            {
              name: 'Set font size',
              value: 'set font size'
            }
          ]
        }
      }
    }
  },
  computed: {
    previeMarked () {
      return marked(this.preview.raw)
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
