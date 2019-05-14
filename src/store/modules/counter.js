export default{
  namespaced: true,
  state: {
    script: '',
    countedScript: {},
    options: {
      verticalLength: 20,
      horizontalLength: 20,
      direction: 'h',
      indent: false,
      number: false,
      alphabet: false,
      comma: false,
      lowerCase: false,
      bracket: false,
      noStartBracket: false
    }
  },
  getters: {
    script: state => state.script,
    options: state => state.options,
    countedScript: state => state.countedScript,
    direction: state => state.options.direction,
    verticalLength: state => state.options.direction === 'v' ? state.countedScript[0].length : state.countedScript.length,
    horizontalLength: state => state.options.direction === 'v' ? state.countedScript.length : state.countedScript[0].length
  },
  mutations: {
    setOptions (state, options) {
      // localStorageにoptionsの値をセット
      localStorage.setItem('options', JSON.stringify(state.options))
      // state置き換え
      state.options = options
    },
    setScript (state, script) {
      state.script = script
    },
    setCountedScript (state, script) {
      state.countedScript = script
    },
    loadOptions (state) {
      if (localStorage.getItem('options')) {
        // LocalStorageから取得したJson文字列をパース
        const options = JSON.parse(localStorage.getItem('options'))
        // state置き換え
        state.options = options
      }
    }
  },
  actions: {
    doLoadOptions ({commit}) {
      commit('loadOptions')
    },
    countManuscriptText ({commit, state}) {
      let countedScript = []

      const line = (() => {
        switch (state.options.direction) {
          case 'v': return state.options.horizontalLength
          case 'h': return state.options.verticalLength
          default : return 0
        }
      })()

      const row = (() => {
        switch (state.options.direction) {
          case 'v': return state.options.verticalLength
          case 'h': return state.options.horizontalLength
          default : return 0
        }
      })()

      const regexEnd2char = (() => {
        let strCombRegex = ''
        if (state.options.comma) strCombRegex += '、。，．,.'
        if (state.options.lowerCase) strCombRegex += 'ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ'
        if (state.options.noStartBracket) strCombRegex += '】)）」\\]'

        if (strCombRegex === '') return null
        return new RegExp('[' + strCombRegex + ']')
      })()

      const regex2char = (() => {
        let strCombRegex = ''
        if (state.options.bracket) strCombRegex += '【】（）()「」[\\]'
        if (state.options.number) strCombRegex += '0-9'
        if (state.options.alphabet) strCombRegex += 'a-zA-Z'

        if (strCombRegex === '') return null
        return new RegExp('[' + strCombRegex + ']')
      })()

      const regexNewLine = new RegExp(/\n|\r\n|\r/)
      const regexBracket = new RegExp(/[【（([「[]/)
      const regexClosingBracket = new RegExp(/[】)）\]」]/)

      let textArray = [...state.script]
      let count = 0
      let indentFlag = false
      while (true) {
        const excess = (() => {
          if (count > line - 1) {
            return true
          } else {
            return false
          }
        })()

        let rowArray = []
        let index = 0
        let diff = 0

        textArray.some((element, textIndex) => {
          index = textIndex + diff
          let pushString = textArray[index]
          let pushFlag = true

          if ((state.options.indent && textIndex === 0) && (indentFlag || count === 0)) {
            rowArray.push({text: '', excess: excess})
          }
          // 範囲を超えない
          if (index > textArray.length - 1) {
            return true
          }

          // 改行コードがあった場合、次の行へ
          if (regexNewLine.test(textArray[index])) {
            indentFlag = true
            return true
          }

          // ひとマスに2文字入れる場合
          if (regex2char != null && regex2char.test(textArray[index])) {
            if (regexClosingBracket.test(textArray[index])) {
              // 閉じかっこだった場合、前の行にかっこを追加
              pushString = rowArray.pop().text + textArray[index]
            } else if (textArray[index + 1] && (regexBracket.test(textArray[index]) || regex2char.test(textArray[index + 1]))) {
              // 始まりのかっこだった場合と
              // 次の文字がひとマスに2文字いれる文字だった場合は、
              // indexのマスに次の文字を足して、次の文字を読み飛ばす
              pushString = textArray[index] + textArray[index + 1]
              ++diff
              index = textIndex + diff
            }
          }

          // 行の最後の文字の時、次の文字が文頭禁止文字じゃないかをチェック
          if (rowArray.length === row - 1) {
            indentFlag = false
            let lastString = pushString

            // 文頭禁止文字をチェックした最後の行に追加する
            let lastStringIndex = index + 1
            while (true) {
              if (regexEnd2char != null && regexEnd2char.test(textArray[lastStringIndex])) {
                lastString += textArray[lastStringIndex]
                ++diff
              } else {
                break
              }
              ++lastStringIndex
            }
            rowArray.push({text: lastString, excess: excess})
            index = textIndex + diff
            return true
          }

          // 通常の文字列追加
          if (pushFlag && pushString !== undefined) {
            rowArray.push({text: pushString, excess: excess})
          }
        })

        textArray = textArray.slice(index + 1)
        rowArray = rowArray.concat(new Array(row - rowArray.length).fill({text: '', excess: excess}))
        countedScript.push(rowArray)
        ++count

        if (textArray.length === 0 && count >= line) {
          break
        }
      }
      commit('setCountedScript', countedScript)
    }
  }
}
