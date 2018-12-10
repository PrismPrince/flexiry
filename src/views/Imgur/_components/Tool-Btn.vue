<template>
  <v-tooltip bottom :disabled="active">
    <slot></slot>
    <v-btn slot="activator" fab flat small :outline="activeTool === tool" @click="emitTool" :disabled="active">
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
  </v-tooltip>
</template>

<script>
export default {
  name: 'tool-btn',
  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    activeTool: {
      type: String,
      required: true,
      default: ''
    },
    tool: {
      type: String,
      required: true,
      default: ''
    },
    icon: {
      type: String,
      required: true,
      default: ''
    }
  },
  methods: {
    emitTool () {
      this.$emit('click', this.activeTool !== this.tool ? this.tool : null)
    }
  }
}
</script>
