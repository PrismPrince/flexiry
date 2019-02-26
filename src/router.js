import Vue from 'vue'
import Router from 'vue-router'
import Firebase from './services/firebase'

import Welcome from './views/Welcome'
import Bookmarks from './views/Bookmarks'
import FileAudit from './views/File-Audit'
import FontSwaps from './views/Font-Swaps'
import Imgur from './views/Imgur'

const database = Firebase.firestore()

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
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
    // {
    //   path: '/admin',
    //   name: 'Admin',
    //   component: Admin,
    //   // meta: {
    //   //   guard: 'auth:admin'
    //   // },
    //   children: [
    //     {
    //       path: 'bookmarks/:type?',
    //       name: 'AdminBookmarks',
    //       component: AdminBookmarks
    //     }
    // //     {
    // //       path: 'qc-rejection',
    // //       name: 'AdminQCRejection',
    // //       component: AdminQCRejection
    // //     }
    //   ]
    // },
    {
      path: '/bookmarks/:type?',
      name: 'Bookmarks',
      component: Bookmarks
    },
    {
      path: '/font-swaps',
      name: 'FontSwaps',
      component: FontSwaps
    },
    {
      path: '/file-audit',
      name: 'FileAudit',
      component: FileAudit
    },
    {
      path: '/imgur',
      name: 'Imgur',
      component: Imgur
    }
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
