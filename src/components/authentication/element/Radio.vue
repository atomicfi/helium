<template>
  <label :for="element.name">
    <input type="radio" :name="element.name" @input="handleInput($event)" />
    {{ element.label }}
  </label>
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
