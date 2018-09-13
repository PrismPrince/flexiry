<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" persistent enable-resize-watcher fixed app>
      <v-list>
        <v-list-tile v-if="!auth" to="/login" disabled>
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="auth" to="/home" disabled>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- <v-list-group v-if="auth && user.role === 'admin'" prepend-icon="supervisor_account" no-action> -->
        <v-list-group prepend-icon="supervisor_account" no-action>
          <v-list-tile slot="activator" disabled>
            <v-list-tile-content>
              <v-list-tile-title>Administrator</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/admin/bookmarks" disabled>
            <v-list-tile-content>
              <v-list-tile-title>Bookmark Tools</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/admin/qc-rejection" disabled>
            <v-list-tile-content>
              <v-list-tile-title>QC Rejection</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>

        <v-list-tile v-if="auth" to="/bookmarks">
          <v-list-tile-action>
            <v-icon>bookmarks</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Bookmarks</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/qc-rejection" disabled>
          <v-list-tile-action>
            <v-icon>list</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>QC Rejection</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/file-audit" disabled>
          <v-list-tile-action>
            <v-icon>done_all</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>File Audit</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-footer height="auto" fixed>
        <v-card class="flex grey lighten-3" flat tile>
          <v-card-text class="justify-center">Get connected for updates!</v-card-text>

          <v-card-actions class="justify-center">
            <v-switch label="Subscribe" v-model="subscription.status"></v-switch>
            <!-- <v-btn class="mx-3" icon>
              <v-icon size="24px">home</v-icon>
            </v-btn>

            <v-btn class="mx-3" icon>
              <v-icon size="24px">home</v-icon>
            </v-btn> -->
          </v-card-actions>

          <v-card-actions class="justify-center">
            &copy;2018 — <strong>Flexiry</strong>
          </v-card-actions>
        </v-card>
      </v-footer>
    </v-navigation-drawer>

    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Flexiry</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-avatar>
        <!-- <img src="" alt=""> -->
        <v-icon>star</v-icon>
      </v-avatar>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn v-if="auth" @click="logout" flat>Logout</v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Firebase from './services/firebase'
import evetBus from './services/event-bus'

const messaging = Firebase.messaging()
const database = Firebase.firestore()

messaging.usePublicVapidKey(process.env.VUE_APP_FIREBASE_PUBLIC_VAPID_KEY)

export default {
  name: 'App',
  data () {
    return {
      auth: Firebase.auth().currentUser || {
        uid: 'xxx'
      },
      user: {
        role: 'user'
      },
      drawer: true,
      subscription: {
        status: false,
        token: window.localStorage.getItem('pushToken') || null
      }
    }
  },
  firestore () {
    return {
      user: database.collection('users').doc(this.auth.uid)
    }
  },
  mounted () {
    evetBus.$on('authUser', auth => {
      this.auth = auth

      database.collection('users').doc(this.auth.uid).get().then(user => {
        this.user = user.data()
      }).catch(error => { console.error(error) })
    })
  },
  created () {
    this.subscription.status = this.subscription.token !== null
  },
  watch: {
    'subscription.status': function () {
      if (this.subscription.status) {
        messaging.requestPermission().then(() => messaging.getToken()).then(token => {
          window.localStorage.setItem('pushToken', token)

          database.collection('subscribers').add({ token }).then(subscriber => { console.log('Subscribed', subscriber) })

          this.subscription.token = token
        }).catch(err => {
          this.subscription.status = false
          console.error('Denied', err)
        })
      } else {
        messaging.getToken().then(userToken => {
          messaging.deleteToken(userToken).then(() => {
            window.localStorage.removeItem('pushToken')

            database.collection('subscribers').doc(this.subscribers.find(subscriber => subscriber.token === userToken).id).delete().then(() => { console.log('Unubscribed', userToken) })

            this.subscription.token = null
          }).catch(err => {
          this.subscription.status = true
            console.error('Error unsubscribing', err)
          })
        })
      }
    }
  },
  methods: {
    logout () {
      Firebase.auth().signOut().then(() => {
        this.auth = null
        this.$router.replace('/')
      })
    }
  }
}
</script>
