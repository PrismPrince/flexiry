<template>
  <md-card class="md-accent note-card">
    <md-card-header>
      <md-card-header-text>
        <div class="md-title"><md-icon>error</md-icon> Error!</div>
      </md-card-header-text>
      <md-button class="md-icon-button btn-close" @click="$emit('close')">
        <md-icon>close</md-icon>
      </md-button>
    </md-card-header>
    <md-card-content>{{ message }}</md-card-content>
  </md-card>
</template>

<script>

export default {
  name: 'note-card',
  props: {
    message: {
      type: String,
      required: true,
      deafault: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .note-card {
    margin: 0 0 20px 0;

    .md-icon {
      color: #fff;
    }
  }
</style>
