<template>
  <button @click="emitUpdate">{{ element.label }}</button>
</template>

<script setup>
const props = defineProps(['element'])
const emit = defineEmits(['inputUpdate'])

const emitUpdate = function () {
  emit('inputUpdate', props.element)
}
</script>
