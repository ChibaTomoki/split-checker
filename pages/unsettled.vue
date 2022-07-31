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
    <ItemsList :items="items" @get-all-items="getAllItems" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Item, Person } from '../model'

export default Vue.extend({
  name: 'UnsettledPage',
  components: {
    SummaryArea: () => import('../components/SummaryArea.vue'),
    DeleteDialog: () => import('../components/DeleteDialog.vue'),
    ItemsList: () => import('../components/ItemsList.vue'),
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
