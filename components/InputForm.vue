<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { ItemPerson, Item } from '../model'
import StringInput from './StringInput.vue'
import PositiveIntInput from './PositiveIntInput.vue'

interface Props {
  initItem: Item
}

interface Emits {
  (e: 'posted-item'): void
  (e: 'get-all-items'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const tempItem = reactive<Item>({
  name: props.initItem.name,
  persons: props.initItem.persons,
  note: props.initItem.note,
})
const valid = ref(true)
const formRef = ref<any>(null)

const updateName = (newName: string): void => {
  tempItem.name = newName
}

const updatePaid = (newPaid: number, index: number): void => {
  if (tempItem.persons[index]) tempItem.persons[index].paid = newPaid
  initializeToPay()
}

const updateToPay = (newToPay: number, index: number): void => {
  if (tempItem.persons[index]) tempItem.persons[index].toPay = newToPay
}

const updateNote = (newNote: string): void => {
  tempItem.note = newNote
}
const initializeToPay = (): void => {
  const paidSum: number = tempItem.persons.reduce((sum: number, person: ItemPerson) => sum + person.paid, 0)
  const roundedAliquot: number = Math.round(paidSum / tempItem.persons.length)
  let remainder: number = paidSum - roundedAliquot * tempItem.persons.length

  tempItem.persons.forEach((person: ItemPerson) => {
    let addition: number = 0
    if (remainder > 0) {
      addition++
      remainder--
    } else if (remainder < 0) {
      addition--
      remainder++
    }
    person.toPay = roundedAliquot + addition
  })
}

const initializeTempItem = (): void => {
  tempItem.name = ''
  tempItem.persons.forEach((person) => {
    person.paid = 0
    person.toPay = 0
  })
  tempItem.note = ''
}

const postItem = (): void => {
  const isOk: boolean = formRef.value.validate()
  if (!isOk) return

  axios
    .post('/api', tempItem)
    .then((response: AxiosResponse<Item>) => {
      console.log(response)
      emits('get-all-items')
    })
    .then(() => {
      initializeTempItem()
      emits('posted-item')
    })
    .catch((error: AxiosError) => console.log(error))
}
</script>

<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="postItem">
    <StringInput
      :value="tempItem.name"
      label="購入品"
      :rules="[(v) => !!v || '購入品名が必要です']"
      @update-value="updateName($event)"
    />
    <template v-for="person in tempItem.persons">
      <PositiveIntInput
        :key="'paid' + person.index"
        :value="person.paid"
        :label="person.name + 'が払った額'"
        @update-value="updatePaid($event, person.index)"
      />
    </template>
    <template v-for="person in tempItem.persons">
      <PositiveIntInput
        :key="'toPay' + person.index"
        :value="person.toPay"
        :label="person.name + 'が払う額'"
        @update-value="updateToPay($event, person.index)"
      />
    </template>
    <StringInput :value="tempItem.note" label="メモ" @update-value="updateNote($event)" />
    <v-btn type="submit" @click="validate"> 追加 </v-btn>
  </v-form>
</template>
