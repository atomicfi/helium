<template>
  <GatherCredentials
    v-if="taskWorkflowStore.status === AUTHENTICATION_STATUS.AUTHENTICATION"
    :activeError="activeError"
    @onSubmit="startTaskWorkflow"
    :requestType="REQUEST_TYPES.AUTHENTICATION"
  />
  <TaskWorkflowProcessing
    v-if="taskWorkflowStore.status === AUTHENTICATION_STATUS.PROCESSING"
  />
  <GatherCredentials
    v-if="taskWorkflowStore.status === AUTHENTICATION_STATUS.MFA"
    @onSubmit="submitGatherResponse"
    :requestType="REQUEST_TYPES.MFA"
  />
  <TaskWorkflowCompleted
    v-else-if="taskWorkflowStore.status === AUTHENTICATION_STATUS.COMPLETED"
  />
  <TaskWorkflowFailed
    v-else-if="taskWorkflowStore.status === AUTHENTICATION_STATUS.FAILED"
  />
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import GatherCredentials from '@/components/authentication/GatherCredentials.vue'
import TaskWorkflowCompleted from '@/components/authentication/TaskWorkflowCompleted.vue'
import TaskWorkflowFailed from '@/components/authentication/TaskWorkflowFailed.vue'
import TaskWorkflowProcessing from '@/components/authentication/TaskWorkflowProcessing.vue'
import {
  AUTHENTICATION_STATUS,
  PUSHER_EVENTS,
  USER_MESSAGE_TYPES,
  REQUEST_TYPES
} from '@/util/constants'
import { useTaskWorkflowStore } from '@/stores/task-workflow'
import Pusher from '@/plugins/pusher'
const taskWorkflowStore = useTaskWorkflowStore()

const activeError = ref(undefined)

function _unsubscribeFromTaskEvents({ taskWorkflowId }) {
  const pusherInstance = Pusher.get()

  pusherInstance.unsubscribe(`presence-${taskWorkflowId}`)
  pusherInstance.unsubscribe(`private-external-${taskWorkflowId}`)
}

async function _handleGatherRequest({ payload }) {
  taskWorkflowStore.status = AUTHENTICATION_STATUS.MFA
  taskWorkflowStore.gatherRequest = payload
}

async function _handleDisplayAccounts({ payload }) {
  console.log('unhandled state: should display accounts', payload)
  // @TODO handle displaying of accounts
}

async function _handleAuthenticationSuccessful({ payload: authPayload }) {
  console.log('authentication was successful', authPayload)
  taskWorkflowStore.isAuthenticated = true
}

async function _handleAuthenticationFailed({ taskWorkflowId, payload }) {
  taskWorkflowStore.status = AUTHENTICATION_STATUS.FAILED
  taskWorkflowStore.isAuthenticated = false
  taskWorkflowStore.payload = payload
  taskWorkflowStore.reset()
  _unsubscribeFromTaskEvents({ taskWorkflowId })
}

function _handleFractionalDepositError({ payload }) {
  console.log('unhandled state: fractional deposit error', payload)
  // @TODO handle fractional deposit error
}

async function _handleManualMode({ payload }) {
  console.log('unhandled state: QA inspection', payload)
  taskWorkflowStore.payload = payload
  // @TODO handle quality assurance inspection
}
function _handleTaskWorkflowFinished({ taskWorkflowId }) {
  taskWorkflowStore.status = AUTHENTICATION_STATUS.COMPLETED
  taskWorkflowStore.reset()
  _unsubscribeFromTaskEvents({ taskWorkflowId })
}

async function _handleTaskFailed({ taskWorkflowId, payload }) {
  taskWorkflowStore.status = AUTHENTICATION_STATUS.FAILED
  taskWorkflowStore.payload = payload
  taskWorkflowStore.reset()
  _unsubscribeFromTaskEvents({ taskWorkflowId })
}

const userMessageHandlerConfig = {
  [USER_MESSAGE_TYPES.GATHER_REQUEST]: _handleGatherRequest,
  [USER_MESSAGE_TYPES.DISPLAY_DEPOSIT_ACCOUNTS]: _handleDisplayAccounts,
  [USER_MESSAGE_TYPES.AUTHENTICATION_SUCCESSFUL]:
    _handleAuthenticationSuccessful,
  [USER_MESSAGE_TYPES.AUTHENTICATION_FAILED]: _handleAuthenticationFailed,
  [USER_MESSAGE_TYPES.FRACTIONAL_DEPOSIT_ERROR]: _handleFractionalDepositError,
  [USER_MESSAGE_TYPES.MANUAL_MODE]: _handleManualMode,
  [USER_MESSAGE_TYPES.TASK_FAILED]: _handleTaskFailed,
  [USER_MESSAGE_TYPES.TASK_WORKFLOW_FINISHED]: _handleTaskWorkflowFinished
}

const bindToUserMessageEvents = function ({ channel, taskWorkflowId }) {
  Object.entries(userMessageHandlerConfig).forEach(
    ([messageType, messageHandler]) =>
      channel.bind(messageType, async (payload) => {
        messageHandler({ payload, taskWorkflowId })
      })
  )
}

const startTaskWorkflow = async function () {
  try {
    await taskWorkflowStore.createTaskWorkflow()
    activeError.value = undefined
    const pusherInstance = Pusher.get()
    const presence = pusherInstance.subscribe(
      `presence-${taskWorkflowStore.taskWorkflow._id}`
    )
    const channel = pusherInstance.subscribe(
      `private-external-${taskWorkflowStore.taskWorkflow._id}`
    )

    presence.bind(PUSHER_EVENTS.SUBSCRIPTION_ERROR, function (status) {
      console.log('Error subscribing to presence channel', status)
    })

    bindToUserMessageEvents({
      channel,
      taskWorkflowId: taskWorkflowStore.taskWorkflow._id
    })
  } catch (error) {
    activeError.value = error.response.data
    taskWorkflowStore.isCreatingWorkflow = false
  }
}

const submitGatherResponse = function () {
  taskWorkflowStore.sendMfaResponse()
}

onUnmounted(
  () => (taskWorkflowStore.status = AUTHENTICATION_STATUS.AUTHENTICATION)
)
</script>
