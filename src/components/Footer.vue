<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  pagePath: {
    type: String,
    required: true,
  },
})
const year = new Date().getFullYear()

const phoneRaw = '+989128133731'
const phoneDisplay = '+98 912 813 3731'
const emailAddress = 'pezeshk.afzar.sh@gmail.com'

const socials = [
  { key: 'linkedin', url: 'https://linkedin.com/' },
  { key: 'instagram', url: 'https://instagram.com/' },
  { key: 'telegram', url: 'https://t.me/' },
]

const footerArtworks = [
  { key: 'home', src: '/images/footer/home.png', matches: (path) => path === '/' },
  { key: 'products', src: '/images/footer/what we make.png', matches: (path) => path.startsWith('/products') },
  { key: 'life', src: '/images/footer/life in motion.png', matches: (path) => path === '/life-in-motion' },
  { key: 'story', src: '/images/footer/our story.png', matches: (path) => path === '/about' },
  { key: 'contact', src: '/images/footer/say hello.png', matches: (path) => path === '/contact' },
]

const footerArtwork = computed(() => (
  footerArtworks.find(({ matches }) => matches(props.pagePath)) ?? null
))
</script>

<template>
  <footer class="foot">
    <img
      v-for="artwork in footerArtworks"
      :key="artwork.key"
      :src="artwork.src"
      :class="[
        'foot-art',
        `foot-art--${artwork.key}`,
        { 'is-active': artwork.key === footerArtwork?.key },
      ]"
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
    />

    <div class="foot-inner">
      <p class="foot-manifesto">{{ t('footer.manifesto') }}</p>

      <div class="cols">
        <div class="col col-brand">
          <RouterLink to="/" class="brand">
            <span class="brand-mark" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c.5 2 1.6 3.4 3 4.4l-1.2.6c1.4 1.2 3 1.9 4.9 2l-.9 1.4c1.2.6 2.6.9 4.2.8-1 1.7-2.5 2.9-4.5 3.5.2.7.6 1.3 1.1 1.8-1.7.5-3.4.4-5-.3l-.6 5.8h-2l-.6-5.8c-1.6.7-3.3.8-5 .3.5-.5.9-1.1 1.1-1.8-2-.6-3.5-1.8-4.5-3.5 1.6.1 3-.2 4.2-.8L5.3 9c1.9-.1 3.5-.8 4.9-2L9 6.4c1.4-1 2.5-2.4 3-4.4z"/>
              </svg>
            </span>
            <span class="brand-name">{{ t('brand') }}</span>
          </RouterLink>
          <p class="brand-desc">{{ t('footer.description') }}</p>

          <div class="brand-mission">
            <span class="brand-mission-label">{{ t('footer.missionLabel') }}</span>
            <p class="brand-mission-text">{{ t('footer.mission') }}</p>
          </div>
        </div>

        <nav class="col col-links" aria-label="What we make">
          <h3 class="col-heading">{{ t('footer.columns.technologies') }}</h3>
          <ul class="link-list">
            <li><RouterLink to="/products#platforms" class="foot-link">{{ t('footer.links.platforms') }}</RouterLink></li>
            <li><RouterLink to="/products#innovations" class="foot-link">{{ t('footer.links.innovations') }}</RouterLink></li>
            <li><RouterLink to="/products#custom" class="foot-link">{{ t('footer.links.custom') }}</RouterLink></li>
          </ul>
        </nav>

        <nav class="col col-links" aria-label="Company">
          <h3 class="col-heading">{{ t('footer.columns.company') }}</h3>
          <ul class="link-list">
            <li><RouterLink to="/about" class="foot-link">{{ t('nav.about') }}</RouterLink></li>
            <li><RouterLink to="/products" class="foot-link">{{ t('nav.products') }}</RouterLink></li>
            <li><RouterLink to="/life-in-motion" class="foot-link">{{ t('nav.lifeInMotion') }}</RouterLink></li>
            <li><RouterLink to="/contact" class="foot-link">{{ t('footer.links.consultation') }}</RouterLink></li>
          </ul>
        </nav>

        <nav class="col col-links" aria-label="Quick links">
          <h3 class="col-heading">{{ t('footer.columns.navigate') }}</h3>
          <ul class="link-list">
            <li><RouterLink to="/" class="foot-link">{{ t('nav.home') }}</RouterLink></li>
            <li><RouterLink to="/products" class="foot-link">{{ t('nav.products') }}</RouterLink></li>
            <li><RouterLink to="/life-in-motion" class="foot-link">{{ t('nav.lifeInMotion') }}</RouterLink></li>
            <li><RouterLink to="/about" class="foot-link">{{ t('nav.about') }}</RouterLink></li>
            <li><RouterLink to="/contact" class="foot-link">{{ t('nav.contact') }}</RouterLink></li>
          </ul>
        </nav>

        <div class="col col-contact">
          <h3 class="col-heading">{{ t('footer.columns.contact') }}</h3>
          <ul class="contact-list">
            <li class="contact-item">
              <span class="ci-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2"/>
                  <path d="M3 7l9 6 9-6"/>
                </svg>
              </span>
              <a :href="`mailto:${emailAddress}`" class="ci-link" dir="ltr">{{ emailAddress }}</a>
            </li>
            <li class="contact-item">
              <span class="ci-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2.03Z"/>
                </svg>
              </span>
              <a :href="`tel:${phoneRaw}`" class="ci-link" dir="ltr">{{ phoneDisplay }}</a>
            </li>
            <li class="contact-item">
              <span class="ci-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <span class="ci-text">
                <span class="ci-label">{{ t('footer.contact.primaryLabel') }}</span>
                {{ t('footer.contact.address') }}
              </span>
            </li>
            <li class="contact-item">
              <span class="ci-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <span class="ci-text">
                <span class="ci-label">{{ t('footer.contact.secondaryLabel') }}</span>
                {{ t('footer.contact.secondAddress') }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="bar">
        <p class="bar-rights">© {{ year }} {{ t('brand') }}. {{ t('footer.rights') }}</p>

        <p class="bar-tagline">{{ t('footer.tagline') }}</p>

        <ul class="socials">
          <li v-for="s in socials" :key="s.key">
            <a :href="s.url" target="_blank" rel="noopener noreferrer" class="social"
               :aria-label="t(`footer.social.${s.key}`)">
              <svg v-if="s.key === 'linkedin'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0H13v1.6c.6-1 1.9-1.9 3.7-1.9 3 0 4.3 1.8 4.3 4.8V21h-4v-6.4c0-1.6-.6-2.5-1.9-2.5-1.3 0-2 .8-2 2.5V21H9.5V9Z"/>
              </svg>
              <svg v-else-if="s.key === 'instagram'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              <svg v-else-if="s.key === 'telegram'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.5 3.2 2.9 10.4c-1 .4-1 1.8 0 2.2l4.4 1.5 1.7 5.5c.3 1 1.6 1.2 2.2.4l2.6-3.3 4.6 3.4c.8.6 2 .2 2.2-.8l3.4-14.7c.3-1.1-.8-2.1-2-1.4Zm-2.4 3.5-7.7 7.1-.3 3.2-1.5-4.8 9.5-5.5Z"/>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* The footer is one completely solid slab of deep green #002900.
   Strict rule: no glows, no halos, no gradient bleed of any kind —
   the ground the site stands on is plain, quiet earth. */
.foot {
  margin-top: auto;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  z-index: 1;
  background: #002900;
  color: #F5F5E5;
  padding: 4.5rem 2.5rem 1.75rem;
}

.foot-art {
  position: absolute;
  z-index: 0;
  display: block;
  width: auto;
  height: auto;
  max-width: none;
  opacity: 1;
  visibility: hidden;
  pointer-events: none;
  user-select: none;
}

.foot-art.is-active { visibility: visible; }

.foot-art--home {
  bottom: 0;
  left: clamp(0.5rem, 1.2vw, 1rem);
  width: clamp(216px, 28.8vw, 432px);
}

.foot-art--products {
  bottom: 0;
  left: 50%;
  width: clamp(360px, 44vw, 630px);
  transform: translateX(-50%);
}

.foot-art--life {
  right: 40%;
  bottom: -2rem;
  width: clamp(280px, 35vw, 520px);
}

.foot-art--story {
  left: 40%;
  bottom: 0;
  width: clamp(300px, 28vw, 420px);
  transform: scale(1.12);
  transform-origin: left bottom;
}

.foot-art--contact {
  right: 33%;
  bottom: clamp(1.5rem, 12%, 5rem);
  width: auto;
  height: 66.666%;
}

.foot-inner { max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }

/* One warm sentence before the columns — the footer opens like a chapter */
.foot-manifesto {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.8vw, 2.25rem);
  font-weight: 550;
  letter-spacing: var(--track-display);
  line-height: 1.25;
  color: #F5F5E5;
  margin: 0 0 3rem;
  max-width: 26ch;
}

html[lang='fa'] .foot-manifesto { font-weight: 700; line-height: 1.5; }

.cols {
  display: grid;
  grid-template-columns: 1.9fr 1fr 1fr 1fr 1.3fr;
  gap: 3.5rem;
  padding-bottom: 2.75rem;
  border-bottom: 1px solid rgba(245, 245, 229, 0.18);
}

.col { display: flex; flex-direction: column; gap: 1.25rem; }
.col-brand { gap: 1.5rem; padding-inline-end: 1.5rem; }

.brand {
  display: inline-flex; align-items: center; gap: 0.625rem;
  text-decoration: none; color: #F5F5E5;
}

.brand-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 42px; height: 42px; border-radius: 50%;
  background: rgba(245, 245, 229, 0.14);
  color: var(--orange);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s ease;
}

.brand:hover .brand-mark {
  transform: rotate(-10deg) scale(1.08);
  background: rgba(245, 245, 229, 0.24);
}

.brand-name {
  font-family: var(--font-display);
  font-size: 1.25rem; font-weight: 600;
  letter-spacing: -0.005em; color: #F5F5E5;
}

html[lang='fa'] .brand-name { font-weight: 700; }

.brand-desc {
  font-size: 0.9375rem; line-height: 1.75;
  color: rgba(245, 245, 229, 0.72);
  max-width: 40ch; margin: 0;
}

.brand-mission {
  display: flex; flex-direction: column; gap: 0.5rem;
  padding: 1.25rem 1.375rem;
  background: rgba(0, 27, 0, 0.6);
  border-radius: 20px;
  max-width: 42ch;
}

.brand-mission-label {
  font-family: var(--font-body);
  font-size: 0.75rem; font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--orange);
}

html[lang='fa'] .brand-mission-label { letter-spacing: 0; font-size: 0.8125rem; }

.brand-mission-text {
  font-size: 0.9375rem; line-height: 1.7;
  color: rgba(245, 245, 229, 0.88); margin: 0;
}

.col-heading {
  font-family: var(--font-display);
  font-size: 1.0625rem; font-weight: 600;
  letter-spacing: 0;
  color: #F5F5E5;
  margin: 0 0 0.375rem;
}

html[lang='fa'] .col-heading { font-weight: 700; }

.link-list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 0.75rem;
}

.foot-link {
  color: rgba(245, 245, 229, 0.75);
  text-decoration: none;
  font-size: 0.9375rem; font-weight: 400;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex; align-items: center; gap: 0.5rem;
}

.foot-link::before {
  content: ''; display: inline-block; width: 0; height: 2px;
  border-radius: 2px;
  background: var(--orange);
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.foot-link:hover { color: #FFC8A8; }
.foot-link:hover::before { width: 14px; }

.contact-list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 1rem;
}

.contact-item {
  display: flex; align-items: flex-start; gap: 0.75rem;
  font-size: 0.9375rem; line-height: 1.5;
  color: rgba(245, 245, 229, 0.75);
}

.ci-icon {
  flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(245, 245, 229, 0.12);
  color: var(--sand);
  transition: background 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-top: 1px;
}

.contact-item:hover .ci-icon {
  background: rgba(245, 245, 229, 0.24);
  transform: scale(1.08);
}

.ci-link {
  color: rgba(245, 245, 229, 0.88);
  text-decoration: none;
  transition: color 0.3s ease;
  font-variant-numeric: tabular-nums;
}

.ci-link:hover { color: #FFC8A8; }
.ci-text { color: rgba(245, 245, 229, 0.75); }
.ci-label {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--orange);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

html[lang='fa'] .ci-label { letter-spacing: 0; }

.bar {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 1.5rem; gap: 1.5rem; flex-wrap: wrap;
}

.bar-rights {
  font-family: var(--font-body);
  font-size: 0.8125rem; font-weight: 500;
  color: rgba(245, 245, 229, 0.6); margin: 0;
}

.bar-tagline {
  font-family: var(--font-display);
  font-size: 0.9375rem; font-style: italic;
  color: rgba(255, 200, 168, 0.9); margin: 0;
}

html[lang='fa'] .bar-tagline { font-style: normal; }

.socials {
  list-style: none; padding: 0; margin: 0;
  display: flex; gap: 0.625rem;
}

.social {
  display: inline-flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(245, 245, 229, 0.1);
  border: 1px solid rgba(245, 245, 229, 0.2);
  color: rgba(245, 245, 229, 0.85);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              background 0.4s ease, color 0.4s ease, border-color 0.4s ease;
}

.social:hover {
  transform: scale(1.1) translateY(-2px);
  background: var(--orange);
  border-color: var(--orange);
  color: #002900;
}

@media (max-width: 1024px) {
  .foot { padding: 3.5rem 1.75rem 1.5rem; }
  .foot-art--home { width: clamp(192px, 34.8vw, 336px); }
  .foot-art--products { width: min(64vw, 534px); }
  .foot-art--life { right: 32%; width: clamp(250px, 45vw, 420px); }
  .foot-art--story { left: 32%; width: clamp(260px, 42vw, 360px); }
  .foot-art--contact { right: 18%; height: min(48%, 500px); }
  .cols {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem 3rem; padding-bottom: 2.25rem;
  }
  .col-brand { grid-column: 1 / -1; padding-inline-end: 0; }
  .brand-desc, .brand-mission { max-width: 56ch; }
}

@media (max-width: 640px) {
  .foot { padding: 2.75rem 1.25rem 1.25rem; }
  .foot-art--home { width: min(50.4vw, 192px); }
  .foot-art--products { width: min(86vw, 330px); }
  .foot-art--life { right: 24%; bottom: -1.5rem; width: min(68vw, 260px); }
  .foot-art--story { left: 20%; width: min(72vw, 280px); }
  .foot-art--contact { right: 4%; bottom: 0; height: min(24%, 360px); }
  .foot-manifesto { margin-bottom: 2.25rem; }
  .cols { grid-template-columns: 1fr; gap: 2.5rem; text-align: center; }
  .col { align-items: center; }
  .brand-desc { text-align: center; }
  .brand-mission { align-items: center; text-align: center; }
  .link-list, .contact-list { align-items: center; }
  .contact-item { justify-content: center; }
  .bar { flex-direction: column; text-align: center; gap: 1rem; padding-top: 1.75rem; }
}
</style>
