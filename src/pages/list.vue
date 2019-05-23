<template lang="pug">
  main
    select(v-model="selected")
      option(v-for="option in sortOptions" v-bind:value="option.value") {{ option.text }}
    div(@click="order = 'desc' ? 'asc' : 'desc' ") {{order}}
    template(v-for="document in orderdDocuments")
      router-link(:to = "{name: 'result-update', params: {id: document.key}}", exact)
        article
          h1 {{document.title}}
          footer
            span.date 作成日時：{{document.created_at | formatDate}}
            span.date 編集日時：{{document.updated_at | formatDate}}
            span.deadline(v-if="document.deadline") 締め切り：{{document.deadline | formatDate}}
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

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
  }
}
</script>

<style lang="scss" scoped>
  article {
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
</style>
