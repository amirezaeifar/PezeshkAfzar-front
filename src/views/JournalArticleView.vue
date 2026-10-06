<script setup>
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import JournalCard from '../components/JournalCard.vue'
import { useJournal } from '../composables/useJournal.js'
import { localize } from '../utils/localized.js'
import { safeContentUrl, sanitizeRichHtml } from '../utils/sanitizeRichHtml.js'

const route = useRoute()
const { t, locale } = useI18n()
const { articles: journalArticles, getArticle, getCategory, loading, loadArticles } = useJournal()

const article = computed(() => getArticle(route.params.slug))
const category = computed(() => article.value ? getCategory(article.value.category) : null)
const richSection = computed(() => article.value?.sections?.find((section) => section.html))

const richBodyHtml = computed(() => sanitizeRichHtml(localize(richSection.value?.html, locale.value)))
const tableOfContents = computed(() => {
  if (!article.value) return []
  if (!richSection.value) {
    return article.value.sections.map((section) => ({
      id: section.id,
      label: localize(section.heading, locale.value),
      level: 2,
    }))
  }
  const template = document.createElement('template')
  template.innerHTML = richBodyHtml.value
  return [...template.content.querySelectorAll('h2, h3')].map((heading) => ({
    id: heading.id,
    label: heading.textContent.trim(),
    level: heading.tagName === 'H3' ? 3 : 2,
  })).filter((item) => item.id && item.label)
})
const related = computed(() => {
  if (!article.value) return []
  const sameCategory = journalArticles.value.filter((item) => item.slug !== article.value.slug && item.category === article.value.category)
  const others = journalArticles.value.filter((item) => item.slug !== article.value.slug && item.category !== article.value.category)
  return [...sameCategory, ...others].slice(0, 3)
})

onMounted(() => loadArticles())
watch(() => route.params.slug, () => loadArticles({ force: true }))

function formatDate(date) {
  return new Intl.DateTimeFormat(locale.value === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(`${date}T12:00:00Z`))
}
</script>

<template>
  <main v-if="article" class="article-page">
    <header class="article-header container">
      <nav class="breadcrumb" :aria-label="t('journal.article.breadcrumbLabel')">
        <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
        <span aria-hidden="true">/</span>
        <RouterLink to="/journal">{{ t('nav.journal') }}</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ localize(category?.label, locale) }}</span>
      </nav>

      <div class="article-heading">
        <div class="article-heading__main">
          <span class="article-category">{{ localize(category?.label, locale) }}</span>
          <h1>{{ localize(article.title, locale) }}</h1>
          <p class="article-deck">{{ localize(article.summary, locale) }}</p>
        </div>

        <dl class="article-byline">
          <div>
            <dt>{{ t('journal.article.writtenBy') }}</dt>
            <dd>{{ localize(article.author, locale) }}</dd>
          </div>
          <div v-if="article.reviewer">
            <dt>{{ t('journal.article.reviewedBy') }}</dt>
            <dd>{{ localize(article.reviewer, locale) }}</dd>
          </div>
          <div>
            <dt>{{ t('journal.article.published') }}</dt>
            <dd><time :datetime="article.datePublished">{{ formatDate(article.datePublished) }}</time></dd>
          </div>
          <div>
            <dt>{{ t('journal.article.updated') }}</dt>
            <dd><time :datetime="article.dateModified">{{ formatDate(article.dateModified) }}</time></dd>
          </div>
          <div>
            <dt>{{ t('journal.article.readingTimeLabel') }}</dt>
            <dd>{{ t('journal.readingTime', { count: article.readingMinutes }) }}</dd>
          </div>
        </dl>
      </div>
    </header>

    <figure class="article-hero container">
      <img
        :src="article.image"
        :srcset="article.imageSrcset"
        sizes="(max-width: 720px) 94vw, 1200px"
        :alt="localize(article.alt, locale)"
        decoding="async"
        fetchpriority="high"
      />
    </figure>

    <div class="article-layout container">
      <aside class="article-toc" :aria-label="t('journal.article.onThisPage')">
        <span>{{ t('journal.article.onThisPage') }}</span>
        <ol>
          <li v-for="section in tableOfContents" :key="section.id" :class="{ 'toc-subitem': section.level === 3 }">
            <a :href="`#${section.id}`">{{ section.label }}</a>
          </li>
        </ol>
      </aside>

      <article class="article-body">
        <p class="article-body__opening">{{ localize(article.summary, locale) }}</p>

        <div v-if="richSection" class="article-rich-content" v-html="richBodyHtml"></div>
        <template v-else>
          <section v-for="section in article.sections" :id="section.id" :key="section.id">
            <h2>{{ localize(section.heading, locale) }}</h2>
            <p v-for="(paragraph, index) in section.paragraphs" :key="index">
              {{ localize(paragraph, locale) }}
            </p>
            <ul v-if="section.bullets">
              <li v-for="(bullet, index) in section.bullets" :key="index">{{ localize(bullet, locale) }}</li>
            </ul>
          </section>
        </template>

        <aside v-if="article.medical" class="medical-note">
          <strong>{{ t('journal.article.disclaimerTitle') }}</strong>
          <p>{{ t('journal.article.disclaimer') }}</p>
        </aside>

        <section class="article-sources" aria-labelledby="sources-heading">
          <h2 id="sources-heading">{{ t('journal.article.sources') }}</h2>
          <ol>
            <li v-for="source in article.sources" :key="source.url">
              <a v-if="safeContentUrl(source.url)" :href="safeContentUrl(source.url)" target="_blank" rel="noopener noreferrer">
                {{ localize(source.label, locale) }}
                <span aria-hidden="true">↗</span>
              </a>
              <span v-else>{{ localize(source.label, locale) }}</span>
            </li>
          </ol>
        </section>

        <RouterLink to="/journal" class="back-link">
          <span aria-hidden="true">←</span>
          {{ t('journal.article.back') }}
        </RouterLink>
      </article>
    </div>

    <section class="related container" aria-labelledby="related-heading">
      <div class="related__head">
        <span class="eyebrow">{{ t('journal.article.keepReading') }}</span>
        <h2 id="related-heading">{{ t('journal.article.related') }}</h2>
      </div>
      <div class="related__grid">
        <JournalCard
          v-for="(item, index) in related"
          :key="item.slug"
          :article="item"
          :index="index"
          variant="home"
        />
      </div>
    </section>

    <section class="article-cta container">
      <div>
        <span class="eyebrow">{{ t('journal.ctaEyebrow') }}</span>
        <h2>{{ t('journal.article.ctaTitle') }}</h2>
      </div>
      <RouterLink to="/journal" class="btn-primary">{{ t('journal.cta') }}</RouterLink>
    </section>
  </main>

  <main v-else-if="!loading" class="article-missing container">
    <span class="eyebrow">404</span>
    <h1>{{ t('journal.article.notFound') }}</h1>
    <RouterLink to="/journal" class="btn-primary">{{ t('journal.article.back') }}</RouterLink>
  </main>

  <main v-else class="article-missing container" aria-live="polite">
    <span class="eyebrow">Journal</span>
    <h1>…</h1>
  </main>
</template>

<style scoped>
.article-page { overflow: clip; background: var(--cream); }

.article-header {
  padding-top: clamp(9rem, 15vw, 12rem);
  padding-bottom: clamp(3.5rem, 7vw, 6rem);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: .55rem;
  align-items: center;
  margin-bottom: clamp(3rem, 7vw, 6rem);
  color: var(--muted);
  font-size: .76rem;
}

.breadcrumb a { color: var(--ink-soft); text-decoration-thickness: 1px; text-underline-offset: 3px; }

.article-heading {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(240px, .6fr);
  gap: clamp(3rem, 8vw, 8rem);
  align-items: end;
}

.article-category {
  color: var(--coral-deep);
  font-size: .76rem;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
}

html[lang='fa'] .article-category { letter-spacing: 0; }

.article-heading h1 {
  max-width: 13ch;
  margin: 1rem 0 1.5rem;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 7.6vw, 7.5rem);
  font-weight: 550;
  letter-spacing: -.06em;
  line-height: .91;
}

html[lang='fa'] .article-heading h1 {
  max-width: 18ch;
  font-size: clamp(2.35rem, 5.4vw, 5rem);
  font-weight: 700;
  line-height: 1.48;
  letter-spacing: -.02em;
  overflow-wrap: normal;
  word-break: normal;
}

html[lang='fa'] .article-deck { font-size: clamp(.98rem, 1.25vw, 1.12rem); line-height: 2; }

.article-deck {
  max-width: 58ch;
  margin: 0;
  color: var(--ink-soft);
  font-size: clamp(1.05rem, 1.5vw, 1.3rem);
  line-height: 1.75;
}

.article-byline {
  display: grid;
  gap: 1rem;
  margin: 0;
  padding: 1.5rem 0 0;
  border-top: 1px solid rgba(0, 41, 0, .22);
}

.article-byline div { display: grid; grid-template-columns: 7rem 1fr; gap: 1rem; }
.article-byline dt { color: var(--muted); font-size: .72rem; }
.article-byline dd { margin: 0; color: var(--ink); font-size: .78rem; font-weight: 700; }
html[lang='fa'] .article-byline dt { font-size: .68rem; }
html[lang='fa'] .article-byline dd { font-size: .74rem; font-weight: 550; line-height: 1.7; }

.article-hero {
  overflow: hidden;
  aspect-ratio: 16 / 8.7;
  border-radius: 100px 20px 100px 20px;
  border: 1px solid rgba(0, 41, 0, .16);
}

.article-hero img { width: 100%; height: 100%; object-fit: cover; }

.article-layout {
  display: grid;
  grid-template-columns: minmax(190px, .38fr) minmax(0, 1fr) minmax(80px, .2fr);
  gap: clamp(2rem, 5vw, 5rem);
  padding-block: clamp(4rem, 8vw, 8rem);
}

.article-toc {
  position: sticky;
  top: 7.5rem;
  align-self: start;
  padding-inline-start: 1rem;
  border-inline-start: 2px solid var(--orange);
}

.article-toc > span {
  display: block;
  margin-bottom: 1rem;
  color: var(--coral-deep);
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.article-toc ol { display: grid; gap: .8rem; margin: 0; padding: 0; list-style: none; counter-reset: toc; }
.article-toc li { counter-increment: toc; }
.article-toc a { color: var(--muted); font-size: .76rem; line-height: 1.5; text-decoration: none; }
.article-toc a::before { content: '0' counter(toc) ' '; color: var(--orange); }
.article-toc a:hover { color: var(--ink); }
.article-toc .toc-subitem { padding-inline-start: .8rem; }
.article-toc .toc-subitem a { font-size: .7rem; }

.article-body { grid-column: 2; max-width: 740px; }

.article-body__opening {
  margin: 0 0 3.5rem;
  padding-inline-start: 1.5rem;
  color: var(--ink);
  border-inline-start: 4px solid var(--orange);
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.5vw, 2rem);
  line-height: 1.5;
}

html[lang='fa'] .article-body__opening { font-size: clamp(1.12rem, 2vw, 1.55rem); font-weight: 600; line-height: 1.95; }

.article-body section { scroll-margin-top: 8rem; margin-block: 0 4rem; }
.article-body h2 {
  margin: 0 0 1.3rem;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 580;
  line-height: 1.15;
  letter-spacing: -.035em;
}

html[lang='fa'] .article-body h2 { font-size: clamp(1.55rem, 2.7vw, 2.3rem); line-height: 1.65; font-weight: 700; letter-spacing: -.015em; }
.article-body p, .article-body li { color: var(--ink-soft); font-size: 1.04rem; line-height: 1.95; }
html[lang='fa'] .article-body p, html[lang='fa'] .article-body li { font-size: .98rem; line-height: 2.05; }
.article-body p { margin: 0 0 1.25rem; }
.article-body ul { display: grid; gap: .8rem; margin: 1.6rem 0; padding-inline-start: 1.3rem; }
.article-body li::marker { color: var(--orange); }
.article-rich-content { margin-bottom: 4rem; }
.article-rich-content :deep(h2), .article-rich-content :deep(h3) { scroll-margin-top: 8rem; color: var(--ink); font-family: var(--font-display); }
.article-rich-content :deep(h2) { margin: 3.5rem 0 1.3rem; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 580; line-height: 1.15; letter-spacing: -.035em; }
.article-rich-content :deep(h3) { margin: 2.4rem 0 1rem; font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 620; line-height: 1.35; }
.article-rich-content :deep(p), .article-rich-content :deep(li) { color: var(--ink-soft); font-size: 1.04rem; line-height: 1.95; }
.article-rich-content :deep(p) { margin: 0 0 1.25rem; }
.article-rich-content :deep(ul), .article-rich-content :deep(ol) { display: grid; gap: .8rem; margin: 1.6rem 0; padding-inline-start: 1.5rem; }
.article-rich-content :deep(li::marker) { color: var(--orange); font-weight: 700; }
.article-rich-content :deep(strong) { color: var(--ink); }
.article-rich-content :deep(a) { color: var(--coral-deep); text-decoration-thickness: 1px; text-underline-offset: 4px; }
.article-rich-content :deep(blockquote) { margin: 2rem 0; padding: 1rem 1.4rem; color: var(--ink-soft); background: rgba(255,146,92,.09); border-inline-start: 4px solid var(--orange); border-radius: 0 12px 12px 0; font-family: var(--font-display); font-size: 1.15rem; line-height: 1.9; }
.article-rich-content :deep(img) { display: block; width: 100%; height: auto; margin: 2.5rem 0; border-radius: 18px; }
html[lang='fa'] .article-rich-content :deep(h2) { font-size: clamp(1.55rem, 2.7vw, 2.3rem); line-height: 1.65; font-weight: 700; letter-spacing: -.015em; }
html[lang='fa'] .article-rich-content :deep(h3) { font-size: clamp(1.25rem, 2.2vw, 1.75rem); line-height: 1.8; font-weight: 700; }
html[lang='fa'] .article-rich-content :deep(p), html[lang='fa'] .article-rich-content :deep(li) { font-size: .98rem; line-height: 2.05; }

.medical-note {
  margin: 1rem 0 4rem;
  padding: 1.5rem 1.7rem;
  color: var(--ink-soft);
  background: var(--mint-light, #e6efdc);
  border: 1px solid rgba(0, 41, 0, .15);
  border-radius: 10px 32px 10px 32px;
}

.medical-note strong { color: var(--ink); }
.medical-note p { margin: .5rem 0 0; font-size: .88rem; line-height: 1.7; }

.article-sources { padding-top: 3rem; border-top: 1px solid rgba(0, 41, 0, .2); }
.article-sources h2 { font-size: clamp(1.8rem, 3vw, 2.5rem); }
.article-sources ol { display: grid; gap: .9rem; padding-inline-start: 1.25rem; }
.article-sources a { color: var(--ink); text-decoration-color: rgba(255, 146, 92, .8); text-underline-offset: 4px; }

.back-link {
  display: inline-flex;
  align-items: center;
  gap: .7rem;
  color: var(--ink);
  font-size: .88rem;
  font-weight: 750;
}

html[dir='rtl'] .back-link span { transform: rotate(180deg); }

.related { padding-block: clamp(5rem, 9vw, 9rem); border-top: 1px solid rgba(0, 41, 0, .16); }
.related__head { display: flex; align-items: end; justify-content: space-between; margin-bottom: 3rem; }
.related__head h2 { margin: .7rem 0 0; color: var(--ink); font-family: var(--font-display); font-size: clamp(2.6rem, 5vw, 5rem); font-weight: 560; line-height: 1; }
html[lang='fa'] .related__head h2 { font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1.5; font-weight: 700; }

html[lang='fa'] .article-page :deep(.journal-card h3) {
  font-size: clamp(1.14rem, 1.65vw, 1.42rem);
  font-weight: 650;
  line-height: 1.62;
  overflow-wrap: normal;
  word-break: normal;
}

html[lang='fa'] .article-page :deep(.journal-card__summary) {
  font-size: .88rem;
  line-height: 1.9;
}

.article-page :deep(.journal-card:focus-visible) {
  outline: 2px solid var(--orange);
  outline-offset: 5px;
}
.related__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.5rem, 3vw, 3rem); }

.article-cta {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: clamp(4rem, 8vw, 8rem);
  padding-block: clamp(3rem, 6vw, 5rem);
  border-top: 1px solid rgba(0, 41, 0, .2);
  border-bottom: 1px solid rgba(0, 41, 0, .2);
}

.article-cta h2 { max-width: 14ch; margin: .8rem 0 0; color: var(--ink); font-family: var(--font-display); font-size: clamp(2.2rem, 4vw, 4rem); font-weight: 560; line-height: 1.05; }
html[lang='fa'] .article-cta h2 { font-size: clamp(1.8rem, 3.4vw, 3rem); line-height: 1.55; font-weight: 700; }

.article-missing { min-height: 80vh; display: grid; place-content: center; justify-items: start; gap: 2rem; padding-top: 8rem; }
.article-missing h1 { max-width: 15ch; margin: 0; font-family: var(--font-display); font-size: clamp(3rem, 8vw, 7rem); color: var(--ink); }

@media (max-width: 900px) {
  .article-heading { grid-template-columns: 1fr; }
  .article-layout { grid-template-columns: 1fr; }
  .article-toc { display: none; }
  .article-body { grid-column: 1; margin-inline: auto; }
  .related__grid { grid-template-columns: 1fr; }
}

@media (max-width: 620px) {
  .article-header { padding-top: 8rem; }
  .article-heading h1 { font-size: clamp(3rem, 15vw, 4.8rem); }
  html[lang='fa'] .article-heading h1 { font-size: clamp(2rem, 9.5vw, 2.8rem); line-height: 1.5; }
  .article-byline div { grid-template-columns: 6rem 1fr; }
  .article-hero { width: calc(100% - 2rem); border-radius: 48px 12px 48px 12px; aspect-ratio: 4 / 3; }
  .article-cta { align-items: flex-start; flex-direction: column; }
}
</style>
