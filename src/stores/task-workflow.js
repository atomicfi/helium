import { ref } from 'vue'
import { defineStore } from 'pinia'
import { AUTHENTICATION_STATUS } from '@/util/constants'
import { makeRequest } from '@/lib/request'
import { useCompanyStore } from '@/stores/company'
import { useUserStore } from '@/stores/user'

export const useTaskWorkflowStore = defineStore('task-workflow', () => {
  const taskWorkflow = ref(undefined)
  const userInput = ref({})
  const isCreatingWorkflow = ref(false)
  const status = ref(AUTHENTICATION_STATUS.AUTHENTICATION)
  const isAuthenticated = ref(undefined)
  const payload = ref({})
  const gatherRequest = ref(undefined)

  async function createTaskWorkflow() {
    isCreatingWorkflow.value = true

    const userStore = useUserStore()
    const companyStore = useCompanyStore()
    const userData = await userStore.getUserData()

    let data = {
      type: 'custom',
      userInput: userInput.value,
      automationDevice: 'cloud',
      authenticationFlowId: 'auth',
      company: companyStore.company._id,
      connector: companyStore.company.connector._id,
      tasks: [
        {
          product: 'deposit',
          settings: {
            deposit: {
              distributionType: 'total',
              distributionAction: 'create'
            },
            destinationUserAccountId: userData?.user?.accounts[0]?._id
          }
        }
      ]
    }
    const response = await makeRequest({
      method: 'POST',
      endpoint: '/task-workflow/',
      data
    })

    isCreatingWorkflow.value = false
    status.value = AUTHENTICATION_STATUS.PROCESSING
    userInput.value = {}
    taskWorkflow.value = response.data.data.taskWorkflow
  }

  async function sendMfaResponse() {
    status.value = AUTHENTICATION_STATUS.PROCESSING

    const data = {
      taskId: gatherRequest.value.taskId,
      userInput: userInput.value
    }

    await makeRequest({
      method: 'POST',
      endpoint: '/task/message',
      data
    })

    userInput.value = {}
    gatherRequest.value = undefined
  }

  function updateUserInput({ element, requestType }) {
    if (!userInput.value[requestType]) userInput.value[requestType] = {}
    userInput.value[requestType][element.name] = {
      component: element.component,
      id: element.id || Date.now(), // If there is not an id, just use a unique value
      value: element.value
    }
  }

  function reset() {
    userInput.value = {}
    taskWorkflow.value = undefined
    isAuthenticated.value = undefined
    gatherRequest.value = undefined
  }

  return {
    createTaskWorkflow,
    isCreatingWorkflow,
    isAuthenticated,
    gatherRequest,
    status,
    payload,
    taskWorkflow,
    updateUserInput,
    userInput,
    reset,
    sendMfaResponse
  }
})
