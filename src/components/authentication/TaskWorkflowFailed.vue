<template>
  <article>
    <h3>❌ Failure state</h3>
    <footer>
      <h6>Details</h6>
      <p v-if="taskWorkflowStore.isAuthenticated === false">
        <kbd>
          {{ taskWorkflowStore.payload.failReason }}
        </kbd>
      </p>
      <small><pre>JSON Payload</pre></small>
      <pre>{{ taskWorkflowStore.payload }}</pre>
    </footer>
  </article>
  <button @click="tryAgain">Try Again</button>
</template>

<script setup>
import { AUTHENTICATION_STATUS } from '@/util/constants'
import { useTaskWorkflowStore } from '@/stores/task-workflow'
const taskWorkflowStore = useTaskWorkflowStore()

const tryAgain = function () {
  taskWorkflowStore.status = AUTHENTICATION_STATUS.AUTHENTICATION
}
</script>
