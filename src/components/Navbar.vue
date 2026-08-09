<script setup>
import { useI18n } from 'vue-i18n'
import { nextTick, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { RTL_LOCALES } from '../main.js'

const { t, locale } = useI18n()
const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)
const languageOpen = ref(false)
const languagePicker = ref(null)
const languageTrigger = ref(null)
const availableLocales = ['en', 'fa']

const languageOptions = () => Array.from(languagePicker.value?.querySelectorAll('.lang-option') ?? [])

const setLocale = (code) => {
  locale.value = code
  document.documentElement.setAttribute('lang', code)
  document.documentElement.setAttribute('dir', RTL_LOCALES.includes(code) ? 'rtl' : 'ltr')
  languageOpen.value = false
  nextTick(() => languageTrigger.value?.focus())
}

const closeMenu = () => { menuOpen.value = false }

const closeLanguageMenu = (restoreFocus = false) => {
  languageOpen.value = false
  if (restoreFocus) nextTick(() => languageTrigger.value?.focus())
}

const openLanguageMenu = (index = availableLocales.indexOf(locale.value)) => {
  languageOpen.value = true
  nextTick(() => languageOptions()[Math.max(0, index)]?.focus())
}

const toggleLanguageMenu = () => {
  if (languageOpen.value) closeLanguageMenu()
  else openLanguageMenu()
}

const onLanguageTriggerKeydown = (event) => {
  if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return
  event.preventDefault()
  event.stopPropagation()
  openLanguageMenu(event.key === 'ArrowUp' ? availableLocales.length - 1 : 0)
}

const onLanguageMenuKeydown = (event) => {
  if (!languageOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closeLanguageMenu(true)
    return
  }

  if (event.key === 'Tab') {
    closeLanguageMenu()
    return
  }

  const options = languageOptions()
  const currentIndex = options.indexOf(document.activeElement)
  let nextIndex = currentIndex

  if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % options.length
  else if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + options.length) % options.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = options.length - 1
  else return

  event.preventDefault()
  event.stopPropagation()
  options[nextIndex]?.focus()
}

const onScroll = () => { scrolled.value = window.scrollY > 24 }

const onKeydown = (e) => {
  if (e.key !== 'Escape') return
  if (languageOpen.value) closeLanguageMenu(true)
  else closeMenu()
}

const onDocumentPointerDown = (event) => {
  if (!languagePicker.value?.contains(event.target)) closeLanguageMenu()
}

watch(() => route.fullPath, () => {
  closeMenu()
  closeLanguageMenu()
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('pointerdown', onDocumentPointerDown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})
</script>

<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled, 'is-open': menuOpen }">
    <div class="nav-inner">
      <RouterLink to="/" class="brand" @click="closeMenu">
        <span class="brand-mark" aria-hidden="true">
          <!-- A maple leaf, simplified and friendly -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c.5 2 1.6 3.4 3 4.4l-1.2.6c1.4 1.2 3 1.9 4.9 2l-.9 1.4c1.2.6 2.6.9 4.2.8-1 1.7-2.5 2.9-4.5 3.5.2.7.6 1.3 1.1 1.8-1.7.5-3.4.4-5-.3l-.6 5.8h-2l-.6-5.8c-1.6.7-3.3.8-5 .3.5-.5.9-1.1 1.1-1.8-2-.6-3.5-1.8-4.5-3.5 1.6.1 3-.2 4.2-.8L5.3 9c1.9-.1 3.5-.8 4.9-2L9 6.4c1.4-1 2.5-2.4 3-4.4z"/>
          </svg>
        </span>
        <span class="brand-name">{{ t('brand') }}</span>
      </RouterLink>

      <nav class="nav-links" :aria-label="t('footer.columns.navigate')">
        <RouterLink to="/" class="nav-link" exact-active-class="is-active">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/products" class="nav-link" active-class="is-active">{{ t('nav.products') }}</RouterLink>
        <RouterLink to="/life-in-motion" class="nav-link" active-class="is-active">{{ t('nav.lifeInMotion') }}</RouterLink>
        <RouterLink to="/about" class="nav-link" active-class="is-active">{{ t('nav.about') }}</RouterLink>
        <RouterLink to="/contact" class="nav-link" active-class="is-active">{{ t('nav.contact') }}</RouterLink>
      </nav>

      <div class="nav-actions">
        <div ref="languagePicker" class="lang-picker" @keydown="onLanguageMenuKeydown">
          <button
            ref="languageTrigger"
            class="lang-toggle"
            type="button"
            aria-haspopup="menu"
            aria-controls="language-menu"
            :aria-expanded="languageOpen"
            :aria-label="t('lang.label')"
            @click="toggleLanguageMenu"
            @keydown="onLanguageTriggerKeydown"
          >
            <svg class="lang-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span class="lang-code">{{ locale.toUpperCase() }}</span>
            <svg class="lang-caret" :class="{ 'is-open': languageOpen }" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m2 2 4 4 4-4" />
            </svg>
          </button>

          <transition name="lang-pop">
            <div
              v-if="languageOpen"
              id="language-menu"
              class="lang-menu"
              role="menu"
              :aria-label="t('lang.label')"
            >
              <button
                v-for="code in availableLocales"
                :key="code"
                class="lang-option"
                :class="{ 'is-active': locale === code }"
                type="button"
                role="menuitemradio"
                :aria-checked="locale === code"
                :lang="code"
                @click="setLocale(code)"
              >
                <span>{{ t(`lang.names.${code}`) }}</span>
                <span class="lang-option-code" aria-hidden="true">{{ code.toUpperCase() }}</span>
              </button>
            </div>
          </transition>
        </div>

        <button
          class="menu-toggle"
          :aria-expanded="menuOpen"
          :aria-label="t('footer.columns.navigate')"
          @click="menuOpen = !menuOpen"
        >
          <span class="menu-bar" />
          <span class="menu-bar" />
        </button>
      </div>
    </div>

    <transition name="menu-drop">
      <nav v-if="menuOpen" class="mobile-menu" :aria-label="t('footer.columns.navigate')">
        <RouterLink to="/" class="mobile-link" exact-active-class="is-active" @click="closeMenu">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/products" class="mobile-link" active-class="is-active" @click="closeMenu">{{ t('nav.products') }}</RouterLink>
        <RouterLink to="/life-in-motion" class="mobile-link" active-class="is-active" @click="closeMenu">{{ t('nav.lifeInMotion') }}</RouterLink>
        <RouterLink to="/about" class="mobile-link" active-class="is-active" @click="closeMenu">{{ t('nav.about') }}</RouterLink>
        <RouterLink to="/contact" class="mobile-link" active-class="is-active" @click="closeMenu">{{ t('nav.contact') }}</RouterLink>
        <RouterLink to="/contact" class="btn-ink mobile-cta" @click="closeMenu">
          {{ t('consult.ctaPrimary') }}
          <span class="arrow">→</span>
        </RouterLink>
      </nav>
    </transition>
  </header>
</template>

<style scoped>
/* The header is always the deep green #002900 — a solid earthy band.
   Rule: every glow, halo, or soft shadow up here is SAND (#F5F5E5),
   never orange. Orange appears only as flat fills (the CTA pill). */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  padding: 1.125rem 0;
  background: #002900;
  transition: padding 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav.is-scrolled,
.nav.is-open {
  padding: 0.75rem 0;
  /* A soft sand halo underlining the bar as the page scrolls */
  box-shadow: 0 1px 0 rgba(245, 245, 229, 0.22),
              0 14px 36px -20px rgba(245, 245, 229, 0.45);
}

.nav-inner {
  max-width: 1280px; margin: 0 auto; padding: 0 2rem;
  display: grid; grid-template-columns: 1fr auto 1fr;
  align-items: center; gap: 1.5rem;
}

/* ── Brand — the maple leaf ────────────────────────────── */
.brand {
  display: inline-flex; align-items: center; gap: 0.625rem;
  text-decoration: none; color: #F5F5E5; justify-self: start;
}

.brand-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(245, 245, 229, 0.14);
  color: var(--orange);
  /* Sand halo around the leaf — the header's only glow color */
  box-shadow: 0 0 24px -6px rgba(245, 245, 229, 0.4);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              background 0.4s ease, box-shadow 0.4s ease;
}

/* The leaf sways when greeted */
.brand:hover .brand-mark {
  transform: rotate(-10deg) scale(1.08);
  background: rgba(245, 245, 229, 0.24);
  box-shadow: 0 0 30px -4px rgba(245, 245, 229, 0.55);
}

.brand-name {
  font-family: var(--font-display);
  font-size: 1.1875rem; font-weight: 600; letter-spacing: -0.01em;
  color: #F5F5E5;
}

/* ── Center links — sand pills on green ────────────────── */
.nav-links {
  display: flex; gap: 0.25rem; align-items: center;
}

.nav-link {
  padding: 0.5625rem 1.0625rem;
  border-radius: var(--radius-btn);
  text-decoration: none;
  font-size: 0.9375rem; font-weight: 500;
  color: rgba(245, 245, 229, 0.82);
  transition: color 250ms ease, background 250ms ease, box-shadow 250ms ease;
}

.nav-link:hover {
  color: var(--orange);
  background: rgba(245, 245, 229, 0.14);
  box-shadow: 0 0 20px -6px rgba(245, 245, 229, 0.45);
}

.nav-link.is-active {
  color: #002900;
  background: var(--sand);
  font-weight: 600;
  box-shadow: 0 0 22px -6px rgba(245, 245, 229, 0.55);
}

/* ── Right actions ─────────────────────────────────────── */
.nav-actions {
  display: flex; align-items: center; gap: 0.75rem; justify-self: end;
}

.lang-picker { position: relative; }

.lang-toggle {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem;
  min-width: 56px; height: 34px;
  padding: 0 0.45rem;
  background: rgba(245, 245, 229, 0.08);
  border: 1px solid rgba(245, 245, 229, 0.3);
  border-radius: 14px;
  cursor: pointer;
  color: #F5F5E5;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 220ms ease, background 220ms ease,
              box-shadow 220ms ease, transform 220ms ease;
}

.lang-toggle:hover {
  border-color: var(--sand);
  background: rgba(245, 245, 229, 0.12);
  box-shadow: 0 10px 24px -16px rgba(245, 245, 229, 0.5);
  transform: translateY(-1px);
}

.lang-globe { width: 13px; height: 13px; opacity: 0.72; }

.lang-code {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.07em;
}

.lang-caret {
  width: 8px; height: 6px;
  opacity: 0.62;
  transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.lang-caret.is-open { transform: rotate(180deg); }

.lang-menu {
  position: absolute;
  top: calc(100% + 0.55rem);
  inset-inline-end: 0;
  z-index: 4;
  width: 136px;
  padding: 0.375rem;
  background: rgba(0, 27, 0, 0.9);
  border: 1px solid rgba(245, 245, 229, 0.2);
  border-radius: 16px;
  box-shadow: 0 20px 44px -24px rgba(0, 27, 0, 0.92), inset 0 1px 0 rgba(245, 245, 229, 0.08);
  backdrop-filter: blur(16px) saturate(1.08);
  -webkit-backdrop-filter: blur(16px) saturate(1.08);
}

.lang-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.7rem;
  color: rgba(245, 245, 229, 0.78);
  background: transparent;
  border: 0;
  border-radius: 11px;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 500;
  text-align: start;
  transition: color 220ms ease, background 220ms ease, transform 220ms ease;
}

.lang-option:hover,
.lang-option:focus-visible {
  color: var(--sand);
  background: rgba(245, 245, 229, 0.11);
  transform: translateX(2px);
}

html[dir='rtl'] .lang-option:hover,
html[dir='rtl'] .lang-option:focus-visible { transform: translateX(-2px); }

.lang-option:focus-visible {
  outline: 1px solid rgba(245, 245, 229, 0.62);
  outline-offset: -1px;
}

.lang-option.is-active { color: var(--sand); background: rgba(245, 245, 229, 0.08); }

.lang-option-code {
  color: rgba(245, 245, 229, 0.46);
  font-family: var(--font-body);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.lang-pop-enter-active,
.lang-pop-leave-active {
  transform-origin: top right;
  transition: opacity 180ms ease, transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

html[dir='rtl'] .lang-pop-enter-active,
html[dir='rtl'] .lang-pop-leave-active { transform-origin: top left; }

.lang-pop-enter-from,
.lang-pop-leave-to { opacity: 0; transform: translateY(-5px) scale(0.96); }

/* ── Mobile ────────────────────────────────────────────── */
.menu-toggle {
  display: none;
  flex-direction: column; justify-content: center; gap: 5px;
  width: 42px; height: 42px;
  padding: 0 11px;
  background: transparent;
  border: 1.5px solid rgba(245, 245, 229, 0.4);
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.menu-toggle:hover {
  border-color: var(--sand);
  box-shadow: 0 0 20px -6px rgba(245, 245, 229, 0.5);
}

.menu-bar {
  display: block; height: 2px; width: 100%;
  border-radius: 2px; background: #F5F5E5;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav.is-open .menu-bar:first-child { transform: translateY(3.5px) rotate(45deg); }
.nav.is-open .menu-bar:last-child { transform: translateY(-3.5px) rotate(-45deg); }

.mobile-menu {
  display: none;
  flex-direction: column; gap: 0.25rem;
  max-width: 1280px; margin: 0 auto;
  padding: 1rem 2rem 1.5rem;
}

.mobile-link {
  padding: 0.875rem 1.125rem;
  border-radius: 16px;
  text-decoration: none;
  font-size: 1.0625rem; font-weight: 500;
  color: rgba(245, 245, 229, 0.85);
  transition: background 250ms ease, color 250ms ease;
}

.mobile-link:hover { background: rgba(245, 245, 229, 0.14); color: var(--orange); }
.mobile-link.is-active { background: rgba(245, 245, 229, 0.14); color: #F5F5E5; }

.mobile-cta { justify-content: center; margin-top: 0.75rem; }

.menu-drop-enter-active, .menu-drop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.menu-drop-enter-from, .menu-drop-leave-to {
  opacity: 0; transform: translateY(-10px);
}

@media (max-width: 1040px) {
  .nav-links { display: none; }
  .nav-inner { grid-template-columns: auto 1fr; padding: 0 1.25rem; }
  .nav-actions { justify-self: end; }
  .menu-toggle { display: flex; }
  .mobile-menu { display: flex; padding: 1rem 1.25rem 1.5rem; }
}
</style>
