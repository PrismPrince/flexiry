<template>
  <div id="app">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <span class="md-title">My Title</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" class="md-scrollbar">
        <sidebar></sidebar>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'

export default {
  name: 'App',
  components: {
    Sidebar
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
</style>
