<template>
  <div>
    <div>{{ id }}</div>
    <label :for="id"> 日付 </label>
    <b-form-datepicker :id="id" v-model="tempDate" :state="state" type="date" @input="emitDate" @blur="emitDate" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface Data {
  tempDate: string
}
export default Vue.extend({
  name: 'InputFormComponent',
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: false,
      default: '',
    },
    state: { type: Boolean, required: false, default: null },
  },
  data: (): Data => ({
    tempDate: '',
  }),
  watch: {
    value(newDate: string): void {
      this.tempDate = newDate
    },
  },
  created(): void {
    if (this.value) this.tempDate = this.value
    else this.tempDate = this.toStringFromDate(new Date())
  },
  methods: {
    emitDate(): void {
      this.$emit('update-date', this.tempDate)
    },
    toStringFromDate(dateDate: Date): string {
      const year: string = dateDate.getFullYear().toString()
      const month: string = ('0' + (dateDate.getMonth() + 1).toString()).slice(-2)
      const date: string = ('0' + dateDate.getDate().toString()).slice(-2)
      return year + '-' + month + '-' + date
    },
  },
})
</script>
