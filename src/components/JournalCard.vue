<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJournal } from '../composables/useJournal.js'
import { localize } from '../utils/localized.js'

const props = defineProps({
  article: { type: Object, required: true },
  index: { type: Number, default: 0 },
  variant: { type: String, default: 'default' },
})

const { t, locale } = useI18n()
const { getCategory } = useJournal()
const category = computed(() => getCategory(props.article.category))
const formattedDate = computed(() => new Intl.DateTimeFormat(
  locale.value === 'fa' ? 'fa-IR' : 'en-US',
  { year: 'numeric', month: 'short', day: 'numeric' },
).format(new Date(`${props.article.datePublished}T12:00:00Z`)))
</script>

<template>
  <article
    class="journal-card"
    :class="[`journal-card--${variant}`, `journal-card--shape-${index % 3}`]"
  >
    <RouterLink :to="`/journal/${article.slug}`" class="journal-card__link">
      <div class="journal-card__media">
        <img
          :src="article.image"
          :srcset="article.imageSrcset"
          sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 620px"
          :alt="localize(article.alt, locale)"
          :width="article.imageWidth || 1600"
          :height="article.imageHeight || 1000"
          :loading="variant === 'featured' ? 'eager' : 'lazy'"
          :fetchpriority="variant === 'featured' ? 'high' : undefined"
          decoding="async"
        />
        <span class="journal-card__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
      </div>

      <div class="journal-card__body">
        <div class="journal-card__meta">
          <span>{{ localize(category?.label, locale) }}</span>
          <span aria-hidden="true">•</span>
          <time :datetime="article.datePublished">{{ formattedDate }}</time>
          <span aria-hidden="true">•</span>
          <span>{{ t('journal.readingTime', { count: article.readingMinutes }) }}</span>
        </div>
        <h3>{{ localize(article.title, locale) }}</h3>
        <p>{{ localize(article.summary, locale) }}</p>
        <span class="journal-card__read">
          {{ t('journal.readArticle') }}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.journal-card {
  min-width: 0;
}

.journal-card__link {
  display: grid;
  gap: 1.2rem;
  color: inherit;
  text-decoration: none;
}

.journal-card__media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 11;
  border: 1px solid rgba(0, 41, 0, .16);
  border-radius: 32px 12px 32px 12px;
  background: var(--cream-deep);
}

.journal-card--shape-1 .journal-card__media { border-radius: 12px 40px 12px 40px; }
.journal-card--shape-2 .journal-card__media { border-radius: 44px 44px 12px 12px; }

.journal-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .9s cubic-bezier(.16, 1, .3, 1);
}

.journal-card__number {
  position: absolute;
  inset-inline-end: .75rem;
  bottom: .75rem;
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  color: var(--ink);
  background: rgba(245, 245, 230, .92);
  border: 1px solid rgba(0, 41, 0, .2);
  font-size: .72rem;
  font-weight: 750;
  backdrop-filter: blur(8px);
}

.journal-card__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: .75rem;
}

.journal-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
  color: var(--coral-deep);
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .035em;
  text-transform: uppercase;
}

html[lang='fa'] .journal-card__meta { letter-spacing: 0; }

.journal-card h3 {
  max-width: 18ch;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 2.3vw, 2.2rem);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: var(--track-display);
}

html[lang='fa'] .journal-card h3 { line-height: 1.45; font-weight: 800; }

.journal-card p {
  max-width: 52ch;
  margin: 0;
  color: var(--ink-soft);
  font-size: .96rem;
  line-height: 1.72;
}

.journal-card__read {
  display: inline-flex;
  align-items: center;
  gap: .55rem;
  margin-top: .25rem;
  padding-bottom: .22rem;
  color: var(--ink);
  border-bottom: 1px solid rgba(0, 41, 0, .28);
  font-size: .84rem;
  font-weight: 750;
  transition: color .25s ease, border-color .25s ease;
}

html[dir='rtl'] .journal-card__read span { transform: rotate(180deg); }

.journal-card__link:hover .journal-card__media img { transform: scale(1.045); }
.journal-card__link:hover .journal-card__read { color: var(--coral-deep); border-color: var(--orange); }

.journal-card--featured .journal-card__link {
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
}

.journal-card--featured .journal-card__media {
  aspect-ratio: 16 / 10;
  border-radius: 90px 18px 90px 18px;
}

.journal-card--featured h3 {
  max-width: 12ch;
  font-size: clamp(2.25rem, 4.5vw, 4.8rem);
}

.journal-card--home h3 { font-size: clamp(1.35rem, 2vw, 1.85rem); }
.journal-card--home .journal-card__meta { font-size: .67rem; }

@media (max-width: 800px) {
  .journal-card--featured .journal-card__link { grid-template-columns: 1fr; gap: 1.5rem; }
  .journal-card--featured .journal-card__media { border-radius: 48px 12px 48px 12px; }
  .journal-card--featured h3 { max-width: 15ch; font-size: clamp(2.1rem, 11vw, 3.6rem); }
}

@media (prefers-reduced-motion: reduce) {
  .journal-card__media img { transition: none; }
}
</style>
