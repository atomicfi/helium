<template>
  <article :aria-busy="companyStore.isLoadingCompany">
    <div v-if="!companyStore.isLoadingCompany && companyStore.company">
      <h4>Login to {{ companyStore.company.connector.name }}</h4>
      <p v-if="taskWorkflowStore.gatherRequest?.sections[0]?.prompt">
        {{ taskWorkflowStore.gatherRequest.sections[0]?.prompt }}
      </p>
      <FormElement
        v-for="element in filteredFormElements"
        :key="element.id"
        :element="element"
        @onInput="onInput"
      ></FormElement>
      <footer>
        <p v-if="props.activeError">
          <mark
            >{{ props.activeError.code }}: {{ props.activeError.message }}</mark
          >
        </p>
        <div v-if="!taskWorkflowStore.gatherRequest">
          <button
            @click="onSubmit"
            :aria-busy="taskWorkflowStore.isCreatingWorkflow"
          >
            Sign in
          </button>
          <a href="#">I forgot my credentials</a>
        </div>
      </footer>
    </div>
  </article>

  <section id="accordions">
    <details>
      <summary><kbd>formElements</kbd></summary>
      <pre>{{ formElements }}</pre>
    </details>
    <details v-if="Object.keys(taskWorkflowStore.userInput)?.length">
      <summary><kbd>userInput</kbd></summary>
      <pre>{{ taskWorkflowStore.userInput }}</pre>
    </details>
  </section>
</template>

<script setup>
import { USER_INPUT_ELEMENT_TYPES } from '@/util/constants'
import { elementMeetsConditions } from '@/lib/form-flow'
import FormElement from '@/components/authentication/FormElement.vue'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import { useTaskWorkflowStore } from '@/stores/task-workflow'
const emit = defineEmits(['onSubmit'])
const props = defineProps(['requestType', 'activeError'])

const companyStore = useCompanyStore()
const taskWorkflowStore = useTaskWorkflowStore()
const route = useRoute()
const companyId = route.params.companyId

// Get the form elements from the company connector
const formElements = computed(() => {
  return taskWorkflowStore.gatherRequest
    ? taskWorkflowStore.gatherRequest.sections[0]?.elements
    : companyStore.company?.connector?.options?.sections[0]?.elements
})

// Makes sure the right fields are shown
const filteredFormElements = computed(() => {
  return formElements.value.filter((element) => {
    return elementMeetsConditions({
      currentFormData: taskWorkflowStore.userInput,
      requestType: props.requestType,
      product: 'deposit',
      element
    })
  })
})

// Whenever a user interacts with an input, update our userInput object
const onInput = function (element) {
  taskWorkflowStore.updateUserInput({ element, requestType: props.requestType })

  // If the user presses a button, also submit the form
  if (element.component === USER_INPUT_ELEMENT_TYPES.BUTTON) {
    onSubmit()
  }
}

const onSubmit = async function () {
  emit('onSubmit')
}

// Lifecycle hooks
onMounted(async () => {
  await companyStore.getCompany(companyId)
})

// @TODO handle authenticators
// @TODO handle multi-payroll options
// @TODO handle configurable connectors (e.g. Workday)
</script>
