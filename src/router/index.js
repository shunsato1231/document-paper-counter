import Vue from 'vue'
import Router from 'vue-router'
import Input from '@/components/Input'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Input',
      component: Input
    }
  ]
})
