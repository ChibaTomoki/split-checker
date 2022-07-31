<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="[
        { text: '購入品', value: 'name' },
        { text: '', value: 'actions' },
        { text: '', value: 'data-table-expand' },
      ]"
      :items="items"
      :single-expand="true"
      :expanded.sync="expanded"
      item-key="_id"
      show-select
      show-expand
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>未清算リスト</v-toolbar-title>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <EditDialog :item="item" @get-all-items="$emit('get-all-items')" />
        <DeleteDialog :item="item" @get-all-items="$emit('get-all-items')" />
      </template>
      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-data-table
            v-model="selected2"
            :headers="[
              { text: '名前', value: 'name' },
              { text: '払った額', value: 'paid' },
              { text: '払う額', value: 'toPay' },
            ]"
            :items="item.persons"
            hide-default-footer
          >
          </v-data-table>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ItemAddedId } from '../model'

interface Data {
  selected: boolean[]
  expanded: boolean[]
}

export default Vue.extend({
  name: 'ItemsComponent',
  components: {
    DeleteDialog: () => import('./DeleteDialog.vue'),
    EditDialog: () => import('./EditDialog.vue'),
  },
  props: {
    items: {
      type: Array as PropType<ItemAddedId[]>,
      default: () => [{ _id: '', name: '', persons: [{ index: 0, name: '', paid: 0, toPay: 0 }], note: '' }],
    },
  },
  data: (): Data => ({
    selected: [],
    expanded: [],
  }),
})
</script>
