<script setup lang="ts">
import { ref } from 'vue'
import { ItemAddedId } from '../model'
import DeleteDialog from './DeleteDialog.vue'
import EditDialog from './EditDialog.vue'

interface Props {
  items: ItemAddedId
}

interface Emits {
  (e: 'get-all-items'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

emits('get-all-items')

const selected = ref<boolean[]>([])
const showsDetail = ref<boolean[]>([])
const expanded = ref<boolean[]>([])
</script>

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
            v-model="showsDetail"
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
