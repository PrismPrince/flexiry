<template>
  <div class="qc-rejection-admin">
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-66 md-small-size-50 md-xsmall-size-100">
        <md-table v-model="colorways" md-card md-fixed-header @md-selected="selectColorway">
          <md-table-toolbar>
            <div class="md-subheading">Colorways</div>
          </md-table-toolbar>

          <md-table-empty-state md-icon="playlist_add" md-label="Add Colorways" md-description="Your colorways will appear here."></md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }" class="md-primary" md-selectable="single">
            <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="Defined By">{{ item.defined_by }}</md-table-cell>
            <md-table-cell md-label="Action">
              <md-button class="md-icon-button md-dense md-raised md-accent" @click.stop="removeColorway(item)">
                <md-icon>close</md-icon>
                <md-tooltip md-delay="300">Remove</md-tooltip>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>

      <div class="md-layout-item md-size-33 md-small-size-50 md-xsmall-size-100">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ custom.colorway.id === null ? 'Add Colorway' : 'Edit Colorway' }}</div>
          </md-card-header>

          <md-card-content>
            <md-field class="" md-clearable>
              <label>Name</label>
              <md-input v-model="custom.colorway.name" @keyup.enter="addColorway"></md-input>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button v-if="custom.colorway.id !== null" class="md-dense md-raised" @click="cancelColorwayEdit">Cancel</md-button>
            <md-button v-if="custom.colorway.id !== null" class="md-dense md-raised md-primary" @click="updateColorway" :disabled="!custom.colorway.name">Save</md-button>
            <md-button v-else class="md-dense md-raised md-primary" @click="addColorway" :disabled="!custom.colorway.name">Add</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-66 md-small-size-50 md-xsmall-size-100">
        <md-table v-model="accessories" md-card md-fixed-header @md-selected="selectAccessory">
          <md-table-toolbar>
            <div class="md-subheading">Accessories</div>
          </md-table-toolbar>

          <md-table-empty-state md-icon="playlist_add" md-label="Add Accessories" md-description="Your accessories will appear here."></md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }" class="md-primary" md-selectable="single">
            <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="Value">{{ item.value }}</md-table-cell>
            <md-table-cell md-label="Defined By">{{ item.defined_by }}</md-table-cell>
            <md-table-cell md-label="Action">
              <md-button class="md-icon-button md-dense md-raised md-accent" @click.stop="removeAccessory(item)">
                <md-icon>close</md-icon>
                <md-tooltip md-delay="300">Remove</md-tooltip>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>

      <div class="md-layout-item md-size-33 md-small-size-50 md-xsmall-size-100">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ custom.accessory.id === null ? 'Add Accessory' : 'Edit Accessory' }}</div>
          </md-card-header>

          <md-card-content>
            <md-field md-clearable>
              <label>Name</label>
              <md-input v-model="custom.accessory.name"></md-input>
            </md-field>

            <md-field md-clearable>
              <label>Value</label>
              <md-input v-model="custom.accessory.value" @keyup.enter="addAccessory"></md-input>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button v-if="custom.accessory.id !== null" class="md-dense md-raised" @click="cancelAccessoryEdit">Cancel</md-button>
            <md-button v-if="custom.accessory.id !== null" class="md-dense md-raised md-primary" @click="updateAccessory" :disabled="!custom.accessory.name || !custom.accessory.value">Save</md-button>
            <md-button v-else class="md-dense md-raised md-primary" @click="addAccessory" :disabled="!custom.accessory.name || !custom.accessory.value">Add</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-66 md-small-size-50 md-xsmall-size-100">
        <md-table v-model="rejections" md-card md-fixed-header @md-selected="selectRejection">
          <md-table-toolbar>
            <div class="md-subheading">Rejections</div>
          </md-table-toolbar>

          <md-table-empty-state md-icon="playlist_add" md-label="Add Rejections" md-description="Your rejections will appear here."></md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }" class="md-primary" md-selectable="single">
            <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="Value">{{ item.value }}</md-table-cell>
            <md-table-cell md-label="Filters">{{ item.filters.join(' | ') }}</md-table-cell>
            <md-table-cell md-label="Defined By">{{ item.defined_by }}</md-table-cell>
            <md-table-cell md-label="Action">
              <md-button class="md-icon-button md-dense md-raised md-accent" @click.stop="removeRejection(item)">
                <md-icon>close</md-icon>
                <md-tooltip md-delay="300">Remove</md-tooltip>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>

      <div class="md-layout-item md-size-33 md-small-size-50 md-xsmall-size-100">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ custom.rejection.id === null ? 'Add Rejection' : 'Edit Rejection' }}</div>
          </md-card-header>

          <md-card-content>
            <md-field md-clearable>
              <label>Name</label>
              <md-input v-model="custom.rejection.name"></md-input>
            </md-field>

            <md-field md-clearable>
              <label>Value</label>
              <md-input v-model="custom.rejection.value"></md-input>
            </md-field>

            <md-field>
              <label>Filters</label>
              <md-select v-model="custom.rejection.filters" multiple>
                <md-option value="general">General</md-option>
                <md-option value="tqc">TQC</md-option>
                <md-option value="cu3">CU3</md-option>
                <md-option value="csl">CSL</md-option>
                <md-option value="pdp">PDP</md-option>
              </md-select>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button v-if="custom.rejection.id !== null" class="md-dense md-raised" @click="cancelRejectionEdit">Cancel</md-button>
            <md-button v-if="custom.rejection.id !== null" class="md-dense md-raised md-primary" @click="updateColorway" :disabled="!custom.rejection.name || !custom.rejection.value || !custom.rejection.filters.length">Save</md-button>
            <md-button v-else class="md-dense md-raised md-primary" @click="addRejection" :disabled="!custom.rejection.name || !custom.rejection.value || !custom.rejection.filters.length">Add</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>

    <md-snackbar md-position="center" :md-duration="snackbar.duration" :md-active.sync="snackbar.visible">
      <span>{{ snackbar.msg }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import Firebase from 'firebase'
import { __DB__ } from '../../../main'

export default {
  name: 'qc-rejection-admin',
  data () {
    return {
      colorways: [],
      accessories: [],
      rejections: [],
      custom: {
        colorway: {
          id: null,
          name: ''
        },
        accessory: {
          id: null,
          name: '',
          value: ''
        },
        rejection: {
          id: null,
          name: '',
          value: '',
          filters: ['general']
        }
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
  methods: {
    addColorway () {
      let name = this.custom.colorway.name.toUpperCase().trim()

      __DB__.collection('colorways').add({
        name: name,
        defined_by: 'admin',
        created_at: Firebase.firestore.FieldValue.serverTimestamp()
      })

      this.custom.colorway.name = ''

      this.snackbar.msg = `Colorway "${name}" added.`
      this.snackbar.visible = true
    },
    selectColorway (item) {
      /* eslint curly: "off" */

      if (!item)
        this.custom.colorway = {
          id: null,
          name: ''
        }
      else
        this.custom.colorway = {
          id: item.id,
          name: item.name
        }
    },
    cancelColorwayEdit () {
      this.custom.colorway = {
        id: null,
        name: ''
      }
    },
    updateColorway () {
      let {id, name} = this.custom.colorway

      __DB__.collection('rejections').doc(id).update({
        name: name,
        updated_at: Firebase.firestore.FieldValue.serverTimestamp()
      })
    },
    removeColorway ({id, name}) {
      __DB__.collection('colorways').doc(id).delete()

      this.snackbar.msg = `Colorway "${name}" deleted.`
      this.snackbar.visible = true
    },
    addAccessory () {
      let name = this.custom.accessory.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').trim()
      let value = this.custom.accessory.value.toLowerCase().replace(/\s+/g, '_').trim()

      __DB__.collection('accessories').add({
        name: name,
        value: value,
        defined_by: 'admin',
        created_at: Firebase.firestore.FieldValue.serverTimestamp()
      })

      this.custom.accessory.name = ''
      this.custom.accessory.value = ''

      this.snackbar.msg = `Accessory "${name}" added.`
      this.snackbar.visible = true
    },
    selectAccessory (item) {
      /* eslint curly: "off" */

      if (!item)
        this.custom.accessory = {
          id: null,
          name: '',
          value: ''
        }
      else
        this.custom.accessory = {
          id: item.id,
          name: item.name,
          value: item.value
        }
    },
    cancelAccessoryEdit () {
      this.custom.accessory = {
        id: null,
        name: '',
        value: ''
      }
    },
    updateAccessory () {
      let {id, name, value} = this.custom.accessory

      __DB__.collection('rejections').doc(id).update({
        name: name,
        value: value,
        updated_at: Firebase.firestore.FieldValue.serverTimestamp()
      })
    },
    removeAccessory ({id, name}) {
      __DB__.collection('accessories').doc(id).delete()

      this.snackbar.msg = `Accessory "${name}" deleted.`
      this.snackbar.visible = true
    },
    addRejection () {
      let name = this.custom.rejection.name.trim()
      let value = this.custom.rejection.value.trim()
      let filters = this.custom.rejection.filters.sort()

      __DB__.collection('rejections').add({
        name: name,
        value: value,
        filters: filters,
        defined_by: 'admin',
        created_at: Firebase.firestore.FieldValue.serverTimestamp()
      })

      this.custom.rejection.name = ''
      this.custom.rejection.value = ''
      this.custom.rejection.filters = []

      this.snackbar.msg = `Rejection "${name}" added.`
      this.snackbar.visible = true
    },
    selectRejection (item) {
      /* eslint curly: "off" */

      if (!item)
        this.custom.rejection = {
          id: null,
          name: '',
          value: '',
          filters: []
        }
      else
        this.custom.rejection = {
          id: item.id,
          name: item.name,
          value: item.value,
          filters: item.filters
        }
    },
    cancelRejectionEdit () {
      this.custom.rejection = {
        id: null,
        name: '',
        value: '',
        filters: []
      }
    },
    updateRejection () {
      let {id, name, value, filters} = this.custom.rejection

      __DB__.collection('rejections').doc(id).update({
        name: name,
        value: value,
        filters: filters,
        updated_at: Firebase.firestore.FieldValue.serverTimestamp()
      })
    },
    removeRejection ({id, name}) {
      __DB__.collection('rejections').doc(id).delete()

      this.snackbar.msg = `Rejection "${name}" deleted.`
      this.snackbar.visible = true
    }
  }
}
</script>

<style lang="scss">
  .md-app-content {
    margin-right: 4px;
  }
</style>

<style lang="scss" scoped>
  .md-card {
    margin: 16px;
  }
</style>
