<template>
  <span class="trello-marked" v-html="html"></span>
</template>

<script>
import marked from 'marked'
import emoji from '@/components/mixins/emoji'

export default {
  name: 'Trello-Marked',
  mixins: [emoji],
  props: {
    plainText: [String]
  },
  computed: {
    html () {
      return marked(this.plainText)
        // remove <p>...</p> tags at the beginning and end
        .trim().replace(/^<p>/, '').replace(/<\/p>$/, '')
        // add target="_black" to all links
        .replace(/<a\s+href/g, `<a target="_black" href`)
        // search and replace valid emoji code
        .split(/(:[\w+-]+:)/).map(str => str.replace(/^:([\w+-]+):$/, (match, p1) => this._emojiNormalize(p1))).join('')
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ code {
    background-color: #e2e4e6;
    border: 1px solid #d6dadc;
    border-radius: 2px;
    color: #eb5a46;
    padding: 1px 3px;
    margin: -1px 2px;
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
  }
</style>
