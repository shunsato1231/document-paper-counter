<template lang="pug">
  main
    select(v-model="selected")
      option(v-for="option in sortOptions" v-bind:value="option.value") {{ option.text }}
    div(@click="order = 'desc' ? 'asc' : 'desc' ") {{order}}
    template(v-for="document in orderdDocuments")
      article
        router-link(:to = "{name: 'result-update', params: {id: document.key}}", exact)
          h1 {{document.title}}
          footer
            span.date 作成日時：{{document.created_at | formatDate}}
            span.date 編集日時：{{document.updated_at | formatDate}}
            span.deadline(v-if="document.deadline") 締め切り：{{document.deadline | formatDate}}
        .delete
          button(@click="clickDocument(document);doDelete();")
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Dialog from '@/components/dialog.vue'
import Vue from 'vue'

export default {
  name: 'List',
  data () {
    return {
      verticalLength: 20,
      horizontalLength: 20,
      selected: 'updated_at',
      sortOptions: [
        {text: '編集日順', value: 'updated_at'},
        {text: '作成日順', value: 'created_at'},
        {text: '締め切り順', value: 'deadline'}
      ],
      order: 'as'
    }
  },
  computed: {
    ...mapGetters('list', ['list']),
    data () {
      return {
        document: {}
      }
    },
    orderdDocuments () {
      return _
        .chain(this.list)
        .forEach((value, key) => {
          value.key = key
          return value
        })
        .orderBy(this.selected, this.order)
        .value()
    }
  },
  methods: {
    doDelete () {
      let dialog = Vue.extend(Dialog)
      let dialogInstance = new dialog({
        propsData: {
          text: this.document.title + 'を削除しますか'
        }
      }).$on('test', this.delete).$mount()

       this.$el.appendChild(dialogInstance.$el)
    },
    delete () {
      this.$store.dispatch('list/deleteDocument', this.document.key)
        .then(() => {
          this.$toasted.show(this.document.title + 'を削除しました', {duration : 1500})
        })
    },
    clickDocument(document) {
      this.document = document
    }
  }
}
</script>

<style lang="scss" scoped>
  article {
    position: relative;
    transition-duration: 500ms;
    padding: 5px 0;
    border-bottom: solid #e0e0d7 1px;

    &:hover{
      background: #e0e0d7;
    }
  }

  a:hover{
    text-decoration: none;
  }

  h1 {
    @include font-size(16);
  }

  span{
    margin-right: 10px;
    @include font-size(12);
    color: #888;
  }

  .delete {
    position:absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 50px;

    button{
      background: none;
      border: none;
      outline: none;
      position: relative;
      height: 100%;
      width: 100%;
      &:before {
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        content: '';
        width: 20px;
        height: 2px;
        background: #e0e0d7;
        transform: translateX(-10px) rotate(-45deg);
      }

      &:after {
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        content: '';
        width: 20px;
        height: 2px;
        background: #e0e0d7;
        transform: translateX(-10px) rotate(45deg);
      }

      &:hover {
        &:before {
          background: #333;
        }
        &:after {
          background: #333;
        }
      }
    }
  }
</style>
