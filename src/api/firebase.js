import VueCookies from 'vue-cookies'
import axios from 'axios'
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
      this.getNotinotificationKey()
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
  getNotinotificationKey () {
    const userId = VueCookies.get('userInfo').uid
    const url = process.env.VUE_APP_API_URL_BASE + "/fcm/notification?notification_key_name=" + userId
    let headers = {
      'Content-Type':'application/json',
      'Authorization': 'key=' + process.env.VUE_APP_FIRE_BASE_serverKey,
      'project_id': process.env.VUE_APP_FIRE_BASE_messagingSenderId
    }
    return new Promise((resolve, reject) => {
      axios.get(url, {headers: headers, data: {}})
        .then(res => {
          console.log(res.data)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
    })
  },
  createTokenGroup (token) {
    return new Promise((resolve, reject) => {
      const userId = VueCookies.get('userInfo').uid
      const url = process.env.VUE_APP_API_URL_BASE + "/fcm/notification"

      let data = {
        "operation": "create",
        "notification_key_name": userId,
        "registration_ids": [token]
      }

      let headers = {
        'Authorization': 'key=' + process.env.VUE_APP_FIRE_BASE_serverKey,
        'project_id': process.env.VUE_APP_FIRE_BASE_messagingSenderId
      }

      axios.post(url, data, {headers: headers, useCredentails: true})
        .then(res => {
          console.log(res.data)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
    })
  },
  addTokenGroup (token, key) {
    return new Promise((resolve, reject) => {
      const userId = VueCookies.get('userInfo').uid
      const url = process.env.VUE_APP_API_URL_BASE + "/fcm/notification"

      let data = {
        "operation": "add",
        "notification_key_name": userId,
        "notification_key": key,
        "registration_ids": [token]
      }

      let headers = {
        'Authorization': 'key=' + process.env.VUE_APP_FIRE_BASE_serverKey,
        'project_id': process.env.VUE_APP_FIRE_BASE_messagingSenderId
      }

      axios.post(url, data, {headers: headers, useCredentails: true})
        .then(res => {
          console.log(res.data)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
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
