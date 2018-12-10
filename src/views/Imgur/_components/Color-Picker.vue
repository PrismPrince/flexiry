<template>
  <v-menu v-model="baseColorMenu" :transition="offsetY ? 'slide-y-transition' : 'slide-x-reverse-transition'" :disabled="disabled" :min-width="minWidth" :nudge-left="nudgeLeft" :nudge-bottom="nudgeBottom" :offset-x="offsetX" :offset-y="offsetY">
    <slot name="activator" slot="activator"></slot>
    <v-list dense style="max-height: 528px;">
      <v-menu v-for="(color, key) in colors" :key="color.text" transition="slide-x-transition" offset-x left open-on-hover full-width>
        <v-list-tile slot="activator" :class="color.text === 'shades' ? 'white' : color.text" @click="select(color.hex !== null ? color.hex : '#ffffff')" style="width: 100%">
          <v-list-tile-title>{{ color.color }}</v-list-tile-title>
          <v-list-tile-action class="justify-end">
            <v-list-tile-action-text class="white--text">{{ color.hex }}</v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>

        <v-list dense>
          <v-list-tile v-for="(alt, i) in color.alt" :key="alt.text" :class="alt.text" @click="select(alt.hex)">
            <v-list-tile-title :class="alt.text.match(/(darken)|(black)/) ? 'white--text' : ''">{{ alt.color }}</v-list-tile-title>
            <v-list-tile-action class="justify-end">
              <v-list-tile-action-text :class="alt.text.match(/(darken)|(black)/) ? 'white--text' : 'black--text'">{{ alt.hex !== 'transparent' ? alt.hex : '' }}</v-list-tile-action-text>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-list>
  </v-menu>
</template>

<script>
import colors from '../_utils/colors'

export default {
  name: 'color-picker',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    minWidth: {
      type: [String, Number],
      default: undefined
    },
    nudgeLeft: {
      type: [String, Number],
      default: 0
    },
    nudgeBottom: {
      type: [String, Number],
      default: 0
    },
    offsetX: {
      type: Boolean,
      default: false
    },
    offsetY: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      colors,
      baseColorMenu: false
    }
  },
  methods: {
    select (hex) {
      this.$emit('select', hex)
      this.baseColorMenu = false
    }
  }
}
</script>
