import VueCookies from 'vue-cookies'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/messaging'
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
const messaging = firebase.messaging();


// variable
var _userInfo = {}
var _documents = []

export default {
  initFirebase () {
    auth.onAuthStateChanged(this.onAuthStateChanged.bind(this))

    messaging.usePublicVapidKey(process.env.VUE_APP_FIRE_BASE_publicVapidKey)
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
  permittionNotification () {
    return new Promise((resolve, reject) => {
      // 通知の受信許可
      messaging.requestPermission().then(() => {
        // トークン取得
        messaging.getToken().then((token) => {
          resolve(token)
        })
      }).catch(reject)
    })
  },
  tokenDuplicationCheck (token) {
    return new Promise((resolve, reject) => {
      const userId = VueCookies.get('userInfo').uid
      let tokens
      let duplication = false
      // トークン重複チェック
      database.collection('users').doc(userId).get()
        .then((doc) => {
          tokens = doc.data().token
          if(doc.data().token) duplication = tokens.some(val => val == token)

          if(duplication) {
            resolve()
          } else {
            if (tokens === undefined) {
              tokens = [token]
            } else {
              tokens.push(token)
            }
            resolve(tokens)
          }
        }).catch(reject)
    })
  },
  addToken (tokens) {
    return new Promise((resolve, reject) => {
      const userId = VueCookies.get('userInfo').uid
      database.collection('users').doc(userId).set({
        token: tokens
      })
        .then(() => {
          resolve()
        }).catch(reject)
    })
  },
  registrationToken () {
    return new Promise((resolve, reject) => {
      this.permittionNotification()
        .then(token => {
          return this.tokenDuplicationCheck(token)
        }).then(token => {
          if(!token) resolve()
          return this.addToken(token)
        }).then(() => {
          resolve()
        }).catch(reject)
    })
  },
  getDocuments () {
    return new Promise((resolve, reject) => {
      const userId = VueCookies.get('userInfo').uid
      database.collection('users').doc(userId).collection('documents').get()
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
      const userId = VueCookies.get('userInfo').uid
      database.collection('users').doc(userId).collection('documents').doc(id).get()
        .then((snapshot) => {
          resolve(Object.assign({}, snapshot.data()))
        }).catch(reject)
    })
  },
  saveDocument (document) {
    return new Promise((resolve, reject) => {
      const userId = VueCookies.get('userInfo').uid
      database.collection('users').doc(userId).collection('documents')
        .add(document)
        .then((ref) =>  {
          resolve(ref)
        }).catch(reject)
    })
  },
  updateDocument (document, id) {
    return new Promise((resolve, reject) => {
      const userId = VueCookies.get('userInfo').uid
      database.collection('users').doc(userId).collection('documents').doc(id)
        .set(document)
        .then((ref) =>  {
          resolve(ref)
        }).catch(reject)
    })
  },
  deleteDocument (id) {
    return new Promise((resolve, reject) => {
      const userId = VueCookies.get('userInfo').uid
      database.collection('users').doc(userId).collection('documents').doc(id).delete()
        .then(() => {
          resolve()
        }).catch(reject)
    })
  }
}
