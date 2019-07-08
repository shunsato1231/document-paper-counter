<template lang="pug">
  section
    h1 このアプリについて
    ul
      li 入力した文章が原稿用紙に収まるかどうかを、実際にマス目に納めてカウントします。
      li ログインするとカウントした結果を保存することができます。
      li 締切日を設定すると締め切り前日と当日に通知が届きます。(8:00と17:00に通知)
</template>

<script>
export default {
  name: 'Help',
  data () {
    return {
      verticalLength: 20,
      horizontalLength: 20
    }
  }
}
</script>

<style lang="scss" scoped>
  section {
    padding: 20px 5%;
  }

  h1 {
    @include font-size(18);
    font-weight: bold;
  }

  ul {
    margin: 10px 5px;
    li {
      @include font-size(14);
      line-height: 2;
      list-style: disc inside;
    }
  }
</style>
