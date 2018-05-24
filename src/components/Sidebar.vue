<template>
  <div class="sidebar">
    <md-toolbar class="md-transparent" md-elevation="0">
      Navigation
    </md-toolbar>

    <md-list>
          <md-list-item to="/login" v-if="!user">
            <md-icon>person</md-icon>
            <span class="md-list-item-text">Login</span>
          </md-list-item>

          <md-list-item to="/home" v-if="user">
            <md-icon>home</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>
        </md-list>

    <md-button class="md-primary md-raised md-dense" @click="logout" v-if="user">Logout</md-button>
  </div>
</template>

<script>
import Firebase from 'firebase'
import __bus__ from '../bus'

export default {
  name: 'sidebar',
  data () {
    return {
      user: Firebase.auth().currentUser
    }
  },
  mounted () {
    __bus__.$on('authUser', user => {
      this.user = user
    })
  },
  methods: {
    logout () {
      Firebase.auth().signOut().then(() => {
        this.user = null
        this.$router.replace('/')
      })
    }
  }
}
</script>
