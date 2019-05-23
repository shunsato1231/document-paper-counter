import Vue from 'vue'
import Router from 'vue-router'
import Input from '@/pages/input'
import Result from '@/pages/result'
import Help from '@/pages/help'
import List from '@/pages/list'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'input',
      component: Input
    },
    {
      path: '/input/:id',
      name: 'reinput',
      component: Input
    },
    {
      path: '/result',
      name: 'result',
      component: Result
    },
    {
      path: '/result/:id',
      name: 'result-update',
      component: Result
    },
    {
      path: '/help',
      name: 'help',
      component: Help
    },
    {
      path: '/list',
      name: 'list',
      component: List
    }
  ]
})
