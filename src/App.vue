<template>
  <div id="app">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button btn-side-drawer" @click="sidenav = !sidenav">
          <md-icon>menu</md-icon>
        </md-button>

        <span class="md-title">My Title</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" class="md-scrollbar" :md-active.sync="sidenav">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list>
          <md-list-item to="/login" v-if="!user">
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Login</span>
          </md-list-item>

          <md-list-item to="/home" v-if="user">
            <md-icon>delete</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">Spam</span>
          </md-list-item>
        </md-list>

        <md-button class="md-primary md-raised" @click="logout" v-if="user">Logout</md-button>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Firebase from 'firebase'

export default {
  name: 'App',
  data () {
    return {
      sidenav: false,
      user: Firebase.auth().currentUser
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-app-drawer {
    height: 100vh;
    width: 250px;
  }

  .md-app /deep/ .md-app-container {
    height: 100vh;
  }

  @media (min-width: 601px) {
    .btn-side-drawer {
      display: none;
    }
  }
</style>
