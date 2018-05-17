<template>
  <span class="trello-marked" v-html="html"></span>
</template>

<script>
export default {
  name: 'Trello-Marked',
  props: {
    html: [String]
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
  }
</style>
