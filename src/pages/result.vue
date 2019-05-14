<template lang="pug">
  main
    .wrapper
      .script(:style='styles', :class="(direction === 'h') ? 'h' : 'v'")
        .line(v-for='line in countedScript', :class="(direction === 'h') ? 'h' : 'v'")
          .square(:style='styles', :class="{ excess: row.excess }", v-for='row in line' ) {{row.text}}
    .editor
      button.reinput  入力し直す
      span aaaa
      button.save 保存する　
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Result',
  computed: {
    styles () {
      return {
        '--squareSize': this.squareSize,
        '--scriptWidht': this.scriptWidht,
        '--scriptHeight': this.scriptHeight
      }
    },
    ...mapGetters('counter', ['countedScript', 'direction', 'verticalLength', 'horizontalLength'])
  },
  data () {
    return {
      squareSize: 30,
      scriptWidht: 0,
      scriptHeight: 0
    }
  },
  beforeCreate () {
    this.$store.dispatch('counter/countManuscriptText')
  },
  created () {
    this.scriptWidht = this.horizontalLength * this.squareSize + 1
    this.scriptHeight = this.verticalLength * this.squareSize + 1
  },
  mounted () {
    this.scrollToLeft()
  },
  methods: {
    scrollToLeft () {
      if (this.direction === 'v') {
        const script = document.querySelector('.wrapper')
        script.scroll(this.scriptWidht, 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  main{
    text-align: center;
  }

  .wrapper {
    display: inline-block;
    border: solid #353535 2px;
    margin: 0 auto;
    max-width: 100%;
    max-height: 601px;
    overflow-x: auto;
    overflow-y: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .script {
    width: calc(var(--scriptWidht) * 1px);
    height: calc(var(--scriptHeight) * 1px);
    border: solid #cdcec6;
    box-sizing: border-box;
  }

  .square {
    width: calc(var(--squareSize) * 1px);
    height: calc(var(--squareSize) * 1px);
    line-height: calc(var(--squareSize) * 1px);
    text-align: center;
    @include font-size(14);
    border: solid #cdcec6;
    border-width: 1px 1px 0 0;
  }

  .excess.square {
    background: #FDECEC;
  }

  .h.script {
    display: block;
    border-width: 0 0 1px 1px;
  }

  .h.line {
    display: flex;
  }

  .v.script {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    border-width: 0 0 1px 1px;
  }

  .v.line {
    display: block;
  }

  .v .square {
    -webkit-writing-mode: vertical-rl;
    -ms-writing-mode: tb-rl;
        writing-mode: vertical-rl;
  }

  .editor {
    display: flex;
    width: 100%;
    justify-content:space-between;
    align-items: flex-end;
  }

  button {
    display: block;
    position: relative;
    height: 40px;
    border: solid #353535 2px;
    background: #f2f2e9;
    @include font-size(12);
    outline: none;
    -moz-transition: 0.3s;
    -o-transition: 0.3s;
    -webkit-transition: 0.3s;
    font-weight: bold;
    font-family: "ヒラギノ明朝 ProN W3","Hiragino Mincho ProN","ＭＳ Ｐ明朝","MS PMincho",serif;
    &:hover{
      color: #f2f2e9;
      background: #353535;
    }
  }

  .reinput {
    padding: 10px 15px 10px 35px;
    &:before {
      content:'←';
      position: absolute;
      left: 10px;
      top: 50%;
      margin-top: -10px;
      @include font-size(18);
      height: 20px;
      line-height: 20px;
    }
  }

  .save {
    padding: 10px 35px 10px 15px;
    &:after {
      content:'→';
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -10px;
      @include font-size(18);
      height: 20px;
      line-height: 20px;
    }
  }
</style>
