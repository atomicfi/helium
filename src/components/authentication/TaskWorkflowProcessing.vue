<template>
  <article>
    <div v-if="!taskWorkflowStore.isAuthenticated">
      <h2>🔒 Authenticating...</h2>
      <h2 class="inactive" v-if="!taskWorkflowStore.isAuthenticated">
        🏦 Update deposit account
      </h2>
    </div>
    <div v-else>
      <h2 class="inactive"><s>✅ Authenticated</s></h2>
      <h2>🏦 Updating deposit account...</h2>
    </div>
    <progress></progress>
  </article>
</template>

<script setup>
import { useTaskWorkflowStore } from '@/stores/task-workflow'
const taskWorkflowStore = useTaskWorkflowStore()
</script>

<style scoped>
.inactive {
  opacity: 0.3;
}
</style>
