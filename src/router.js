import Vue from 'vue'
import Router from 'vue-router'
import Firebase from './services/firebase'

import Welcome from './views/Welcome'
import Admin from './views/admin'
import AdminToolsWeb from './views/admin/tools/Web'
import Tools from './views/tools'
import ToolsWeb from './views/tools/Web'
// import ToolsWebAll from './views/tools/web/All'
// import ToolsWebCSL from './views/tools/web/CSL'

const database = Firebase.firestore()

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/'
      // name: 'NotFound',
      // component: NotFound
    },
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/login',
      redirect: '/'
      // name: 'Login',
      // component: Login,
      // meta: {
      //   guard: 'guest'
      // }
    },
    // {
    //   path: '/home',
    //   name: 'Home',
    //   component: Home,
    //   meta: {
    //     guard: 'auth'
    //   }
    // },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      // meta: {
      //   guard: 'auth:admin'
      // },
      children: [
    //     {
    //       path: '',
    //       redirect: 'tools'
    //     },
        {
          path: 'tools',
          redirect: 'tools/web'
        },
        {
          path: 'tools/web/:type?',
          name: 'AdminToolsWeb',
          component: AdminToolsWeb
        },
    //     {
    //       path: 'qc-rejection',
    //       name: 'AdminQCRejection',
    //       component: AdminQCRejection
    //     }
      ]
    },
    {
      path: '/tools',
      component: Tools,
      children: [
        {
          path: '',
          redirect: 'web'
        },
    //     {
    //       path: 'scripts',
    //       name: 'Scripts',
    //       component: Scripts
    //     },
        {
          path: 'web/:type?',
          name: 'ToolsWeb',
          component: ToolsWeb
        }
      ]
    },
    // {
    //   path: '/qc-rejection',
    //   name: 'QCRejection',
    //   component: QCRejection
    // }
  ]
})

router.beforeEach((to, from, next) => {
  let user = Firebase.auth().currentUser || null
  let role = null
  let guard = to.matched[0].meta.guard || null

  if (user) {
    database.collection('users').doc(user.uid).get().then(snap => {
      if (snap.exists) role = snap.data().role
    }).catch(error => {
      console.error(error)
    }).finally(() => {
      if (guard === 'auth:admin' && role === 'admin') next()
      else if (guard === 'auth:admin' && role !== 'admin') next('home') // 403
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
