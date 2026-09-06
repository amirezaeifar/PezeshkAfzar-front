<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { products } from '../data/products.js'
import { siteImages } from '../data/site.js'
import { testimonials } from '../data/testimonials.js'
import { localize } from '../utils/localized.js'

const { t, locale } = useI18n()

/* Home previews read from the product records with page-specific presentation overrides. */
const softwarePreview = products
  .filter((p) => p.type === 'software')
  .slice(0, 3)
  .map((product) => (
    product.id === 'todays-mom'
      ? { ...product, flagship: false, image: '/images/software/todays-mom-main-page.jpg' }
      : product.id === 'skinapp'
        ? { ...product, image: '/images/software/skinapp-main-page.jpg' }
      : product.id === 'agingdrug'
        ? { ...product, image: '/images/software/agingdrug-main-page.jpg' }
      : product
  ))
const techPreview = products.filter((p) => p.type === 'equipment').slice(0, 2)
const tickerProducts = products.map((product) => ({
  ...product,
  tickerName:
    product.id === 'hospital-autoclaves'
      ? { en: 'Industrial Autoclaves', fa: 'اتوکلاوهای صنعتی' }
      : product.name,
}))

const missionPoints = ['p1', 'p2', 'p3']
const customSteps = ['analyze', 'design', 'build']

/* The voices checkerboard — photos and quote plates alternating
   across a 3-column grid: P Q P / Q P Q / P Q P */
const voicePhoto = (tm) => tm.photo.replace('w=400', 'w=900')
const testimonialMobileImages = {
  '/images/testimonials/mother-baby.jpg': '/images/testimonials/mother-baby-mobile.jpg',
  '/images/testimonials/family-sunset.jpg': '/images/testimonials/family-sunset-mobile.jpg',
}
const voiceCells = [
  ...testimonials.slice(0, 4).flatMap((tm, i) => [
    {
      type: 'photo',
      src: voicePhoto(testimonials[i]),
      mobileSrc: testimonialMobileImages[voicePhoto(testimonials[i])],
    },
    { type: 'quote', tm },
  ]),
  ...(testimonials[4] ? [{ type: 'photo', src: voicePhoto(testimonials[4]) }] : []),
]
const whyKeys = ['accuracy', 'reliability', 'innovation']
const partnerPoints = ['p1', 'p2', 'p3']

/* Film-title reveal — the headline rises word by word out of clip masks */
const titleWordsA = computed(() => t('hero.titleA').split(' '))
const titleWordsC = computed(() => t('hero.titleC').split(' '))
const delayA = (i) => `${0.35 + i * 0.09}s`
const delayB = computed(() => `${0.35 + titleWordsA.value.length * 0.09}s`)
const delayC = (i) => `${0.44 + (titleWordsA.value.length + i) * 0.09}s`

const root = ref(null)
const heroEl = ref(null)
const heroVisual = ref(null)
const tickerTrack = ref(null)
const tickerGroup = ref(null)

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Pointer parallax — the scene leans toward the cursor */
const onHeroMove = (e) => {
  if (reducedMotion || !heroVisual.value) return
  const rect = heroVisual.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  heroVisual.value.style.setProperty('--px', x.toFixed(3))
  heroVisual.value.style.setProperty('--py', y.toFixed(3))
}

const onHeroLeave = () => {
  if (!heroVisual.value) return
  heroVisual.value.style.setProperty('--px', '0')
  heroVisual.value.style.setProperty('--py', '0')
}

/* Scroll parallax — hero layers drift apart at different depths */
let ticking = false
const onScroll = () => {
  if (reducedMotion || ticking || !heroEl.value) return
  ticking = true
  requestAnimationFrame(() => {
    const h = heroEl.value
    if (h) {
      const progress = Math.min(window.scrollY / Math.max(h.offsetHeight, 1), 1)
      h.style.setProperty('--sy', progress.toFixed(4))
    }
    ticking = false
  })
}

/* The product ribbon moves with one composited transform. Its speed eases
   down while people explore it, rather than snapping to a pause. */
let tickerFrame = 0
let tickerLastTime = 0
let tickerOffset = 0
let tickerWidth = 0
let tickerSpeed = 48
let tickerTargetSpeed = 48
let tickerResizeObserver = null

const setTickerExploring = (isExploring) => {
  tickerTargetSpeed = isExploring ? 13 : 48
}

const onTickerFocusOut = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) setTickerExploring(false)
}

const animateTicker = (time) => {
  if (!tickerLastTime) tickerLastTime = time
  const elapsed = Math.min(time - tickerLastTime, 64)
  tickerLastTime = time
  tickerSpeed += (tickerTargetSpeed - tickerSpeed) * Math.min(1, elapsed / 260)

  if (tickerWidth && tickerTrack.value) {
    tickerOffset = (tickerOffset + tickerSpeed * elapsed / 1000) % tickerWidth
    tickerTrack.value.style.transform = `translate3d(${-tickerOffset}px, 0, 0)`
  }

  tickerFrame = requestAnimationFrame(animateTicker)
}

/* Scroll reveals */
let observer = null
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  if (!reducedMotion) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    root.value?.querySelectorAll('.reveal, .reveal-side').forEach((el) => observer.observe(el))

    tickerWidth = tickerGroup.value?.offsetWidth ?? 0
    tickerResizeObserver = new ResizeObserver((entries) => {
      tickerWidth = entries[0]?.contentRect.width ?? tickerWidth
    })
    if (tickerGroup.value) tickerResizeObserver.observe(tickerGroup.value)
    tickerFrame = requestAnimationFrame(animateTicker)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
  tickerResizeObserver?.disconnect()
  cancelAnimationFrame(tickerFrame)
})
</script>

<template>
  <main ref="root" class="view">
    <!-- 1 · The opening shot — a full-screen frame in deep earthy green,
         where an orange sun warms a life lived well -->
    <section ref="heroEl" class="cine" style="--sy: 0" @pointermove="onHeroMove" @pointerleave="onHeroLeave">
      <span class="cine-sun" aria-hidden="true"></span>
      <span class="cine-halo" aria-hidden="true"></span>
      <span class="cine-beam" aria-hidden="true"></span>

      <div class="cine-inner">
        <div class="cine-copy">
          <span class="eyebrow eyebrow-deep cine-focus" style="animation-delay: 0.15s">{{ t('hero.eyebrow') }}</span>

          <h1 class="cine-title">
            <span class="cine-line">
              <span v-for="(w, i) in titleWordsA" :key="`a-${i}`" class="cine-mask cine-word">
                <span class="cine-lift" :style="{ animationDelay: delayA(i) }">{{ w }}</span>
              </span>
            </span>
            <span class="cine-line">
              <span class="cine-mask cine-word cine-word-accent">
                <span class="cine-lift" :style="{ animationDelay: delayB }">
                  <em class="text-fire">{{ t('hero.titleB') }}</em>
                </span>
              </span>
              <span v-for="(w, i) in titleWordsC" :key="`c-${i}`" class="cine-mask cine-word">
                <span class="cine-lift" :style="{ animationDelay: delayC(i) }">{{ w }}</span>
              </span>
            </span>
          </h1>

          <p class="cine-sub cine-focus" style="animation-delay: 0.9s">{{ t('hero.subtitle') }}</p>

          <div class="cine-actions cine-focus" style="animation-delay: 1.05s">
            <RouterLink to="/products" class="btn-ink pulse-cta">
              {{ t('hero.ctaPrimary') }}
              <span class="arrow">→</span>
            </RouterLink>
            <RouterLink to="/contact" class="btn-ghost-light">{{ t('hero.ctaSecondary') }}</RouterLink>
          </div>

          <div class="cine-trust cine-focus" style="animation-delay: 1.2s">
            <span class="trust-avatars" aria-hidden="true">
              <i class="trust-avatar av-1"></i>
              <i class="trust-avatar av-2"></i>
              <i class="trust-avatar av-3"></i>
            </span>
            <span class="trust-copy">
              <strong>{{ t('hero.trust.value') }}</strong>
              {{ t('hero.trust.label') }}
            </span>
          </div>
        </div>

        <!-- The scene: parallax layers around a person whose day just got lighter -->
        <div ref="heroVisual" class="cine-visual" aria-hidden="true">
          <span class="cine-ring"></span>

          <div class="cine-arch photo-frame cine-focus" style="animation-delay: 0.5s">
            <img :src="siteImages.hero" alt="" loading="eager" class="cine-zoom" />
          </div>

          <figure class="cine-moment photo-frame cine-focus" style="animation-delay: 0.85s">
            <img :src="siteImages.life3" alt="" loading="lazy" decoding="async" />
          </figure>

          <div class="float float-chip-a cine-focus" style="animation-delay: 1.05s">
            <div class="bob chip-card">
              <span class="chip-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12h4l2.5-6 4 12L16 12h5" />
                </svg>
              </span>
              <span class="chip-text">
                <strong>{{ t('hero.chips.a.value') }}</strong>
                <small>{{ t('hero.chips.a.label') }}</small>
              </span>
            </div>
          </div>

          <div class="float float-chip-b cine-focus" style="animation-delay: 1.25s">
            <div class="bob bob-slow chip-card">
              <span class="chip-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 17.5 4c-1.6 0-3 .8-4 2-1-1.2-2.4-2-4-2A4.5 4.5 0 0 0 5 8.5c0 2.2 1.5 4 3 5.5l5.5 5.5L19 14z" />
                </svg>
              </span>
              <span class="chip-text">
                <strong>{{ t('hero.chips.b.value') }}</strong>
                <small>{{ t('hero.chips.b.label') }}</small>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="cine-cue cine-focus" style="animation-delay: 1.5s" aria-hidden="true">
        <span class="cue-pill"><span class="cue-drop"></span></span>
        <span class="cue-label">{{ t('hero.scroll') }}</span>
      </div>

    </section>

    <!-- Product ticker — a compact, continuously moving index directly
         below the opening shot. -->
    <nav
      class="product-ticker"
      :aria-label="t('productTicker.ariaLabel')"
      @pointerenter="setTickerExploring(true)"
      @pointerleave="setTickerExploring(false)"
      @focusin="setTickerExploring(true)"
      @focusout="onTickerFocusOut"
    >
      <div class="ticker-viewport">
        <div ref="tickerTrack" class="ticker-track">
          <div ref="tickerGroup" class="ticker-group">
            <RouterLink
              v-for="product in tickerProducts"
              :key="product.id"
              :to="`/products/${product.id}`"
              class="ticker-item"
            >
              <span class="ticker-name">{{ localize(product.tickerName, locale) }}</span>
              <span class="ticker-separator" aria-hidden="true">•</span>
            </RouterLink>
          </div>
          <div class="ticker-group ticker-clone" aria-hidden="true">
            <RouterLink
              v-for="product in tickerProducts"
              :key="`clone-${product.id}`"
              :to="`/products/${product.id}`"
              class="ticker-item"
              tabindex="-1"
            >
              <span class="ticker-name">{{ localize(product.tickerName, locale) }}</span>
              <span class="ticker-separator" aria-hidden="true">•</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 2 · Mission — the day we give back -->
    <section class="mission">
      <div class="mission-grid">
        <div class="mission-copy">
          <span class="eyebrow reveal">{{ t('mission.eyebrow') }}</span>
          <h2 class="mission-title reveal">{{ t('mission.title') }}</h2>
          <p class="mission-body reveal">{{ t('mission.body') }}</p>

          <!-- The cascade — each promise steps further into the light -->
          <div class="mission-points">
            <article
              v-for="(k, i) in missionPoints" :key="k"
              class="point reveal-side"
              :style="{ transitionDelay: `${i * 0.12}s` }"
            >
              <span class="point-icon" aria-hidden="true">
                <svg v-if="k === 'p1'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 17.5 4c-1.6 0-3 .8-4 2-1-1.2-2.4-2-4-2A4.5 4.5 0 0 0 5 8.5c0 2.2 1.5 4 3 5.5l5.5 5.5L19 14z" />
                </svg>
                <svg v-else-if="k === 'p2'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2l2.4 2.4 3.4-.5.6 3.4 3 1.7-1.5 3 1.5 3-3 1.7-.6 3.4-3.4-.5L12 22l-2.4-2.4-3.4.5-.6-3.4-3-1.7 1.5-3-1.5-3 3-1.7.6-3.4 3.4.5L12 2z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 21C7 17 3 13.6 3 9.5 3 6.4 5.4 4 8.5 4c1.7 0 3 .8 3.5 1.5C12.5 4.8 13.8 4 15.5 4 18.6 4 21 6.4 21 9.5c0 4.1-4 7.5-9 11.5z" />
                </svg>
              </span>
              <div class="point-text">
                <h3 class="point-title">{{ t(`mission.points.${k}.title`) }}</h3>
                <p class="point-body">{{ t(`mission.points.${k}.body`) }}</p>
              </div>
            </article>
          </div>
        </div>

        <!-- Overlapping collage — three frames of life, each carrying the ember -->
        <div class="mission-collage reveal">
          <span class="collage-ring" aria-hidden="true"></span>
          <figure class="life life-a photo-frame"><img :src="siteImages.life1" alt="" loading="lazy" decoding="async" class="kenburns" /></figure>
          <figure class="life life-b photo-frame"><img :src="siteImages.life2" alt="" loading="lazy" decoding="async" /></figure>
          <figure class="life life-c photo-frame"><img :src="siteImages.sunrise" alt="" loading="lazy" decoding="async" /></figure>
        </div>
      </div>
    </section>

    <!-- 3 · Voices — a checkerboard of vibrant photos and quote plates,
         alternating across the grid per the reference layout -->
    <section class="voices">
      <header class="voices-head">
        <span class="eyebrow reveal">{{ t('trusted.eyebrow') }}</span>
        <h2 class="voices-title reveal">{{ t('trusted.title') }}</h2>
        <p class="voices-sub reveal">{{ t('trusted.sub') }}</p>

        <div class="voices-badge reveal" role="img" :aria-label="`${t('trusted.badgeValue')} — ${t('trusted.badgeLabel')}`">
          <span class="badge-stars" aria-hidden="true">
            <svg v-for="s in 5" :key="s" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
            </svg>
          </span>
          <strong class="badge-value">{{ t('trusted.badgeValue') }}</strong>
          <span class="badge-label">{{ t('trusted.badgeLabel') }}</span>
        </div>
      </header>

      <div class="voices-grid">
        <template v-for="(cell, i) in voiceCells" :key="`v-${i}`">
          <figure
            v-if="cell.type === 'photo'"
            class="voice-shot reveal"
            :style="{ transitionDelay: `${0.06 + (i % 3) * 0.08}s` }"
          >
            <picture>
              <source v-if="cell.mobileSrc" media="(max-width: 720px)" :srcset="cell.mobileSrc" />
              <img :src="cell.src" alt="" loading="lazy" decoding="async" />
            </picture>
          </figure>

          <figure
            v-else
            class="voice reveal"
            :style="{ transitionDelay: `${0.06 + (i % 3) * 0.08}s` }"
          >
            <span class="voice-quotemark" aria-hidden="true">“</span>
            <blockquote class="voice-quote">{{ localize(cell.tm.quote, locale) }}</blockquote>
            <figcaption class="voice-foot">
              <span class="voice-name">—{{ localize(cell.tm.name, locale) }}</span>
              <span class="voice-trust">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
                </svg>
                Trustpilot
              </span>
            </figcaption>
          </figure>
        </template>
      </div>
    </section>

    <!-- 4 · Software platforms — a stepped cascade of cards -->
    <section id="solutions" class="block-section">
      <header class="section-head reveal">
        <div class="head-left">
          <span class="eyebrow">{{ t('solutions.eyebrow') }}</span>
          <h2 class="section-title">{{ t('solutions.title') }}</h2>
        </div>
        <p class="section-sub">{{ t('solutions.sub') }}</p>
      </header>

      <div class="cascade-grid">
        <div
          v-for="(product, i) in softwarePreview" :key="product.id"
          class="cascade-cell reveal"
          :style="{ transitionDelay: `${i * 0.12}s` }"
        >
          <ProductCard :product="product" :index="i" variant="showcase" />
        </div>
      </div>

      <div class="section-foot reveal">
        <RouterLink to="/products#platforms" class="btn-ghost-ink">
          {{ t('solutions.viewAll') }}
          <span class="arrow">→</span>
        </RouterLink>
      </div>
    </section>

    <!-- 5 · Built just for you — the sunlit workshop -->
    <section class="custom">
      <div class="custom-panel">
        <header class="custom-head reveal">
          <span class="eyebrow">{{ t('custom.eyebrow') }}</span>
          <h2 class="custom-title">{{ t('custom.title') }}</h2>
          <p class="custom-sub">{{ t('custom.sub') }}</p>
        </header>

        <!-- The path — three plates in a gentle asymmetric drift, each
             carrying one outlined numeral inside the box. Classes are
             .craft-* on purpose: .steps/.step collide with daisyUI's
             stepper, which injects its own counters and overflow. -->
        <div class="craft-steps">
          <article
            v-for="(k, i) in customSteps" :key="k"
            class="craft-step reveal"
            :class="`craft-${i}`"
            :style="{ transitionDelay: `${i * 0.14}s` }"
          >
            <span class="craft-no" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="craft-title">{{ t(`custom.steps.${k}.title`) }}</h3>
            <p class="craft-body">{{ t(`custom.steps.${k}.body`) }}</p>
          </article>
        </div>

        <div class="custom-foot reveal">
          <RouterLink to="/contact" class="btn-ink pulse-cta">
            {{ t('custom.cta') }}
            <span class="arrow">→</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 6 · The split feature — half a warm photograph, half solid deep
         green. Technology that works around your wards. -->
    <section class="partner">
      <div class="partner-media photo-frame reveal">
        <img :src="siteImages.partner" alt="" loading="lazy" decoding="async" />
      </div>

      <div class="partner-panel">
        <div class="partner-content reveal">
          <span class="eyebrow eyebrow-deep">{{ t('partner.eyebrow') }}</span>
          <h2 class="partner-title">{{ t('partner.title') }}</h2>
          <p class="partner-body">{{ t('partner.body') }}</p>

          <ul class="partner-points">
            <li v-for="(k, i) in partnerPoints" :key="k" class="ppoint" :style="{ transitionDelay: `${i * 0.1}s` }">
              <span class="ppoint-check" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span class="ppoint-text">
                <strong class="ppoint-title">{{ t(`partner.points.${k}.title`) }}</strong>
                <span class="ppoint-body">{{ t(`partner.points.${k}.body`) }}</span>
              </span>
            </li>
          </ul>

          <RouterLink to="/contact" class="btn-light partner-cta">
            {{ t('partner.cta') }}
            <span class="arrow">→</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 7 · Fresh technologies — two frames, offset, with one small
         flare pooling off the right side of the box -->
    <section id="technologies" class="block-section tech-block">
      <span class="tech-flare" aria-hidden="true"></span>
      <header class="section-head reveal">
        <div class="head-left">
          <span class="eyebrow">{{ t('tech.eyebrow') }}</span>
          <h2 class="section-title">{{ t('tech.title') }}</h2>
        </div>
        <p class="section-sub">{{ t('tech.sub') }}</p>
      </header>

      <div class="tech-grid">
        <div
          v-for="(product, i) in techPreview" :key="product.id"
          class="tech-cell reveal"
          :style="{ transitionDelay: `${i * 0.12}s` }"
        >
          <ProductCard :product="product" :index="i" variant="showcase" />
        </div>
      </div>

      <div class="section-foot reveal">
        <RouterLink to="/products#innovations" class="btn-ghost-ink">
          {{ t('tech.viewAll') }}
          <span class="arrow">→</span>
        </RouterLink>
      </div>
    </section>

    <!-- 8 · Why people choose us — a trio on the sand -->
    <section class="why">
      <header class="section-head reveal">
        <div class="head-left">
          <span class="eyebrow">{{ t('why.eyebrow') }}</span>
          <h2 class="section-title">{{ t('why.title') }}</h2>
        </div>
        <p class="section-sub">{{ t('why.sub') }}</p>
      </header>

      <div class="why-grid">
        <article
          v-for="(k, i) in whyKeys" :key="k"
          class="why-item reveal"
          :class="`why-${i}`"
          :style="{ transitionDelay: `${i * 0.12}s` }"
        >
          <span class="why-icon" aria-hidden="true">
            <svg v-if="k === 'accuracy'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <svg v-else-if="k === 'reliability'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 20h10" />
              <path d="M12 20v-8" />
              <path d="M12 12c4 0 7-3 7-8-5 0-7 3-7 8zM12 12c-3.5 0-6-2.5-6-6.5 4.5 0 6 2.5 6 6.5z" />
            </svg>
          </span>
          <h3 class="why-item-title">{{ t(`why.items.${k}.title`) }}</h3>
          <p class="why-item-body">{{ t(`why.items.${k}.body`) }}</p>
        </article>
      </div>
    </section>

    <!-- 9 · Let's talk — the finale melts from orange back into sand -->
    <section class="consult">
      <div class="consult-panel reveal">
        <span class="consult-sun breathe" aria-hidden="true"></span>

        <span class="eyebrow consult-eyebrow">{{ t('consult.eyebrow') }}</span>
        <h2 class="consult-title">{{ t('consult.title') }}</h2>
        <p class="consult-body">{{ t('consult.body') }}</p>
        <div class="consult-actions">
          <RouterLink to="/contact" class="btn-light pulse-cta">
            {{ t('consult.ctaPrimary') }}
            <span class="arrow">→</span>
          </RouterLink>
          <RouterLink to="/about" class="btn-ghost-deep">{{ t('consult.ctaSecondary') }}</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* The page canvas: one calm, flat sheet of ivory. Depth comes from a
   few localized, non-continuous flares pooled through the mid-to-bottom
   sections — soft breaths of warmth and green, never a page-long wash.
   Inverted bands (.voices, .consult-panel) still answer in orange. */
.view {
  background-color: var(--sand);
  background-image:
    radial-gradient(56rem 36rem at 84% 24%, rgba(255, 146, 92, 0.09), transparent 68%),
    radial-gradient(46rem 30rem at 4% 46%, rgba(46, 91, 46, 0.07), transparent 66%),
    radial-gradient(52rem 34rem at 94% 64%, rgba(255, 146, 92, 0.11), transparent 64%),
    radial-gradient(42rem 28rem at 10% 88%, rgba(255, 172, 127, 0.14), transparent 62%);
  background-repeat: no-repeat;
}

/* ── 1 · The opening shot ────────────────────────────── */
.cine {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: var(--grad-hero);
  overflow: hidden;
  color: #F5F5E5;
}

/* The sun — a vibrant orange body breathing behind the scene */
.cine-sun {
  position: absolute;
  width: 62vw; height: 62vw;
  min-width: 560px; min-height: 560px;
  top: -18vw; inset-inline-end: -16vw;
  pointer-events: none;
  transform: translateY(calc(var(--sy) * 140px));
}

.cine-sun::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(246, 224, 201, 0.8) 0%,
    rgba(246, 224, 201, 0.38) 38%,
    rgba(246, 224, 201, 0.12) 58%,
    rgba(246, 224, 201, 0) 72%);
  animation: sunPulse 9s ease-in-out infinite;
}

/* A low answering glow near the ground */
.cine-halo {
  position: absolute;
  width: 50vw; height: 30vw;
  bottom: -12vw; inset-inline-start: -12vw;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255, 146, 92, 0.2) 0%, rgba(255, 146, 92, 0) 70%);
  filter: blur(30px);
  pointer-events: none;
  transform: translateY(calc(var(--sy) * 60px));
}

/* One warm light-beam sweeps the frame on load */
.cine-beam {
  position: absolute;
  top: -10%; bottom: -10%;
  width: 22%;
  inset-inline-start: 0;
  background: linear-gradient(90deg,
    rgba(245, 245, 229, 0) 0%,
    rgba(245, 245, 229, 0.12) 50%,
    rgba(245, 245, 229, 0) 100%);
  pointer-events: none;
  animation: lightSweep 2.4s cubic-bezier(0.6, 0, 0.3, 1) 0.6s both;
}

.cine-inner {
  position: relative;
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 9rem 2rem 3rem;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 3rem;
  align-items: center;
}

.cine-copy {
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 1.75rem;
}

.cine-title {
  font-family: var(--font-display);
  font-size: clamp(2.875rem, 6.2vw, 5.5rem);
  line-height: 1.02; font-weight: 550;
  letter-spacing: var(--track-display);
  margin: 0; color: #F5F5E5;
}

html[lang='fa'] .cine-title { line-height: 1.28; font-weight: 800; }

.cine-line { display: block; }

/* Each word rises from its own clip mask, film-title style */
.cine-word {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding-bottom: 0.14em;
  margin-inline-end: 0.24em;
}

.cine-word .cine-lift { padding-bottom: 0.02em; }

html[lang='en'] .cine-word-accent {
  padding-inline-end: 0.12em;
  margin-inline-end: 0.12em;
}

.cine-title em { font-style: italic; }
html[lang='fa'] .cine-title em { font-style: normal; }

.cine-sub {
  font-size: 1.125rem; line-height: 1.75;
  color: rgba(245, 245, 229, 0.8);
  margin: 0; max-width: 52ch;
}

.cine-actions { display: flex; flex-wrap: wrap; gap: 0.875rem; align-items: center; }

.cine-trust {
  display: flex; align-items: center; gap: 0.875rem;
  margin-top: 0.25rem;
}

.trust-avatars { display: inline-flex; }

.trust-avatar {
  display: inline-block; width: 38px; height: 38px;
  border-radius: 50%; border: 2.5px solid rgba(0, 27, 0, 0.85);
}

.trust-avatar + .trust-avatar { margin-inline-start: -10px; }
.av-1 { background: linear-gradient(140deg, #FFC8A8, #FF925C); }
.av-2 { background: linear-gradient(140deg, #F5F5E5, #2E5B2E); }
.av-3 { background: linear-gradient(140deg, #FFDCC7, #F2773B); }

.trust-copy {
  font-size: 0.875rem; color: rgba(245, 245, 229, 0.72); line-height: 1.4;
}

.trust-copy strong {
  display: block; color: var(--orange); font-size: 1.125rem; font-weight: 700;
  font-family: var(--font-display);
}

/* ── The parallax scene ──────────────────────────────── */
.cine-visual {
  position: relative;
  min-height: 540px;
  --px: 0; --py: 0;
}

/* Orange orbit ring — slow rotation, dashed light */
.cine-ring {
  position: absolute;
  left: 50%; bottom: 4%;
  width: min(96%, 470px);
  aspect-ratio: 1;
  margin-left: calc(min(96%, 470px) / -2);
  border-radius: 50%;
  border: 2px dashed rgba(246, 224, 201, 0.5);
  filter: drop-shadow(0 0 4px rgba(246, 224, 201, 0.24));
  animation: orbit 46s linear infinite;
  transform-origin: center;
}

/* The arch — pure life lit by its own orange sky, pushed in slowly.
   The frame stays clean: the orange lives inside the photograph. */
.cine-arch {
  position: absolute;
  left: 50%; bottom: 8%;
  width: min(72%, 360px);
  aspect-ratio: 3 / 4;
  margin-left: calc(min(72%, 360px) / -2);
  transform: translate(calc(var(--px) * 12px), calc(var(--py) * 10px + var(--sy) * -70px));
  border-radius: 999px 999px 36px 36px;
  box-shadow: var(--glow-fire), 0 40px 90px -40px rgba(0, 20, 0, 0.7);
  border: 5px solid rgba(245, 245, 229, 0.9);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
}

/* The smaller moment — sunset vitality, overlapping the arch */
.cine-moment {
  position: absolute;
  bottom: 0; inset-inline-start: 2%;
  width: 150px; height: 150px;
  margin: 0;
  border-radius: 50%;
  border: 4px solid rgba(245, 245, 229, 0.9);
  box-shadow: 0 24px 60px -20px rgba(255, 146, 92, 0.45);
  z-index: 2;
  transform: translateY(calc(var(--sy) * -110px));
}

.float {
  position: absolute;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
  z-index: 2;
}

.float-chip-a {
  top: 16%; inset-inline-start: -3%;
  transform: translate(calc(var(--px) * 24px), calc(var(--py) * 18px + var(--sy) * -150px));
}

.float-chip-b {
  bottom: 18%; inset-inline-end: -3%;
  transform: translate(calc(var(--px) * 28px), calc(var(--py) * 22px + var(--sy) * -40px));
}

.bob { animation: bobSoft 5.5s ease-in-out infinite; }
.bob-slow { animation: bobSoft 7.5s ease-in-out infinite; animation-delay: 0.8s; }

/* Deep glass chips with ember icons */
.chip-card {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.8125rem 1.25rem 0.8125rem 0.8125rem;
  background: rgba(0, 27, 0, 0.68);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 146, 92, 0.4);
  border-radius: 20px;
  box-shadow: 0 20px 44px -20px rgba(0, 20, 0, 0.6);
}

html[dir='rtl'] .chip-card { padding: 0.8125rem 0.8125rem 0.8125rem 1.25rem; }

.chip-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: 13px; flex-shrink: 0;
  background: var(--grad-orange); color: #002900;
}

.chip-text { display: flex; flex-direction: column; line-height: 1.25; }
.chip-text strong {
  font-size: 1.0625rem; font-weight: 600; color: #F5F5E5;
  font-family: var(--font-display);
}
.chip-text small { font-size: 0.75rem; color: rgba(245, 245, 229, 0.68); font-weight: 500; }

/* ── Scroll cue ──────────────────────────────────────── */
.cine-cue {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  padding-bottom: 1.5rem;
}

.cue-pill {
  display: block;
  width: 26px; height: 42px;
  border: 2px solid rgba(245, 245, 229, 0.4);
  border-radius: 999px;
  position: relative;
}

.cue-drop {
  position: absolute;
  top: 7px; left: 50%;
  width: 5px; height: 8px;
  margin-left: -2.5px;
  border-radius: 3px;
  background: var(--orange);
  animation: scrollDrop 1.9s ease-in-out infinite;
}

.cue-label {
  font-size: 0.75rem; font-weight: 600;
  color: rgba(245, 245, 229, 0.55);
  letter-spacing: 0.06em;
}

html[lang='fa'] .cue-label { letter-spacing: 0; }

/* ── Product ticker ──────────────────────────────────── */
.product-ticker {
  position: relative;
  z-index: 2;
  direction: ltr;
  overflow: hidden;
  color: #F5F5E5;
  background:
    linear-gradient(105deg, rgba(0, 31, 0, 0.78), rgba(0, 52, 25, 0.62)),
    rgba(0, 41, 0, 0.58);
  border-top: 1px solid rgba(245, 245, 229, 0.16);
  border-bottom: 1px solid rgba(245, 245, 229, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 16px 36px -32px rgba(0, 41, 0, 0.78);
  backdrop-filter: blur(14px) saturate(1.08);
  -webkit-backdrop-filter: blur(14px) saturate(1.08);
}

.product-ticker::before,
.product-ticker::after {
  content: '';
  position: absolute;
  z-index: 3;
  top: 0; bottom: 0;
  width: min(10vw, 7rem);
  pointer-events: none;
}

.product-ticker::before {
  left: 0;
  background: linear-gradient(90deg, rgba(0, 31, 0, 0.96) 8%, rgba(0, 31, 0, 0));
}

.product-ticker::after {
  right: 0;
  background: linear-gradient(270deg, rgba(0, 31, 0, 0.96) 8%, rgba(0, 31, 0, 0));
}

.ticker-viewport {
  overflow: hidden;
  padding: 0.55rem 0;
}

.ticker-track,
.ticker-group {
  display: flex;
  align-items: center;
  width: max-content;
}

.ticker-track {
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

.ticker-group { flex: 0 0 auto; }

.ticker-item {
  display: inline-flex; align-items: center; gap: 1.6rem;
  min-height: 2.75rem;
  padding: 0.25rem 1.85rem;
  color: rgba(245, 245, 229, 0.78);
  opacity: 0.88;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  transition: color 320ms ease, opacity 320ms ease, text-shadow 320ms ease;
}

.ticker-item:hover,
.ticker-item:focus-visible {
  color: var(--orange);
  opacity: 1;
  text-shadow: 0 0 18px rgba(255, 146, 92, 0.42);
}

.ticker-name {
  unicode-bidi: plaintext;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 650;
  letter-spacing: 0.025em;
  text-shadow: 0 0 14px rgba(245, 245, 229, 0.1);
}

html[lang='fa'] .ticker-name { letter-spacing: 0; }

.ticker-separator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: rgba(255, 146, 92, 0.72);
  font-size: 0.78rem;
  line-height: 1;
  text-shadow: 0 0 12px rgba(255, 146, 92, 0.34);
}

/* ── 2 · Mission — asymmetric, overlapping ───────────── */
.mission {
  padding: 7rem 2rem 4rem;
  max-width: 1280px; margin: 0 auto;
}

.mission-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 4rem;
  align-items: center;
}

.mission-copy {
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 1.5rem;
}

.mission-title {
  font-family: var(--font-display);
  font-size: clamp(2.125rem, 4vw, 3.5rem);
  line-height: 1.08; font-weight: 550;
  letter-spacing: var(--track-display); margin: 0;
  color: var(--ink); max-width: 18ch;
}

html[lang='fa'] .mission-title { line-height: 1.3; font-weight: 800; }

.mission-body {
  font-size: 1.0625rem; line-height: 1.8;
  color: var(--ink-soft); margin: 0; max-width: 52ch;
}

/* The cascade — rows step deeper into the page */
.mission-points {
  display: flex; flex-direction: column; gap: 1rem;
  margin-top: 1.25rem;
  width: 100%;
}

.point {
  display: flex; align-items: flex-start; gap: 1.125rem;
  padding: 1.375rem 1.5rem;
  background: var(--cream);
  border: 1px solid rgba(0, 41, 0, 0.2);
  border-radius: var(--radius-card);
  transition-property: opacity, transform, box-shadow;
  max-width: 34rem;
}

.point:nth-child(2) { margin-inline-start: 2.25rem; }
.point:nth-child(3) { margin-inline-start: 4.5rem; }

.point:hover { box-shadow: var(--glow-warm); }

.point-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
  background: var(--grad-orange); color: #002900;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.point:hover .point-icon { transform: scale(1.1) rotate(-6deg); }

.point-text { display: flex; flex-direction: column; gap: 0.375rem; }

.point-title {
  font-family: var(--font-display);
  font-size: 1.1875rem; font-weight: 600;
  margin: 0; color: var(--ink);
}

html[lang='fa'] .point-title { font-weight: 700; }

.point-body {
  font-size: 0.9375rem; line-height: 1.65;
  color: var(--ink-soft); margin: 0;
}

/* The collage — three overlapping frames of life */
.mission-collage {
  position: relative;
  min-height: 560px;
}

/* The green nuance — a quiet soft-green ring behind the collage */
.collage-ring {
  position: absolute;
  top: 6%; inset-inline-end: 0;
  width: 62%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px dashed rgba(46, 91, 46, 0.55);
  animation: orbit 52s linear infinite reverse;
}

.life {
  position: absolute; margin: 0;
  background: var(--cream-deep);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.life img { transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
.life:hover img { transform: scale(1.05); }

.life-a {
  top: 0; inset-inline-start: 0;
  width: 62%; aspect-ratio: 4 / 3;
  border-radius: 32px;
  transform: rotate(-2deg);
  box-shadow: var(--glow-warm);
  z-index: 1;
}

.life-b {
  top: 30%; inset-inline-end: 2%;
  width: 46%; aspect-ratio: 3 / 4;
  border-radius: 999px 999px 28px 28px;
  transform: rotate(1.6deg);
  box-shadow: var(--shadow-lift);
  z-index: 2;
}

.life-c {
  bottom: 0; inset-inline-start: 12%;
  width: 40%; aspect-ratio: 1;
  border-radius: 50%;
  transform: rotate(-1deg);
  box-shadow: var(--glow-warm);
  z-index: 3;
}

.life:hover { transform: rotate(0deg) translateY(-6px); }

/* ── 3 · Voices — the checkerboard of photos & words ─── */
.voices {
  padding: 5.5rem 2rem 6rem;
  max-width: 1280px; margin: 0 auto;
}

.voices-head {
  margin: 0 auto 3.5rem;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 1.25rem;
}

.voices-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.8vw, 3.25rem);
  line-height: 1.1; font-weight: 550;
  letter-spacing: var(--track-display); margin: 0;
  color: var(--ink); max-width: 24ch;
}

html[lang='fa'] .voices-title { line-height: 1.32; font-weight: 800; }

.voices-sub {
  font-size: 1.0313rem; line-height: 1.75;
  color: var(--ink-soft); margin: 0; max-width: 56ch;
}

/* The rating badge — a cream pill with five warm stars */
.voices-badge {
  display: inline-flex; align-items: center; gap: 0.75rem;
  margin-top: 0.5rem;
  padding: 0.6875rem 1.375rem;
  background: var(--cream);
  border: 1px solid rgba(0, 41, 0, 0.16);
  border-radius: 999px;
  box-shadow: 0 14px 30px -20px rgba(0, 41, 0, 0.35);
}

.badge-stars { display: inline-flex; gap: 2px; color: var(--orange); }

.badge-value {
  font-family: var(--font-display);
  font-size: 1.0625rem; font-weight: 700; color: #002900;
}

.badge-label { font-size: 0.8125rem; font-weight: 600; color: var(--ink-soft); }

/* The checkerboard — photos and quote plates alternate cell by cell,
   replicating the reference layout */
.voices-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 320px;
  gap: 2.75rem 2rem;
  align-items: stretch;
}

/* Photo tiles — vibrant moments in warm light */
.voice-shot {
  margin: 0; overflow: hidden; min-height: 0; height: 100%;
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  transition-property: opacity, transform;
}

.voice-shot img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.voice-shot picture {
  display: block;
  width: 100%;
  height: 100%;
}

.voice-shot:hover img { transform: scale(1.04); }

/* Quote plates — solid light ground, orange quotemarks up top,
   the words in the middle, name and Trustpilot on the baseline,
   and the signature orange bottom border */
.voice {
  position: relative;
  display: flex; flex-direction: column; gap: 1.25rem;
  height: 100%; min-height: 0; margin: 0; overflow: hidden;
  padding: 1.875rem 1.625rem 1.25rem;
  background: var(--cream);
  border-radius: 16px 16px 3px 3px;
  border-bottom: 2px solid var(--orange);
  transition-property: opacity, transform, box-shadow;
}

.voice:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 44px -26px rgba(0, 41, 0, 0.35);
}

.voice-quotemark {
  font-family: var(--font-display);
  font-size: 4.25rem; line-height: 0.75;
  font-weight: 700;
  letter-spacing: -0.06em;
  color: var(--orange);
}

.voice-quote {
  font-family: var(--font-display);
  font-size: 1.1875rem; line-height: 1.5; font-weight: 500;
  color: var(--ink);
  margin: 0;
  flex: 1;
  display: flex; align-items: center;
}

html[lang='fa'] .voice-quote { font-weight: 600; line-height: 1.8; }

.voice-foot {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem;
  margin-top: auto;
  padding-top: 0.875rem;
}

.voice-name { font-size: 0.9375rem; font-weight: 600; color: var(--ink); }

/* Trustpilot mark — the brand's green star, ink wordmark */
.voice-trust {
  display: inline-flex; align-items: center; gap: 0.4375rem;
  font-size: 0.875rem; font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}

.voice-trust svg { color: #00B67A; flex-shrink: 0; }

/* ── Shared section furniture ────────────────────────── */
.block-section {
  padding: 5rem 2rem;
  max-width: 1280px; margin: 0 auto;
}

.section-head {
  display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1.5rem 4rem;
  align-items: end; margin-bottom: 3.5rem;
}

.head-left { display: flex; flex-direction: column; gap: 1.125rem; align-items: flex-start; }

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 3.4vw, 3rem);
  line-height: 1.1; font-weight: 550;
  letter-spacing: var(--track-display); margin: 0;
  color: var(--ink); max-width: 22ch;
}

html[lang='fa'] .section-title { line-height: 1.32; font-weight: 800; }

.section-sub {
  font-size: 1.0313rem; line-height: 1.75;
  color: var(--ink-soft); margin: 0; max-width: 46ch;
  justify-self: end; text-align: start;
}

.section-foot {
  display: flex; justify-content: center; margin-top: 3.5rem;
}

.cascade-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.cascade-cell { display: flex; flex-direction: column; }
.cascade-cell:nth-child(3n + 2) { margin-top: 3rem; }
.cascade-cell:nth-child(3n + 3) { margin-top: 6rem; }
.cascade-cell > :deep(*) { flex: 1; }

/* ── 5 · Custom — the sunlit workshop ────────────────── */
.custom { padding: 3rem 2rem; max-width: 1280px; margin: 0 auto; }

/* One clean, unified plate — no corner glow, no pooled shadow */
.custom-panel {
  position: relative; overflow: hidden;
  background: var(--cream);
  border: 1px solid rgba(0, 41, 0, 0.2);
  border-radius: var(--radius-panel);
  padding: 5rem 4.5rem 4.5rem;
  box-shadow: 0 30px 70px -50px rgba(178, 83, 36, 0.35);
}

.custom-head {
  position: relative;
  display: flex; flex-direction: column; gap: 1.25rem;
  align-items: flex-start;
  margin-bottom: 3.5rem;
  max-width: 56ch;
}

.custom-title {
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 3.6vw, 3rem);
  line-height: 1.12; font-weight: 550;
  letter-spacing: var(--track-display); margin: 0;
  color: var(--ink);
}

html[lang='fa'] .custom-title { line-height: 1.32; font-weight: 800; }

.custom-sub {
  font-size: 1.0313rem; line-height: 1.75;
  color: var(--ink-soft); margin: 0;
}

/* The three steps — plates in a gentle asymmetric drift that stays
   strictly inside the panel: a normal gap, no negative margins, no
   overhang. One small outlined numeral per plate, nothing else. */
.craft-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.craft-step {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start;
  padding: 2.25rem 2rem 2.375rem;
  background: var(--cream);
  border: 1px solid rgba(0, 41, 0, 0.14);
  border-radius: 28px;
  transition-property: opacity, transform, box-shadow, border-color;
  overflow: hidden;
}

/* Each plate sits at its own height and tilt */
.craft-0 {
  border-start-end-radius: 8px;
  transform: rotate(-0.8deg);
}

.craft-1 {
  margin-top: 2.25rem;
  background: var(--warm-soft);
  border-color: rgba(255, 146, 92, 0.35);
  border-end-start-radius: 8px;
  box-shadow: 0 26px 54px -30px rgba(178, 83, 36, 0.4);
}

.craft-2 {
  margin-top: 0.875rem;
  border-start-start-radius: 8px;
  transform: rotate(0.8deg);
}

.craft-0.is-visible { transform: rotate(-0.8deg); }
.craft-2.is-visible { transform: rotate(0.8deg); }

.craft-step:hover {
  transform: translateY(-6px) rotate(0deg) !important;
  border-color: rgba(255, 146, 92, 0.6);
  box-shadow: var(--glow-warm), 0 0 0 4px rgba(255, 146, 92, 0.12);
  z-index: 1;
}

/* The numeral — one modest outlined figure at the top of the plate,
   filling softly with warmth on approach */
.craft-no {
  font-family: var(--font-display);
  font-size: 2.25rem; line-height: 1;
  font-weight: 600; font-style: italic;
  color: transparent;
  -webkit-text-stroke: 1.25px rgba(255, 146, 92, 0.65);
  margin-bottom: 1.125rem;
  transition: color 0.5s ease;
}

html[lang='fa'] .craft-no { font-style: normal; }

.craft-step:hover .craft-no { color: rgba(255, 146, 92, 0.35); }

.craft-title {
  font-family: var(--font-display);
  font-size: 1.375rem; font-weight: 600;
  margin: 0 0 0.75rem; color: var(--ink);
}

html[lang='fa'] .craft-title { font-weight: 700; }

.craft-body {
  font-size: 0.9375rem; line-height: 1.75;
  color: var(--ink-soft); margin: 0;
}

.custom-foot {
  position: relative;
  display: flex; justify-content: center; margin-top: 3.5rem;
}

/* ── 6 · The split feature — photo | solid deep green ── */
.partner {
  display: grid; grid-template-columns: 1fr 1fr;
  margin: 3rem 0;
  min-height: 580px;
}

.partner-media {
  min-height: 380px;
}

.partner-media img {
  transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.partner:hover .partner-media img { transform: scale(1.04); }

/* The other half: one solid slab of deep green. No gradient here —
   the flat color is the point, answering the photograph's warmth. */
.partner-panel {
  background: #002900;
  color: #F5F5E5;
  display: flex; align-items: center;
  padding: 5rem 4.5rem;
}

.partner-content {
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 1.5rem;
  max-width: 34rem;
}

.partner-title {
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 3.2vw, 2.75rem);
  line-height: 1.14; font-weight: 550;
  letter-spacing: var(--track-display); margin: 0;
  color: #F5F5E5;
}

html[lang='fa'] .partner-title { line-height: 1.34; font-weight: 800; }

.partner-body {
  font-size: 1.0313rem; line-height: 1.75;
  color: rgba(245, 245, 229, 0.78); margin: 0;
}

.partner-points {
  list-style: none; padding: 0; margin: 0.5rem 0 0;
  display: flex; flex-direction: column; gap: 1.25rem;
}

.ppoint { display: flex; align-items: flex-start; gap: 1rem; }

.ppoint-check {
  flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--orange); color: #002900;
  margin-top: 2px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ppoint:hover .ppoint-check { transform: scale(1.12) rotate(-6deg); }

.ppoint-text { display: flex; flex-direction: column; gap: 0.25rem; }

.ppoint-title {
  font-family: var(--font-display);
  font-size: 1.0625rem; font-weight: 600; color: #F5F5E5;
}

html[lang='fa'] .ppoint-title { font-weight: 700; }

.ppoint-body {
  font-size: 0.9375rem; line-height: 1.65;
  color: rgba(245, 245, 229, 0.72);
}

.partner-cta { margin-top: 1rem; }

/* ── 7 · Tech — two offset frames ────────────────────── */
/* One small, restricted flare pooling off the right side of the box —
   a localized glow, not a page-wide wash */
.tech-block { position: relative; }

.tech-flare {
  position: absolute;
  top: 3rem; inset-inline-end: -7rem;
  width: 30rem; height: 30rem;
  background: var(--flare-warm);
  pointer-events: none;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
}

.tech-cell { display: flex; flex-direction: column; }
.tech-cell:nth-child(even) { margin-top: 4rem; }
.tech-cell > :deep(*) { flex: 1; }

/* ── 8 · Why — trio on the sand ──────────────────────── */
.why {
  padding: 4rem 2rem 5rem;
  max-width: 1280px; margin: 0 auto;
}

.why-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem;
  align-items: start;
}

.why-item {
  display: flex; flex-direction: column; gap: 1rem;
  padding: 2.5rem 2.25rem;
  border-radius: var(--radius-card);
  transition-property: opacity, transform, box-shadow;
}

/* Clean cards — cream or the softest orange tint */
.why-0 {
  background: var(--warm-soft);
  transform: rotate(-1deg);
}

.why-1 {
  background: var(--cream);
  border: 1px solid rgba(0, 41, 0, 0.2);
  transform: translateY(1.5rem);
  box-shadow: var(--shadow-card);
}

.why-2 {
  background: var(--warm-soft);
  transform: rotate(1deg);
}

.why-item.is-visible.why-0 { transform: rotate(-1deg); }
.why-item.is-visible.why-1 { transform: translateY(1.5rem); }
.why-item.is-visible.why-2 { transform: rotate(1deg); }

.why-0:hover, .why-2:hover { transform: rotate(0deg) translateY(-6px) !important; box-shadow: var(--glow-warm); }
.why-1:hover { transform: translateY(1rem) !important; box-shadow: var(--glow-warm); }

.why-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 52px; height: 52px; border-radius: 50%;
  background: var(--grad-orange); color: #002900;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.why-item:hover .why-icon { transform: scale(1.1) rotate(6deg); }

.why-item-title {
  font-family: var(--font-display);
  font-size: 1.3125rem; font-weight: 600;
  margin: 0; color: var(--ink);
}

html[lang='fa'] .why-item-title { font-weight: 700; }

.why-item-body {
  font-size: 0.9375rem; line-height: 1.7;
  color: var(--ink-soft); margin: 0;
}

/* ── 9 · Consult — the inverted finale (orange → sand) ── */
.consult {
  padding: 1rem 2rem 6rem;
  max-width: 1280px; margin: 0 auto;
}

.consult-panel {
  position: relative; overflow: hidden;
  background: var(--grad-invert);
  border-radius: var(--radius-panel);
  padding: 5.5rem 3rem;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 1.375rem;
  box-shadow: var(--glow-fire);
}

/* Warm shimmer rising inside the finale */
.consult-sun {
  position: absolute;
  width: 640px; height: 640px;
  bottom: -480px; left: 50%; margin-left: -320px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(245, 245, 229, 0.5) 0%,
    rgba(245, 245, 229, 0.16) 45%,
    rgba(245, 245, 229, 0) 70%);
  pointer-events: none;
}

.consult-eyebrow {
  position: relative;
  background: rgba(0, 41, 0, 0.16);
  color: #002900;
}

.consult-eyebrow::before { background: #002900; }

.consult-title {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 3.6vw, 3rem);
  line-height: 1.14; font-weight: 550;
  letter-spacing: var(--track-display); margin: 0;
  color: #002900; max-width: 26ch;
}

html[lang='fa'] .consult-title { line-height: 1.36; font-weight: 800; }

.consult-body {
  position: relative;
  font-size: 1.0625rem; line-height: 1.7;
  color: rgba(0, 27, 0, 0.8); margin: 0; max-width: 52ch;
}

.consult-actions {
  position: relative;
  display: flex; flex-wrap: wrap; gap: 0.875rem;
  justify-content: center; margin-top: 0.75rem;
}

/* Ghost pill in deep ink for standing on the warmth */
.btn-ghost-deep {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 1rem 1.75rem;
  background: transparent;
  color: #002900;
  font-weight: 700; font-size: 1rem;
  border: 1.5px solid rgba(0, 41, 0, 0.45);
  border-radius: var(--radius-btn); text-decoration: none;
  transition: background 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-ghost-deep:hover {
  background: rgba(245, 245, 229, 0.3);
  border-color: #002900;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 1024px) {
  .cine-inner { grid-template-columns: 1fr; gap: 3.5rem; padding: 8rem 1.75rem 2.5rem; }
  .cine-visual { min-height: 480px; max-width: 540px; margin: 0 auto; width: 100%; }
  .mission { padding: 5rem 1.75rem 3rem; }
  .mission-grid { grid-template-columns: 1fr; gap: 3.5rem; }
  .mission-collage { min-height: 480px; }
  .point:nth-child(2) { margin-inline-start: 1.25rem; }
  .point:nth-child(3) { margin-inline-start: 2.5rem; }
  .voices { padding: 4.5rem 1.75rem 5rem; }
  .voices-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 300px; gap: 1.5rem; }
  .block-section { padding: 4rem 1.75rem; }
  .section-head { grid-template-columns: 1fr; gap: 1.5rem; }
  .section-sub { justify-self: start; }
  .cascade-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
  .cascade-cell:nth-child(3n + 2),
  .cascade-cell:nth-child(3n + 3) { margin-top: 0; }
  .cascade-cell:nth-child(even) { margin-top: 2.5rem; }
  .custom { padding: 2rem 1.75rem; }
  .custom-panel { padding: 3.5rem 2.25rem 3rem; }
  .craft-steps { grid-template-columns: 1fr; gap: 1.25rem; }
  .craft-step { margin: 0 !important; transform: none !important; }
  .craft-step:hover { transform: translateY(-4px) !important; }
  .tech-flare { display: none; }
  .partner { grid-template-columns: 1fr; min-height: 0; }
  .partner-panel { padding: 3.5rem 1.75rem; }
  .tech-grid { grid-template-columns: 1fr; gap: 1.75rem; }
  .tech-cell:nth-child(even) { margin-top: 0; }
  .why { padding: 3rem 1.75rem 4rem; }
  .why-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .why-item { transform: none !important; }
  .why-item:hover { transform: translateY(-4px) !important; }
  .consult { padding: 1rem 1.75rem 4.5rem; }
  .consult-panel { padding: 4rem 2rem; }
}

@media (max-width: 720px) {
  .cine-inner { padding: 7rem 1.25rem 2rem; }
  .cine-visual { min-height: 430px; }
  .cine-arch { width: min(78%, 300px); margin-left: calc(min(78%, 300px) / -2); }
  .cine-moment { width: 116px; height: 116px; }
  .ticker-item { padding-inline: 0.9rem; }
  .mission { padding: 4rem 1.25rem 2.5rem; }
  .mission-collage { min-height: 400px; }
  .point:nth-child(n) { margin-inline-start: 0; }
  .voices { padding: 3.5rem 1.25rem 4rem; }
  .voices-grid { grid-template-columns: 1fr; grid-auto-rows: auto; gap: 1.25rem; }
  .voice-shot { aspect-ratio: 3 / 2; }
  .voice { min-height: 280px; }
  .voices-badge { flex-wrap: wrap; justify-content: center; }
  .block-section { padding: 3.5rem 1.25rem; }
  .cascade-grid,
  .tech-grid { grid-template-columns: minmax(0, 1fr); gap: 1rem; }
  .cascade-cell:nth-child(even) { margin-top: 0; }
  .custom { padding: 1.5rem 1.25rem; }
  .custom-panel { padding: 2.75rem 1.5rem; border-radius: var(--radius-card); }
  .partner-panel { padding: 2.75rem 1.25rem; }
  .why { padding: 2.5rem 1.25rem 3.5rem; }
  .consult { padding: 0.5rem 1.25rem 3.5rem; }
  .consult-panel { padding: 3.5rem 1.5rem; border-radius: var(--radius-card); }
  .chip-card { padding: 0.6875rem 1rem 0.6875rem 0.6875rem; }
  .chip-text strong { font-size: 0.9375rem; }
  .chip-text small { font-size: 0.6875rem; }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-viewport {
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 146, 92, 0.55) rgba(245, 245, 229, 0.08);
  }

  .ticker-track { transform: none !important; }
  .ticker-clone { display: none; }
}
</style>
