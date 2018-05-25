import Vue from 'vue'
import Router from 'vue-router'
import Firebase from 'firebase'

import { __DB__ } from '../main'

// components
import NotFound from '@/components/pages/Not-Found'
import Login from '@/components/pages/Login'
import Home from '@/components/pages/Home'
import QCRejection from '@/components/pages/QC-Rejection'
import QCRejectionAdmin from '@/components/pages/QC-Rejection-Admin'

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
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        guard: 'guest'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        guard: 'auth'
      }
    },
    {
      path: '/qc-rejection',
      name: 'QCRejection',
      component: QCRejection
    },
    {
      path: '/qc-rejection/admin',
      name: 'QCRejectionAdmin',
      component: QCRejectionAdmin,
      meta: {
        guard: 'auth:admin'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let user = Firebase.auth().currentUser || null
  let role = null
  let guard = to.matched[0].meta.guard || null

  if (user) {
    __DB__.collection('users').doc(user.uid).get().then(snap => {
      if (snap.exists) role = snap.data().role
      else role = null
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      if (guard === 'auth:admin' && role === 'admin') next()
      else if (guard === 'auth:admin' && role !== 'admin') next('home')
      else if (guard === 'auth') next()
      else if (guard === 'guest') next('home')
      else next()
    })
  } else {
    if (guard === 'auth:admin') next('login')
    else if (guard === 'auth') next('login')
    else if (guard === 'guest') next()
    else next()
  }
})

export default router
