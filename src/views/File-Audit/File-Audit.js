import Marked from '@/components/layouts/Marked'
import FONTSWAPS from './font-swaps.json' // Updated at 03-06-2019

export default {
  name: 'file-audit',
  components: { Marked },
  data () {
    return {
      fontSwaps: [],

      updateFonts: [],
      outlinedFonts: [],
      missingFontForms: [],

      builder: {
        header: null,
        updateFonts: {
          nonMinted: null,
          minted: null,
          note: null
        },
        outlinedFonts: {
          fonts: [],
          note: null
        },
        missingFonts: {
          header: null,
          font: null,
          editable: null,
          usedIn: null,
          link: null,
          sub: null,
          note: null
        },
        photoSwaps: null,
        formPlus: {
          header: null,
          date: null,
          screenshot: null,
          note: null
        },
        stampReview: null,
        extraNotes: null
      }
    }
  },
  created () {
    let date = new Date().toLocaleString().split(',')[0].split('/')
      .map(d => d.length === 1 ? `0${d}` : d).join('-')

    this.fontSwaps = FONTSWAPS
    this.builder.header = '###Attention MD'
    this.builder.missingFonts.header = '@mollywiggins'
    this.builder.photoSwaps = '@rachelricci'
    this.builder.formPlus.header = '**Form+ Sent**'
    this.builder.formPlus.date = `\`${date}\``
  },
  computed: {
    nonMintedFonts () {
      return this.fontSwaps.map(font => font.nonMintedFont).sort()
    },
    mintedFonts () {
      return this.fontSwaps.map(font => font.mintedFont).sort()
    },
    builderText () {
      let { photoSwaps, stampReview, extraNotes } = this.builder

      return [
        this.flattenFonts,
        this.missingFontFormsText,
        this.formPlusText,
        photoSwaps === '@rachelricci' ? null : photoSwaps,
        stampReview,
        extraNotes
      ].filter(text => text !== null).join('\n\n---\n\n')
    },
    updateFontsList () {
      return this.updateFonts.map(updateFont => {
        let { nonMinted, minted, note } = updateFont

        nonMinted = nonMinted.trim()
        minted = minted.trim()
        note = note === null ? '' : note

        return (`- Update ${updateFont.nonMinted} to ${updateFont.minted} ` + note).trim()
      })
    },
    updateFontsText () {
      return this.updateFontsList.join('\n') || null
    },
    outlinedFontsList () {
      return this.outlinedFonts.map(outlinedFont => {
        let { fonts, note } = outlinedFont
        let fontsText = ''

        fonts = fonts.map(font => font.trim())
        note = note === null ? '' : note

        for (let i = 0; i < fonts.length; i++) {
          if (fonts.length === 1) fontsText += fonts[i]
          else if (i === fonts.length - 1) fontsText += ` and ${fonts[i]}`
          else if (i === fonts.length - 2) fontsText += fonts[i]
          else fontsText += `${fonts[i]}, `
        }

        return (`- Outlined text${outlinedFont.fonts.length > 1 ? 's are ' : ' is '}${fontsText} ` + note).trim()
      })
    },
    outlinedFontsText () {
      return this.outlinedFontsList.join('\n') || null
    },
    flattenFonts () {
      let flattenList = ''

      if (this.updateFontsText || this.outlinedFontsText) {
        if (this.builder.header) flattenList += this.builder.header + '\n\n'

        if (this.updateFontsText) flattenList += this.updateFontsText

        flattenList += this.outlinedFontsText ? '\n' : ''

        if (this.outlinedFontsText) flattenList += this.outlinedFontsText
      }

      return flattenList || null
    },
    missingFontFormsList () {
      let header = this.builder.missingFonts.header === null ? '' : (this.builder.missingFonts.header + '\n\n')
      let text

      text = this.missingFontForms.map(missingFont => {
        let { font, editable, usedIn, link, sub, note } = missingFont

        font = font
        editable = editable
        usedIn = usedIn
        link = link === null ? 'n/a' : (link === '' ? 'n/a' : link)
        sub = sub === null ? 'n/a' : (sub === '' ? 'n/a' : sub)
        note = note === null ? '' : note

        if (this.missingFontForms.length > 1) return [
          `- **Non-Minted Font**: ${font}`,
          ` **Editable or Outlined**: ${editable}`,
          ` **Where the font is used**: ${usedIn}`,
          ` **Purchased link**: ${link}`,
          ` **Suggested sub**: ${sub}`,
          (note === '' ? '' : ` Additional note from designer: ${note}`)
        ].join('\n').trim()
        else return [
          `**Non-Minted Font**: ${font}`,
          `**Editable or Outlined**: ${editable}`,
          `**Where the font is used**: ${usedIn}`,
          `**Purchased link**: ${link}`,
          `**Suggested sub**: ${sub}`,
          (note === '' ? '' : `Additional note from designer: ${note}`)
        ].join('\n').trim()
      })

      return text || null
    },
    missingFontFormsText () {
      let header = this.builder.missingFonts.header === null ? '' : (this.builder.missingFonts.header + '\n\n')

      return this.missingFontFormsList.length > 0 ? header + this.missingFontFormsList.join('\n\n') : null
    },
    formPlusText () {
      let { header, date, screenshot, note } = this.builder.formPlus
      let text = ''

      header = header === null ? '' : header
      date = date === null ? '' : date
      screenshot = screenshot === null ? '' : screenshot
      note = note === null ? '' : note

      if (!note) return null

      if (header) text += `${header}`

      if (header && date) text += ' '

      if (date) text += `${date}\n`
      else if (header) text += '\n'

      if (screenshot) text += `${screenshot}\n\n`
      else if (header || date) text += '\n'

      text += note

      return text
    }
  },
  methods: {
    addUpdateFont () {
      let { nonMinted, minted, note } = this.builder.updateFonts

      if ((nonMinted === null ? true : nonMinted.trim() === '') ||
        (minted === null ? true : minted.trim() === '')) return

      this.builder.updateFonts.nonMinted = null
      this.builder.updateFonts.minted = null
      this.builder.updateFonts.note = null

      this.updateFonts.push({ nonMinted, minted, note })
    },
    addOutlinedFont () {
      let { fonts, note } = this.builder.outlinedFonts

      fonts = fonts.filter(font => font.trim() !== '')

      if (fonts.length <= 0) return

      this.builder.outlinedFonts.fonts = []
      this.builder.outlinedFonts.note = null

      this.outlinedFonts.push({ fonts, note })
    },
    addMissingFont () {
      let { font, editable, usedIn, link, sub, note } = this.builder.missingFonts

      if ((font === null ? true : font.trim() === '') ||
        (editable === null ? true : editable.trim() === '') ||
        (usedIn === null ? true : usedIn.trim() === '')) return

      this.builder.missingFonts.font = null
      this.builder.missingFonts.editable = null
      this.builder.missingFonts.usedIn = null
      this.builder.missingFonts.link = null
      this.builder.missingFonts.sub = null
      this.builder.missingFonts.note = null

      this.missingFontForms.push({ font, editable, usedIn, link, sub, note })
    },
    swapFont (nonMintedFont, key) {
      let font = this.fontSwaps.find(font => font.nonMintedFont === nonMintedFont.trim())

      if (font) {
        this.builder.updateFonts.minted = font.mintedFont
        this.builder.updateFonts.note = font.note
      }
    },
    removeUpdateFont (key) {
      this.updateFonts.splice(key, 1)
    },
    removeOutlinedFont (key) {
      this.outlinedFonts.splice(key, 1)
    },
    removeMissingFontForm (key) {
      this.missingFontForms.splice(key, 1)
    },
    copyText () {
      let textarea = document.createElement('textarea')
      textarea.value = this.builderText
      textarea.id = 'raw-text'
      textarea.style = 'height: 1px; width: 1px; opecity: 0'

      document.getElementById('raw-text-container').appendChild(textarea)
      document.getElementById('raw-text').select()
      document.execCommand('copy')
      document.getElementById('raw-text-container').removeChild(textarea)
    },
    reset () {
      let date = new Date().toLocaleString().split(',')[0].split('/')
        .map(d => d.length === 1 ? `0${d}` : d).join('-')

      this.updateFonts = []
      this.outlinedFonts = []
      this.missingFontForms = []
      this.builder.header = '###Attention MD'
      this.builder.updateFonts.nonMinted = null
      this.builder.updateFonts.minted = null
      this.builder.updateFonts.note = null
      this.builder.outlinedFonts.fonts = []
      this.builder.outlinedFonts.note = null
      this.builder.missingFonts.header = '@mollywiggins'
      this.builder.missingFonts.font = null
      this.builder.missingFonts.editable = null
      this.builder.missingFonts.usedIn = null
      this.builder.missingFonts.link = null
      this.builder.missingFonts.sub = null
      this.builder.photoSwaps = '@rachelricci'
      this.builder.formPlus.header = '**Form+ Sent**'
      this.builder.formPlus.date = `\`${date}\``
      this.builder.formPlus.screenshot = null
      this.builder.formPlus.note = null
      this.builder.stampReview = null
      this.builder.extraNotes = null
    }
  }
}
