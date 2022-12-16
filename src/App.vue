<template>
  <header>
    <div class="grid" id="grid">
      <div><img :src="`/logo-${darkMode ? 'dark' : 'light'}.png`" /></div>
      <div class="contrast-switcher">
        <label for="terms">
          <input
            :v-model="darkMode"
            @input="toggleDarkMode"
            type="checkbox"
            role="switch"
            id="dark"
            name="dark"
            checked
          />
          Dark
        </label>
      </div>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
  <footer>
    Made with ❤️ by
    <a href="https://docs.atomicfi.com" target="_blank">Atomic</a>
  </footer>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
const darkMode = ref(true)

const toggleDarkMode = function () {
  setDarkMode(!darkMode.value)
}
const setDarkMode = function (darkModePreference) {
  console.log('setting dark mode', darkModePreference)
  darkMode.value = darkModePreference
  const htmlElement = document.querySelector('html')
  htmlElement.setAttribute('data-theme', darkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    setDarkMode(true)
  } else {
    setDarkMode(false)
  }
})
</script>

<style scoped>
footer {
  text-align: center;
}
header {
  text-align: left;
}
img {
  height: 80px;
}
.grid {
  column-count: 2;
}
.contrast-switcher {
  text-align: right;
  padding-top: 30px;
}
</style>
