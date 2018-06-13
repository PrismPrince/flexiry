import Vue from 'vue'
import Router from 'vue-router'
import Firebase from 'firebase'

import { __DB__ } from '../main'

// components
import NotFound from '@/components/pages/Not-Found'
import Login from '@/components/pages/Login'
import Home from '@/components/pages/Home'
import Admin from '@/components/pages/Admin'
import AdminTools from '@/components/pages/Admin/Tools'
import AdminQCRejection from '@/components/pages/Admin/QC-Rejection'
import Tools from '@/components/pages/Tools'
import QCRejection from '@/components/pages/QC-Rejection'
import Scripts from '@/components/pages/Tools/Scripts'
import WebTools from '@/components/pages/Tools/Web-Tools'

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
      path: '/admin',
      component: Admin,
      meta: {
        guard: 'auth:admin'
      },
      children: [
        {
          path: '',
          redirect: 'tools'
        },
        {
          path: 'tools',
          name: 'AdminTools',
          component: AdminTools
        },
        {
          path: 'qc-rejection',
          name: 'AdminQCRejection',
          component: AdminQCRejection
        }
      ]
    },
    {
      path: '/tools',
      component: Tools,
      children: [
        {
          path: '',
          redirect: 'scripts'
        },
        {
          path: 'scripts',
          name: 'Scripts',
          component: Scripts
        },
        {
          path: 'web',
          component: WebTools,
          children: [
            {
              path: ''
            },
            {
              path: 'csl'
            },
            {
              path: 'cu3'
            },
            {
              path: 'mpd'
            },
            {
              path: 'pdp'
            },
            {
              path: 'trello'
            }
          ]
        }
      ]
    },
    {
      path: '/qc-rejection',
      name: 'QCRejection',
      component: QCRejection
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
