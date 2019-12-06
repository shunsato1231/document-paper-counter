<template lang=pug>
  #app
    head-menu
    router-view
</template>

<script>
import HeadMenu from '@/components/head-menu.vue'

export default {
  name: 'App',
  components: { HeadMenu },
  mounted () {
    window.addEventListener("touchstart", this.mobileNoScroll, { passive: false })
  },
  destroyed () {
    window.addEventListener("touchstart", this.mobileNoScroll, { passive: false })
  },
  methods: {
    mobileNoScroll: function(event) {
      if (event.touches.length >= 2) {
        event.preventDefault();
      }
    }
  }
}
</script>

<style lang="scss">
@import "./assets/scss/reset";
main{
  margin: 20px auto;
  width: 90%;
}
</style>
