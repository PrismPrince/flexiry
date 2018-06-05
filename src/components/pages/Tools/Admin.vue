<template>
  <div class="web-tools-admin">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-table v-model="webtools" md-card md-fixed-header>
          <md-table-toolbar>
            <div class="md-subheading">CSL</div>
          </md-table-toolbar>

          <md-table-empty-state md-icon="playlist_add" md-label="Add CSL Tools" md-description="Your CSL tools will appear here."></md-table-empty-state>

          <md-table-row slot="md-table-row" slot-scope="{ item }" class="md-primary">
            <md-table-cell md-label="Title">{{ item.title }}</md-table-cell>
            <md-table-cell md-label="Version">{{ item.version | versionize }}</md-table-cell>
            <md-table-cell md-label="Description">{{ item.description | str_limit(50, '...') }}</md-table-cell>
            <md-table-cell md-label="Type">{{ item.type.toUpperCase() }}</md-table-cell>
            <md-table-cell md-label="Action">
              <md-button class="md-icon-button md-dense md-raised md-primary" @click.stop="">
                <md-icon>create</md-icon>
                <md-tooltip md-delay="300">Edit</md-tooltip>
              </md-button>
              <md-button class="md-icon-button md-dense md-raised md-accent" @click.stop="">
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
            <div class="md-title">Add Web Tool</div>
          </md-card-header>

          <md-card-content>
            <md-field md-clearable>
              <label>Title</label>
              <md-input v-model="webtool.title"></md-input>
            </md-field>

            <md-field md-clearable>
              <label>Description</label>
              <md-textarea v-model="webtool.description" md-autogrow></md-textarea>
            </md-field>

            <md-field md-clearable>
              <label>Code</label>
              <md-textarea v-model="webtool.code"></md-textarea>
            </md-field>

            <span class="md-subheading">Version</span>

            <div class="md-layout">
              <div class="md-layout-item md-small-size-33 md-xsmall-size-50">
                <md-radio v-model="webtool.version.type" value="major">Major</md-radio>
              </div>
              <div class="md-layout-item md-small-size-33 md-xsmall-size-50">
                <md-radio v-model="webtool.version.type" value="minor">Minor</md-radio>
              </div>
              <div class="md-layout-item md-small-size-33 md-xsmall-size-50">
                <md-radio v-model="webtool.version.type" value="patch">Patch</md-radio>
              </div>
              <div class="md-layout-item md-small-size-50 md-xsmall-size-50">
                <md-radio v-model="webtool.version.type" value="pre">Pre-release</md-radio>
              </div>

              <div class="md-layout-item md-small-size-50 md-xsmall-size-100">
                <md-field v-if="webtool.version.type === 'pre'" md-clearable>
                  <label>Enter pre-release version</label>
                  <md-input v-model="webtool.version.pre"></md-input>
                </md-field>
              </div>
            </div>

            <md-field>
              <label>Type</label>
              <md-select v-model="webtool.type">
                <md-option value="csl">CSL</md-option>
                <md-option value="cu3">CU3</md-option>
                <md-option value="mpd">MPD</md-option>
                <md-option value="pdp">PDP</md-option>
                <md-option value="trello">Trello</md-option>
              </md-select>
            </md-field>

          </md-card-content>

          <md-card-actions>
            <md-button  class="md-dense md-raised md-primary" @click="addWebTool" :disabled="false">Add</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import Firebase from 'firebase'
import { __DB__ } from '../../../main'
// import Marked from '@/components/layouts/Marked'

export default {
  name: 'web-tools-admin',
  components: {
    // Marked
  },
  data () {
    return {
      auth: Firebase.auth().currentUser,
      webtools: [],
      webtool: {
        title: '',
        version: {
          type: null,
          pre: ''
        },
        description: '',
        code: '',
        type: '',
        error: {
          status: false,
          message: ''
        }
      }
    }
  },
  firestore () {
    return {
      user: __DB__.collection('users').doc(this.auth.uid),
      webtools: __DB__.collection('web-tools').orderBy('updated_at')
    }
  },
  methods: {
    addWebTool () {
      let versionObj = this.webtool.version
      let version = [0, 0, 0]
      if (versionObj.type === 'pre') version = [0, 0, 0, versionObj.pre.trim()]
      else if (versionObj.type === 'patch') version = [0, 0, 1]
      else if (versionObj.type === 'minor') version = [0, 1, 0]
      else if (versionObj.type === 'major') version = [1, 0, 0]

      __DB__.collection('web-tools').add({
        title: this.webtool.title,
        version: version,
        description: this.webtool.description,
        code: this.webtool.code,
        type: this.webtool.type,
        created_at: Firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: Firebase.firestore.FieldValue.serverTimestamp()
      })

      this.webtool = {
        title: '',
        version: {
          type: null,
          pre: ''
        },
        description: '',
        code: '',
        type: '',
        error: {
          status: false,
          message: ''
        }
      }
    }
  },
  filters: {
    versionize ([major = 0, minor = 0, patch = 0, pre = '']) {
      return `v${major}.${minor}.${patch}${pre}`
    },
    str_limit (str, limit, tail) {
      return str.length > limit ? str.substr(0, limit) + tail : str
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-table {
    margin-bottom: 16px;
  }
</style>
