import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import './plugins/vuetify'
import './plugins/vuefire'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
