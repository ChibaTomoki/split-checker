<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="postItem">
    <StringInput :value="tempItem.name" label="購入品" :required="true" @update-value="updateName($event)" />
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
    <v-btn type="submit"> 追加 </v-btn>
    <!-- <b-alert :show="doneFirstSubmit && hasNameEmptyError" variant="danger" class="my-1" style="width: 14rem">
      購入品を入力してください
    </b-alert> -->
    <!-- <b-alert :show="doneFirstSubmit && hasTotalAmountError" variant="danger" class="my-1" style="width: 14rem">
      払った額と払う額の合計を同じにしてください
    </b-alert> -->
  </v-form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ItemPerson, Item } from '../model'

interface Data {
  tempItem: Item
  valid: boolean
  doneFirstSubmit: boolean
}

export default Vue.extend({
  name: 'InputFormComponent',
  components: {
    StringInput: () => import('./StringInput.vue'),
    PositiveIntInput: () => import('./PositiveIntInput.vue'),
  },
  props: {
    initItem: {
      type: Object as PropType<Item>,
      default: () => ({ name: '', persons: [{ index: 0, name: '', paid: 0, toPay: 0 }], note: '' }),
    },
  },
  data: (): Data => ({
    tempItem: {
      name: '',
      persons: [],
      note: '',
    },
    valid: true,
    doneFirstSubmit: false,
  }),
  computed: {
    hasTotalAmountError(): boolean {
      return this.getTotalPaid() !== this.getTotalToPay()
    },
    hasNameEmptyError(): boolean {
      return this.tempItem.name === ''
    },
  },
  created(): void {
    this.tempItem = JSON.parse(JSON.stringify(this.initItem))
  },
  methods: {
    updateName(newName: string): void {
      this.$set(this.tempItem, 'name', newName)
    },
    updatePaid(newPaid: number, index: number): void {
      this.$set(this.tempItem.persons[index], 'paid', newPaid)
      this.initializeToPay()
    },
    updateToPay(newToPay: number, index: number): void {
      this.$set(this.tempItem.persons[index], 'toPay', newToPay)
    },
    updateNote(newNote: string): void {
      this.$set(this.tempItem, 'note', newNote)
    },
    initializeToPay(): void {
      const paidSum = this.tempItem.persons.reduce((sum, person) => sum + person.paid, 0)
      const roundedAliquot = Math.round(paidSum / this.tempItem.persons.length)
      let remainder: number = paidSum - roundedAliquot * this.tempItem.persons.length

      this.tempItem.persons.forEach((person) => {
        let addition: number = 0
        if (remainder > 0) {
          addition++
          remainder--
        } else if (remainder < 0) {
          addition--
          remainder++
        }
        this.$set(person, 'toPay', roundedAliquot + addition)
      })
    },
    initializeTempItem(): void {
      this.$set(this.tempItem, 'name', '')
      this.tempItem.persons.forEach((person) => {
        this.$set(person, 'paid', 0)
        this.$set(person, 'toPay', 0)
      })
      this.$set(this.tempItem, 'note', '')
      this.doneFirstSubmit = false
    },
    getTotalPaid(): number {
      return this.tempItem.persons.reduce(
        (totalPaid: number, current: ItemPerson): number => totalPaid + current.paid,
        0
      )
    },
    getTotalToPay(): number {
      return this.tempItem.persons.reduce(
        (totalToPay: number, current: ItemPerson): number => totalToPay + current.toPay,
        0
      )
    },
    postItem(): void {
      this.doneFirstSubmit = true
      if (this.hasTotalAmountError || this.hasNameEmptyError) return

      this.$axios
        .post('/api', this.tempItem)
        .then((response) => {
          console.log(response)
          this.$emit('get-all-items')
        })
        .then(() => {
          this.initializeTempItem()
          this.$emit('posted-item')
        })
        .catch((response) => console.log(response))
    },
  },
})
</script>
