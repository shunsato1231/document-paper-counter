import Vue from 'vue'
import Router from 'vue-router'
import Input from '@/pages/input'
import Result from '@/pages/result'
import Help from '@/pages/help'
import List from '@/pages/list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'input',
      component: Input
    },
    {
      path: '/result',
      name: 'result',
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
