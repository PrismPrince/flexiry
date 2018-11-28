<template>
  <v-container fluid class="tools-web">
    <v-layout align-center justify-center row wrap>
      <v-flex>
        <v-alert class="mb-3" v-model="alert.time" type="info" dismissible>
          <p class="subheading">Tip! <span class="caption">(close in {{ alert.time }})</span></p>
          <p class="body-1">Drag links to your bookmarks.</p>
        </v-alert>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex>
        <v-toolbar color="primary" tabs dark flat>
          <v-toolbar-title>Bookmarks</v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- ----------------------------- ADMIN ----------------------------- -->

          <!-- <v-dialog v-model="dialog" max-width="800px">
            <v-btn slot="activator" color="white" class="mb-2" light>Add Bookmark</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">{{ bookmark.id === null ? 'Add Bookmark' : 'Edit Bookmark' }}</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6>
                      <v-text-field v-model="bookmark.title" label="Title"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6>
                      <v-select v-model="bookmark.type" label="Type" item-text="text" item-value="value" :items="[
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
                      <v-textarea v-model="bookmark.description" label="Description" rows="1" auto-grow></v-textarea>
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
                            <span>{{ newVersion || bookmark.version.current | versionize }}</span>
                            <v-slide-x-transition>
                              <v-avatar v-if="newVersion" class="right accent">
                                <v-icon>check</v-icon>
                              </v-avatar>
                            </v-slide-x-transition>
                          </v-chip>
                        </v-flex>

                        <v-flex :sm12="bookmark.version.type === 'pre'" :md8="bookmark.version.type === 'pre'" xs12>
                          <v-radio-group v-model="bookmark.version.type" row>
                            <v-radio color="primary" label="Major" value="major"></v-radio>
                            <v-radio color="primary" label="Minor" value="minor"></v-radio>
                            <v-radio color="primary" label="Patch" value="patch"></v-radio>
                            <v-radio color="primary" label="Pre-release" value="pre"></v-radio>
                          </v-radio-group>
                        </v-flex>

                        <v-flex v-if="bookmark.version.type === 'pre'" xs12 sm12 md4>
                          <v-text-field v-model="bookmark.version.pre" label="Enter pre-release version"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-slide-x-reverse-transition>

                    <v-flex xs12>
                      <v-textarea v-model="bookmark.code" label="Code"></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                <v-btn v-if="bookmark.id === null" color="blue darken-1" flat @click.native="addBookmark">Save</v-btn>
                <v-btn v-else color="blue darken-1" flat @click.native="updateBookmark">Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->

          <!-- ----------------------------- ADMIN ----------------------------- -->

          <v-tabs slot="extension" color="transparent" slider-color="accent" align-with-title dark>
            <v-tab to="/bookmarks" ripple>All</v-tab>
            <v-tab to="/bookmarks/csl" ripple>CSL</v-tab>
            <v-tab to="/bookmarks/cu3" ripple>CU3</v-tab>
            <v-tab to="/bookmarks/mpd" ripple>MPD</v-tab>
            <v-tab to="/bookmarks/pdp" ripple>PDP</v-tab>
            <v-tab to="/bookmarks/trello" ripple>TRELLO</v-tab>
          </v-tabs>
        </v-toolbar>

        <!-- --------------------------------- -->
        <v-data-table :headers="headers" :items="items" class="elevation-1" :loading="loader" :total-items="itemSize" :rows-per-page-items="[5, 10, 25, 50, 100]" :pagination.sync="pagination">
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

              <!-- ----------------------------- ADMIN ----------------------------- -->

              <!-- <td>
                <v-icon class="mr-2" @click.stop="editBookmark(props.item)" small>edit</v-icon>
                <v-icon @click.stop="removeBookmark(props.item)" small>delete</v-icon>
              </td> -->

              <!-- ----------------------------- ADMIN ----------------------------- -->

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
                      <marked :plain-text="'```javascript\n// javascript\n\n' + props.item.code + '\n```'" ></marked>
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
                  <v-icon dark>bookmarks</v-icon>
                </v-avatar>
                <p class="title">Nothing in bookmarks</p>
                <p class="body-1">Please add some tools!</p>
              </v-flex>
            </v-layout>
          </template>
        </v-data-table>
        <!-- --------------------------------- -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Firebase from '@/services/firebase'
import Marked from '@/components/layouts/Marked'

const database = Firebase.firestore()

export default {
  name: 'tools-web',
  components: { Marked },
  beforeRouteEnter (to, from, next) {
    if (to.params.type) {
      next(vm => {
        if (['csl', 'cu3', 'mdp', 'pdp', 'trello'].indexOf(to.params.type.toLowerCase().trim()) !== -1) vm.type = to.params.type
        else next('/bookmarks')
      })
    } else next()
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
        // },
        // {
        //   text: 'Actions',
        //   value: 'title',
        //   sortable: false
        }
      ],
      editCodeRef: '',
      bookmark: {
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
      alert: {
        isRunning: false,
        time: 60,
        timer: null
      },
      dialog: false
    }
  },
  created () {
    this.startAlertDismissTimer()
  },
  computed: {
    newVersion () {
      let [major, minor, patch] = this.bookmark.version.current

      switch (this.bookmark.version.type) {
        case 'pre': return [major, minor, patch, this.bookmark.version.pre.trim()]
        case 'patch': return [major, minor, patch + 1]
        case 'minor': return [major, minor + 1, 0]
        case 'major': return [major + 1, 0, 0]
        default: return null
      }
    },
    checkEditCode () {
      return this._trimEOL(this.editCodeRef) !== this._trimEOL(this.bookmark.code)
    }
  },
  watch: {
    pagination: {
      deep: true,
      handler () {
        let { descending, page, rowsPerPage, sortBy } = this.pagination
        let query = database.collection('tools/bookmarks/manipulators').orderBy(sortBy || 'title', descending ? 'desc' : 'asc')

        this.loader = true

        if (this.type) query = query.where(`type.${this.type}`, '==', true)

        if ((rowsPerPage * (page - 1)) > 0) query = query.startAfter(this.lastItem)

        if (rowsPerPage > 0) query = query.limit(rowsPerPage)

        database.doc('tools/bookmarks').get().then(doc => {
          switch (this.type) {
            case 'csl':
              this.itemSize = doc.data().cslCount
              break
            case 'cu3':
              this.itemSize = doc.data().cu3Count
              break
            case 'mpd':
              this.itemSize = doc.data().mpdCount
              break
            case 'pdp':
              this.itemSize = doc.data().pdpCount
              break
            case 'trello':
              this.itemSize = doc.data().trelloCount
              break
            default:
              this.itemSize = doc.data().allCount
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
    startAlertDismissTimer () {
      this.alert.isRunning = true
      if (!this.alert.timer) {
        this.alert.timer = setInterval(() => {
          if (this.alert.time > 0) this.alert.time--
          else this.stopAlertDismissTimer()
        }, 1000)
      }
    },
    stopAlertDismissTimer () {
      clearInterval(this.alert.timer)

      this.alert.isRunning = false
      this.alert.timer = null
      this.alert.time = 0
    },
    addBookmark () {
      let type = {
        csl: this.bookmark.type.indexOf('csl') !== -1,
        cu3: this.bookmark.type.indexOf('cu3') !== -1,
        mpd: this.bookmark.type.indexOf('mpd') !== -1,
        pdp: this.bookmark.type.indexOf('pdp') !== -1,
        trello: this.bookmark.type.indexOf('trello') !== -1
      }

      this.loader = true

      database.collection('tools/bookmarks/manipulators').add({
        title: this.bookmark.title.trim(),
        version: this.newVersion,
        description: this.bookmark.description.trim(),
        code: this._trimEOL(this.bookmark.code),
        type: type,
        created_at: Firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: Firebase.firestore.FieldValue.serverTimestamp()
      }).then(bookmark => {
        database.collection('tools/bookmarks/manipulators').doc(bookmark.id).collection('history').add({
          version: this.newVersion,
          code: this._trimEOL(this.bookmark.code),
          created_at: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          // this.snackbar.msg = `Bookmark "${this.bookmark.title.trim()}" added.`
          // this.snackbar.visible = true
          this.dialog = false
          this.loader = false
          this.itemSize++

          this._clearBookmark()
        }).catch(e => { console.log(e) })
      }).catch(e => { console.log(e) })
    },
    editBookmark ({ id, title, version, description, code, type }) {
      this.bookmark.id = id
      this.bookmark.title = title
      this.bookmark.version.current = version
      this.bookmark.description = description
      this.bookmark.code = this.editCodeRef = code
      this.bookmark.type = Object.keys(type).filter(key => type[key])
      this.dialog = true
    },
    updateBookmark () {
      let { id, title, description, code } = this.bookmark
      let type = {
        csl: this.bookmark.type.indexOf('csl') !== -1,
        cu3: this.bookmark.type.indexOf('cu3') !== -1,
        mpd: this.bookmark.type.indexOf('mpd') !== -1,
        pdp: this.bookmark.type.indexOf('pdp') !== -1,
        trello: this.bookmark.type.indexOf('trello') !== -1
      }

      this.loader = true

      if (this.checkEditCode) {
        database.collection('tools/bookmarks/manipulators').doc(id).update({
          title: title.trim(),
          version: this.newVersion,
          description: description.trim(),
          code: this._trimEOL(code),
          type: type,
          updated_at: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          database.collection('tools/bookmarks/manipulators').doc(id).collection('history').add({
            version: this.newVersion,
            code: this._trimEOL(code),
            created_at: Firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            this.dialog = false
            this.loader = false

            this._clearBookmark()
          }).catch(e => { console.log(e) })
        }).catch(e => { console.log(e) })
      } else {
        database.collection('tools/bookmarks/manipulators').doc(id).update({
          title: title.trim(),
          description: description.trim(),
          type: type,
          updated_at: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          this.dialog = false
          this.loader = false

          this._clearBookmark()
        }).catch(e => { console.log(e) })
      }
    },
    removeBookmark ({ id, title }) {
      this.loader = true

      database.collection('tools/bookmarks/manipulators').doc(id).delete().then(() => {
        this._deleteHistory(id)
        this.itemSize--
        this.loader = false
        // this.snackbar.msg = `Bookmark "${title}" deleted.`
        // this.snackbar.visible = true
      }).catch(e => { console.log(e) })
    },
    close () {
      this.dialog = false
      this._clearBookmark()
    },
    _clearBookmark () {
      this.editCodeRef = ''
      this.bookmark = {
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

      database.collection('tools/bookmarks/manipulators').doc(id).collection('history').limit(15).get().then(versions => {
        if (versions.size === 0) return

        versions.docs.forEach(version => {
          batch.delete(version.ref)
        })

        return batch.commit().then(() => versions.size).catch(e => { console.log(e) })
      }).then(size => {
        if (size === 0) {
          resolve()
          return
        }

        process.nextTick(() => {
          this._deleteHistory(id)
        })
      }).catch(e => { console.log(e) })
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
