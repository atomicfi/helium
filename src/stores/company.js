import { ref } from 'vue'
import { defineStore } from 'pinia'
import { makeRequest } from '@/lib/request'

export const useCompanyStore = defineStore('company', () => {
  const company = ref(undefined)
  const searchResults = ref(undefined)
  const isSearching = ref(false)
  const isLoadingCompany = ref(false)

  async function getCompany(id) {
    isLoadingCompany.value = true
    const response = await makeRequest({
      method: 'GET',
      endpoint: `/company/${id}`
    })

    company.value = response.data.data
    isLoadingCompany.value = false
  }

  async function search(query) {
    isSearching.value = true
    const response = await makeRequest({
      method: 'POST',
      endpoint: '/company/search',
      data: {
        query
      }
    })
    searchResults.value = response.data.data
    isSearching.value = false
  }

  return {
    company,
    getCompany,
    search,
    searchResults,
    isSearching,
    isLoadingCompany
  }
})
