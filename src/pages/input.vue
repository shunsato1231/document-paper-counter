<template lang="pug">
  main
    form(@submit.prevent='toResult')
      .setting-form
        .direction-form
          input#radio1(type='radio', name='direction', value='h' v-model="options.direction")
          label(for='radio1') 横書き
          input#radio2(type='radio', name='direction', value='v' v-model="options.direction")
          label(for='radio2') 縦書き
        input#checkbox1(type='checkbox', name='indent' v-model="options.indent")
        label(for='checkbox1') 段落の頭を1マス開ける
        input#checkbox2(type='checkbox', name='number' v-model="options.number")
        label(for='checkbox2') 数字を1マスに2文字入れる
        input#checkbox3(type='checkbox', name='alphabet' v-model="options.alphabet")
        label(for='checkbox3') アルファベットを1マスに2文字入れる
        input#checkbox4(type='checkbox', name='comma' v-model="options.comma")
        label(for='checkbox4') 句読点（「。」や「、」）が行の頭に来ないようにする
        input#checkbox5(type='checkbox', name='lowerCase' v-model="options.lowerCase")
        label(for='checkbox5') 「っ」「ゃ」「ゅ」「ょ」が行の頭に来ないようにする
        input#checkbox6(type='checkbox', name='bracket' v-model="options.bracket")
        label(for='checkbox6') 括弧を他の文字と同じますに入れる
        input#checkbox7(type='checkbox', name='noStartBracket' v-model="options.noStartBracket")
        label(for='checkbox7') 閉じ括弧が行の頭に来ないようにする
      .squaresForm
        .verticalForm
          .direction 縦：
          div
            .plus(@click='options.verticalLength++', :disabled='options.verticalLength>=100')
            input.num(type='number', v-model='options.verticalLength', min='1', max='100')
            .minas(@click='options.verticalLength--', :disabled='options.verticalLength<=1')
        .horizontalForm
          .direction 横：
          div
            .plus(@click='options.horizontalLength++', :disabled='options.horizontalLength>=100')
            input.num(type='number', v-model='options.horizontalLength', min='1', max='100')
            .minas(@click='options.horizontalLength--', :disabled='options.horizontalLength<=1')
      textarea(v-model='script' required)
      button.countButton(type='submit') カウントする
</template>

<script>
import { mapGetters } from 'vuex'
import * as Enum from '@/lib/enum'

export default {
  name: 'Input',
  data () {
    return {
      mode: ''
    }
  },
  computed: {
    script: {
      get () {
        return this.$store.getters['counter/script']
      },
      set (value) {
        this.$store.commit('counter/setScript', value)
      }
    },
    ...mapGetters('counter', ['options'])
  },
  watch: {
    options: {
      handler: function () {
        this.$store.commit('counter/setOptions', { options:this.options, mode:this.mode })
      },
      deep: true
    }
  },
  methods: {
    toResult () {
      this.$store.commit('counter/setOptions', { options:this.options, mode:this.mode })
      this.$router.push({name: 'result'})
    }
  },
  beforeCreate () {
    if( !this.$route.params.id ) {
      this.$store.dispatch('counter/doLoadOptions')
    }
  },
  created () {
    if( !this.$route.params.id ) {
      this.mode = Enum.MODE.NEW
    } else {
      this.mode = Enum.MODE.UPDATE
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
*{
  outline: none;
}
.setting-form{
  input{
    display: none;
  }
}
.direction-form{
  display: flex;
}

input:checked + label::after{
  opacity: 1;
}

label{
  display: table;
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 5px;
  @include font-size(13);
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

textarea{
  padding: 10px;
  width: 100%;
  height: 300px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  border: solid 1px #ccc;
  resize: none;
  @include font-size(14);
  font-family: $gothic;
}

.squaresForm{
  display: flex;
  height: 70px;
  margin: 10px 0;
}
.verticalForm, .horizontalForm{
  display: flex;
  flex-direction: row;
}

.verticalForm{
  margin-right: 30px;
}

.plus, .minas{
  display: block;
  width: 30px;
  height: 17px;
  background: transparent;
  border: none;
  position:  relative;
  margin: 0;
  padding: 0;
  outline: none;
}

.plus::before, .minas::before{
    content:  '';
    width: 10px;
    height: 10px;
    display:  block;
    box-sizing: border-box;
    border-top: solid 2px #cdcec6;
    border-right: solid 2px #cdcec6;
    position:  absolute;
}

.plus:disabled::before, .minas:disabled::before{
    border-top: solid 2px #cdcec6;
    border-right: solid 2px #cdcec6;
}

.plus::before{
  top: 50%;
  left: 50%;
  transform: rotate(-45deg);
}

.minas::before{
  bottom: 50%;
  left: 50%;
  transform: rotate(135deg);
}

.direction{
  margin: 0;
  @include font-size(14);
  height: 70px;
  line-height: 70px;
}

.num{
  width: 40px;
  height: 30px;
  border: none;
  padding: 0;
  @include font-size(20);
  font-weight: bold;
  text-align: center;
  background: transparent;
  color: #000;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance:textfield;
}

.countButton{
  -moz-transition: 0.3s;
  -o-transition: 0.3s;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  display: block;
  position: relative;
  margin: 20px auto;
  width: 150px;
  height: 50px;
  line-height: 46px;
  border: none;
  background: transparent;
  @include font-size(16);
  font-weight: bold;
  font-family: "ヒラギノ明朝 ProN W3","Hiragino Mincho ProN","ＭＳ Ｐ明朝","MS PMincho",serif;
  &:hover{
    background-color: #444;
    color: #f2f2e9;
  }
}
</style>
