import { ref } from 'vue'
import { defineStore } from 'pinia'
import { makeRequest } from '@/lib/request'

export const useUserStore = defineStore('user', () => {
  const userData = ref(undefined)

  async function setUser() {
    const response = await makeRequest({
      method: 'GET',
      endpoint: '/user?products=deposit'
    })
    userData.value = response.data.data
    return response.data.data
  }

  async function getUserData() {
    if (!userData.value) await setUser()
    return userData
  }

  return { userData, setUser, getUserData }
})
