<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  value: string
  label: string
  rules: ((value: string) => boolean | string)[]
}
interface Emits {
  (e: 'update-value', value: string): void
  (e: 'handle-keydown-enter'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const inputValueRef = ref('')

watch(
  () => props.value,
  (next: string): void => {
    inputValueRef.value = next
  }
)

const emitValue = (): void => {
  emits('update-value', inputValueRef.value)
}
const handleKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Enter') {
    emitValue()
    emits('handle-keydown-enter')
  }
}
</script>

<template>
  <div>
    <v-text-field
      v-model="inputValueRef"
      :label="label"
      :rules="rules"
      @input="emitValue"
      @blur="emitValue"
      @keydown="handleKeydown($event)"
    />
  </div>
</template>
