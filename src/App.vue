<template>
  <div id="app">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button btn-side-drawer" @click="sidebar = !sidebar">
          <md-icon>menu</md-icon>
        </md-button>

        <span class="md-title">My Title</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" class="md-scrollbar" :md-active.sync="sidebar">
        <sidebar></sidebar>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Sidebar from '@/components/helpers/Sidebar'

export default {
  name: 'App',
  components: {
    Sidebar
  },
  data () {
    return {
      sidebar: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-app /deep/ .md-app-container {
    height: 100vh;
  }

  .md-app-drawer {
    height: 100vh;
    width: 250px;
  }

  @media (min-width: 601px) {
    .btn-side-drawer {
      display: none;
    }
  }
</style>
