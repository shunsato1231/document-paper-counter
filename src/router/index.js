import VueCookies from 'vue-cookies'
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Input from '@/pages/input'
import Result from '@/pages/result'
import Help from '@/pages/help'
import List from '@/pages/list'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'input',
      component: Input,
    },
    {
      path: '/input/:id',
      name: 'reinput',
      component: Input,
      meta: {
        update: true,
        requireAuth: true
      }
    },
    {
      path: '/result',
      name: 'result',
      component: Result,
    },
    {
      path: '/result/:id',
      name: 'result-update',
      component: Result,
      meta: {
        update: true,
        requireAuth: true
      }
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
    },
    {
      path: '/list',
      name: 'list',
      component: List,
      meta: {
        requireAuth: true
      }
    }
  ]
})

router.beforeResolve((to, from, next) => {
  let loggedIn = VueCookies.isKey('userInfo')

  if(to.meta.requireAuth && !loggedIn) {
    next({name: 'input'})
  } else if (to.meta.update && !from.meta.update) {
    store.dispatch('counter/getDocument', to.params.id)
      .then(() =>{
        store.dispatch('counter/countManuscriptText')
        next()
      }).catch(() => {
        next({name: 'input'})
      })
  } else if(to.name === 'result'){
    if (from.name !== 'input') {
      next({name: 'input'})
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
