<template>
  <v-dialog v-model="dialog" width="1000">
    <v-card>
      <v-card-title class="headline teal white--text" primary-title>Uploaded to Imgur</v-card-title>
      <v-card-text>
        <v-layout justify-space-between row fill-height>
          <v-flex sm8>
            <v-img v-if="link !== ''" :src="link" :lazy-src="img" class="grey lighten-2" :height="'auto'" :width="'100%'" max-height="500" contain>
              <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                <v-progress-circular indeterminate color="teal lighten-2"></v-progress-circular>
              </v-layout>
            </v-img>
          </v-flex>
          <v-flex class="ml-3" sm4>
            <v-text-field id="img-view-link" v-model="link" color="teal" label="Image view link" readonly>
              <v-tooltip slot="append" top>
                <v-btn slot="activator" @click="copyImageViewLink" color="teal" flat small icon>
                  <v-icon size="20">file_copy</v-icon>
                </v-btn>
                <span>Copy</span>
              </v-tooltip>
              <v-tooltip slot="append-outer" top>
                <v-btn slot="activator" @click="openImageViewLink" color="teal" flat small icon>
                  <v-icon size="20">launch</v-icon>
                </v-btn>
                <span>Open New Tab</span>
              </v-tooltip>
            </v-text-field>
            <v-text-field id="img-delete-link" v-model="deleteLink" color="teal" label="Image delete link" readonly>
              <v-tooltip slot="append" top>
                <v-btn slot="activator" @click="copyImageDeleteLink" color="teal" flat small icon>
                  <v-icon size="20">file_copy</v-icon>
                </v-btn>
                <span>Copy</span>
              </v-tooltip>
              <v-tooltip slot="append-outer" top>
                <v-btn slot="activator" @click="openImageDeleteLink" color="teal" flat small icon>
                  <v-icon size="20">launch</v-icon>
                </v-btn>
                <span>Open New Tab</span>
              </v-tooltip>
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'upload-dialog',
  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    img: {
      type: String,
      required: true,
      default: ''
    },
    link: {
      type: String,
      required: true,
      default: ''
    },
    deleteLink: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  watch: {
    active (val) {
      this.dialog = val
    }
  },
  methods: {
    copyImageViewLink () {
      document.getElementById('img-view-link').select()
      document.execCommand('copy')
    },
    copyImageDeleteLink () {
      document.getElementById('img-delete-link').select()
      document.execCommand('copy')
    },
    openImageViewLink () {
      window.open(this.link, '_blank')
    },
    openImageDeleteLink () {
      window.open(this.deleteLink, '_blank')
    }
  }
}
</script>
