<template lang="pug">
  header
    .toggle(v-if="smallLayout" @click="menuToggle = !menuToggle" :class="{active:menuToggle}")
      .toggle__line
      .toggle__line
      .toggle__line
    h1
      router-link(:to = "{name: 'input'}", exact) 原稿用紙カウンター
    nav(:class="{active:menuToggle}")
      ul
        li
          router-link(:to = "{name: 'input'}", exact, @click.native="menuToggle = !menuToggle") 入力する
        li(v-if="stateLoggedIn")
          router-link(:to = "{name: 'list'}", exact, @click.native="menuToggle = !menuToggle") 保存した原稿一覧
        li
          router-link(:to = "{name: 'help'}", exact, @click.native="menuToggle = !menuToggle") このアプリについて
        li(v-if="!stateLoggedIn")
          a(@click='login(); menuToggle = !menuToggle') ログイン
        li(v-if="stateLoggedIn")
          a(@click="logout(); menuToggle = !menuToggle; toTop()") ログアウト
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'HeadMenu',
  data: function () {
    return {
      smallLayout: false,
      menuToggle: false
    }
  },
  computed: mapGetters('auth', ['stateLoggedIn']),
  methods: {
    ...mapActions('auth', ['login', 'logout']),
    toTop() {
      this.$router.push({name: 'input'}).catch(err => {})
    },
    handleResize () {
      if (window.innerWidth < 481) {
        this.smallLayout = true
      } else {
        this.smallLayout = false
        this.menuToggle = false
      }
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
    if (window.innerWidth < 481) {
      this.smallLayout = true
    } else {
      this.smallLayout = false
      this.menuToggle = false
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss" scoped>
header{
  display: flex;
  height: 80px;
  line-height: 80px;
  padding: 0 5%;
}

h1{
  @include font-size(30);
  color: #000;
  font-family: $mintyo;
  a:hover{
    text-decoration: none;
  }
}
nav{
  margin: 0 50px;
  @include font-size(14);
  transition-duration: 700ms;
}

ul{
  display: flex;
}

li{
  margin-right: 20px;
  position: relative;
  &:last-child{
    margin: 0;
  }
  a{
    padding: 2px 5px;
    font-weight: normal;
    &:hover{
      background-color: #444;
      color: #f2f2e9;
      text-decoration: none;
    }
  }
  .router-link-active{
    background-color: #444;
    color: #f2f2e9;
    text-decoration: none;
  }
}

@include less_than_medium{
  header{
    display: block;
    line-height: 45px;
    margin-bottom: 20px;
  }

  h1{
    @include font-size(25);
    width: 100%;
    text-align: center;
  }

  nav{
    display: table;
    margin: 0 auto;
    @include font-size(13);
  }

  li{
    margin-right: 10px;
  }
}

@include small{
  header{
    height: 50px;
    margin-bottom: 0;
  }

  h1{
    line-height: 50px;
    @include font-size(22);
    text-align: start;
  }

  .toggle{
    position: absolute;
    top: 15px;
    right: 5%;
    width: 25px;
    height: 15px;
    z-index: 1001;
    .toggle__line {
      transition-duration: 500ms;
      width: 25px;
      height: 3px;
      left: 0;
      position: absolute;
      margin-bottom: 5px;
      background-color: #444;
    }

    .toggle__line:nth-child(2) {
      top: 7px;
    }

    .toggle__line:nth-child(3) {
      top: 14px;
    }
  }

  .active {
    .toggle__line {
      background: #fff;
    }

    .toggle__line:nth-child(1) {
      transform: translateY(7px) rotate(-45deg);
    }

    .toggle__line:nth-child(2) {
      opacity: 0;
    }

    .toggle__line:nth-child(3) {
      transform: translateY(-7px) rotate(45deg);
    }
  }

  nav{
    display: none;
  }

  nav.active{
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:  rgba(0, 0, 0, 0.7);
    z-index: 1000;
  }

  ul{
    display: block;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  li{
    text-align: center;
    line-height: 50px;
    @include font-size(15);
    a {
      color: #fff;
      padding: 5px 10px;
      &:hover {
        background: #fff;
        color: #444;
      }
    }
    .router-link-active{
      background-color: #fff;
      color: #444;
      text-decoration: none;
    }
  }
}
</style>
