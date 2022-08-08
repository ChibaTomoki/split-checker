<template>
  <v-dialog v-model="isOpenRef">
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

<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { ItemAddedId } from '../model'

interface Data {
  isOpen: boolean
}

interface Props {
  item?: ItemAddedId | null
}

interface Emits {
  (e: 'get-all-items'): void
}

const props = withDefaults(defineProps<Props>(), {
  item: () => null,
})
const emits = defineEmits<Emits>()

const isOpenRef = ref(false)

const deleteItem = (deleteId: string): void => {
  axios
    .delete(`/api/${deleteId}`)
    .then((response) => {
      console.log(response)
      emits('get-all-items')
      isOpenRef.value = false
    })
    .catch((error: AxiosError) => console.log(error))
}

const deleteAllItems = (): void => {
  axios
    .delete('/api')
    .then((response) => {
      console.log(response)
      emits('get-all-items')
      isOpenRef.value = false
    })
    .catch((error: AxiosError) => console.log(error))
}
</script>
