<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useMetadata } from './composables/useMetadata.js'

const { t } = useI18n()
const route = useRoute()
const isAdmin = computed(() => Boolean(route.meta.admin))
const showBackToTop = ref(false)
const backToTopLaunching = ref(false)
let launchTimer
let launchResetTimer

const clearLaunchTimers = () => {
  window.clearTimeout(launchTimer)
  window.clearTimeout(launchResetTimer)
  launchTimer = undefined
  launchResetTimer = undefined
}

const updateBackToTop = () => {
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
  const scrollProgress = window.scrollY / maxScroll
  const atTop = window.scrollY <= 12

  if (backToTopLaunching.value && atTop) {
    backToTopLaunching.value = false
    clearLaunchTimers()
  }

  showBackToTop.value = !atTop && (backToTopLaunching.value || scrollProgress >= 0.37)
}

const scrollToTop = () => {
  if (backToTopLaunching.value) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  backToTopLaunching.value = true
  clearLaunchTimers()

  if (reduceMotion) {
    window.scrollTo({ top: 0, behavior: 'auto' })
    window.requestAnimationFrame(updateBackToTop)
    return
  }

  // Let the compression frame land, then launch with the smooth page scroll.
  launchTimer = window.setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 90)

  launchResetTimer = window.setTimeout(() => {
    backToTopLaunching.value = false
    updateBackToTop()
  }, 1800)
}

onMounted(() => {
  updateBackToTop()
  window.addEventListener('scroll', updateBackToTop, { passive: true })
  window.addEventListener('resize', updateBackToTop)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateBackToTop)
  window.removeEventListener('resize', updateBackToTop)
  clearLaunchTimers()
})

useMetadata()
</script>

<template>
  <div class="app-wrapper grain">
    <!-- Ambient atmosphere — sky and sunlight drifting behind every page -->
    <div v-if="!isAdmin" class="ambient" aria-hidden="true">
      <span class="ambient-blob ambient-sky"></span>
      <span class="ambient-blob ambient-sun"></span>
      <span class="ambient-blob ambient-mint"></span>
    </div>

    <Navbar v-if="!isAdmin" />

    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <Footer v-if="!isAdmin" />

    <transition name="back-to-top">
      <button
        v-if="showBackToTop && !isAdmin"
        class="back-to-top"
        :class="{ 'is-launching': backToTopLaunching }"
        type="button"
        :aria-label="t('backToTop')"
        :title="t('backToTop')"
        :aria-busy="backToTopLaunching"
        @click="scrollToTop"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
        </svg>
      </button>
    </transition>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* The sand canvas — #F5F5E5, flat. Each page adds depth only with
     soft, localized radial flares (see the views), never a wash. */
  background: var(--paper);
  color: var(--ink);
  overflow-x: hidden;
  position: relative;
}

/* Fixed atmosphere: three soft color fields drifting very slowly.
   They sit under everything and keep any "plain white" from surviving. */
.ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.ambient-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  will-change: transform;
}

.ambient-sky {
  width: 56vw; height: 56vw;
  top: -18vw; inset-inline-end: -14vw;
  background: radial-gradient(circle, rgba(255, 146, 92, 0.14) 0%, rgba(255, 146, 92, 0) 70%);
  animation: drift 26s ease-in-out infinite;
}

.ambient-sun {
  width: 48vw; height: 48vw;
  top: 22vh; inset-inline-start: -16vw;
  background: radial-gradient(circle, rgba(255, 146, 92, 0.12) 0%, rgba(255, 146, 92, 0) 70%);
  animation: drift 32s ease-in-out infinite reverse;
}

/* The green nuance — soft green #2E5B2E as a quiet undertone */
.ambient-mint {
  width: 44vw; height: 44vw;
  bottom: -14vw; inset-inline-end: 8vw;
  background: radial-gradient(circle, rgba(46, 91, 46, 0.14) 0%, rgba(46, 91, 46, 0) 70%);
  animation: drift 38s ease-in-out infinite;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.main-content > :deep(.view) {
  flex: 1;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-fade-enter-from { opacity: 0; transform: translateY(12px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-8px); }

.back-to-top {
  position: fixed;
  inset-inline-end: clamp(1rem, 3vw, 2rem);
  inset-block-end: max(1rem, env(safe-area-inset-bottom));
  z-index: 90;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 0;
  color: var(--ink);
  background:
    linear-gradient(145deg, rgba(245, 245, 229, 0.24), rgba(245, 245, 229, 0.06)),
    rgba(255, 146, 92, 0.78);
  border: 1px solid rgba(245, 245, 229, 0.46);
  border-radius: 13px;
  box-shadow:
    0 18px 42px -20px rgba(0, 41, 0, 0.72),
    inset 0 1px 0 rgba(245, 245, 229, 0.4),
    inset 0 -1px 0 rgba(0, 41, 0, 0.08);
  backdrop-filter: blur(14px) saturate(1.12);
  -webkit-backdrop-filter: blur(14px) saturate(1.12);
  cursor: pointer;
  will-change: transform, opacity;
  transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 240ms ease,
              background 240ms ease;
}

.back-to-top svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.back-to-top:not(.is-launching):hover {
  transform: translateY(-3px) scale(1.03);
  background:
    linear-gradient(145deg, rgba(245, 245, 229, 0.3), rgba(245, 245, 229, 0.08)),
    rgba(255, 146, 92, 0.84);
  box-shadow:
    0 22px 48px -20px rgba(0, 41, 0, 0.78),
    0 0 22px rgba(255, 146, 92, 0.2),
    inset 0 1px 0 rgba(245, 245, 229, 0.46);
}

.back-to-top:not(.is-launching):hover svg { transform: translateY(-1px); }

.back-to-top.is-launching {
  pointer-events: none;
  animation: backToTopLaunch 680ms both;
}

.back-to-top:focus-visible {
  outline: 3px solid rgba(0, 41, 0, 0.38);
  outline-offset: 3px;
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: opacity 240ms ease,
              transform 360ms cubic-bezier(0.16, 1, 0.3, 1),
              filter 240ms ease;
}

.back-to-top-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.82);
  filter: blur(1.5px);
}

.back-to-top-leave-active { animation: none; }
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.9);
  filter: blur(1.5px);
}

@keyframes backToTopLaunch {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.7, 0.2);
  }
  14% {
    transform: translateY(2px) scale(0.92) rotate(0deg);
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  58% {
    transform: translateY(-32px) scale(1.05) rotate(3deg);
    animation-timing-function: cubic-bezier(0.22, 0.8, 0.28, 1);
  }
  78% { transform: translateY(-27px) scale(1.025) rotate(1.5deg); }
  100% { transform: translateY(-30px) scale(1.03) rotate(2deg); }
}

@media (max-width: 640px) {
  .back-to-top {
    width: 48px;
    height: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-to-top,
  .back-to-top-enter-active,
  .back-to-top-leave-active {
    transition: none;
    animation: none;
  }
}
</style>
