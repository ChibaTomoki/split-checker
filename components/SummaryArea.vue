<template>
  <div>
    <template v-if="payers.length > 0">
      <v-card class="my-2">
        <v-card-title> 支払い </v-card-title>
        <v-card-text>
          <div v-for="person in payers" :key="person.name">
            <div>{{ person.name }}:</div>
            <div>{{ toPays[person.index] }}円</div>
          </div>
        </v-card-text>
      </v-card>
      <v-card class="my-2">
        <v-card-title> 受取り </v-card-title>
        <v-card-text>
          <div v-for="person in receivers" :key="person.name">
            <div>{{ person.name }}:</div>
            <div>{{ paids[person.index] }}円</div>
          </div>
        </v-card-text>
      </v-card>
    </template>
    <template v-if="neutrals.length > 0">
      <v-card class="my-2">
        <v-card-title> 何もしない </v-card-title>
        <v-card-text>
          <div v-for="person in neutrals" :key="person.name">
            <div>
              {{ person.name }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Person, ItemPerson, ItemAddedId } from '../model'

export default Vue.extend({
  name: 'SummaryArea',
  props: {
    items: {
      type: Array as PropType<ItemAddedId[]>,
      default: () => [{ _id: '', name: '', persons: [{ index: 0, name: '', paid: 0, toPay: 0 }], note: '' }],
    },
    persons: { type: Array as PropType<Person[]>, default: () => [{ index: 0, name: '' }] },
  },
  computed: {
    toPays(): number[] {
      return this.items.reduce(
        (toPays: number[], item: ItemAddedId) =>
          item.persons.map((person: ItemPerson, index: number) => toPays[index] + person.toPay - person.paid),
        Array(this.persons.length).fill(0)
      )
    },
    paids(): number[] {
      return this.items.reduce(
        (paids: number[], item: ItemAddedId) =>
          item.persons.map((person: ItemPerson, index: number) => paids[index] - person.toPay + person.paid),
        Array(this.persons.length).fill(0)
      )
    },
    payers(): Person[] {
      return this.persons.filter((person: Person) => this.toPays[person.index] > 0)
    },
    receivers(): Person[] {
      return this.persons.filter((person: Person) => this.toPays[person.index] < 0)
    },
    neutrals(): Person[] {
      return this.persons.filter((person: Person) => this.toPays[person.index] === 0)
    },
  },
})
</script>
