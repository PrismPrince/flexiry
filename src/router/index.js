import Vue from 'vue'
import Router from 'vue-router'
import Firebase from 'firebase'

// components
import Welcome from '@/components/Welcome'
import NotFound from '@/components/Not-Found'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    }
  ]
})

router.beforeEach((to, from, next) => {
  let user = Firebase.auth().currentUser
  let hasGuard = to.matched.some(record => record.meta.guard)
  let guard = null

  if (hasGuard) guard = to.matched.meta.guard

  if (user && guard === 'auth') next()
  else if (user && guard === 'unauth') next('home')
  else next()
})

export default router
