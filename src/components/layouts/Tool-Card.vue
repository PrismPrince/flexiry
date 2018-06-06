<template>
  <div class="tool-card md-layout-item md-xlarge-size-20 md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
    <md-card md-with-hover>
      <md-ripple>
        <md-card-header>
          <div class="md-title">{{ title }}</div>
          <div class="md-subhead">{{ version | versionize }}</div>
        </md-card-header>

        <md-card-expand v-if="description">
          <md-card-actions md-alignment="space-between">
            <md-button class="md-dense md-primary" :href="'javascript:' + code" @click.stop.prevent>{{ title }}</md-button>
            <md-card-expand-trigger>
              <md-button class="md-icon-button">
                <md-icon>keyboard_arrow_down</md-icon>
              </md-button>
            </md-card-expand-trigger>
          </md-card-actions>

          <md-card-expand-content>
            <md-card-content>
              <marked :plain-text="description" :open-link-new-tab="true"></marked>
            </md-card-content>
          </md-card-expand-content>
        </md-card-expand>

        <md-card-actions class="prevent-ripple-effect" v-else md-alignment="left">
          <md-button class="md-dense md-primary" :href="'javascript:' + code" @click.stop.prevent>{{ title }}</md-button>
        </md-card-actions>
      </md-ripple>
    </md-card>
  </div>
</template>

<script>
import Marked from '@/components/layouts/Marked'

export default {
  name: 'tool-card',
  components: {
    Marked
  },
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    version: {
      type: Array,
      required: true,
      default () {
        return [0, 0, 0]
      }
    },
    code: {
      type: String,
      required: true,
      default: ''
    },
    description: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      auth: null,
      preventExpandDisplay: true // submitted as an issue, remove when fixed (https://github.com/vuematerial/vue-material/issues/1790)
    }
  },
  filters: {
    versionize ([major = 0, minor = 0, patch = 0, pre = '']) {
      return `v${major}.${minor}.${patch}${pre}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-card {
    margin-bottom: 16px;
  }

  // submitted as an issue, remove when fixed (https://github.com/vuematerial/vue-material/issues/1790)
  .tool-card .prevent-ripple-effect {
    padding: 8px;
  }

  // submitted as an issue, remove when fixed (https://github.com/vuematerial/vue-material/issues/1790)
  // .prevent-expand-display {
  //   margin-top: calc(-100% + 16px) !important;
  // }
</style>
