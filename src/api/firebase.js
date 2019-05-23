import VueCookies from 'vue-cookies'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
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
const auth = firebase.auth()
const database = firebase.firestore()

// variable
var _userInfo = {}
var _documents = []

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
      VueCookies.set('userInfo', _userInfo)
      store.dispatch('auth/onAuthStateChanged', Object.assign({}, _userInfo))
      store.dispatch('list/getList')
    } else {
      _userInfo = {
        loggedIn: false,
        uid: '',
        name: 'guest'
      }
      VueCookies.remove('userInfo')
      store.dispatch('auth/onAuthStateChanged', Object.assign({}, _userInfo))
      store.dispatch('list/clearList')
    }
  },

  getDocuments () {
    return new Promise((resolve, reject) => {
      const uid = VueCookies.get('userInfo').uid
      database.collection('users').doc(uid).collection('documents').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            _documents[doc.id] = doc.data()
          })
          resolve(Object.assign({}, _documents))
        }).catch(reject)
    })
  },
  getDocument (id) {
    return new Promise((resolve, reject) => {
      const uid = VueCookies.get('userInfo').uid
      database.collection('users').doc(uid).collection('documents').doc(id).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            _documents[doc.id] = doc.data()
          })
          resolve(Object.assign({}, _documents))
        }).catch(reject)
    })
  },
  saveDocument (document) {
    return new Promise((resolve, reject) => {
      const uid = VueCookies.get('userInfo').uid
      database.collection('users').doc(uid).collection('documents')
        .add(document)
        .then((ref) =>  {
          resolve(ref)
        }).catch(reject)
    })
  }
}
