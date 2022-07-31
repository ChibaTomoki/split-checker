<template>
  <v-dialog v-model="isOpen">
    <template #activator="{ on, attrs }">
      <v-btn v-if="item !== null" fab v-bind="attrs" v-on="on">
        <v-icon> mdi-delete </v-icon>
      </v-btn>
      <v-btn v-else v-bind="attrs" v-on="on"> 全て精算 </v-btn>
    </template>
    <v-card>
      <v-card-title></v-card-title>
      <v-card-text>
        <p v-if="item !== null">{{ item.name }}を削除してもよろしいですか？</p>
        <p v-else>全て削除してもよろしいですか？</p>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="item !== null" @click="deleteItem(item._id)">OK</v-btn>
        <v-btn v-else @click="deleteAllItems">OK</v-btn>
        <v-btn @click="isOpen = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ItemAddedId } from '../model'

interface Data {
  isOpen: boolean
}

export default Vue.extend({
  name: 'DeleteDialogComponent',
  props: {
    // TODO: required falseのときdefaultはどうなるか確認
    item: {
      type: Object as PropType<ItemAddedId | null>,
      required: false,
      default: () => null,
    },
  },
  data: (): Data => ({
    isOpen: false,
  }),
  methods: {
    deleteItem(deleteId: string): void {
      this.$axios
        .delete('/api', { data: { _id: deleteId } })
        .then((response) => {
          console.log(response)
          this.$emit('get-all-items')
        })
        .catch((response) => console.log(response))
      this.isOpen = false
    },
    // TODO: エンドポイントを/apiだけに変更
    deleteAllItems(): void {
      this.$axios
        .delete('/api/all')
        .then((response) => {
          console.log(response)
          this.$emit('get-all-items')
        })
        .catch((response) => console.log(response))
      this.isOpen = false
    },
  },
})
</script>
