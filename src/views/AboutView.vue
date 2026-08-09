<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { team, teamGroups } from '../data/team.js'
import { localize } from '../utils/localized.js'

const { t, locale } = useI18n()

const valueKeys = ['mission', 'innovation', 'trust', 'impact']

const credentialGroups = [
  {
    key: 'inventions',
    items: [
      {
        key: 'cuffPatent',
        href: '/images/licenses/8-Cuff%20Patent.png',
        filename: 'Pezeshk-Afzar-Eight-Cuff-Blood-Pressure-System.png',
      },
      {
        key: 'probePatent',
        href: '/images/licenses/Dedicated%20Probe%20Patent.png',
        filename: 'Pezeshk-Afzar-Dental-Pulp-Vitality-Probe.png',
      },
      {
        key: 'trolleyPatent',
        href: '/images/licenses/Autoclave%20Trolley%20Patent.png',
        filename: 'Pezeshk-Afzar-Optimized-Autoclave-Trolley.png',
      },
    ],
  },
  {
    key: 'licenses',
    items: [
      {
        key: 'rdLicense',
        href: '/images/licenses/Research%20&%20Development%20(R&D)%20License.jpeg',
        filename: 'Pezeshk-Afzar-Research-and-Development-License.jpeg',
      },
      {
        key: 'operatingLicense',
        href: '/images/licenses/Operating%20License.jpeg',
        filename: 'Pezeshk-Afzar-Software-Operation-License.jpeg',
      },
    ],
  },
  {
    key: 'ideas',
    items: [
      {
        key: 'ideasList',
        href: '/images/licenses/List%20of%20Ideas.png',
        filename: 'Pezeshk-Afzar-Registered-Ideas.png',
      },
    ],
  },
]

// The family, gathered in three circles around the same table.
const groupedTeam = teamGroups.map((key) => ({
  key,
  members: team.filter((m) => m.group === key),
}))

/* Scroll reveals */
const root = ref(null)
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let observer = null
onMounted(() => {
  if (reducedMotion) return
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  root.value?.querySelectorAll('.reveal, .reveal-side').forEach((el) => observer.observe(el))
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <main ref="root" class="view about">
    <div class="about-inner">
      <!-- The welcome — like stepping into a warm kitchen -->
      <header class="head">
        <span class="eyebrow cine-focus" style="animation-delay: 0.1s">{{ t('about.eyebrow') }}</span>
        <h1 class="head-title">
          <span class="cine-mask"><span class="cine-lift" style="animation-delay: 0.25s">{{ t('about.titleA') }}</span></span>
          <span class="cine-mask"><span class="cine-lift" style="animation-delay: 0.4s"><em class="text-fire">{{ t('about.titleB') }}</em></span></span>
        </h1>
        <p class="head-lead cine-focus" style="animation-delay: 0.65s">{{ t('about.lead') }}</p>
      </header>

      <!-- What we believe — one warm sentence, spoken across the table -->
      <section class="belief reveal">
        <span class="belief-quote" aria-hidden="true">“</span>
        <div class="belief-inner">
          <span class="eyebrow">{{ t('about.philosophyEyebrow') }}</span>
          <h2 class="belief-statement">{{ t('about.philosophyBody') }}</h2>
          <span class="belief-heart" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21C7 17 3 13.6 3 9.5 3 6.4 5.4 4 8.5 4c1.7 0 3 .8 3.5 1.5C12.5 4.8 13.8 4 15.5 4 18.6 4 21 6.4 21 9.5c0 4.1-4 7.5-9 11.5z" />
            </svg>
          </span>
        </div>
      </section>

      <!-- Two notes pinned to the family fridge -->
      <section class="notes">
        <article class="note note-a reveal">
          <span class="note-tape" aria-hidden="true"></span>
          <h2 class="note-title">{{ t('about.missionTitle') }}</h2>
          <p class="note-body">{{ t('about.missionBody') }}</p>
        </article>
        <article class="note note-b reveal" style="transition-delay: 0.12s">
          <span class="note-tape" aria-hidden="true"></span>
          <h2 class="note-title">{{ t('about.storyTitle') }}</h2>
          <p class="note-body">{{ t('about.storyBody') }}</p>
        </article>
      </section>

      <!-- The house rules -->
      <section class="values">
        <header class="values-head reveal">
          <span class="eyebrow">{{ t('about.valuesEyebrow') }}</span>
          <h2 class="values-title">{{ t('about.valuesTitle') }}</h2>
        </header>

        <div class="values-grid">
          <article v-for="(k, i) in valueKeys" :key="k" class="value reveal"
                   :class="`value-${i}`"
                   :style="{ transitionDelay: `${0.08 + i * 0.08}s` }">
            <span class="value-icon" aria-hidden="true">
              <svg v-if="k === 'mission'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" fill="currentColor" />
              </svg>
              <svg v-else-if="k === 'innovation'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18h6M10 21h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />
              </svg>
              <svg v-else-if="k === 'trust'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" />
              </svg>
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12h4l2 5 4-10 2 5h6" />
              </svg>
            </span>
            <h3 class="value-title">{{ t(`about.values.${k}.title`) }}</h3>
            <p class="value-body">{{ t(`about.values.${k}.body`) }}</p>
          </article>
        </div>
      </section>

      <!-- The family album -->
      <section class="team">
        <header class="team-head reveal">
          <span class="eyebrow">{{ t('about.teamEyebrow') }}</span>
          <h2 class="team-title">{{ t('about.teamTitle') }}</h2>
        </header>

        <div class="team-groups">
          <div v-for="grp in groupedTeam" :key="grp.key" class="team-group">
            <h3 class="team-group-title reveal">
              <span class="group-line" aria-hidden="true"></span>
              <span class="group-label">{{ t(`about.teamGroups.${grp.key}`) }}</span>
              <span class="group-line" aria-hidden="true"></span>
            </h3>

            <div class="team-grid">
              <article v-for="(m, i) in grp.members" :key="m.id" class="member reveal"
                       :style="{ transitionDelay: `${0.06 + i * 0.05}s` }">
                <span class="member-avatar" aria-hidden="true">
                  <img v-if="m.image" :src="m.image" alt="" width="72" height="72" loading="lazy" decoding="async" />
                  <svg v-else width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6" />
                  </svg>
                </span>
                <div class="member-info">
                  <h4 class="member-name">{{ localize(m.name, locale) }}</h4>
                  <p v-if="localize(m.position, locale)" class="member-role">{{ localize(m.position, locale) }}</p>
                  <p v-if="localize(m.education, locale)" class="member-degree">{{ localize(m.education, locale) }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- The serious bits — a solid home under the warmth -->
      <section class="certs reveal">
        <header class="certs-head">
          <span class="eyebrow">{{ t('about.certEyebrow') }}</span>
          <h2 class="certs-title">{{ t('about.certTitle') }}</h2>
          <p class="certs-intro">{{ t('about.certIntro') }}</p>
        </header>

        <div class="credential-layout">
          <section v-for="group in credentialGroups" :key="group.key" class="credential-group">
            <h3 class="credential-heading">{{ t(`about.credentialGroups.${group.key}`) }}</h3>
            <ul class="document-list">
              <li v-for="item in group.items" :key="item.key">
                <a
                  class="document-link"
                  :href="item.href"
                  :download="item.filename"
                  :aria-label="t('about.download', { title: t(`about.credentials.${item.key}`) })"
                >
                  <span class="document-title">{{ t(`about.credentials.${item.key}`) }}</span>
                  <span class="download-mark" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3v12" />
                      <path d="m7 10 5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </section>
        </div>
      </section>

      <section class="cta-block reveal">
        <RouterLink to="/contact" class="btn-ink pulse-cta">
          {{ t('hero.ctaSecondary') }}
          <span class="arrow">→</span>
        </RouterLink>
      </section>
    </div>
  </main>
</template>

<style scoped>
.about { padding: 10.5rem 2.5rem 6rem; position: relative; }

.about-inner { max-width: 1080px; margin: 0 auto; position: relative; z-index: 1; }

/* ── The welcome — centered, like a hand-written invitation ── */
.head {
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  gap: 1.5rem;
  margin-bottom: 5.5rem;
}

.head-title {
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 7vw, 5.75rem);
  line-height: 1.02; font-weight: 550;
  letter-spacing: var(--track-display); margin: 0; color: var(--ink);
}

html[lang='fa'] .head-title {
  font-size: clamp(2.25rem, 5.5vw, 4.5rem);
  line-height: 1.25; font-weight: 800;
}

.head-title em { font-style: italic; }
html[lang='fa'] .head-title em { font-style: normal; }

.head-lead {
  font-size: 1.125rem; line-height: 1.85;
  color: var(--ink-soft); max-width: 62ch; margin: 0;
}

/* ── What we believe — the sentence over dinner ──────── */
.belief {
  position: relative; overflow: hidden;
  background: #FCFCF2;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  padding: 4rem 4.5rem;
  margin-bottom: 5.5rem;
  box-shadow: 0 30px 70px -52px rgba(229, 100, 42, 0.4);
}

.belief-quote {
  position: absolute;
  top: 0.5rem; inset-inline-start: 2rem;
  font-family: var(--font-display);
  font-size: 9rem; line-height: 1;
  background-image: var(--grad-text-fire);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.5;
  pointer-events: none;
}

.belief-inner {
  position: relative;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  gap: 1.75rem;
}

.belief-statement {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.9vw, 2.25rem);
  line-height: 1.4; font-weight: 500;
  letter-spacing: var(--track-display);
  color: var(--ink); margin: 0; max-width: 30ch;
}

html[lang='fa'] .belief-statement { font-weight: 700; line-height: 1.7; }

.belief-heart {
  display: inline-flex; align-items: center; justify-content: center;
  width: 46px; height: 46px; border-radius: 50%;
  background: var(--grad-orange); color: #001B00;
  animation: breathe 5s ease-in-out infinite;
}

/* ── Two notes on the fridge ─────────────────────────── */
.notes {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 6.5rem;
  align-items: start;
}

.note {
  position: relative;
  display: flex; flex-direction: column; gap: 1.125rem;
  padding: 3rem 2.5rem 2.75rem;
  background: #FCFCF2;
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
  transition-property: opacity, transform, box-shadow;
}

.note-a { transform: rotate(-1.4deg); }
.note-b { transform: rotate(1.2deg) translateY(1.75rem); }

.note-a.is-visible { transform: rotate(-1.4deg); }
.note-b.is-visible { transform: rotate(1.2deg) translateY(1.75rem); }

.note:hover {
  transform: rotate(0deg) translateY(-4px) !important;
  box-shadow: var(--glow-warm);
}

/* The tape holding each note up */
.note-tape {
  position: absolute;
  top: -14px; left: 50%;
  width: 96px; height: 28px;
  margin-left: -48px;
  background: rgba(255, 146, 92, 0.4);
  border-radius: 3px;
  transform: rotate(-2deg);
}

.note-b .note-tape { transform: rotate(2deg); }

.note-title {
  font-family: var(--font-display);
  font-size: 1.625rem; font-weight: 600;
  letter-spacing: var(--track-display); color: var(--ink); margin: 0;
}

html[lang='fa'] .note-title { font-weight: 800; }

.note-body {
  font-size: 1rem; line-height: 1.85;
  color: var(--ink-soft); margin: 0;
}

/* ── The house rules ─────────────────────────────────── */
.values { margin-bottom: 6.5rem; }

.values-head {
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  gap: 1.125rem; margin-bottom: 3rem;
}

.values-title {
  font-family: var(--font-display);
  font-size: clamp(1.625rem, 3vw, 2.375rem);
  line-height: 1.2; font-weight: 550;
  letter-spacing: var(--track-display); color: var(--ink);
  margin: 0; max-width: 26ch;
}

html[lang='fa'] .values-title { font-weight: 800; line-height: 1.45; }

.values-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
  align-items: start;
}

/* Small warm cards — white and the softest orange, leaning into
   each other like people on a couch */
.value {
  display: flex; flex-direction: column; gap: 0.875rem;
  padding: 2rem 1.75rem 2.25rem;
  border-radius: var(--radius-card);
  transition-property: opacity, transform, box-shadow;
}

.value-0 { background: var(--warm-soft); transform: rotate(-1deg); }
.value-1 { background: #FCFCF2; border: 1px solid var(--line); transform: translateY(1.25rem); }
.value-2 { background: var(--warm-soft); transform: rotate(0.8deg); }
.value-3 { background: #FCFCF2; border: 1px solid var(--line); transform: translateY(1.25rem) rotate(-0.6deg); }

.value-0.is-visible { transform: rotate(-1deg); }
.value-1.is-visible { transform: translateY(1.25rem); }
.value-2.is-visible { transform: rotate(0.8deg); }
.value-3.is-visible { transform: translateY(1.25rem) rotate(-0.6deg); }

.value:hover {
  transform: rotate(0deg) translateY(-5px) !important;
  box-shadow: var(--glow-warm);
}

.value-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 46px; height: 46px; border-radius: 50%;
  background: var(--grad-orange); color: #001B00;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.value:hover .value-icon { transform: scale(1.08) rotate(-5deg); }

.value-title {
  font-family: var(--font-display);
  font-size: 1.1875rem; font-weight: 600;
  color: var(--ink); margin: 0;
}

html[lang='fa'] .value-title { font-weight: 700; }

.value-body {
  font-size: 0.9063rem; line-height: 1.75;
  color: var(--ink-soft); margin: 0;
}

/* ── The family album ────────────────────────────────── */
.team { margin-bottom: 6rem; }

.team-head {
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  gap: 1.125rem; margin-bottom: 3.25rem;
}

.team-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.2vw, 2.5rem);
  line-height: 1.2; font-weight: 550;
  letter-spacing: var(--track-display); color: var(--ink);
  margin: 0; max-width: 26ch;
}

html[lang='fa'] .team-title { font-weight: 800; line-height: 1.45; }

.team-groups { display: flex; flex-direction: column; gap: 4rem; }

/* Group label sits centered between two soft lines, like a
   chapter divider in a photo album */
.team-group-title {
  display: flex; align-items: center; justify-content: center; gap: 1.25rem;
  font-size: 1rem; font-weight: 700;
  color: var(--coral-deep); margin: 0 0 2rem;
}

.group-line {
  display: inline-block; flex: 0 1 90px; height: 2px; border-radius: 2px;
  background: linear-gradient(90deg, rgba(255, 146, 92, 0), var(--coral));
}

.group-line:last-child {
  background: linear-gradient(90deg, var(--coral), rgba(255, 146, 92, 0));
}

.team-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem 1.5rem;
}

/* Polaroids from the family album — each slightly askew,
   straightening up when you pick it up */
.member {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 1.125rem;
  text-align: center;
  padding: 2.25rem 1.75rem 2rem;
  background: #FCFCF2;
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
  transition-property: opacity, transform, box-shadow;
}

.member:nth-child(odd) { transform: rotate(-1.3deg); }
.member:nth-child(even) { transform: rotate(1.1deg); }
.member:nth-child(odd).is-visible { transform: rotate(-1.3deg); }
.member:nth-child(even).is-visible { transform: rotate(1.1deg); }

.member:hover {
  transform: rotate(0deg) translateY(-6px) !important;
  box-shadow: var(--glow-warm);
}

.member-avatar {
  display: inline-flex; align-items: center; justify-content: center;
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--warm-soft); color: var(--coral-deep);
  border: 3px solid #FCFCF2;
  outline: 2px solid var(--coral-soft);
  overflow: hidden;
  flex-shrink: 0;
  transition: background 0.5s ease, color 0.5s ease, outline-color 0.5s ease;
}

.member-avatar img {
  width: 100%; height: 100%;
  display: block;
  object-fit: cover;
}

.member:hover .member-avatar {
  background: var(--grad-orange); color: #001B00; outline-color: var(--coral);
}

.member-info { display: flex; flex-direction: column; gap: 0.375rem; align-items: center; }

.member-name {
  font-family: var(--font-display);
  font-size: 1.25rem; font-weight: 600;
  color: var(--ink); margin: 0;
}

html[lang='fa'] .member-name { font-weight: 800; }

.member-role {
  font-size: 0.875rem; font-weight: 700;
  color: var(--coral-deep); margin: 0;
}

.member-degree {
  font-size: 0.875rem; line-height: 1.55;
  color: var(--ink-soft); margin: 0.375rem 0 0;
  padding-top: 0.625rem;
  border-top: 2px solid var(--warm-soft);
}

/* ── The serious bits ────────────────────────────────── */
.certs {
  margin-bottom: 4.5rem;
  background: #FCFCF2;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  padding: 3.25rem 3rem;
  box-shadow: 0 26px 60px -48px rgba(0, 41, 0, 0.35);
}

.certs-head {
  display: flex; flex-direction: column; gap: 1.125rem; margin-bottom: 2.25rem;
  align-items: center; text-align: center;
}

.certs-intro {
  max-width: 58ch;
  margin: 0;
  color: var(--ink-soft);
  font-size: 1rem;
  line-height: 1.75;
}

.certs-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  line-height: 1.25; font-weight: 550;
  letter-spacing: var(--track-display); color: var(--ink);
  margin: 0; max-width: 30ch;
}

html[lang='fa'] .certs-title { font-weight: 800; }

.credential-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.credential-group {
  padding: 1.5rem;
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 20px;
}

.credential-heading {
  margin: 0 0 1rem;
  color: var(--coral-deep);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

html[lang='fa'] .credential-heading { letter-spacing: 0; }

.document-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.document-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4rem;
  padding: 0.85rem 0.9rem 0.85rem 1rem;
  color: var(--ink);
  background: var(--warm-soft);
  border: 1px solid transparent;
  border-radius: 15px;
  text-decoration: none;
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 280ms ease,
              box-shadow 280ms ease,
              background 280ms ease;
}

html[dir='rtl'] .document-link { padding: 0.85rem 1rem 0.85rem 0.9rem; }

.document-link:hover {
  transform: translateY(-2px);
  background: #FFF7F0;
  border-color: rgba(229, 100, 42, 0.28);
  box-shadow: 0 16px 30px -24px rgba(229, 100, 42, 0.7);
}

.document-title {
  font-size: 0.9rem;
  font-weight: 650;
  line-height: 1.45;
}

.download-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  color: var(--ink);
  background: var(--grad-orange);
  border-radius: 50%;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.document-link:hover .download-mark { transform: translateY(2px) scale(1.05); }

.cta-block {
  display: flex; justify-content: center;
  padding: 2rem 0 0;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 1024px) {
  .about { padding: 9rem 1.75rem 4.5rem; }
  .head { margin-bottom: 4rem; }
  .belief { padding: 3rem 2rem; margin-bottom: 4.5rem; }
  .belief-quote { font-size: 6rem; inset-inline-start: 1.25rem; }
  .notes { grid-template-columns: 1fr; gap: 2.5rem; margin-bottom: 5rem; }
  .note-b { transform: rotate(1.2deg); }
  .note-b.is-visible { transform: rotate(1.2deg); }
  .values { margin-bottom: 5rem; }
  .values-grid { grid-template-columns: repeat(2, 1fr); }
  .value-1, .value-3 { transform: none; }
  .value-1.is-visible, .value-3.is-visible { transform: none; }
  .team-grid { grid-template-columns: repeat(2, 1fr); }
  .certs { padding: 2.5rem 1.75rem; }
  .credential-layout { grid-template-columns: 1fr; }
}

@media (max-width: 720px) {
  .about { padding: 7.5rem 1.25rem 3.5rem; }
  .belief { border-radius: var(--radius-card); }
  .values-grid { grid-template-columns: 1fr; }
  .value:nth-child(n) { transform: none; }
  .team-grid { grid-template-columns: 1fr; }
  .certs { border-radius: var(--radius-card); }
  .credential-group { padding: 1.125rem; border-radius: 18px; }
}
</style>
