<template>
  <div class="admin-tools-web">
    <v-layout row>
      <v-flex>
        <v-toolbar color="primary" tabs dark flat>
          <v-toolbar-title>Web Tools</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
            <v-btn slot="activator" color="white" class="mb-2" light>Add Web Tool</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">{{ webTool.id === null ? 'Add Web Tool' : 'Edit Web Tool' }}</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6>
                      <v-text-field v-model="webTool.title" label="Title"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6>
                      <v-select v-model="webTool.type" label="Type" item-text="text" item-value="value" :items="[
                        {
                          text: 'CSL',
                          value: 'csl'
                        },
                        {
                          text: 'CU3',
                          value: 'cu3'
                        },
                        {
                          text: 'MPD',
                          value: 'mpd'
                        },
                        {
                          text: 'PDP',
                          value: 'pdp'
                        },
                        {
                          text: 'Trello',
                          value: 'trello'
                        },
                      ]" attach multiple></v-select>
                    </v-flex>

                    <v-flex xs12>
                      <v-textarea v-model="webTool.description" label="Description" rows="1" auto-grow></v-textarea>
                    </v-flex>

                    <v-slide-x-reverse-transition>
                      <v-layout  v-if="checkEditCode" row wrap>
                        <v-flex xs12>
                          <span>Version</span>
                          <v-chip :class="newVersion ? 'primary' : 'red'">
                            <v-slide-x-reverse-transition>
                              <v-avatar v-if="!newVersion" class="red lighten-3">
                                <v-icon>cached</v-icon>
                              </v-avatar>
                            </v-slide-x-reverse-transition>
                            <span>{{ newVersion || webTool.version.current | versionize }}</span>
                            <v-slide-x-transition>
                              <v-avatar v-if="newVersion" class="right accent">
                                <v-icon>check</v-icon>
                              </v-avatar>
                            </v-slide-x-transition>
                          </v-chip>
                        </v-flex>

                        <v-flex :sm12="webTool.version.type === 'pre'" :md8="webTool.version.type === 'pre'" xs12>
                          <v-radio-group v-model="webTool.version.type" row>
                            <v-radio color="primary" label="Major" value="major"></v-radio>
                            <v-radio color="primary" label="Minor" value="minor"></v-radio>
                            <v-radio color="primary" label="Patch" value="patch"></v-radio>
                            <v-radio color="primary" label="Pre-release" value="pre"></v-radio>
                          </v-radio-group>
                        </v-flex>

                        <v-flex v-if="webTool.version.type === 'pre'" xs12 sm12 md4>
                          <v-text-field v-model="webTool.version.pre" label="Enter pre-release version"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-slide-x-reverse-transition>

                    <v-flex xs12>
                      <v-textarea v-model="webTool.code" label="Code"></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                <v-btn v-if="webTool.id === null" color="blue darken-1" flat @click.native="addWebTool">Save</v-btn>
                <v-btn v-else color="blue darken-1" flat @click.native="updateWebTool">Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-tabs slot="extension" color="transparent" slider-color="accent" align-with-title dark>
            <v-tab to="/admin/tools/web" ripple>All</v-tab>
            <v-tab to="/admin/tools/web/csl" ripple>CSL</v-tab>
            <v-tab to="/admin/tools/web/cu3" ripple>CU3</v-tab>
            <v-tab to="/admin/tools/web/mpd" ripple>MPD</v-tab>
            <v-tab to="/admin/tools/web/pdp" ripple>PDP</v-tab>
            <v-tab to="/admin/tools/web/trello" ripple>TRELLO</v-tab>
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
              <td>
                <v-icon class="mr-2" @click.stop="editWebTool(props.item)" small>edit</v-icon>
                <v-icon @click.stop="removeWebTool(props.item)" small>delete</v-icon>
              </td>
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
                      This feature is available soon.
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
  name: 'admin-tools-web',
  components: { Marked },
  beforeRouteEnter (to, from, next) {
    if (to.params.type) next(vm => {
      if (['csl', 'cu3', 'mdp', 'pdp', 'trello'].indexOf(to.params.type.toLowerCase().trim()) !== -1) vm.type = to.params.type
      else next('/admin/tools')
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
        {
          text: 'Actions',
          value: 'title',
          sortable: false
        }
      ],
      editCodeRef: '',
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
      dialog: false
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
  watch: {
    dialog (val) {
      val || this.close()
    },
    pagination: {
      deep: true,
      handler () {
        let { descending, page, rowsPerPage, sortBy, totalItems } = this.pagination
        let query = database.collection('tools/web/manipulators').orderBy(sortBy || 'title', descending ? 'desc' : 'asc')

        this.loader = true

        if (!!this.type) query = query.where(`type.${this.type}`, '==', true)

        if ((rowsPerPage * (page - 1)) > 0) query = query.startAfter(this.lastItem)

        if (rowsPerPage > 0) query = query.limit(rowsPerPage)

        database.doc('tools/web').get().then(doc => {
          switch (this.type) {
            case 'csl':
              this.itemSize = doc.data().csl_count
              break
            case 'cu3':
              this.itemSize = doc.data().cu3_count
              break
            case 'mpd':
              this.itemSize = doc.data().mpd_count
              break
            case 'pdp':
              this.itemSize = doc.data().pdp_count
              break
            case 'trello':
              this.itemSize = doc.data().trello_count
              break
            default:
              this.itemSize = doc.data().all_count
          }

          this.$bind('items', query).then(doc => {
            this.lastItem = this.items.length > 0 ? this.items[this.items.length - 1].title : ''
            this.loader = false
          })
        })
      }
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

      this.loader = true

      database.collection('tools/web/manipulators').add({
        title: this.webTool.title.trim(),
        version: this.newVersion,
        description: this.webTool.description.trim(),
        code: this._trimEOL(this.webTool.code),
        type: type,
        created_at: Firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: Firebase.firestore.FieldValue.serverTimestamp()
      }).then(webTool => {
        database.collection('tools/web/manipulators').doc(webTool.id).collection('history').add({
          version: this.newVersion,
          code: this._trimEOL(this.webTool.code),
          created_at: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          // this.snackbar.msg = `Web tool "${this.webTool.title.trim()}" added.`
          // this.snackbar.visible = true
          this.dialog = false
          this.loader = false
          this.itemSize++

          this._clearWebTool()
        }).catch(e => { console.log(e) })
      }).catch(e => { console.log(e) })
    },
    editWebTool (webTool) {
      let { id, title, version, description, code, type } = webTool

      this.webTool.id = id
      this.webTool.title = title
      this.webTool.version.current = version
      this.webTool.description = description
      this.webTool.code = this.editCodeRef = code
      this.webTool.type = Object.keys(type).filter(key => type[key])
      this.dialog = true
    },
    updateWebTool () {
      let { id, title, description, code } = this.webTool
      let type = {
        csl: this.webTool.type.indexOf('csl') !== -1,
        cu3: this.webTool.type.indexOf('cu3') !== -1,
        mpd: this.webTool.type.indexOf('mpd') !== -1,
        pdp: this.webTool.type.indexOf('pdp') !== -1,
        trello: this.webTool.type.indexOf('trello') !== -1
      }

      this.loader = true

      if (this.checkEditCode) {
        database.collection('tools/web/manipulators').doc(id).update({
          title: title.trim(),
          version: this.newVersion,
          description: description.trim(),
          code: this._trimEOL(code),
          type: type,
          updated_at: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          database.collection('tools/web/manipulators').doc(id).collection('history').add({
            version: this.newVersion,
            code: this._trimEOL(code),
            created_at: Firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            this.dialog = false
            this.loader = false

            this._clearWebTool()
          }).catch(e => { console.log(e) })
        }).catch(e => { console.log(e) })
      } else {
        database.collection('tools/web/manipulators').doc(id).update({
          title: title.trim(),
          description: description.trim(),
          type: type,
          updated_at: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          this.dialog = false
          this.loader = false

          this._clearWebTool()
        }).catch(e => { console.log(e) })
      }
    },
    removeWebTool ({id, title}) {
      this.loader = true

      database.collection('tools/web/manipulators').doc(id).delete().then(() => {
        this._deleteHistory(id)
        this.itemSize--
        this.loader = false
        // this.snackbar.msg = `Web tool "${title}" deleted.`
        // this.snackbar.visible = true
      })
    },
    close () {
      this.dialog = false
      this._clearWebTool()
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
      let batch = database.batch()

      database.collection('tools/web/manipulators').doc(id).collection('history').limit(15).get().then(versions => {
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
