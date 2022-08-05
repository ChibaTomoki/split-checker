<template>
  <div>
    <v-text-field
      v-model="inputValue"
      :label="label"
      :rules="rules"
      @input="emitValue"
      @blur="emitValue"
      @keydown="handleKeydown($event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface Data {
  inputValue: string
}

export default Vue.extend({
  name: 'StringInputComponent',
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
    rules: { type: [Boolean, Array], default: true },
  },
  data: (): Data => ({
    inputValue: '',
  }),
  watch: {
    value(newValue: string): void {
      this.inputValue = newValue
    },
  },
  created(): void {
    this.inputValue = this.value
  },
  methods: {
    emitValue(): void {
      this.$emit('update-value', this.inputValue)
    },
    handleKeydown(e: KeyboardEvent): void {
      if (e.key === 'Enter') {
        this.emitValue()
        this.$emit('handle-keydown-enter')
      }
    },
  },
})
</script>
