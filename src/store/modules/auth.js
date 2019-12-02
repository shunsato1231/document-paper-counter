import Vue from 'vue'
import Firebase from './../../api/firebase'

export default {
  namespaced: true,
  state: {
    user: {
      loggedIn: false,
      uid: '',
      name: ''
    },
    messagingIsSupported: '',
  },

  getters: {
    userData: state => state.user,
    stateLoggedIn: state => state.user.loggedIn,
    messagingIsSupported: state => state.messagingIsSupported,
  },

  mutations: {
    onAuthStateChanged (state, { user }) {
      state.user = user
    },

    setUser (state, { key, val }) {
      Vue.set(state.user, key, val)
    },

    setMessagingIsSupported(state, isSupported) {
      state.messagingIsSupported = isSupported
    },
  },

  actions: {
    onAuthStateChanged ({ commit }, user) {
      commit('onAuthStateChanged', { user })
    },

    checkMessagingisSupported ({ commit }, isSupported) {
      commit('setMessagingIsSupported', isSupported)
    },

    login () {
      Firebase.login()
    },

    logout () {
      Firebase.logout()
    }
  }
}
