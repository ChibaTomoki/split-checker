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

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'StringInput',
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
    rules: { type: Array, default: () => [true] },
  },
  setup(props, context) {
    const inputValueRef = ref('')

    watch(
      () => props.value,
      (next: string): void => {
        inputValueRef.value = next
      }
    )

    const emitValue = (): void => {
      context.emit('update-value', inputValueRef)
    }

    const handleKeydown = (e: KeyboardEvent): void => {
      if (e.key === 'Enter') {
        emitValue()
        context.emit('handle-keydown-enter')
      }
    }

    return {
      inputValueRef,
      emitValue,
      handleKeydown,
    }
  },
})
</script>
