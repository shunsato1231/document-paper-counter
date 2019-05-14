import firebase from 'firebase/app'
import 'firebase/auth'
import store from '@/store'

// initialize Firebase
let config = {
  apiKey: process.env.VUE_APP_FIRE_BASE_apiKey,
  authDomain: process.env.VUE_APP_FIRE_BASE_authDomain,
  databaseURL: process.env.VUE_APP_FIRE_BASE_databaseURL,
  projectId: process.env.VUE_APP_FIRE_BASE_projectId,
  storageBucket: process.env.VUE_APP_FIRE_BASE_storageBucket,
  messagingSenderId: process.env.VUE_APP_FIRE_BASE_messagingSenderId,
  appId: process.env.VUE_APP_FIRE_BASE_appId
}

firebase.initializeApp(config)
var auth = firebase.auth()

// variable
var _userInfo = {}

export default {
  initFirebase () {
    auth.onAuthStateChanged(this.onAuthStateChanged.bind(this))
  },

  login () {
    var provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  },

  logout () {
    auth.signOut()
  },

  onAuthStateChanged (user) {
    if (user) {
      _userInfo = {
        loggedIn: true,
        uid: user.uid,
        name: user.displayName
      }
      store.dispatch('auth/onAuthStateChanged', Object.assign({}, _userInfo))
    } else {
      _userInfo = {
        loggedIn: false,
        uid: '',
        name: 'guest'
      }
      store.dispatch('auth/onAuthStateChanged', Object.assign({}, _userInfo))
    }
  }
}
