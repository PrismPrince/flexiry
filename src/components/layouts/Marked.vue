<template>
  <span class="marked" v-html="marked_text"></span>
</template>

<script>
import marked from 'marked'
import emoji from '@/mixins/emoji'

export default {
  name: 'marked',
  mixins: [emoji],
  props: {
    plainText: {
      type: String,
      required: true,
      default: ''
    },
    removeTagEnds: {
      type: Boolean,
      default: false
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

      // remove <p>...</p> tags at the beginning and end
      if (this.removeTagEnds) markedText = markedText.trim().replace(/^<p>/, '').replace(/<\/p>$/, '')

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
