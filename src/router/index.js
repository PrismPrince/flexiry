import Vue from 'vue'
import Router from 'vue-router'
import Firebase from 'firebase'

import { __DB__ } from '../main'

// components
import NotFound from '@/components/Not-Found'
import Login from '@/components/Login'
import Home from '@/components/Home'
import QCRejection from '@/components/QC-Rejection'
import QCRejectionAdmin from '@/components/QC-Rejection-Admin'

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
      component: QCRejection,
      meta: {
        guard: 'auth'
      }
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
  let userRole = user ? __DB__.collection('users').doc(user.id).role : null
  let guard = to.matched[0].meta.guard || null

  if (guard === 'auth:admin' && user && userRole === 'admin') next()
  else if (guard === 'auth:admin' && user && userRole !== 'admin') next('home')
  else if (guard === 'auth' && user) next()
  else if (guard === 'auth' && !user) next('login')
  else if (guard === 'guest' && !user) next()
  else if (guard === 'guest' && user) next('home')
  else next()
})

export default router
