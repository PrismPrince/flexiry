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
      <template slot="md-tab" slot-scope="{ tab }">
        <md-badge :md-content="tab.data.count" md-dense>
          {{ tab.label }}
        </md-badge>
      </template>

      <md-tab id="tab-all" md-label="All Web Tools" to="/tools/web" :md-template-data="{ count: webTools.length }">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webTool.title" :version="webTool.version" :code="webTool.code" :description="webTool.description" :key="webTool.id" v-for="webTool in webTools"></tool-card>
        </div>
      </md-tab>
      <md-tab id="tab-csl" md-label="CSL" to="/tools/web/csl" :md-template-data="{ count: csl.length }">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webTool.title" :version="webTool.version" :code="webTool.code" :description="webTool.description" :key="webTool.id" v-for="webTool in csl"></tool-card>
        </div>
      </md-tab>
      <md-tab id="tab-cu3" md-label="CU3" to="/tools/web/cu3" :md-template-data="{ count: cu3.length }">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webTool.title" :version="webTool.version" :code="webTool.code" :description="webTool.description" :key="webTool.id" v-for="webTool in cu3"></tool-card>
        </div>
      </md-tab>
      <md-tab id="tab-mpd" md-label="MPD" to="/tools/web/mpd" :md-template-data="{ count: mpd.length }">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webTool.title" :version="webTool.version" :code="webTool.code" :description="webTool.description" :key="webTool.id" v-for="webTool in mpd"></tool-card>
        </div>
      </md-tab>
      <md-tab id="tab-pdp" md-label="PDP" to="/tools/web/pdp" :md-template-data="{ count: pdp.length }">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webTool.title" :version="webTool.version" :code="webTool.code" :description="webTool.description" :key="webTool.id" v-for="webTool in pdp"></tool-card>
        </div>
      </md-tab>
      <md-tab id="tab-trello" md-label="Trello" to="/tools/web/trello" :md-template-data="{ count: trello.length }">
        <div class="md-layout md-alignment-top-center">
          <tool-card :title="webTool.title" :version="webTool.version" :code="webTool.code" :description="webTool.description" :key="webTool.id" v-for="webTool in trello"></tool-card>
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
      webTools: []
    }
  },
  firestore () {
    return {
      user: __DB__.collection('users').doc(this.auth.uid),
      webTools: __DB__.collection('web-tools').orderBy('updated_at')
    }
  },

  computed: {
    csl () {
      return this.webTools.filter(webTool => webTool.type.csl === true)
    },
    cu3 () {
      return this.webTools.filter(webTool => webTool.type.cu3 === true)
    },
    mpd () {
      return this.webTools.filter(webTool => webTool.type.mpd === true)
    },
    pdp () {
      return this.webTools.filter(webTool => webTool.type.pdp === true)
    },
    trello () {
      return this.webTools.filter(webTool => webTool.type.trello === true)
    }
  }
}
</script>

<style lang="scss" scoped>
  .note {
    margin: 0 0 16px 0;
  }

  .md-badge-content /deep/ .md-badge {
    position: absolute;
    top: -10px;
    right: -18px;
  }
</style>
