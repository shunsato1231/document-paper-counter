<template lang="pug">
  main
    router-link(:to = "{name: 'input'}", exact)
      article
        h1 タイトル
        footer
          span.date 編集日時：2019.05.18
          span.deadline 締め切り：2019.06.10
    router-link(:to = "{name: 'input'}", exact)
      article
        h1 タイトル
        footer
          span.date 編集日時：2019.05.18
          span.deadline 締め切り：2019.06.10
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      verticalLength: 20,
      horizontalLength: 20
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
