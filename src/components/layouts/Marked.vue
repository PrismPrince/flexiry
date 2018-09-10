<template>
  <span class="marked" v-html="marked_text"></span>
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import emoji from '@/mixins/emoji'

hljs.registerLanguage('javascript', javascript)

marked.setOptions({
  breaks: true,
  highlight (code) {
    return hljs.highlightAuto(code).value
  }
})

export default {
  name: 'marked',
  mixins: [emoji],
  props: {
    plainText: {
      type: String,
      required: true,
      default: ''
    },
    openLinkNewTab: {
      type: Boolean,
      default: false
    },
    emoji: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    marked_text () {
      let markedText = marked(this.plainText)

      // add target="_black" to all links
      if (this.openLinkNewTab) markedText = markedText.replace(/<a\s+href/g, `<a target="_black" href`)

      // search and replace valid emoji code
      if (this.emoji) markedText = markedText.split(/(:[\w+-]+:)/).map(str => str.replace(/^:([\w+-]+):$/, (match, emoji) => this._emojiNormalize(emoji))).join('')

      return markedText
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~highlight.js/styles/monokai-sublime.css';

/deep/ pre code.language-javascript {
  background: none;
  color: inherit;
  box-shadow: none;
}

/deep/ hr {
    background: #d6dadc;
    border: 0;
    color: #d6dadc;
    height: 1px;
    margin: 16px 0;
    padding: 0;
    width: 100%;
}

/deep/ blockquote {
  border-left: 1px solid #c4c9cc;
  color: #666;
  margin: 8px 0 8px 8px;
  padding: 0 0 0 8px;
}

/deep/ .emoji {
  height: 18px;
  width: auto;
  display: inline;
  margin-bottom: -4px;
}

/deep/ img {
  width: auto;
  max-width: 100%;
  max-height: 450px;
}
</style>
