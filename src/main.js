import Vue from 'vue'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Firebase from './api/firebase'
import moment from 'moment'


Vue.config.productionTip = false
Firebase.initFirebase()

Vue.use(VueCookies)

// set default config
VueCookies.config('7d')

// set global cookie
VueCookies.set('theme','default');
VueCookies.set('hover-time','1s');

//filter
Vue.filter('formatDate', function (value) {
  return moment(value).format('YYYY.MM.DD hh:mm')
})

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

global._App = app
