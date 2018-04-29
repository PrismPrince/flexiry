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
        <div class="md-layout md-gutter preview">
          <div class="md-layout-item">
            <md-content>
              <p>
                // output code...
              </p>
            </md-content>
          </div>
          <div class="md-layout-item">
            <md-content>
              <pre>code...</pre>
            </md-content>
          </div>
        </div>
        <div class="md-layout md-gutter options">
          <div class="md-layout-item md-layout md-size-15">
            <div class="md-layout-item product-kind">
              <md-content>
                <div class="md-title">Product Kind</div>
                <md-field md-clearable>
                  <label>Custom</label>
                  <md-input v-model="reject.pk.custom"></md-input>
                  <md-button class="md-icon-button md-dense md-input-action" :class="reject.pk.locked ? 'md-accent' : 'md-primary'" @click="reject.pk.locked = !reject.pk.locked">
                    <md-icon>{{ reject.pk.locked ? 'lock_outline' : 'lock_open' }}</md-icon>
                  </md-button>
                </md-field>
              </md-content>
            </div>

            <div class="md-layout-item colorway">
              <md-content>
                <div class="md-title">Colorways</div>
                <md-content class="md-scrollbar">
                  <md-checkbox v-model="reject.colorways" value="A">A</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="B">B</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="C">C</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="D">D</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="E">E</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="F">F</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="G">G</md-checkbox>
                  <md-checkbox v-model="reject.colorways" value="H">H</md-checkbox>
                </md-content>
              </md-content>
            </div>
          </div>
          <div class="md-layout-item md-size-15 accessories">
            <md-content>
              <div class="md-title">Accessories</div>
              <md-field md-clearable>
                <label>Custom</label>
                <md-input v-model="reject.accessories.custom"></md-input>
              </md-field>
              <md-content>
                <md-content class="md-scrollbar" :style="{height: !!reject.accessories.user.length ? '50%' : ''}">
                  <md-checkbox v-for="(accessory, key) in reject.accessories.def" :key="key" v-model="reject.accessories.selected" :value="accessory.value">{{ accessory.name }}</md-checkbox>
                </md-content>
                <md-content v-if="!!reject.accessories.user.length" class="md-scrollbar" style="height: 50%">
                  <md-checkbox v-for="(accessory, key) in reject.accessories.user" :key="key" v-model="reject.accessories.selected" :value="accessory.value">{{ accessory.name }}</md-checkbox>
                </md-content>
              </md-content>
            </md-content>
          </div>
          <div class="md-layout-item md-size-55 rejections">
            <md-content>
              <div class="md-title">Rejections</div>
              <md-field md-clearable>
                <label>Custom</label>
                <md-input v-model="reject.rejections.custom"></md-input>
              </md-field>
              <md-tabs md-alignment="right">
                <md-tab id="tab-general" md-label="General">
                  <md-content>
                    //
                  </md-content>
                </md-tab>
                <md-tab id="tab-tqc" md-label="TQC">
                  <md-content>
                    //
                  </md-content>
                </md-tab>
                <md-tab id="tab-cu3" md-label="CU3">
                  <md-content>
                    //
                  </md-content>
                </md-tab>
                <md-tab id="tab-pdp" md-label="PDP">
                  <md-content>
                    //
                  </md-content>
                </md-tab>
              </md-tabs>
            </md-content>
          </div>
          <div class="md-layout-item md-size-15 screenshot">Screenshot</div>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
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
            }
          ]
        },
        rejections: {
          custom: '',
          selected: [],
          def: [],
          user: []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-app {
    height: 100vh;

    &-drawer {
      border: 1px solid rgba(#000, .12);
      width: 250px;
    }
  }

  .preview {
    height: 30%;
  }

  .options {
    height: 70%
  }

  .md-field {
    margin: 0;

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

  .product-kind {
    height: 25%;

    > .md-content {
      height: 100%;

      > .md-content {
        height: calc(100% - 26px);
      }
    }

    .md-field {

      /deep/ .md-clear {
        right: 32px;
      }
    }
  }

  .colorway {
    height: 75%;

    > .md-content {
      height: calc(100% - 26px);

      > .md-content {
        overflow-y: auto;
        height: 100%;
      }
    }
  }

  .accessories {

    > .md-content {
      height: 100%;

      > .md-content {
        height: calc(100% - 74px);

        > .md-content {
          overflow-y: auto;
        }
      }
    }
  }
</style>
