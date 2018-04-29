// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

import firebase from './firebase-init'
import router from './router'

import App from './App'

Vue.use(VueFire)
Vue.use(VueMaterial)

Vue.config.productionTip = false

/* eslint-disable no-new */
let app

firebase.auth().onAuthStateChanged(auth => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    })
  }
})
