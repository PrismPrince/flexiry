// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import Firebase from 'firebase/app'
import VueMaterial from 'vue-material'
import 'normalize.css/normalize.css'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'firebase/firestore'

import router from './router'
import config from '../firebase-config.json'

import App from './App'

Vue.use(VueFire)
Vue.use(VueMaterial)

Firebase.initializeApp(config)

export const __DB__ = Firebase.firestore()

__DB__.settings({timestampsInSnapshots: true})

Vue.config.productionTip = false

/* eslint-disable no-new */
let app

Firebase.auth().onAuthStateChanged(auth => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    })
  }
})
