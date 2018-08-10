<template>
  <div class="tools-web">
    <v-layout align-center justify-center row wrap>
      <v-flex md6>
        <v-alert v-model="alert.time" type="info" dismissible>
          <p class="subheading">Tip! <span class="caption">(close in {{ alert.time }})</span></p>
          <p class="body-1">Drag links to your bookmarks.</p>
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-toolbar color="primary" tabs dark flat>
          <v-toolbar-title>Web Tools</v-toolbar-title>
          <v-tabs slot="extension" color="transparent" slider-color="accent" align-with-title dark>
            <v-tab to="/tools/web" ripple>All</v-tab>
            <v-tab to="/tools/web/csl" ripple>CSL</v-tab>
            <v-tab to="/tools/web/cu3" ripple>CU3</v-tab>
            <v-tab to="/tools/web/mpd" ripple>MPD</v-tab>
            <v-tab to="/tools/web/pdp" ripple>PDP</v-tab>
            <v-tab to="/tools/web/trello" ripple>TRELLO</v-tab>
          </v-tabs>
        </v-toolbar>

        <!-- --------------------------------- -->
        <v-data-table :headers="headers" :items="items" class="elevation-1" :loading="loader" :total-items="itemSize" :pagination.sync="pagination">
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td>
                <v-tooltip bottom>
                  <a slot="activator" :href="`javascript: ${props.item.code}`" @click.prevent.stop>{{ props.item.title }}</a>
                  <span>Drag me!</span>
                </v-tooltip>
              </td>
              <td>{{ props.item.version | versionize }}</td>
              <td>{{ props.item.type | optimize_type }}</td>
              <td>{{ props.item.description | str_limit(40, '...') }}</td>
            </tr>
          </template>

          <template slot="expand" slot-scope="props">
            <v-tabs color="grey lighten-1" slider-color="white">
              <v-tab>Description</v-tab>
              <v-tab>Code</v-tab>
              <v-tab>History</v-tab>

              <v-tabs-items>
                <v-tab-item>
                  <v-card flat dark>
                    <v-card-text>
                      <marked :plain-text="props.item.description" :open-link-new-tab="true"></marked>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item>
                  <v-card flat dark>
                    <v-card-text>
                      {{ props.item.code }}
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item>
                  <v-card flat dark>
                    <v-card-text>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem laudantium ab sint et voluptatibus excepturi est, ipsum amet molestiae officiis fuga ut exercitationem quidem harum, ratione tempore maxime tempora aperiam.
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </template>

          <template slot="no-data">
            <v-layout align-center justify-center row wrap>
              <v-flex class="text-xs-center empty-state" md6>
                <v-avatar color="grey">
                  <v-icon dark>whatshot</v-icon>
                </v-avatar>
                <p class="title">Nothing in Web Tools {{ type }}</p>
                <p class="body-1">Please add some tools!</p>
              </v-flex>
            </v-layout>
          </template>
        </v-data-table>
        <!-- --------------------------------- -->

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Firebase from '@/services/firebase'
import Marked from '@/components/layouts/Marked'

const database = Firebase.firestore()

export default {
  name: 'tools-web',
  components: { Marked },
  beforeRouteEnter (to, from, next) {
    if (to.params.type) next(vm => {
      if (['csl', 'cu3', 'mdp', 'pdp', 'trello'].indexOf(to.params.type.toLowerCase().trim()) !== -1) vm.type = to.params.type
      else next('/tools')
    })
    else next()
  },
  beforeRouteUpdate (to, from, next) {

    this.type = to.params.type ? to.params.type : null
    this.loader = false
    this.itemSize = null
    this.items = []
    this.pagination = {
      page: 1,
      sortBy: 'title',
      rowsPerPage: 10
    }

    next()
  },
  beforeRouteLeave (to, from, next) {
    this.type = null
    this.loader = false
    this.itemSize = null
    this.items = []
    this.pagination = {
      sortBy: 'title',
      rowsPerPage: 10
    }

    next()
  },
  data () {
    return {
      type: null,
      loader: false,
      itemSize: null,
      lastItem: '',
      items: [],
      pagination: {
        page: 1,
        sortBy: 'title',
        rowsPerPage: 10
      },
      headers: [
        {
          text: 'Title',
          value: 'title'
        },
        {
          text: 'Version',
          value: 'version',
          sortable: false
        },
        {
          text: 'Type',
          value: 'type',
          sortable: false
        },
        {
          text: 'Description',
          value: 'description',
          sortable: false
        },
      ],
      alert: {
        isRunning: false,
        time: 60,
        timer: null
      }
    }
  },
  created () {
    this.startAlertDismissTimer()
  },
  watch: {
    pagination: {
      deep: true,
      handler () {
        let { descending, page, rowsPerPage, sortBy, totalItems } = this.pagination
        let query = database.collection('web-tools').orderBy(sortBy || 'title', descending ? 'desc' : 'asc')

        this.loader = true

        if (!!this.type) query = query.where(`type.${this.type}`, '==', true)

        if ((rowsPerPage * (page - 1)) > 0) query = query.startAfter(this.lastItem)

        if (rowsPerPage > 0) query = query.limit(rowsPerPage)

        if (!this.type) {
          database.collection('web-tools').get().then(snap => {
            this.itemSize = snap.size

            this.$bind('items', query).then(doc => {
              this.lastItem = this.items.length > 0 ? this.items[this.items.length - 1].title : ''
              this.loader = false
            })
          })
        } else {
          database.collection('web-tools').where(`type.${this.type}`, '==', true).get().then(snap => {
            this.itemSize = snap.size

            this.$bind('items', query).then(doc => {
              this.lastItem = this.items.length > 0 ? this.items[this.items.length - 1].title : ''
              this.loader = false
            })
          })
        }
      }
    }
  },
  methods: {
    startAlertDismissTimer () {
      this.alert.isRunning = true

      if (!this.alert.timer) this.alert.timer = setInterval(() => {
        if (this.alert.time > 0) this.alert.time--
        else this.stopAlertDismissTimer()
      }, 1000)
    },
    stopAlertDismissTimer () {
      clearInterval(this.alert.timer)

      this.alert.isRunning = false
      this.alert.timer = null
      this.alert.time = 0
    }
  },
  filters: {
    versionize ([major = 0, minor = 0, patch = 0, pre = '']) {
      return `${major}.${minor}.${patch}${pre}`
    },
    str_limit (str, limit, tail) {
      return str.length > limit ? str.substr(0, limit - 1) + tail : str
    },
    optimize_type (types) {
      return Object.keys(types).filter(key => types[key]).join(' | ').toUpperCase()
    }
  }
}
</script>

<style lang="scss" scoped>
  .empty-state {
    margin: 40px 0;

    .v-avatar {
      width: 250px !important;
      height: 250px !important;
      margin-bottom: 20px;

      .v-icon {
        font-size: 150px;
      }
    }
  }

  .v-textarea /deep/ textarea {
    max-height: 105px;
  }

  .v-chip .v-avatar.right {
    margin-right: -12px;
    margin-left: 8px;
  }
</style>
