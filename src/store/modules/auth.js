import Firebase from './../../api/firebase'

export default {
  namespaced: true,
  state: {
    user: {
      loggedIn: false,
      uid: '',
      name: ''
    }
  },

  getters: {
    userData: state => state.user,
    stateLoggedIn: state => state.user.loggedIn
  },

  mutations: {
    onAuthStateChanged (state, { user }) {
      state.user = user
    },

    setUser (state, { key, val }) {
      Vue.set(state.user, key, val)
    }
  },

  actions: {
    onAuthStateChanged ({ commit }, user) {
      commit('onAuthStateChanged', { user })
    },

    login ({ commit }) {
      Firebase.login()
    },

    logout ({ commit }) {
      Firebase.logout()
    }
  }
}
