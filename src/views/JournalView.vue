<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import JournalCard from '../components/JournalCard.vue'
import { useJournal } from '../composables/useJournal.js'
import { localize } from '../utils/localized.js'

const { t, locale } = useI18n()
const { articles: journalArticles, categories, featured, loading, loadArticles } = useJournal()
const activeCategory = ref('all')

const visibleCategories = computed(() => categories.value.filter((category) => (
  journalArticles.value.some((article) => article.category === category.key)
)))

const filteredArticles = computed(() => journalArticles.value.filter((article) => {
  if (article.slug === featured.value?.slug) return false
  return activeCategory.value === 'all' || article.category === activeCategory.value
}))

onMounted(() => loadArticles())
watch(visibleCategories, (items) => {
  if (activeCategory.value !== 'all' && !items.some((item) => item.key === activeCategory.value)) {
    activeCategory.value = 'all'
  }
})

function setCategory(key) {
  activeCategory.value = key
}
</script>

<template>
  <main class="journal-page">
    <header class="journal-hero">
      <svg class="life-thread" viewBox="0 0 900 280" fill="none" aria-hidden="true">
        <path d="M-30 205C120 35 225 285 388 125C530-15 612 245 930 42" />
      </svg>
      <div class="journal-hero__inner">
        <span class="eyebrow">{{ t('journal.eyebrow') }}</span>
        <div class="journal-hero__copy">
          <h1>{{ t('journal.title') }}</h1>
          <p>{{ t('journal.lead') }}</p>
        </div>
        <p class="journal-hero__note">{{ t('journal.note') }}</p>
      </div>
    </header>

    <section class="featured container" :aria-label="t('journal.featured')">
      <div class="section-kicker">
        <span>{{ t('journal.featured') }}</span>
        <span class="section-kicker__line" aria-hidden="true"></span>
      </div>
      <JournalCard v-if="featured" :article="featured" :index="0" variant="featured" />
    </section>

    <section class="journal-library container" aria-labelledby="latest-heading">
      <div class="library-head">
        <div>
          <span class="eyebrow">{{ t('journal.latestEyebrow') }}</span>
          <h2 id="latest-heading">{{ t('journal.latestTitle') }}</h2>
        </div>

        <div class="category-filter" role="group" :aria-label="t('journal.filterLabel')">
          <button
            type="button"
            :class="{ 'is-active': activeCategory === 'all' }"
            :aria-pressed="activeCategory === 'all'"
            @click="setCategory('all')"
          >
            {{ t('journal.allCategories') }}
          </button>
          <button
            v-for="category in visibleCategories"
            :key="category.key"
            type="button"
            :class="{ 'is-active': activeCategory === category.key }"
            :aria-pressed="activeCategory === category.key"
            @click="setCategory(category.key)"
          >
            {{ localize(category.label, locale) }}
          </button>
        </div>
      </div>

      <div v-if="filteredArticles.length" class="article-grid" aria-live="polite">
        <JournalCard
          v-for="(article, index) in filteredArticles"
          :key="article.slug"
          :article="article"
          :index="index + 1"
          :class="{ 'article-grid__wide': index === 0 }"
        />
      </div>
      <p v-else-if="!loading" class="empty-state">{{ t('journal.empty') }}</p>
    </section>

    <section class="journal-cta container">
      <div class="journal-cta__panel">
        <span class="journal-cta__orb" aria-hidden="true"></span>
        <span class="eyebrow">{{ t('journal.ctaEyebrow') }}</span>
        <h2>{{ t('journal.ctaTitle') }}</h2>
        <p>{{ t('journal.ctaBody') }}</p>
        <a href="#latest-heading" class="btn-primary">{{ t('journal.cta') }}</a>
      </div>
    </section>
  </main>
</template>

<style scoped>
.journal-page { width: 100%; max-width: 100%; overflow-x: clip; background: var(--cream); }
.journal-page *, .journal-page *::before, .journal-page *::after { box-sizing: border-box; min-width: 0; }

.journal-hero {
  position: relative;
  min-height: min(690px, 78vh);
  display: flex;
  align-items: flex-end;
  padding: clamp(9rem, 18vh, 13rem) 0 clamp(4rem, 8vw, 7rem);
  background:
    radial-gradient(circle at 14% 28%, rgba(255, 146, 92, .18), transparent 29%),
    linear-gradient(150deg, #f9f4df 0%, #f5f5e6 56%, #e6efdc 100%);
  border-bottom: 1px solid rgba(0, 41, 0, .14);
}

.journal-hero__inner {
  position: relative;
  z-index: 1;
  inline-size: min(1280px, calc(100% - 3rem));
  max-inline-size: 100%;
  margin-inline: auto;
}

.journal-hero__copy {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(260px, .55fr);
  gap: clamp(2rem, 8vw, 8rem);
  align-items: end;
  margin-top: 1.6rem;
}

.journal-hero h1 {
  max-width: 12ch;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(4rem, 9vw, 9.2rem);
  font-weight: 550;
  line-height: .86;
  letter-spacing: -.065em;
  overflow-wrap: anywhere;
}

html[lang='fa'] .journal-hero h1 {
  max-width: 16ch;
  font-size: clamp(2.75rem, 5vw, 5.4rem);
  line-height: 1.35;
  letter-spacing: -.025em;
  font-weight: 700;
}

.journal-hero__copy p {
  max-width: 34ch;
  margin: 0 0 .6rem;
  color: var(--ink-soft);
  font-size: clamp(1rem, 1.35vw, 1.2rem);
  line-height: 1.8;
}

.journal-hero__note {
  width: fit-content;
  max-width: 38ch;
  margin: clamp(3rem, 6vw, 5rem) 0 0 auto;
  padding-inline-start: 1rem;
  color: var(--muted);
  border-inline-start: 2px solid var(--orange);
  font-size: .82rem;
  line-height: 1.65;
}

html[dir='rtl'] .journal-hero__note { margin-left: 0; margin-right: auto; }

.life-thread {
  position: absolute;
  inset-inline-start: 50%;
  top: 43%;
  width: max(900px, 100%);
  transform: translateX(-50%);
  height: auto;
  color: var(--orange);
  opacity: .52;
  pointer-events: none;
}

.life-thread path {
  stroke: currentColor;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 16 14;
  animation: thread-drift 18s linear infinite;
}

@keyframes thread-drift { to { stroke-dashoffset: -300; } }

.featured, .journal-library, .journal-cta { inline-size: min(1280px, calc(100% - 3rem)); max-inline-size: 100%; margin-inline: auto; }
.featured { padding-block: clamp(3.5rem, 6vw, 6rem); }

.section-kicker {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.2rem;
  color: var(--coral-deep);
  font-size: .75rem;
  font-weight: 800;
  letter-spacing: .11em;
  text-transform: uppercase;
}

html[lang='fa'] .section-kicker { letter-spacing: 0; }
.section-kicker__line { width: 72px; height: 1px; background: var(--orange); }

.journal-library {
  padding-block: clamp(3.5rem, 6vw, 6rem);
  border-top: 1px solid rgba(0, 41, 0, .14);
}

.library-head {
  display: grid;
  grid-template-columns: minmax(240px, .65fr) minmax(0, 1.35fr);
  gap: 3rem;
  align-items: end;
  margin-bottom: clamp(2rem, 4vw, 3.25rem);
}

.library-head h2 {
  max-width: 10ch;
  margin: .8rem 0 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 5vw, 5.2rem);
  font-weight: 560;
  line-height: .98;
  letter-spacing: -.045em;
}

html[lang='fa'] .library-head h2 { line-height: 1.3; font-weight: 800; }

.category-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: .55rem;
}

.category-filter button {
  appearance: none;
  padding: .68rem 1rem;
  color: var(--ink-soft);
  background: transparent;
  border: 1px solid rgba(0, 41, 0, .23);
  border-radius: 999px;
  font: inherit;
  font-size: .78rem;
  font-weight: 700;
  cursor: pointer;
  overflow-wrap: anywhere;
  transition: background .25s ease, color .25s ease, border-color .25s ease;
}

.category-filter button:hover,
.category-filter button:focus-visible,
.category-filter button.is-active {
  color: #f5f5e6;
  background: var(--ink);
  border-color: var(--ink);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(2.25rem, 4vw, 3.75rem) clamp(1.25rem, 2.5vw, 2.25rem);
  align-items: start;
}

.article-grid > * { min-width: 0; }

.article-grid > :nth-child(3n + 2) {
  padding-inline-start: clamp(.5rem, 1.2vw, 1.25rem);
  border-inline-start: 1px solid rgba(0, 41, 0, .14);
}

.article-grid > :nth-child(3n) {
  padding-inline-start: clamp(.5rem, 1.2vw, 1.25rem);
  border-inline-start: 1px solid rgba(0, 41, 0, .14);
}

.article-grid > * {
  animation: journal-reveal .62s cubic-bezier(.16, 1, .3, 1) both;
}

.article-grid > :nth-child(2) { animation-delay: .06s; }
.article-grid > :nth-child(3) { animation-delay: .12s; }

@keyframes journal-reveal {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.journal-page :deep(.journal-card__link:focus-visible) {
  outline: 3px solid rgba(255, 146, 92, .8);
  outline-offset: 6px;
  border-radius: 18px;
}

.journal-page :deep(.journal-card__link) { gap: .9rem; }
.journal-page :deep(.journal-card__media) { aspect-ratio: 4 / 3; }
.journal-page :deep(.journal-card__body) { gap: .58rem; }
.journal-page :deep(.journal-card__meta) { font-size: .67rem; font-weight: 650; }
.journal-page :deep(.journal-card h3) { max-width: 22ch; font-size: clamp(1.35rem, 2vw, 1.8rem); line-height: 1.16; }
.journal-page :deep(.journal-card p) { font-size: .9rem; line-height: 1.65; }
.journal-page :deep(.journal-card__read) { margin-top: .1rem; font-size: .78rem; }

.journal-page :deep(.journal-card--featured .journal-card__link) {
  grid-template-columns: minmax(0, 1.18fr) minmax(280px, .82fr);
  gap: clamp(1.75rem, 4vw, 3.75rem);
}

.journal-page :deep(.journal-card--featured .journal-card__media) {
  aspect-ratio: 16 / 9;
  border-radius: 68px 16px 68px 16px;
}

.journal-page :deep(.journal-card--featured h3) {
  max-width: 15ch;
  font-size: clamp(2rem, 3.6vw, 3.65rem);
}

html[lang='fa'] .journal-page :deep(.journal-card h3) {
  font-size: clamp(1.18rem, 1.7vw, 1.52rem);
  font-weight: 650;
  line-height: 1.58;
  overflow-wrap: normal;
  word-break: normal;
}

html[lang='fa'] .journal-page :deep(.journal-card--featured h3) {
  max-width: 19ch;
  font-size: clamp(1.75rem, 3vw, 2.8rem);
  font-weight: 700;
  line-height: 1.48;
}

html[lang='fa'] .journal-page :deep(.journal-card p) { font-size: .88rem; line-height: 1.9; }
html[lang='fa'] .journal-page :deep(.journal-card__meta) { font-size: .65rem; font-weight: 500; }

.empty-state {
  padding: 4rem;
  text-align: center;
  color: var(--muted);
  border: 1px dashed rgba(0, 41, 0, .25);
  border-radius: 28px;
}

.journal-cta { padding-block: clamp(2rem, 6vw, 6rem) clamp(5rem, 9vw, 9rem); }

.journal-cta__panel {
  position: relative;
  overflow: hidden;
  padding: clamp(3rem, 7vw, 6.5rem);
  color: #f5f5e6;
  background: var(--ink);
  border-radius: 80px 20px 80px 20px;
}

.journal-cta__panel .eyebrow { color: var(--orange); }
.journal-cta__panel h2 {
  max-width: 13ch;
  margin: 1rem 0;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5vw, 5rem);
  font-weight: 560;
  line-height: 1;
}

html[lang='fa'] .journal-cta__panel h2 { line-height: 1.35; font-weight: 800; }
.journal-cta__panel p { max-width: 50ch; margin: 0 0 2rem; color: rgba(245, 245, 230, .76); line-height: 1.75; }
.journal-cta__panel .btn-primary { position: relative; z-index: 1; }

.journal-cta__orb {
  position: absolute;
  width: 20rem;
  height: 20rem;
  inset-inline-end: -4rem;
  top: -6rem;
  border: 1px solid rgba(255, 146, 92, .5);
  border-radius: 50%;
  box-shadow: 0 0 0 42px rgba(255, 146, 92, .055), 0 0 0 84px rgba(255, 146, 92, .035);
}

@media (max-width: 850px) {
  .journal-hero__copy, .library-head { grid-template-columns: 1fr; }
  .journal-hero h1 { font-size: clamp(3.6rem, 17vw, 6.2rem); }
  .journal-hero__note { margin-inline-start: 0; }
  .category-filter { justify-content: flex-start; }
  .article-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .article-grid > :nth-child(3n + 2),
  .article-grid > :nth-child(3n) { padding-inline-start: 0; border-inline-start: 0; }
  .article-grid > :nth-child(even) { padding-inline-start: 1.25rem; border-inline-start: 1px solid rgba(0, 41, 0, .14); }
  .journal-page :deep(.journal-card--featured .journal-card__link) { grid-template-columns: 1fr; gap: 1.25rem; }
  .journal-page :deep(.journal-card--featured h3) { font-size: clamp(1.85rem, 6vw, 2.8rem); }
}

@media (max-width: 540px) {
  .journal-hero__inner, .featured, .journal-library, .journal-cta { inline-size: min(100% - 2rem, 1280px); }
  .journal-hero { min-height: 620px; }
  .journal-cta__panel { border-radius: 44px 14px 44px 14px; }
  .article-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .article-grid > :nth-child(even) { padding-inline-start: 0; border-inline-start: 0; }
  .journal-page :deep(.journal-card--featured h3) { font-size: clamp(1.65rem, 8vw, 2.25rem); }
  html[lang='fa'] .journal-page :deep(.journal-card--featured h3) { font-size: clamp(1.48rem, 7.2vw, 2rem); }
}

@media (max-width: 540px) {
  html[lang='fa'] .journal-hero h1 {
    font-size: clamp(2.25rem, 11vw, 3.15rem);
    line-height: 1.42;
  }
}

@media (prefers-reduced-motion: reduce) {
  .life-thread path { animation: none; }
  .article-grid > * { animation: none; }
}
</style>
