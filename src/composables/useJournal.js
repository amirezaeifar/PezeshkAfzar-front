import { computed, ref } from 'vue'
import { journalArticles as fallbackArticles, journalCategories } from '../data/journal.js'
import { journalApi } from '../services/journalApi.js'

const articles = ref([...fallbackArticles])
const categories = ref([...journalCategories])
const loading = ref(false)
const apiAvailable = ref(true)
let loaded = false

export function useJournal() {
  async function loadCategories() {
    try {
      const payload = await journalApi.listCategories()
      categories.value = payload.categories || []
    } catch {
      const usedKeys = new Set(articles.value.map((article) => article.category))
      categories.value = [...usedKeys].map((key) => (
        journalCategories.find((category) => category.key === key)
        || { key, label: { en: key, fa: key } }
      ))
    }
    return categories.value
  }

  async function loadArticles({ force = false } = {}) {
    if (loading.value || (loaded && !force)) return articles.value

    loading.value = true
    try {
      const payload = await journalApi.listPublic()
      articles.value = payload.articles || []
      await loadCategories()
      apiAvailable.value = true
      loaded = true
    } catch {
      // Keep the three bundled launch stories visible when the local API is offline.
      apiAvailable.value = false
    } finally {
      loading.value = false
    }
    return articles.value
  }

  const getArticle = (slug) => articles.value.find((item) => item.slug === slug)
  const getCategory = (key) => categories.value.find((item) => item.key === key)
  const featured = computed(() => articles.value.find((item) => item.featured) ?? articles.value[0])

  return { articles, categories, featured, loading, apiAvailable, loadArticles, loadCategories, getArticle, getCategory }
}
