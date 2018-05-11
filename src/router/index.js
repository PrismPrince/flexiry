import Vue from 'vue'
import Router from 'vue-router'
import Firebase from 'firebase'

// components
import NotFound from '@/components/Not-Found'
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
      path: '/qc-rejection',
      name: 'QCRejection',
      component: QCRejection
    },
    {
      path: '/qc-rejection/admin',
      name: 'QCRejectionAdmin',
      component: QCRejectionAdmin
    }
    // {
    //   path: 'custom',
    //   name: 'QCRejectionCustom',
    //   component: QCRejectionCustom
    // }
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
