import Firebase from './../../api/firebase'
import _ from 'lodash'

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
    },
    deleteDocument(state, id) {
      state.list = Object.assign({}, _.omit(state.list, id))
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
    },
    deleteDocument({ commit }, id) {
      Firebase.deleteDocument(id)
        .then(() => {
          commit('deleteDocument', id)
        })
    }
  }
}
