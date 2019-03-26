import marked from 'marked'
import FONTS from './fonts.json'

export default {
  name: 'font-list',
  data () {
    return {
      search: null,
      fonts: [],
      headers: [
        { text: 'Font', value: 'font', width: '400px' },
        { text: 'Minimum Size', value: 'minSize', sortable: false, width: '150px' },
        { text: 'Stroke', value: 'stroke', sortable: false, width: '150px' },
        { text: 'Note', value: 'note', sortable: false },
        { text: 'Status', value: 'status', sortable: false, width: '200px' }
        // { text: 'Date Added', value: 'dateAdded' },
        // { text: 'Filename', value: 'filename' },
        // { text: 'Customizer Default', value: 'customizerDefault' },
        // { text: 'Public', value: 'public' },
        // { text: 'FRCP Eligible', value: 'frcpEligible' },
      ]
    }
  },
  created () {
    this.fonts = FONTS
  },
  computed: {
    filteredFonts () {
      if (this.search) return this.fonts.filter(font => (font.font.toLowerCase().indexOf(this.search) > -1))
      else return this.fonts
    }
  },
  methods: {
    marked (text) {
      return marked(text)
    }
  }
}
