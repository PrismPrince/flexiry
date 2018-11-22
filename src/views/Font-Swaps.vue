<template>
  <v-container fluid class="font-swaps">
    <v-layout row>
      <v-flex>
        <v-toolbar color="primary" tabs dark flat>
          <v-toolbar-title>Font Swaps</v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- <v-btn color="error" @click="__seedFonts">
            <v-icon small>warning</v-icon> Seed Fonts
          </v-btn> -->

          <!-- ----------------------------- ADMIN ----------------------------- -->

          <!-- <v-dialog v-model="font.dialog" max-width="900px" persistent>
            <v-btn slot="activator" color="white" class="mb-2" light>Add Font Swap</v-btn>
            <v-card>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 md4>
                      <v-text-field v-model.trim="font.mintedFont" label="Minted Font" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field v-model.trim="font.nonMintedFont" label="Non-Minted Font" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field v-model.trim="font.note" label="Note" clearable></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="close" color="primary" flat>Cancel</v-btn>
                <v-btn v-if="font.update" @click="updateFontSwap" color="primary" flat>Update</v-btn>
                <v-btn v-else @click="addFontSwap" color="primary" flat>Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->

          <!-- ----------------------------- ADMIN ----------------------------- -->

        </v-toolbar>

        <!-- --------------------------------- -->
        <v-data-table :headers="headers" :items="items" class="elevation-1" :loading="loader" :total-items="itemSize" :rows-per-page-items="[5, 10, 25, 50, 100]" :pagination.sync="pagination" :no-data-text="'loading...'">
          <template slot="items" slot-scope="props">
            <tr>
              <td>{{ props.item.nonMintedFont }}</td>
              <td>{{ props.item.mintedFont }}</td>
              <td>{{ props.item.note }}</td>

              <!-- ----------------------------- ADMIN ----------------------------- -->

              <!-- <td>
                <v-icon class="mr-2" @click.stop="editFontSwap(props.item)" small>edit</v-icon>
                <v-icon @click.stop="removeFontSwap(props.item)" small>delete</v-icon>
              </td> -->

              <!-- ----------------------------- ADMIN ----------------------------- -->

            </tr>
          </template>

          <template slot="no-data">
            <v-layout align-center justify-center row wrap>
              <v-flex class="text-xs-center empty-state" md6>
                <v-avatar color="grey">
                  <v-icon dark>font_download</v-icon>
                </v-avatar>
                <p class="title">Nothing in font swaps</p>
                <p class="body-1">Please add some fonts!</p>
              </v-flex>
            </v-layout>
          </template>
        </v-data-table>
        <!-- --------------------------------- -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Firebase from '@/services/firebase'
// import fontsSeeder from '@/Fonts-Seeder'

const database = Firebase.firestore()

export default {
  name: 'font-swaps',
  data () {
    return {
      font: {
        id: null,
        mintedFont: null,
        nonMintedFont: null,
        note: null,
        update: false,
        dialog: false
      },
      loader: false,
      itemSize: null,
      lastItem: '',
      items: [],
      pagination: {
        page: 1,
        sortBy: 'nonMintedFont',
        rowsPerPage: 10
      },
      headers: [
        {
          text: 'Non-Minted Font',
          value: 'nonMintedFont'
        },
        {
          text: 'Minted Font',
          value: 'mintedFont'
        },
        {
          text: 'Note',
          value: 'note',
          sortable: false
        // },
        // {
        //   text: 'Actions',
        //   value: 'nonMintedFont',
        //   sortable: false
        }
      ]
    }
  },
  watch: {
    pagination: {
      deep: true,
      handler () {
        let { descending, page, rowsPerPage, sortBy, totalItems } = this.pagination
        let query = database.collection('tools/font-swaps/fonts').orderBy(sortBy || 'nonMintedFont', descending ? 'desc' : 'asc')

        this.loader = true

        if ((rowsPerPage * (page - 1)) > 0) query = query.startAfter(this.lastItem)

        if (rowsPerPage > 0) query = query.limit(rowsPerPage)

        database.doc('tools/font-swaps').get().then(doc => {
          this.itemSize = doc.data().fontCount

          this.$bind('items', query).then(doc => {
            this.lastItem = this.items.length > 0 ? this.items[this.items.length - 1].nonMintedFont : ''
            this.loader = false
          })
        })
      }
    }
  },
  methods: {
    // __seedFonts () {
    //   let batch = database.batch()
    //   let fontSwap = database.collection('tools/font-swaps/fonts').doc()

    //   for (let i = 0; i < fontsSeeder.length; i++) {
    //     database.collection('tools/font-swaps/fonts').add(fontsSeeder[i]).then(font => {
    //       console.log(font)
    //     })
    //   }
    // },
    addFontSwap () {
      let { mintedFont, nonMintedFont, note } = this.font

      this.loader = true

      if (mintedFont && nonMintedFont) {
        database.collection('tools/font-swaps/fonts').add({
          mintedFont: mintedFont,
          nonMintedFont: nonMintedFont,
          note: note ? note.trim() : null,
          created_at: Firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: Firebase.firestore.FieldValue.serverTimestamp()
        }).then(fontSwap => {
          this.close()
          this.loader = false
        }).catch(e => { console.log(e) })
      } else {
        alert('Wrong input!')
      }
    },
    editFontSwap ({id, mintedFont, nonMintedFont, note}) {
      this.font = {
        id,
        mintedFont,
        nonMintedFont,
        note,
        update: true,
        dialog: true
      }
    },
    updateFontSwap () {
      let { id, mintedFont, nonMintedFont, note } = this.font

      this.loader = true

      database.collection('tools/font-swaps/fonts').doc(id).update({
        mintedFont,
        nonMintedFont,
        note,
        updated_at: Firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        this.close()
        this.loader = false
      }).catch(e => { console.log(e) })
    },
    removeFontSwap ({id}) {
      this.loader = true

      database.collection('tools/font-swaps/fonts').doc(id).delete().then(() => {
        this.itemSize--
        this.loader = false
      }).catch(e => { console.log(e) })
    },
    close () {
      this.font = {
        id: null,
        update: false,
        dialog: false,
        mintedFont: null,
        nonMintedFont: null,
        note: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .empty-state {
    margin: 40px 0;

    .v-avatar {
      width: 250px !important;
      height: 250px !important;
      margin-bottom: 20px;

      .v-icon {
        font-size: 150px;
      }
    }
  }

  .v-textarea /deep/ textarea {
    max-height: 105px;
  }

  .v-chip .v-avatar.right {
    margin-right: -12px;
    margin-left: 8px;
  }
</style>
