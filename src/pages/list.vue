<template lang="pug">
  main
    .sort
      select(v-model="selected")
          option(v-for="option in sortOptions" v-bind:value="option.value") {{ option.text }}
      .order(@click="changeOeder" :class="order")
    template(v-for="document in orderdDocuments")
      article
        router-link(:to = "{name: 'result-update', params: {id: document.key}}", exact)
          h1 {{document.title}}
          footer
            span.date 作成日：{{document.created_at | formatDate}}
            span.date 編集日：{{document.updated_at | formatDate}}
            span.deadline(v-if="document.deadline") 締切日：{{document.deadline | formatDate}}
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
        {text: '締切日順', value: 'deadline'}
      ],
      order: 'desc'
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
    },
    changeOeder () {
      if(this.order === 'asc') {
        this.order = 'desc'
      } else if (this.order === 'desc') {
        this.order = 'asc'
      }
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
  .sort {
    display: table;
    margin-left: auto;
    margin-right: 22px;
    margin-bottom: 15px;
  }

  .order {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-bottom: 2px solid #9b9b90;
    border-left: 2px solid #9b9b90;
    &:hover {
      cursor: pointer;
    }
  }

  .desc {
    transform: rotateZ(-45deg) translateX(6px) translateY(2px);
  }
  .asc {
    transform: rotateZ(135deg) translateY(-6px);
  }

  select {
    cursor: pointer;
    text-indent: 0.01px;
    text-overflow: ellipsis;
    border: none;
    outline: none;
    background: #fafafa;
    background-image: none;
    box-shadow: none;
    -webkit-appearance: none;
    appearance: none;
    font-family: $gothic;
    color: #444;
    @include font-size(14);
    font-weight: bold;
    border-radius: 0;
    padding: 4px 8px;
    margin-right: 8px;
  }
  .selectWrapper select::-ms-expand {
      display: none;
  }

  @include small{
    span{
      display: block;
    }
  }
</style>
