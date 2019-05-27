<template lang=pug>
  #app
    head-menu
    router-view
</template>

<script>
import HeadMenu from '@/components/head-menu.vue'

export default {
  name: 'App',
  components: { HeadMenu }
}
</script>

<style lang="scss">
@import "./assets/scss/reset";
main{
  margin: 20px auto;
  width: 90%;
}
</style>
