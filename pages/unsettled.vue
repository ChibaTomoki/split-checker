<template>
  <v-container>
    <v-row>
      <v-col>
        <SummaryArea :items="items" :persons="persons" />
      </v-col>
      <v-col>
        <DeleteDialog @get-all-items="getAllItems" />
      </v-col>
    </v-row>
    <Items :items="items" @get-all-items="getAllItems" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Item, Person } from '../model'

export default Vue.extend({
  name: 'UnsettledPage',
  components: {
    SummaryArea: () => import('../components/SummaryArea.vue'),
    DeleteDialog: () => import('../components/CommonComponents/DeleteDialog.vue'),
    Items: () => import('../components/Items/Items.vue'),
  },
  computed: {
    items(): Item[] {
      return this.$store.getters.getItems
    },
    persons(): Person[] {
      return this.$store.getters.getPersons
    },
  },
  methods: {
    getAllItems(): void {
      this.$store.dispatch('fetchAllItems')
    },
  },
})
</script>
