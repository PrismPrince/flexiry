<template>
  <div class="web-tools">
    <div class="md-layout md-alignment-top-center" v-if="hint.status">
      <div class="md-layout-item md-size-40 md-medium-size-50 md-small-size-80 md-xsmall-size-100">
        <md-card class="note md-accent">
          <md-card-header>
            <md-card-header-text>Drag links to your bookmarks.</md-card-header-text>
            <md-button class="md-icon-button md-dense" @click="hint.status = !hint.status">
              <md-icon>close</md-icon>
            </md-button>
          </md-card-header>
        </md-card>
      </div>
    </div>
    <md-tabs class="md-elevation-3 md-primary" md-sync-route md-dynamic-height>
      <md-tab id="tab-csl" md-label="CSL" to="/tools/web/csl">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webtool.title" :version="webtool.version" :code="webtool.code" :description="webtool.description" :key="webtool.id" v-for="webtool in csl"></tool-card>
        </div>
      </md-tab>
      <md-tab id="tab-cu3" md-label="CU3" to="/tools/web/cu3">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webtool.title" :version="webtool.version" :code="webtool.code" :description="webtool.description" :key="webtool.id" v-for="webtool in cu3"></tool-card>
        </div>
      </md-tab>
      <md-tab id="tab-mpd" md-label="MPD" to="/tools/web/mpd">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webtool.title" :version="webtool.version" :code="webtool.code" :description="webtool.description" :key="webtool.id" v-for="webtool in mpd"></tool-card>
        </div>
      </md-tab>
      <md-tab id="tab-pdp" md-label="PDP" to="/tools/web/pdp">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webtool.title" :version="webtool.version" :code="webtool.code" :description="webtool.description" :key="webtool.id" v-for="webtool in pdp"></tool-card>
        </div>
      </md-tab>
      <md-tab id="tab-trello" md-label="Trello" to="/tools/web/trello">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webtool.title" :version="webtool.version" :code="webtool.code" :description="webtool.description" :key="webtool.id" v-for="webtool in trello"></tool-card>
        </div>
      </md-tab>
    </md-tabs>
  </div>
</template>

<script>
import Firebase from 'firebase'
import { __DB__ } from '../../../main'

import ToolCard from '@/components/layouts/Tool-Card'

export default {
  name: 'web-tools',
  components: {
    ToolCard
  },
  data () {
    return {
      auth: Firebase.auth().currentUser,
      user: {},
      hint: {
        status: true,
        hits: 0
      },
      csl: [],
      cu3: [],
      mpd: [],
      pdp: [],
      trello: []
    }
  },
  firestore () {
    return {
      user: __DB__.collection('users').doc(this.auth.uid),
      csl: __DB__.collection('web-tools').where('type', '==', 'csl').orderBy('updated_at'),
      cu3: __DB__.collection('web-tools').where('type', '==', 'cu3').orderBy('updated_at'),
      mpd: __DB__.collection('web-tools').where('type', '==', 'mpd').orderBy('updated_at'),
      pdp: __DB__.collection('web-tools').where('type', '==', 'pdp').orderBy('updated_at'),
      trello: __DB__.collection('web-tools').where('type', '==', 'trello').orderBy('updated_at')
    }
  }
}
</script>

<style lang="scss" scoped>
  [v-cloak] {
    display: none;
  }

  .note {
    margin: 0 0 16px 0;
  }
</style>
