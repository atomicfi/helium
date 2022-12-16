<template>
  <article>
    <h3>Who pays you?</h3>
    <input
      type="search"
      id="search"
      name="search"
      v-model="query"
      placeholder="Employer or payroll provider"
      @input="onInput"
    />
    <progress id="progress" v-if="companyStore.isSearching"></progress>
    <p v-else>{{ query ? `Results for ${query}` : 'Popular' }}</p>
    <hr />

    <ul>
      <li v-for="company in companyStore.searchResults" :key="company._id">
        <RouterLink :to="`/authenticate/${company._id}`"
          >{{ company.name }}
        </RouterLink>
        <small v-if="company.subtext">{{ company.subtext }}</small>
      </li>
    </ul>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCompanyStore } from '@/stores/company'
import debounce from 'lodash/debounce'
const companyStore = useCompanyStore()
const query = ref('')

const onInput = debounce(() => {
  companyStore.search(query.value)
}, 200)

// Lifecycle hooks
onMounted(async () => {
  await companyStore.search(query.value)
})
</script>

<style scoped>
ul,
li {
  list-style-type: none;
  list-style-position: inside;
  margin: 0px;
  padding: 0px;
}
p {
  margin-bottom: 0px;
}
small {
  opacity: 0.5;
  font-size: 14px;
  margin-left: 5px;
}
</style>
