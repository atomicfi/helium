<template>
  <Input
    v-if="props.element.component === USER_INPUT_ELEMENT_TYPES.INPUT"
    :element="props.element"
    @inputUpdate="handleInput"
  ></Input>
  <Select
    v-if="props.element.component === USER_INPUT_ELEMENT_TYPES.SELECT"
    :element="props.element"
    @inputUpdate="handleInput"
  >
  </Select>
  <Radio
    v-if="props.element.component === USER_INPUT_ELEMENT_TYPES.RADIO"
    :element="props.element"
    @inputUpdate="handleInput"
  >
  </Radio>
  <Button
    v-if="props.element.component === USER_INPUT_ELEMENT_TYPES.BUTTON"
    :element="props.element"
    @inputUpdate="handleInput"
  >
  </Button>
</template>

<script setup>
import { USER_INPUT_ELEMENT_TYPES } from '@/util/constants'
import Input from './element/Input.vue'
import Select from './element/Select.vue'
import Button from './element/Button.vue'
import Radio from './element/Radio.vue'

const props = defineProps(['element'])

const emit = defineEmits(['onInput'])

const handleInput = function (element) {
  emit('onInput', element)
}
</script>
