<template>
  <div class="web-tools-admin">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-table v-model="webTools" md-card md-fixed-header>
          <md-table-toolbar>
            <div class="md-subheading">Web Tools</div>
          </md-table-toolbar>

          <md-table-empty-state md-icon="playlist_add" md-label="Add Web Tools" md-description="Your web tools will appear here."></md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }" class="md-primary">
            <md-table-cell md-label="Title">{{ item.title }}</md-table-cell>
            <md-table-cell md-label="Version">{{ item.version | versionize }}</md-table-cell>
            <md-table-cell md-label="Description">{{ item.description | str_limit(80, '...') }}</md-table-cell>
            <md-table-cell md-label="Type">{{ Object.keys(item.type).filter(key => item.type[key]).join(' | ').toUpperCase() }}</md-table-cell>
            <md-table-cell md-label="Action">
              <md-button class="md-icon-button md-dense md-raised md-primary" @click="editWebTool(item)">
                <md-icon>create</md-icon>
                <md-tooltip md-delay="300">Edit</md-tooltip>
              </md-button>
              <md-button class="md-icon-button md-dense md-raised md-accent" @click="removeWebTool(item)">
                <md-icon>close</md-icon>
                <md-tooltip md-delay="300">Remove</md-tooltip>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ webTool.id === null ? 'Add Web Tool' : 'Edit Web Tool' }}</div>
          </md-card-header>

          <md-card-content>
            <md-field md-clearable>
              <label>Title</label>
              <md-input v-model="webTool.title"></md-input>
            </md-field>

            <md-field md-clearable>
              <label>Description</label>
              <md-textarea v-model="webTool.description" md-autogrow></md-textarea>
            </md-field>

            <md-field md-clearable>
              <label>Code</label>
              <md-textarea v-model="webTool.code"></md-textarea>
            </md-field>

            <div v-if="checkEditCode">
              <span class="md-subheading">
                Version
                <md-badge class="md-square" :md-content="$options.filters.versionize(webTool.version.current)"></md-badge>
                <span v-if="newVersion !== null">
                  <span style="display: inline-block; padding-left: 4px;"></span>
                  <md-icon>arrow_forward</md-icon>
                  <md-badge class="md-square md-primary" :md-content="$options.filters.versionize(newVersion)"></md-badge>
                </span>
              </span>

              <div class="md-layout">
                <div class="md-layout-item md-small-size-33 md-xsmall-size-50">
                  <md-radio v-model="webTool.version.type" value="major">Major</md-radio>
                </div>
                <div class="md-layout-item md-small-size-33 md-xsmall-size-50">
                  <md-radio v-model="webTool.version.type" value="minor">Minor</md-radio>
                </div>
                <div class="md-layout-item md-small-size-33 md-xsmall-size-50">
                  <md-radio v-model="webTool.version.type" value="patch">Patch</md-radio>
                </div>
                <div class="md-layout-item md-small-size-50 md-xsmall-size-50">
                  <md-radio v-model="webTool.version.type" value="pre">Pre-release</md-radio>
                </div>

                <div class="md-layout-item md-small-size-50 md-xsmall-size-100">
                  <md-field v-if="webTool.version.type === 'pre'" md-clearable>
                    <label>Enter pre-release version</label>
                    <md-input v-model="webTool.version.pre"></md-input>
                  </md-field>
                </div>
              </div>
            </div>

            <md-field>
              <label>Type</label>
              <md-select v-model="webTool.type" multiple>
                <md-option value="csl">CSL</md-option>
                <md-option value="cu3">CU3</md-option>
                <md-option value="mpd">MPD</md-option>
                <md-option value="pdp">PDP</md-option>
                <md-option value="trello">Trello</md-option>
              </md-select>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button class="md-dense md-raised" @click="_clearWebTool" :disabled="false">Clear</md-button>
            <md-button v-if="webTool.id === null" class="md-dense md-raised md-primary" @click="addWebTool" :disabled="false">Add</md-button>
            <md-button v-else class="md-dense md-raised md-primary" @click="updateWebTool" :disabled="false">Update</md-button>
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
  name: 'web-tools-admin',
  data () {
    return {
      auth: Firebase.auth().currentUser,
      editCodeRef: '',
      webTools: [],
      webTool: {
        id: null,
        title: '',
        version: {
          current: [0, 0, 0],
          type: '',
          pre: ''
        },
        description: '',
        code: '',
        type: [],
        error: {
          status: false,
          message: ''
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
      user: __DB__.collection('users').doc(this.auth.uid),
      webTools: __DB__.collection('web-tools').orderBy('updated_at')
    }
  },
  computed: {
    newVersion () {
      let [major, minor, patch] = this.webTool.version.current

      switch (this.webTool.version.type) {
        case 'pre': return [major, minor, patch, this.webTool.version.pre.trim()]
        case 'patch': return [major, minor, patch + 1]
        case 'minor': return [major, minor + 1, 0]
        case 'major': return [major + 1, 0, 0]
        default: return null
      }
    },
    checkEditCode () {
      return this._trimEOL(this.editCodeRef) !== this._trimEOL(this.webTool.code)
    }
  },
  methods: {
    addWebTool () {
      let type = {
        csl: this.webTool.type.indexOf('csl') !== -1,
        cu3: this.webTool.type.indexOf('cu3') !== -1,
        mpd: this.webTool.type.indexOf('mpd') !== -1,
        pdp: this.webTool.type.indexOf('pdp') !== -1,
        trello: this.webTool.type.indexOf('trello') !== -1
      }

      __DB__.collection('web-tools').add({
        title: this.webTool.title.trim(),
        version: this.newVersion,
        description: this.webTool.description.trim(),
        code: this._trimEOL(this.webTool.code),
        type: type,
        created_at: Firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: Firebase.firestore.FieldValue.serverTimestamp()
      }).then(webTool => {
        __DB__.collection('web-tools').doc(webTool.id).collection('history').add({
          version: this.newVersion,
          code: this._trimEOL(this.webTool.code),
          created_at: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          this.snackbar.msg = `Web tool "${this.webTool.title.trim()}" added.`
          this.snackbar.visible = true

          this._clearWebTool()
        }).catch(e => { console.log(e) })
      }).catch(e => { console.log(e) })
    },
    editWebTool (webTool) {
      let {id, title, version, description, code, type} = webTool

      this.webTool.id = id
      this.webTool.title = title
      this.webTool.version.current = version
      this.webTool.description = description
      this.webTool.code = this.editCodeRef = code
      this.webTool.type = Object.keys(type).filter(key => type[key])
    },
    updateWebTool () {
      let {id, title, description, code} = this.webTool
      let type = {
        csl: this.webTool.type.indexOf('csl') !== -1,
        cu3: this.webTool.type.indexOf('cu3') !== -1,
        mpd: this.webTool.type.indexOf('mpd') !== -1,
        pdp: this.webTool.type.indexOf('pdp') !== -1,
        trello: this.webTool.type.indexOf('trello') !== -1
      }

      if (this.checkEditCode) {
        __DB__.collection('web-tools').doc(id).update({
          title: title.trim(),
          version: this.newVersion,
          description: description.trim(),
          code: this._trimEOL(code),
          type: type,
          updated_at: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          __DB__.collection('web-tools').doc(id).collection('history').add({
            version: this.newVersion,
            code: this._trimEOL(code),
            created_at: Firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => { this._clearWebTool() }).catch(e => { console.log(e) })
        }).catch(e => { console.log(e) })
      } else {
        __DB__.collection('web-tools').doc(id).update({
          title: title.trim(),
          description: description.trim(),
          type: type,
          updated_at: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => { this._clearWebTool() }).catch(e => { console.log(e) })
      }
    },
    removeWebTool ({id, title}) {
      __DB__.collection('web-tools').doc(id).delete().then(() => {
        this._deleteHistory(id)
        this.snackbar.msg = `Web tool "${title}" deleted.`
        this.snackbar.visible = true
      })
    },
    _clearWebTool () {
      this.editCodeRef = ''
      this.webTool = {
        id: null,
        title: '',
        version: {
          current: [0, 0, 0],
          type: '',
          pre: ''
        },
        description: '',
        code: '',
        type: [],
        error: {
          status: false,
          message: ''
        }
      }
    },
    _trimEOL (str) {
      return str.trim().replace(/[ \t]+$/gm, '')
    },
    _deleteHistory (id) {
      /* global resolve */

      let batch = __DB__.batch()

      __DB__.collection('web-tools').doc(id).collection('history').limit(15).get().then(versions => {
        if (versions.size === 0) return

        versions.docs.forEach(version => {
          batch.delete(version.ref)
        })

        return batch.commit().then(() => versions.size)
      }).then(size => {
        if (size === 0) {
          resolve()
          return
        }

        process.nextTick(() => {
          this._deleteHistory(id)
        })
      })
    }
  },
  filters: {
    versionize ([major = 0, minor = 0, patch = 0, pre = '']) {
      return `v${major}.${minor}.${patch}${pre}`
    },
    str_limit (str, limit, tail) {
      return str.length > limit ? str.substr(0, limit - 1) + tail : str
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-table {
    margin-bottom: 16px;
  }

  .md-badge {
    position: relative;
    display: inline-flex;
  }
</style>
