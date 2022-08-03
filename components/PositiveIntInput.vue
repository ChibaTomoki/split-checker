<template>
  <div>
    <v-text-field
      v-model="strTemp"
      inputmode="numeric"
      :label="label"
      :rules="rules"
      counter="16"
      prefix="￥"
      placeholder="半角数字のみ入力可能"
      @blur="emitValue"
      @keydown="handleKeydown($event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface Data {
  strTemp: string
  rules: ((value: any) => any)[]
}

export default Vue.extend({
  name: 'PositiveIntInputComponent',
  props: {
    value: { type: Number, default: 0 },
    label: { type: String, default: '' },
  },
  data: (): Data => ({
    strTemp: '0',
    rules: [
      (value) => !!value || '必須項目',
      (value) => !value.match(/\D/) || '半角数字のみ入力可能',
      (value) => !value.match(/^0\d/) || '不要な先頭の0は入力不可',
    ],
  }),
  watch: {
    value(newValue: number): void {
      this.strTemp = String(newValue)
    },
  },
  created(): void {
    this.strTemp = String(this.value)
  },
  methods: {
    emitValue(): void {
      if (!this.strTemp || this.strTemp.match(/\D/) || this.strTemp.match(/^0\d/)) return
      this.$emit('update-value', Number(this.strTemp))
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
