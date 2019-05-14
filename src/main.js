// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Firebase from './api/firebase'


Vue.config.productionTip = false
Firebase.initFirebase()

console.log(process.env.VUE_APP_SITE_TITLE)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
