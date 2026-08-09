<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
const root = ref(null)

const journeyKeys = ['listen', 'connect', 'ready']
const servicePoints = {
  healthcare: ['planning', 'integration', 'workflow', 'people'],
  manufacturing: ['facilities', 'infrastructure', 'equipment', 'flow'],
}

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let observer = null

onMounted(() => {
  if (reducedMotion) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )

  root.value?.querySelectorAll('.reveal, .reveal-side').forEach((element) => observer.observe(element))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <main ref="root" class="view life-motion">
    <div class="life-inner">
      <header class="motion-hero">
        <div class="hero-copy">
          <span class="eyebrow cine-focus" style="animation-delay: 0.1s">{{ t('lifeInMotion.eyebrow') }}</span>
          <h1 class="hero-title">
            <span class="cine-mask"><span class="cine-lift" style="animation-delay: 0.25s">{{ t('lifeInMotion.titleA') }}</span></span>
            <span class="cine-mask"><span class="cine-lift" style="animation-delay: 0.4s"><em class="text-fire">{{ t('lifeInMotion.titleB') }}</em></span></span>
          </h1>
          <p class="hero-lead cine-focus" style="animation-delay: 0.65s">{{ t('lifeInMotion.lead') }}</p>
        </div>

        <div class="hero-story">
          <span class="hero-orbit" aria-hidden="true"></span>
          <figure class="hero-photo">
            <img
              src="/images/life-in-motion/life-in-motion-hero-960.webp"
              srcset="/images/life-in-motion/life-in-motion-hero-640.webp 640w, /images/life-in-motion/life-in-motion-hero-960.webp 960w"
              sizes="(max-width: 720px) calc(100vw - 2.5rem), (max-width: 1024px) 62vw, 520px"
              :alt="t('lifeInMotion.heroAlt')"
              width="960"
              height="1200"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
            <figcaption>{{ t('lifeInMotion.heroCaption') }}</figcaption>
          </figure>

          <aside class="motion-map">
            <p class="motion-label">{{ t('lifeInMotion.journeyLabel') }}</p>
            <ol class="motion-steps">
              <li v-for="(key, index) in journeyKeys" :key="key" class="motion-step">
                <span class="step-dot" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
                <span>{{ t(`lifeInMotion.journey.${key}`) }}</span>
              </li>
            </ol>
          </aside>
        </div>
      </header>

      <section class="bridge reveal" aria-hidden="true">
        <span class="bridge-line"></span>
        <span class="bridge-dot"></span>
      </section>
      <p class="bridge-copy reveal">{{ t('lifeInMotion.bridge') }}</p>

      <section class="services" :aria-label="t('lifeInMotion.servicesLabel')">
        <article class="service service-healthcare">
          <span class="service-index reveal">01</span>
          <div class="service-copy reveal-side">
            <span class="eyebrow">{{ t('lifeInMotion.healthcare.eyebrow') }}</span>
            <h2 class="service-title">{{ t('lifeInMotion.healthcare.title') }}</h2>
            <p class="service-body">{{ t('lifeInMotion.healthcare.body') }}</p>
          </div>

          <figure class="service-photo healthcare-photo reveal">
            <img
              src="/images/life-in-motion/cozy-healthcare-space-960.webp"
              srcset="/images/life-in-motion/cozy-healthcare-space-640.webp 640w, /images/life-in-motion/cozy-healthcare-space-960.webp 960w"
              sizes="(max-width: 720px) calc(100vw - 2.5rem), (max-width: 1024px) 56vw, 620px"
              :alt="t('lifeInMotion.healthcare.photoAlt')"
              width="960"
              height="1080"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <ul class="point-grid reveal">
            <li v-for="key in servicePoints.healthcare" :key="key" class="point">
              <span class="point-mark" aria-hidden="true"></span>
              <span>{{ t(`lifeInMotion.healthcare.points.${key}`) }}</span>
            </li>
          </ul>
        </article>

        <article class="service service-manufacturing">
          <span class="service-index reveal">02</span>
          <div class="service-copy reveal-side">
            <span class="eyebrow">{{ t('lifeInMotion.manufacturing.eyebrow') }}</span>
            <h2 class="service-title">{{ t('lifeInMotion.manufacturing.title') }}</h2>
            <p class="service-body">{{ t('lifeInMotion.manufacturing.body') }}</p>
          </div>

          <div class="production-images reveal">
            <figure class="service-photo production-main">
              <img
                src="/images/life-in-motion/active-medical-production-960.webp"
                srcset="/images/life-in-motion/active-medical-production-640.webp 640w, /images/life-in-motion/active-medical-production-960.webp 960w"
                sizes="(max-width: 720px) calc(100vw - 2.5rem), (max-width: 1024px) 52vw, 560px"
                :alt="t('lifeInMotion.manufacturing.photoAlt')"
                width="960"
                height="1200"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <figure class="service-photo production-detail">
              <img
                src="/images/life-in-motion/medical-production-teamwork-480.webp"
                srcset="/images/life-in-motion/medical-production-teamwork-320.webp 320w, /images/life-in-motion/medical-production-teamwork-480.webp 480w"
                sizes="(max-width: 640px) 43vw, (max-width: 1024px) 22vw, 280px"
                :alt="t('lifeInMotion.manufacturing.detailAlt')"
                width="480"
                height="600"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>

          <ul class="point-grid reveal">
            <li v-for="key in servicePoints.manufacturing" :key="key" class="point">
              <span class="point-mark" aria-hidden="true"></span>
              <span>{{ t(`lifeInMotion.manufacturing.points.${key}`) }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="closing reveal">
        <span class="closing-orbit" aria-hidden="true"></span>
        <div class="closing-copy">
          <span class="eyebrow">{{ t('lifeInMotion.closeEyebrow') }}</span>
          <h2 class="closing-title">{{ t('lifeInMotion.closeTitle') }}</h2>
          <p class="closing-body">{{ t('lifeInMotion.closeBody') }}</p>
        </div>
        <RouterLink to="/contact" class="btn-ink pulse-cta">
          {{ t('lifeInMotion.cta') }}
          <span class="arrow">→</span>
        </RouterLink>
      </section>
    </div>
  </main>
</template>

<style scoped>
.life-motion {
  position: relative;
  overflow: hidden;
  padding: 10.5rem 2.5rem 6rem;
}

.life-motion::before {
  content: '';
  position: absolute;
  top: 17rem;
  left: 50%;
  width: min(1000px, 82vw);
  height: min(1000px, 82vw);
  border: 1px solid rgba(229, 100, 42, 0.1);
  border-radius: 50%;
  transform: translateX(-10%);
  pointer-events: none;
}

.life-inner {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
}

.motion-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(480px, 1.18fr);
  align-items: center;
  gap: clamp(3rem, 7vw, 7rem);
  min-height: 670px;
  margin-bottom: 4.5rem;
}

.hero-copy {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
}

.hero-title {
  width: min(8.7ch, 100%);
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(3.7rem, 7.5vw, 7rem);
  font-weight: 550;
  letter-spacing: var(--track-display);
  line-height: 0.93;
}

.hero-title em { font-style: italic; }

.hero-lead {
  max-width: 49ch;
  margin: 0;
  color: var(--ink-soft);
  font-size: 1.0625rem;
  line-height: 1.85;
}

.hero-story {
  position: relative;
  min-height: 650px;
}

.hero-orbit {
  position: absolute;
  top: 5%;
  right: -7%;
  width: 85%;
  aspect-ratio: 1;
  border: 1px dashed rgba(229, 100, 42, 0.32);
  border-radius: 50%;
  animation: orbit 50s linear infinite;
}

.hero-orbit::after {
  content: '';
  position: absolute;
  top: 15%;
  right: 15%;
  width: 1rem;
  height: 1rem;
  background: var(--orange);
  border-radius: 50%;
  box-shadow: var(--glow-warm);
}

.hero-photo {
  position: absolute;
  inset: 0 0 auto auto;
  overflow: hidden;
  width: min(76%, 455px);
  margin: 0;
  aspect-ratio: 4 / 5;
  background: var(--warm-soft);
  border: 1px solid var(--line);
  border-radius: 46% 46% 24px 24px;
  box-shadow: 0 32px 70px -42px rgba(0, 41, 0, 0.48);
}

.hero-photo img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.hero-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 62%, rgba(0, 27, 0, 0.68));
  pointer-events: none;
}

.hero-photo figcaption {
  position: absolute;
  z-index: 1;
  right: 1.5rem;
  bottom: 1.4rem;
  left: 1.5rem;
  color: #fffdf6;
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  line-height: 1.5;
  text-transform: uppercase;
}

.motion-map {
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;
  width: min(58%, 340px);
  padding: 2rem;
  background: rgba(252, 252, 242, 0.95);
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(12px);
}

.motion-map::before {
  content: '';
  position: absolute;
  top: 6.4rem;
  bottom: 2.7rem;
  left: 3.2rem;
  width: 1px;
  background: linear-gradient(180deg, var(--orange), rgba(229, 100, 42, 0.14));
}

html[dir='rtl'] .motion-map::before {
  right: 3.2rem;
  left: auto;
}

.motion-label {
  margin: 0 0 1.5rem;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.28;
}

.motion-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.motion-step {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 2.4rem 1fr;
  align-items: center;
  gap: 0.85rem;
  color: var(--ink-soft);
  font-size: 0.8125rem;
  font-weight: 650;
  line-height: 1.45;
}

.step-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  color: var(--ink);
  background: var(--warm-soft);
  border: 1px solid rgba(229, 100, 42, 0.22);
  border-radius: 50%;
  font-size: 0.625rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.bridge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
}

.bridge-line {
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent, var(--orange), transparent);
}

.bridge-dot {
  position: absolute;
  width: 9px;
  height: 9px;
  background: var(--orange);
  border-radius: 50%;
  box-shadow: 0 0 0 8px rgba(255, 146, 92, 0.14);
  transform-origin: center;
  animation: emberPulse 3.8s ease-in-out infinite;
}

.bridge-copy {
  max-width: 29ch;
  margin: 1.5rem auto 8rem;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.3vw, 2.7rem);
  font-weight: 520;
  letter-spacing: var(--track-display);
  line-height: 1.4;
  text-align: center;
}

.services {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 11rem;
  margin-bottom: 8rem;
}

.services::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 5rem;
  bottom: 5rem;
  left: 50%;
  width: 64%;
  border: 1px solid rgba(229, 100, 42, 0.12);
  border-top: 0;
  border-bottom: 0;
  border-radius: 50%;
  transform: translateX(-50%) rotate(8deg);
}

.service {
  position: relative;
  display: grid;
  grid-template-columns: minmax(290px, 0.78fr) minmax(400px, 1.22fr);
  grid-template-areas:
    'copy image'
    'points image';
  align-items: center;
  gap: 2.5rem clamp(3rem, 8vw, 7rem);
}

.service-manufacturing {
  grid-template-columns: minmax(400px, 1.15fr) minmax(290px, 0.85fr);
  grid-template-areas:
    'image copy'
    'image points';
}

.service-index {
  position: absolute;
  z-index: -1;
  top: -5.5rem;
  inset-inline-start: -0.5rem;
  color: rgba(229, 100, 42, 0.1);
  font-family: var(--font-display);
  font-size: clamp(7rem, 14vw, 12rem);
  font-weight: 600;
  line-height: 1;
}

.service-copy {
  grid-area: copy;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.35rem;
}

.service-title {
  max-width: 15ch;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(2.35rem, 4.3vw, 4.2rem);
  font-weight: 550;
  letter-spacing: var(--track-display);
  line-height: 1.04;
}

.service-body {
  max-width: 55ch;
  margin: 0;
  color: var(--ink-soft);
  font-size: 1rem;
  line-height: 1.85;
}

.service-photo {
  overflow: hidden;
  margin: 0;
  background: var(--warm-soft);
  border: 1px solid var(--line);
  box-shadow: 0 28px 64px -46px rgba(0, 41, 0, 0.48);
}

.service-photo img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
}

.service-photo:hover img { transform: scale(1.025); }

.healthcare-photo {
  grid-area: image;
  width: min(100%, 620px);
  justify-self: end;
  aspect-ratio: 8 / 9;
  border-radius: 22px 22px 48% 22px;
}

.production-images {
  position: relative;
  grid-area: image;
  min-height: 690px;
}

.production-main {
  position: absolute;
  top: 0;
  left: 0;
  width: min(74%, 460px);
  aspect-ratio: 4 / 5;
  border-radius: 48% 24px 24px 24px;
}

.production-detail {
  position: absolute;
  right: 0;
  bottom: 0;
  width: min(45%, 280px);
  aspect-ratio: 4 / 5;
  border: 8px solid #FCFCF2;
  border-radius: 20px;
  box-shadow: var(--shadow-card);
}

.point-grid {
  grid-area: points;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line);
  list-style: none;
}

.point {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.9rem 0;
  color: var(--ink);
  border-bottom: 1px solid var(--line);
  font-size: 0.875rem;
  font-weight: 650;
  line-height: 1.5;
}

.point-mark {
  width: 8px;
  height: 8px;
  margin-top: 0.38rem;
  flex: 0 0 auto;
  background: var(--orange);
  border-radius: 50%;
  box-shadow: 0 0 0 5px rgba(255, 146, 92, 0.14);
}

.closing {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 3rem;
  padding: clamp(2.75rem, 6vw, 5rem);
  background: var(--warm-soft);
  border: 1px solid rgba(229, 100, 42, 0.18);
  border-radius: var(--radius-panel);
  box-shadow: 0 28px 70px -50px rgba(229, 100, 42, 0.62);
}

.closing-orbit {
  position: absolute;
  z-index: -1;
  top: -7rem;
  inset-inline-end: -5rem;
  width: 19rem;
  height: 19rem;
  border: 1px dashed rgba(229, 100, 42, 0.34);
  border-radius: 50%;
  animation: orbit 42s linear infinite;
}

.closing-orbit::after {
  content: '';
  position: absolute;
  inset: 3.5rem;
  background: var(--grad-orange);
  border-radius: 50%;
  opacity: 0.45;
  transform-origin: center;
  animation: closingPulse 8.4s ease-in-out infinite;
}

@keyframes closingPulse {
  0%, 100% { transform: scale(0.94); opacity: 0.42; }
  50% { transform: scale(1.04); opacity: 0.5; }
}

.closing-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
}

.closing-title {
  max-width: 21ch;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 550;
  letter-spacing: var(--track-display);
  line-height: 1.12;
}

.closing-body {
  max-width: 55ch;
  margin: 0;
  color: var(--ink-soft);
  font-size: 1rem;
  line-height: 1.75;
}

html[dir='rtl'] .hero-orbit { right: auto; left: -7%; }
html[dir='rtl'] .hero-photo { right: auto; left: 0; }
html[dir='rtl'] .motion-map { right: 0; left: auto; }
html[dir='rtl'] .production-main { right: 0; left: auto; }
html[dir='rtl'] .production-detail { right: auto; left: 0; }

html[lang='fa'] .hero-title,
html[lang='fa'] .service-title,
html[lang='fa'] .closing-title {
  font-weight: 800;
  line-height: 1.28;
}

html[lang='fa'] .hero-title {
  width: min(11ch, 100%);
  font-size: clamp(2.8rem, 6.2vw, 5.6rem);
}

html[lang='fa'] .hero-title em { font-style: normal; }
html[lang='fa'] .motion-label,
html[lang='fa'] .bridge-copy { font-weight: 800; }

@media (max-width: 1024px) {
  .life-motion { padding: 9rem 1.75rem 4.5rem; }
  .motion-hero {
    grid-template-columns: minmax(0, 0.8fr) minmax(400px, 1.2fr);
    gap: 2.5rem;
  }
  .hero-story { min-height: 610px; }
  .service,
  .service-manufacturing {
    grid-template-columns: minmax(260px, 0.82fr) minmax(360px, 1.18fr);
    gap: 2.25rem 3rem;
  }
  .production-images { min-height: 610px; }
}

@media (max-width: 820px) {
  .motion-hero {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .hero-title { width: min(11ch, 100%); }
  .hero-story { min-height: 650px; }
  .hero-photo { width: min(70%, 455px); }
  .motion-map { width: min(48%, 340px); }
  .bridge-copy { margin-bottom: 6rem; }
  .services { gap: 8rem; margin-bottom: 6rem; }
  .service,
  .service-manufacturing {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'copy copy'
      'image points';
    gap: 2.5rem;
  }
  .service-title { max-width: 18ch; }
  .healthcare-photo { width: 100%; }
  .production-images { min-height: 560px; }
  .closing { grid-template-columns: 1fr; align-items: start; }
  .closing .btn-ink { justify-self: start; }
}

@media (max-width: 640px) {
  .life-motion { padding: 7.5rem 1.25rem 3.5rem; }
  .life-motion::before { display: none; }
  .motion-hero { gap: 2.5rem; margin-bottom: 3rem; }
  .hero-title { font-size: clamp(3.15rem, 15vw, 5rem); }
  .hero-story { min-height: 620px; }
  .hero-photo {
    right: 0;
    left: 0;
    width: 100%;
    margin: 0 auto;
    border-radius: 44% 44% 20px 20px;
  }
  html[dir='rtl'] .hero-photo { right: 0; left: 0; }
  .hero-orbit { top: 0; right: -12%; width: 95%; }
  html[dir='rtl'] .hero-orbit { right: auto; left: -12%; }
  .motion-map {
    right: 1rem;
    bottom: 0;
    left: 1rem;
    width: auto;
    padding: 1.4rem;
  }
  html[dir='rtl'] .motion-map { right: 1rem; left: 1rem; }
  .motion-map::before { top: 5.7rem; bottom: 2.1rem; left: 2.6rem; }
  html[dir='rtl'] .motion-map::before { right: 2.6rem; left: auto; }
  .motion-label { margin-bottom: 1rem; font-size: 1.1rem; }
  .motion-steps { gap: 0.7rem; }
  .motion-step { grid-template-columns: 2.25rem 1fr; }
  .step-dot { width: 2.25rem; height: 2.25rem; }
  .bridge { height: 65px; }
  .bridge-copy { margin: 1rem auto 5rem; }
  .services { gap: 7rem; margin-bottom: 4.5rem; }
  .services::before { display: none; }
  .service,
  .service-manufacturing {
    grid-template-columns: 1fr;
    grid-template-areas:
      'copy'
      'image'
      'points';
    gap: 2rem;
  }
  .service-index { top: -4.2rem; font-size: 7rem; }
  .service-title { font-size: clamp(2.25rem, 11vw, 3.4rem); }
  .healthcare-photo { border-radius: 18px 18px 45% 18px; }
  .production-images { min-height: 540px; }
  .production-main { width: 78%; }
  .production-detail { width: 43%; border-width: 6px; }
  .closing { gap: 2rem; padding: 2.5rem 1.5rem; border-radius: var(--radius-card); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-orbit,
  .closing-orbit { animation: none; }
  .service-photo img { transition: none; }
}
</style>
