<template>
  <label>{{ element.placeholder }}</label>
  <select
    :name="element.name"
    :placeholder="element.placeholder"
    :required="!element.isOptional"
    @input="handleInput($event)"
  >
    <option value="" disabled selected>Select your option</option>
    <option
      v-for="option of element.options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
  <small v-if="element.description">{{ element.description }}</small>
</template>

<script setup>
const props = defineProps(['element'])
const emit = defineEmits(['inputUpdate'])

const handleInput = function ($event) {
  emitUpdate($event.target.value.trim())
}
const emitUpdate = function (value) {
  // eslint-disable-next-line vue/no-mutating-props
  props.element.value = value

  emit('inputUpdate', props.element)
}
</script>
