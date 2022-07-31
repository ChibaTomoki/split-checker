<template>
  <v-main>
    <v-container>
      <InputForm :init-item="initItem" @get-all-items="getAllItems" @posted-item="showsSnackbar = true" />
      <v-snackbar v-model="showsSnackbar">
        追加しました
        <template #action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="showsSnackbar = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import { Person, Item } from '../model'

interface Data {
  initItem: Item
  showsSnackbar: boolean
}

export default Vue.extend({
  name: 'IndexPage',
  components: {
    InputForm: () => import('../components/InputForm.vue'),
  },
  data: (): Data => ({
    initItem: {
      name: '',
      persons: [],
      note: '',
    },
    showsSnackbar: false,
  }),
  computed: {
    persons(): Person[] {
      return this.$store.getters.getPersons
    },
    items(): Item[] {
      return this.$store.getters.getItems
    },
  },
  created() {
    this.getAllItems()
    this.$store.getters.getPersons.forEach((person: Person) =>
      this.initItem.persons.push({ ...person, paid: 0, toPay: 0 })
    )
  },
  methods: {
    createInitInput(): Item {
      const initInput: Item = {
        name: '',
        persons: [],
        note: '',
      }
      this.$store.getters.getPersons.forEach((person: Person) =>
        initInput.persons.push({ ...person, paid: 0, toPay: 0 })
      )
      return initInput
    },
    getAllItems(): void {
      this.$store.dispatch('fetchAllItems')
    },
  },
})
</script>
