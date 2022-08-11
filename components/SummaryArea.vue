<script setup lang="ts">
import { computed } from 'vue'
import { Person, ItemPerson, ItemAddedId } from '../model'

interface Props {
  items: ItemAddedId[]
  persons: Person[]
}

const props = defineProps<Props>()

const toPaysRef = computed<number[]>(() => {
  return props.items.reduce(
    (toPays: number[], item: ItemAddedId) =>
      item.persons.map((person: ItemPerson, index: number) => toPays[index] + person.toPay - person.paid),
    Array(props.persons.length).fill(0)
  )
})
const paidsRef = computed<number[]>(() => {
  return props.items.reduce(
    (paids: number[], item: ItemAddedId) =>
      item.persons.map((person: ItemPerson, index: number) => paids[index] - person.toPay + person.paid),
    Array(props.persons.length).fill(0)
  )
})
const payersRef = computed<Person[]>(() => props.persons.filter((person: Person) => toPaysRef.value[person.index] > 0))
const receiversRef = computed<Person[]>(() =>
  props.persons.filter((person: Person) => toPaysRef.value[person.index] < 0)
)
const neutralsRef = computed<Person[]>(() =>
  props.persons.filter((person: Person) => toPaysRef.value[person.index] === 0)
)
</script>

<template>
  <div>
    <template v-if="payersRef.length > 0">
      <v-card class="my-2">
        <v-card-title> 支払い </v-card-title>
        <v-card-text>
          <div v-for="person in payersRef" :key="person.name">
            <div>{{ person.name }}:</div>
            <div>{{ toPaysRef[person.index] }}円</div>
          </div>
        </v-card-text>
      </v-card>
      <v-card class="my-2">
        <v-card-title> 受取り </v-card-title>
        <v-card-text>
          <div v-for="person in receiversRef" :key="person.name">
            <div>{{ person.name }}:</div>
            <div>{{ paidsRef[person.index] }}円</div>
          </div>
        </v-card-text>
      </v-card>
    </template>
    <template v-if="neutralsRef.length > 0">
      <v-card class="my-2">
        <v-card-title> 何もしない </v-card-title>
        <v-card-text>
          <div v-for="person in neutralsRef" :key="person.name">
            <div>
              {{ person.name }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>
