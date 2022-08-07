<script setup lang="ts">
import { ref, reactive, watchEffect, computed } from 'vue'
import axios, { AxiosResponse, AxiosError } from 'axios'
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
const doneFirstSubmitRef = ref(false)
const tempItem: ItemAddedId = reactive({
  _id: '',
  name: '',
  persons: [],
  note: '',
})

watchEffect(() => {
  if (isOpenRef.value) {
    tempItem.name = props.item.name
    tempItem.persons = props.item.persons
    tempItem.note = props.item.note
  }
})

const hasTotalAmountError = computed((): boolean => {
  return getTotalPaid() !== getTotalToPay()
})

const hasNameEmptyError = computed((): boolean => tempItem.name === '')

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

const getTotalPaid = (): number => {
  return tempItem.persons.reduce((totalPaid: number, current: ItemPerson): number => totalPaid + current.paid, 0)
}

const getTotalToPay = (): number => {
  return tempItem.persons.reduce((totalToPay: number, current: ItemPerson): number => totalToPay + current.toPay, 0)
}

const putItem = (): void => {
  doneFirstSubmitRef.value = true
  if (hasTotalAmountError || hasNameEmptyError) return

  axios
    .put('/api', tempItem)
    .then((response: AxiosResponse<ItemAddedId>) => {
      console.log(response)
      emits('get-all-items')
    })
    .catch((error: AxiosError) => console.log(error))
    .finally(() => (isOpenRef.value = false))
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
        <StringInput
          :value="tempItem.name"
          label="購入品"
          :required="true"
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
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="putItem">OK</v-btn>
        <v-btn text @click="isOpenRef = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <!-- <b-alert :show="doneFirstSubmit && hasNameEmptyError" variant="danger" class="my-1">
      購入品を入力してください
    </b-alert>
    <b-alert :show="doneFirstSubmit && hasTotalAmountError" variant="danger" class="my-1">
      払った額と払う額の合計を同じにしてください
    </b-alert> -->
  </v-dialog>
</template>
