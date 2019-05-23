import Firebase from './../../api/firebase'

export default {
  namespaced: true,
  state: {
    list: {}
  },

  getters: {
    list: state => state.list,
  },

  mutations: {
    setList(state, { list }) {
      state.list = list
    },
    clearList(state) {
      state.list = {}
    }
  },

  actions: {
    getList({ commit }) {
      Firebase.getDocuments()
        .then(list => {
          commit('setList',{ list } )
        })
    },
    clearList({ commit }) {
      commit('clearList')
    }
  }
}
