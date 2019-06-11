<template lang="pug">
  main
    .wrapper
      .script(:style='styles', :class="(direction === 'h') ? 'h' : 'v'")
        .line(v-for='line in countedScript', :class="(direction === 'h') ? 'h' : 'v'")
          .square(:style='styles', :class="{ excess: row.excess }", v-for='row in line' ) {{row.text}}
    .editor
      .inputMeta
        div
          p タイトル
          input(type="text" v-model='title')
        div
          p 通知設定
          input#checkbox(type='checkbox', @change='settingNotification' v-model='notification')
          label(for='checkbox') 締め切りを通知する
          datepicker(:value='deadline', v-model='deadline', :disabled='!notification')
      .buttonWrap
        button.reinput(@click="reinput") 入力し直す
        button.save(@click='validation') 保存する
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'Result',
  components: {
    Datepicker
  },
  computed: {
    styles () {
      return {
        '--squareSize': this.squareSize,
        '--scriptWidht': this.scriptWidht,
        '--scriptHeight': this.scriptHeight
      }
    },
    title: {
      get () {
        return this.$store.getters['counter/title']
      },
      set (value) {
        this.$store.commit('counter/setTitle', value)
      }
    },
    deadline: {
      get () {
        return this.$store.getters['counter/deadline']
      },
      set (value) {
        this.$store.commit('counter/setDeadline', value)
      }
    },
    notification: {
      get () {
        return this.$store.getters['counter/notification']
      },
      set (value) {
        this.$store.commit('counter/setNotification', value)
        if (!value) {
          this.deadline = null
        }
      }
    },
    ...mapGetters('counter', ['countedScript', 'direction', 'verticalLength', 'horizontalLength'])
  },
  data () {
    return {
      squareSize: 30,
      scriptWidht: 0,
      scriptHeight: 0,
    }
  },
  beforeCreate () {
    if( !this.$route.meta.update ) {
      this.$store.dispatch('counter/countManuscriptText')
    }
  },
  created () {
    this.scriptWidht = this.horizontalLength * this.squareSize + 1
    this.scriptHeight = this.verticalLength * this.squareSize + 1
  },
  mounted () {
    this.scrollToLeft()
  },
  methods: {
    ...mapActions('counter', ['saveDocument']),
    scrollToLeft () {
      if (this.direction === 'v') {
        const script = document.querySelector('.wrapper')
        script.scroll(this.scriptWidht, 0)
      }
    },
    validation () {
      let errorMessage = []

      if (!this.title) {
        errorMessage.push('タイトルを入力してください')
      }

      if (this.notification && !this.deadline) {
        errorMessage.push('締切日を入力してください')
      }

      if (errorMessage.length === 0) {
        this.save()
      } else {
        errorMessage.forEach((message) => {
          this.$toasted.show(message, {duration : 1500})
        })
      }
    },
    save () {
      if(this.$route.meta.update) {
        this.$store.dispatch('counter/updateDocument', this.$route.params.id)
          .then(title => {
            this.$router.push({name: 'list'})
            this.$toasted.show(title + 'を上書きしました', {duration : 1500})
            this.$store.dispatch('list/getList')
          })
      } else {
        this.$store.dispatch('counter/saveDocument')
          .then(title => {
            this.$router.push({name: 'list'})
            this.$toasted.show(title + 'を保存しました', {duration : 1500})
            this.$store.dispatch('list/getList')
          })
      }
    },
    reinput () {
      if(this.$route.meta.update) {
        this.$router.push ({name: 'reinput', params: {id: this.$route.params.id}})
      } else {
        this.$router.push({name: 'input'})
      }
    },
    settingNotification () {
      this.$store.dispatch('counter/getNotificationKey')
        .catch(() => {
          this.notification = false
          this.$toasted.show('通知の設定時にエラーが発生しました。ブラウザの設定を確認してください。', {duration : 2000})
        })
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
    width: 100%;
    margin-top: 20px;
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
    font-family: $mintyo;
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

  .inputMeta {
    text-align: left;
    margin-bottom: 40px;
    p {
      @include font-size(16);
      margin-top: 15px;
    }
  }

  .buttonWrap {
    display: flex;
    justify-content:space-between;
  }

  input:checked + label::after{
    opacity: 1;
  }

  input[type="checkbox"] {
    display: none;
  }

  label{
    display: table;
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 5px;
    @include font-size(14);
    position: relative;
    &:hover{
      &:before{
        border: solid 2px #000;
      }
    }
    &:before{
      -moz-transition: 0.3s;
      -o-transition: 0.3s;
      -webkit-transition: 0.3s;
      transition: 0.3s;
      display: block;
      content: '';
      position: absolute;
      top: 2px;
      left: -20px;
      width: 10px;
      height: 10px;
      border: solid 2px #888;
    }
    &:after{
      -moz-transition: 0.3s;
        -o-transition: 0.3s;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        display: block;
        content: '';
        position: absolute;
        top: 0;
        left: -15px;
        width: 6px;
        height: 12px;
        border-right: 2px solid #ff0000;
        border-bottom: 2px solid #ff0000;
        opacity: 0;
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
    }
  }

</style>

<style lang="scss">
  .year:hover { border: 1px solid #fafafa; }
  .vdp-datepicker__calendar .cell.selected, .vdp-datepicker__calendar .cell.selected:hover, .vdp-datepicker__calendar .cell.selected.highlighted, .vdp-datepicker__calendar header .prev:not(.disabled):hover, .vdp-datepicker__calendar header .next:not(.disabled):hover, .vdp-datepicker__calendar header .up:not(.disabled):hover { background: #fafafa; }
  .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover, .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover { border: 1px solid #ccc; }
  input {
    @include font-size(14);
    font-family: $gothic;
    outline: none;
    width: 100%;
    padding: 10px;
    border: solid 1px #ccc;
    &:disabled {
      background-color: #eee;
    }
  }
</style>
