<template>
  <div class="sidebar">
    <md-toolbar class="md-transparent" md-elevation="0">
      Navigation
    </md-toolbar>

    <md-list>
      <md-list-item to="/login" v-if="!auth">
        <md-icon>person</md-icon>
        <span class="md-list-item-text">Login</span>
      </md-list-item>

      <md-list-item to="/home" v-if="auth">
        <md-icon>home</md-icon>
        <span class="md-list-item-text">Home</span>
      </md-list-item>

      <md-list-item to="/qc-rejection">
        <md-icon>list</md-icon>
        <span class="md-list-item-text">QC Rejection</span>
      </md-list-item>

      <md-list-item md-expand>
        <md-icon>code</md-icon>
        <span class="md-list-item-text">Tools and Scripts</span>

        <md-list slot="md-expand">
          <md-list-item class="md-inset" to="/tools/scripts">Scripts</md-list-item>
          <md-list-item class="md-inset" to="/tools/web">Web Tools</md-list-item>
          <md-list-item class="md-inset" to="/tools/admin" v-if="auth && user.role === 'admin'">Admin</md-list-item>
        </md-list>
      </md-list-item>
    </md-list>

    <md-button class="md-primary md-raised md-dense" @click="logout" v-if="auth">Logout</md-button>
  </div>
</template>

<script>
import Firebase from 'firebase'
import { __DB__ } from '../../main'
import __bus__ from '../../bus'

export default {
  name: 'sidebar',
  data () {
    return {
      auth: Firebase.auth().currentUser,
      user: {
        role: 'user'
      }
    }
  },
  firestore () {
    return {
      user: __DB__.collection('users').doc(this.auth.uid)
    }
  },
  mounted () {
    __bus__.$on('authUser', user => {
      this.auth = user
    })
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
