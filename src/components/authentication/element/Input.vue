<template>
  <label>{{ element.placeholder }}</label>
  <input
    :type="element.type"
    :name="element.name"
    :placeholder="element.placeholder"
    :required="!element.isOptional"
    spellcheck="false"
    autocomplete="false"
    @input="handleInput($event)"
  />
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

// @TODO: build handling for input masking: date, phone, ssn, state, postalCode
// @TODO handle input modes (such as numeric entries)
// @nitpick password manager support hack since it is buggy
// @nitpick: on mobile, conversion rate is higher if password is not hidden by default
// @nitpick auto-focusing inputs can be helpful
</script>
