<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  value: number
  label: string
}

interface Emits {
  (e: 'handle-keydown-enter'): void
  (e: 'update-value', value: number): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const strTempRef = ref(String(props.value))
const rulesRef = [
  (value: string) => !!value || '必須項目',
  (value: string) => !value.match(/\D/) || '半角数字のみ入力可能',
  (value: string) => !value.match(/^0\d/) || '不要な先頭の0は入力不可',
]

watch(
  () => props.value,
  (next: number): void => {
    strTempRef.value = String(next)
  }
)

const emitValue = (): void => {
  if (!strTempRef.value || strTempRef.value.match(/\D/) || strTempRef.value.match(/^0\d/)) return
  emits('update-value', Number(strTempRef.value))
}

const handleKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Enter') {
    emitValue()
    emits('handle-keydown-enter')
  }
}
</script>

<template>
  <v-text-field
    v-model="strTempRef"
    inputmode="numeric"
    :label="label"
    :rules="rulesRef"
    counter="16"
    maxlength="16"
    prefix="￥"
    placeholder="半角数字のみ入力可能"
    @blur="emitValue"
    @keydown="handleKeydown($event)"
  />
</template>
