<template>
  <v-container class="file-audit" grid-list-lg fluid>
    <v-layout row wrap>
      <v-flex sm6 xs12>
        <v-card class="text-display">
          <v-card-title>
            Raw Texts
          </v-card-title>

          <v-card-text class="raw-text">
            <pre>{{ rawText }}</pre>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex sm6 xs12>
        <v-card class="text-display">
          <v-card-title>
            Formatted Text
          </v-card-title>

          <v-card-text  class="formatted-text">
            <marked :plain-text="rawText" :open-link-new-tab="true"></marked>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout class="mb-5" row wrap>
      <v-flex xs12>
        <v-expansion-panel v-model="expansion" expand focusable>
          <v-expansion-panel-content>
            <div slot="header"><v-icon v-if="updateFontsText" small>create</v-icon> Update Fonts</div>
            <v-card color="teal" tile flat dark>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field v-model.trim="updateFonts.header" color="white" label="Update Font Header" clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>

              <v-card-text>
                <v-layout v-for="(item, key) in updateFonts.updates" :key="key" row wrap>
                  <v-flex xs12 md4>
                    <v-combobox v-model="item.nonMinted" :items="nonMintedFonts" color="white" label="Non-Minted Font" :prepend-icon="updateFonts.updates.length > 1 ? 'clear' : ''" @change="swapFont($event, key)" @click:prepend="removeUpdateFont(key)" hide-no-data hide-selected chips small-chips deletable-chips clearable></v-combobox>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-combobox v-model="item.minted" :items="mintedFonts" color="white" label="Minted Font" hide-no-data hide-selected chips small-chips deletable-chips clearable></v-combobox>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-text-field v-model.trim="item.note" color="white" label="Additional Note" :append-outer-icon="(updateFonts.updates.length - 1) === key ? 'add' : ''" @click:append-outer="addUpdateFont" clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>

              <v-card-text>
                <v-layout v-for="(item, key) in updateFonts.outlines" :key="key" row wrap>
                  <v-flex xs12 md6>
                    <v-combobox v-model="item.fonts" :items="mintedFonts" color="white" label="Outlined Fonts" :prepend-icon="updateFonts.outlines.length > 1 ? 'clear' : ''" @click:prepend="removeOutlinedFont(key)" hide-no-data hide-selected chips small-chips deletable-chips multiple clearable></v-combobox>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field v-model.trim="item.note" color="white" label="Additional Note" :append-outer-icon="(updateFonts.outlines.length - 1) === key ? 'add' : ''" @click:append-outer="addOutlinedFont" clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content>
            <div slot="header"><v-icon v-if="missingFontsText" small>create</v-icon> Missing Fonts</div>
            <v-card color="amber" tile flat light>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field v-model.trim="missingFonts.header" color="black" label="Missing Fonts Header" clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>

              <v-card-text>
                <v-layout v-for="(item, key) in missingFonts.forms" :key="key" row wrap>
                  <v-flex xs12 md4>
                    <v-text-field v-model.trim="item.font" color="black" label="Missing Fonts" :prepend-icon="missingFonts.forms.length > 1 ? 'clear' : ''" @click:prepend="removeMissingFont(key)" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-combobox v-model="item.editable" :items="['Editable', 'Outlined', 'Both']" color="black" label="Editable or Outlined" hide-no-data hide-selected clearable></v-combobox>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-combobox v-model="item.usedIn" :items="['FRT', 'LBL', 'FRCP', 'Stamp', 'ALT']" color="black" label="Where the Font is Used" hide-no-data hide-selected multiple clearable></v-combobox>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-text-field v-model.trim="item.link" color="black" label="Purchased Link" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-text-field v-model.trim="item.sub" color="black" label="Suggested Sub" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-text-field v-model.trim="item.note" color="black" label="Additional Notes from the Designer" :append-outer-icon="(missingFonts.forms.length - 1) === key ? 'add' : ''" @click:append-outer="addMissingFont" clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content>
            <div slot="header"><v-icon v-if="photoSwapsText" small>create</v-icon> Photoswaps</div>
            <v-card color="blue-gtile rey" flat dark>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-combobox v-model="photoSwaps.note" :items="[
                      '@rachelricci, photos do not match winning design.',
                      '@rachelricci, photo on alt orientation do not match winning design.',
                      '@rachelricci, photo on alt orientation is missing.'
                    ]" color="white" label="Photo Swaps Note" hide-no-data hide-selected clearable></v-combobox>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content>
            <div slot="header"><v-icon v-if="formPlusText" small>create</v-icon> Form+</div>
            <v-card color="orange" tile flat light>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <v-text-field v-model.trim="formPlus.header" color="black" label="Form+ Header" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field v-model.trim="formPlus.screenshot" color="black" label="Form+ Screenshot Link" clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>

              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-textarea v-model.trim="formPlus.note" color="black" label="Form+ Content" clearable></v-textarea>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content>
            <div slot="header"><v-icon v-if="stampReviewText" small>create</v-icon> Stamp Element Preview</div>
            <v-card color="red" tile flat dark>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field v-model.trim="stampReview.note" color="white" label="Stamp Elements Review" clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content>
            <div slot="header"><v-icon v-if="extraNotesText" small>create</v-icon> Extra Notes</div>
            <v-card color="grey" tile flat>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-textarea v-model.trim="extraNotes.note" color="black" label="Extra notes" clearable></v-textarea>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>

    <v-speed-dial v-model="hotFab" direction="left" transition="slide-x-reverse-transition" fixed bottom right open-on-hover>
      <v-btn slot="activator" color="teal" v-model="hotFab" fab dark>
        <v-icon>settings</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-tooltip top>
        <v-btn slot="activator" color="primary" @click="copyText" fab small>
          <v-icon>file_copy</v-icon>
        </v-btn>
        <span>Copy</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn slot="activator" color="warning" @click="clearAll" fab small>
          <v-icon>delete</v-icon>
        </v-btn>
        <span>Clear All</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn slot="activator" color="pink" to="/font-swaps" target="_blank" fab small dark>
          <v-icon>font_download</v-icon>
        </v-btn>
        <span>View Fonts <v-icon small dark>launch</v-icon></span>
      </v-tooltip>
    </v-speed-dial>

    <div id="raw-text-container"></div>
    <!-- <textarea id="raw-text" v-model="rawText"></textarea> -->
  </v-container>
</template>

<script>
import Firebase from '@/services/firebase'
import Marked from '@/components/layouts/Marked'
// import fontsSeeder from '@/Fonts-Seeder'

const database = Firebase.firestore()

export default {
  name: 'file-audit',
  components: { Marked },
  data () {
    return {
      fonts: [],
      hotFab: false,
      expansion: [false, false, false, false, false, false],
      updateFonts: {
        header: 'ATTN MD',
        updates: [{
          nonMinted: null,
          minted: null,
          note: null
        }],
        outlines: [{
          fonts: [],
          note: null
        }]
      },
      missingFonts: {
        header: '@mollywiggins, This design contains non-Minted font.',
        forms: [{
          font: null,
          editable: null,
          usedIn: [],
          link: null,
          sub: null,
          note: null
        }]
      },
      photoSwaps: {
        note: null
      },
      formPlus: {
        header: '**Form+**',
        screenshot: null,
        note: null
      },
      stampReview: {
        note: null
      },
      extraNotes: {
        note: null
      }
    }
  },
  firestore () {
    return {
      fonts: database.collection('tools/font-swaps/fonts')
    }
  },
  computed: {
    nonMintedFonts () {
      return this.fonts.map(font => font.nonMintedFont).sort()
    },
    mintedFonts () {
      return this.fonts.map(font => font.mintedFont).sort()
    },
    rawText () {
      return [
        this.updateFontsText,
        this.missingFontsText,
        this.photoSwapsText,
        this.formPlusText,
        this.stampReviewText,
        this.extraNotesText
      ].filter(block => block !== null).join('\n\n---\n\n') || '**Please add notes**'
    },
    updateFontsText () {
      let updateFontsTexts = this.updateFonts.updates.map(update => {
        let { nonMinted, minted, note } = update

        if (nonMinted && minted) return `- Update ${nonMinted.trim()} to ${minted.trim()}${note ?  ' ' + note.trim() : ''}`
        else return null
      }).filter(update => update !== null)

      let outlinedFontsTexts = this.updateFonts.outlines.map(outline => {
        let { fonts, note } = outline
        let fontsText = ''

        if (fonts.length === 0 && !note) return null

        if (fonts.length > 0)
          for (let i = 0; i < fonts.length; i++)
            if (fonts.length === 1) fontsText += fonts[i].trim()
            else if (i === fonts.length - 1) fontsText += ` and ${fonts[i].trim()}`
            else if (i === fonts.length - 2) fontsText += fonts[i].trim()
            else fontsText += `${fonts[i].trim()}, `

        if (note) fontsText += ` ${note.trim()}`

        return `- Outlined text${fonts.length > 1 ? 's are ' : ' is '}${fontsText}`
      }).filter(outline => outline !== null)

      if (updateFontsTexts.length > 0 && outlinedFontsTexts.length > 0) return `**ATTN MD**\n\n${updateFontsTexts.join('\n')}\n${outlinedFontsTexts.join('\n')}`
      else if (updateFontsTexts.length > 0) return `**ATTN MD**\n\n${updateFontsTexts.join('\n')}`
      else if (outlinedFontsTexts.length > 0) return `**ATTN MD**\n\n${outlinedFontsTexts.join('\n')}`
      else return null
    },
    missingFontsText () {
      let missingFontsTexts = this.missingFonts.forms.map(form => {
        let { font, editable, usedIn, link, sub, note } = form

        if (font && editable && usedIn.length > 0) return `Non-minted font: ${font.trim()}\nEditable or Outlined: ${editable.trim()}\nWhere the font is used: ${usedIn.map(x => x.trim()).join(' ')}\nPurchased link: ${link ? link.trim() : 'n/a'}\nSuggested sub: ${sub ? sub.trim() : 'n/a'}` + (note ? `\nAdditional note from the designer: ${note.trim()}` : '')
        else return null
      }).filter(form => form !== null)

      if (missingFontsTexts.length > 0) return (this.missingFonts.header ? `${this.missingFonts.header.trim()}\n\n` : '') + missingFontsTexts.join('\n\n')
      else return null
    },
    photoSwapsText () {
      return this.photoSwaps.note ? this.photoSwaps.note.trim() : null
    },
    formPlusText () {
      let { header, screenshot, note } = this.formPlus

      if (note)
        if (header && screenshot) return [header.trim(), screenshot.trim()].join('\n') + '\n\n' + note.trim()
        else if (header) return `${header.trim()}\n\n${note.trim()}`
        else if (screenshot) return `${screenshot.trim()}\n\n${note.trim()}`
        else return note.trim()
      else return null
    },
    stampReviewText () {
      return this.stampReview.note ? this.stampReview.note.trim() : null
    },
    extraNotesText () {
      return this.extraNotes.note ? this.extraNotes.note.trim() : null
    }
  },
  methods: {
    addUpdateFont () {
      this.updateFonts.updates.push({
        nonMinted: null,
        minted: null,
        note: null
      })
    },
    removeUpdateFont (key) {
      this.updateFonts.updates.splice(key, 1)
    },
    addOutlinedFont () {
      this.updateFonts.outlines.push({
        fonts: [],
        note: null
      })
    },
    removeOutlinedFont (key) {
      this.updateFonts.outlines.splice(key, 1)
    },
    addMissingFont () {
      this.missingFonts.forms.push({
        font: null,
        editable: null,
        usedIn: null,
        link: null,
        sub: null,
        note: null
      })
    },
    removeMissingFont (key) {
      this.missingFonts.forms.splice(key, 1)
    },
    swapFont (nonMintedFont, key) {
      let font = this.fonts.find(font => font.nonMintedFont === nonMintedFont.trim())

      if (font) {
        this.updateFonts.updates[key].minted = font.mintedFont
        this.updateFonts.updates[key].note = font.note
      }
    },
    copyText () {
      let textarea = document.createElement('textarea')
      textarea.value = this.rawText
      textarea.id = 'raw-text'
      textarea.style = 'height: 1px; width: 1px; opecity: 0'

      document.getElementById('raw-text-container').appendChild(textarea)
      document.getElementById('raw-text').select()
      document.execCommand('copy')
      document.getElementById('raw-text-container').removeChild(textarea)
    },
    clearAll () {
      this.expansion = [false, false, false, false, false, false]
      this.updateFonts = {
        header: 'ATTN MD',
        updates: [{
          nonMinted: null,
          minted: null,
          note: null
        }],
        outlines: [{
          fonts: [],
          note: null
        }]
      }
      this.missingFonts = {
        header: '@mollywiggins, This design contains non-Minted font.',
        forms: [{
          font: null,
          editable: null,
          usedIn: [],
          link: null,
          sub: null,
          note: null
        }]
      }
      this.photoSwaps = {
        note: null
      }
      this.formPlus = {
        header: '**Form+**',
        screenshot: null,
        note: null
      }
      this.stampReview = {
        note: null
      }
      this.extraNotes = {
        note: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
pre {
  white-space: pre-line;
  word-break: break-word;
}

.marked /deep/ p:last-child {
  margin-bottom: 0;
}

.text-display {
  max-height: 350px;
  overflow-y: auto;
}

#raw-text {
  height: 1px;
  width: 1px;
  opecity: 0;
}
</style>
