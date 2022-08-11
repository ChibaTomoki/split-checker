<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue'
import axios, { AxiosError } from 'axios'
import { ItemAddedId, ItemPerson } from '../model'
import StringInput from './StringInput.vue'
import PositiveIntInput from './PositiveIntInput.vue'

interface Props {
  item: ItemAddedId
}

interface Emits {
  (e: 'get-all-items'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const isOpenRef = ref(false)
const tempItem: ItemAddedId = reactive({
  _id: '',
  name: '',
  persons: [],
  note: '',
})
const formRef: any = ref(null)

watchEffect(() => {
  if (isOpenRef.value) {
    tempItem._id = props.item._id
    tempItem.name = props.item.name
    tempItem.persons = props.item.persons
    tempItem.note = props.item.note
  }
})

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

const putItem = (): void => {
  const isOk: boolean = formRef.value.validate()
  if (!isOk) return

  axios
    .put(`/api/${tempItem._id}`, tempItem)
    .then((response) => {
      console.log(response)
      emits('get-all-items')
      isOpenRef.value = false
    })
    .catch((error: AxiosError) => console.log(error))
}
</script>

<template>
  <v-dialog v-model="isOpenRef" width="576">
    <template #activator="{ on, attrs }">
      <v-btn fab v-bind="attrs" v-on="on">
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title></v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <StringInput
            :value="tempItem.name"
            label="購入品"
            :rules="[(v) => !!v || '購入品名が必要です']"
            @update-value="updateName($event)"
            @handle-keydown-enter="putItem"
          >
            購入品
          </StringInput>
          <div v-for="person in tempItem.persons" :key="'paid' + person.index">
            <PositiveIntInput
              :value="person.paid"
              :label="person.name + 'が払った額'"
              @update-value="updatePaid($event, person.index)"
              @handle-keydown-enter="putItem"
            >
              {{ person.name }}が払った額
            </PositiveIntInput>
          </div>
          <div v-for="person in tempItem.persons" :key="'toPay' + person.index">
            <PositiveIntInput
              :value="person.toPay"
              :label="person.name + 'が払う額'"
              @update-value="updateToPay($event, person.index)"
              @handle-keydown-enter="putItem"
            >
              {{ person.name }}が払う額
            </PositiveIntInput>
          </div>
          <StringInput
            :value="tempItem.note"
            label="メモ"
            @update-value="updateNote($event)"
            @handle-keydown-enter="putItem"
          >
            メモ
          </StringInput>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="putItem">OK</v-btn>
        <v-btn text @click="isOpenRef = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
