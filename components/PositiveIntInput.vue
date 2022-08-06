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

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'PositiveIntInputComponent',
  props: {
    value: { type: Number, default: 0 },
    label: { type: String, default: '' },
  },
  setup(props, ctx) {
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
      ctx.emit('update-value', Number(strTempRef.value))
    }

    const handleKeydown = (e: KeyboardEvent): void => {
      if (e.key === 'Enter') {
        emitValue()
        ctx.emit('handle-keydown-enter')
      }
    }

    return {
      strTempRef,
      rulesRef,
      emitValue,
      handleKeydown,
    }
  },
})
</script>
