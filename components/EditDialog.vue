<template>
  <v-dialog v-model="isOpen" width="576">
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
        <v-btn text @click="isOpen = false">Cancel</v-btn>
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

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ItemAddedId, ItemPerson } from '../model'

interface Data {
  isOpen: boolean
  tempItem: ItemAddedId
  doneFirstSubmit: boolean
}

export default Vue.extend({
  name: 'EditDialog',
  components: {
    StringInput: () => import('./StringInput.vue'),
    PositiveIntInput: () => import('./PositiveIntInput.vue'),
  },
  props: {
    item: {
      type: Object as PropType<ItemAddedId>,
      default: () => ({ _id: '', name: '', persons: [{ index: 0, name: '', paid: 0, toPay: 0 }], note: '' }),
    },
  },
  data: (): Data => ({
    isOpen: false,
    tempItem: {
      _id: '',
      name: '',
      persons: [],
      note: '',
    },
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
  watch: {
    isOpen(newValue: boolean): void {
      if (newValue) this.tempItem = JSON.parse(JSON.stringify(this.item))
    },
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
      const paidSum: number = this.tempItem.persons.reduce((sum: number, person: ItemPerson) => sum + person.paid, 0)
      const roundedAliquot: number = Math.round(paidSum / this.tempItem.persons.length)
      let remainder: number = paidSum - roundedAliquot * this.tempItem.persons.length

      this.tempItem.persons.forEach((person: ItemPerson) => {
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
    putItem() {
      this.doneFirstSubmit = true
      if (this.hasTotalAmountError || this.hasNameEmptyError) return

      this.$axios
        .put('/api', this.tempItem)
        .then((response) => {
          console.log(response)
          this.$emit('get-all-items')
        })
        .catch((response) => console.log(response))
        .finally(() => (this.isOpen = false))
    },
  },
})
</script>
