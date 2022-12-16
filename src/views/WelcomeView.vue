<template>
  <main>
    <article>
      <h2>👋 Welcome!</h2>
      <p>
        Helium is a starting point to help you build your own user experience.
        It was built during hack days at Atomic with
        <a href="https://vuejs.org/" target="_blank">Vue.js</a> &
        <a href="https://picocss.com/" target="_blank">Pico.css</a>.
      </p>
      <input
        type="text"
        name="access-token"
        v-model="newToken"
        placeholder="Sandbox Access Token"
        aria-label="Access Token"
        :aria-invalid="isTokenInvalid"
        required
      />
      <p>
        <a
          href="https://docs.atomicfi.com/reference/api#access-token"
          target="_blank"
          >Learn how to create a sandbox access token</a
        >
      </p>
      <button :aria-busy="verifyingToken" @click="useToken">
        {{ verifyingToken ? '' : 'Continue' }}
      </button>
    </article>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const router = useRouter()
const userStore = useUserStore()

// Local state
const newToken = ref('')
const verifyingToken = ref(false)
const isTokenInvalid = ref(undefined)

// Methods
async function useToken() {
  isTokenInvalid.value = undefined
  verifyingToken.value = true

  try {
    localStorage.setItem('token', newToken.value)
    await userStore.setUser()
    verifyingToken.value = false
    isTokenInvalid.value = false
    router.push({ path: '/search' })
  } catch (error) {
    isTokenInvalid.value = true
    verifyingToken.value = false
    throw error
  }
}

// Lifecycle hooks
onMounted(() => {
  newToken.value = localStorage.getItem('token')
})
</script>
