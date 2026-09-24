<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProductIcon from '../components/ProductIcon.vue'
import { getProductById } from '../data/products.js'
import { localize } from '../utils/localized.js'

const props = defineProps({
  id: { type: String, required: true },
})

const { t, locale } = useI18n()
const product = computed(() => getProductById(props.id))

const localizedList = (field) =>
  computed(() => product.value?.[field]?.[locale.value] ?? product.value?.[field]?.en ?? [])

const features = localizedList('features')
const benefits = localizedList('benefits')
const applications = localizedList('applications')
const assurances = localizedList('certifications')
const galleryAlt = localizedList('galleryAlt')
const limitations = localizedList('limitations')
const outputContract = localizedList('outputContract')

const root = ref(null)
const metricsEl = ref(null)
const metricValues = ref([0, 0, 0])
const metricTargets = computed(() => [
  features.value.length,
  applications.value.length,
  assurances.value.length,
])

const userProfiles = {
  'todays-mom': {
    en: ['Expectant parents', 'Midwives & obstetric teams', 'Maternal-health programs'],
    fa: ['والدین در انتظار فرزند', 'ماماها و تیم‌های زنان و زایمان', 'برنامه‌های سلامت مادر'],
  },
  skinapp: {
    en: ['Dermatology teams', 'Primary-care clinicians', 'Teledermatology services'],
    fa: ['تیم‌های پوست', 'پزشکان مراقبت اولیه', 'خدمات تله‌درماتولوژی'],
  },
  'ibd-care': {
    en: ['People living with IBD', 'Gastroenterology teams', 'Coordinated-care programs'],
    fa: ['افراد مبتلا به IBD', 'تیم‌های گوارش', 'برنامه‌های مراقبت هماهنگ'],
  },
  agingdrug: {
    en: ['Clinical pharmacists', 'Geriatric-care teams', 'Medication-review services'],
    fa: ['داروسازان بالینی', 'تیم‌های سالمندی', 'خدمات بازبینی دارو'],
  },
  'chemotherapy-care': {
    en: ['Oncology nurses', 'Patients & families', 'Cancer-care centers'],
    fa: ['پرستاران انکولوژی', 'بیماران و خانواده‌ها', 'مراکز درمان سرطان'],
  },
  gib: {
    en: ['Digestive-care nurses', 'Remote-care coordinators', 'Gastroenterology clinics'],
    fa: ['پرستاران گوارش', 'هماهنگ‌کنندگان مراقبت از راه دور', 'کلینیک‌های گوارش'],
  },
  'violence-detection': {
    en: ['Trained human reviewers', 'Clinical quality teams', 'Controlled research programs'],
    fa: ['بازبینان انسانی آموزش‌دیده', 'تیم‌های کیفیت بالینی', 'برنامه‌های پژوهشی کنترل‌شده'],
  },
  'desktop-autoclaves': {
    en: ['Dental practices', 'Outpatient clinics', 'Small procedure rooms'],
    fa: ['مطب‌های دندان‌پزشکی', 'کلینیک‌های سرپایی', 'اتاق‌های عمل کوچک'],
  },
  'hospital-autoclaves': {
    en: ['CSSD teams', 'Hospital engineering', 'High-throughput facilities'],
    fa: ['تیم‌های CSSD', 'مهندسی بیمارستان', 'مراکز با ظرفیت بالا'],
  },
  'blood-glucose-meters': {
    en: ['People monitoring glucose', 'Diabetes educators', 'Community-care teams'],
    fa: ['افراد در حال پایش قند', 'مربیان دیابت', 'تیم‌های مراقبت جامعه'],
  },
  'blood-glucose-test-strips': {
    en: ['Home monitoring routines', 'Pharmacies & clinics', 'Diabetes programs'],
    fa: ['روال‌های پایش خانگی', 'داروخانه‌ها و کلینیک‌ها', 'برنامه‌های دیابت'],
  },
}

const typicalUsers = computed(
  () => userProfiles[product.value?.id]?.[locale.value] ?? userProfiles[product.value?.id]?.en ?? []
)
const workflowKeys = computed(() =>
  product.value?.id === 'violence-detection'
    ? ['ingest', 'track', 'flag', 'review']
    : product.value?.type === 'equipment'
    ? ['prepare', 'run', 'verify', 'support']
    : ['listen', 'capture', 'guide', 'connect']
)
const workflowType = computed(() =>
  product.value?.id === 'violence-detection' ? 'violence' : product.value?.type
)
const comparisonRows = computed(() =>
  features.value.map((feature, index) => ({
    feature,
    outcome: benefits.value[index % Math.max(benefits.value.length, 1)] ?? applications.value[index] ?? '',
  }))
)

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let revealObserver = null
let metricsObserver = null
let scrollFrame = 0

const runCounters = () => {
  if (reducedMotion) {
    metricValues.value = [...metricTargets.value]
    return
  }

  const startedAt = performance.now()
  const duration = 780
  const tick = (time) => {
    const progress = Math.min((time - startedAt) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    metricValues.value = metricTargets.value.map((target) => Math.round(target * eased))
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const observePage = () => {
  revealObserver?.disconnect()
  metricsObserver?.disconnect()

  if (reducedMotion) {
    root.value?.querySelectorAll('.detail-reveal').forEach((element) => element.classList.add('is-visible'))
    metricValues.value = [...metricTargets.value]
    return
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  )
  root.value?.querySelectorAll('.detail-reveal').forEach((element) => revealObserver.observe(element))

  metricsObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      runCounters()
      metricsObserver.disconnect()
    },
    { threshold: 0.45 }
  )
  if (metricsEl.value) metricsObserver.observe(metricsEl.value)
}

const onScroll = () => {
  if (reducedMotion || scrollFrame) return
  scrollFrame = requestAnimationFrame(() => {
    root.value?.style.setProperty('--detail-scroll', `${Math.min(window.scrollY, 1800)}px`)
    scrollFrame = 0
  })
}

onMounted(() => {
  observePage()
  window.addEventListener('scroll', onScroll, { passive: true })
})

watch(
  () => props.id,
  async () => {
    metricValues.value = [0, 0, 0]
    await nextTick()
    observePage()
  }
)

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  metricsObserver?.disconnect()
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(scrollFrame)
})
</script>

<template>
  <main ref="root" class="view detail" style="--detail-scroll: 0px">
    <span class="detail-orb detail-orb-a" aria-hidden="true"></span>
    <span class="detail-orb detail-orb-b" aria-hidden="true"></span>
    <div v-if="product" class="detail-inner">
      <nav class="crumb rise stagger-1" :aria-label="t('detail.breadcrumb')">
        <RouterLink to="/products" class="crumb-link">{{ t('nav.products') }}</RouterLink>
        <span class="crumb-sep" aria-hidden="true">/</span>
        <span aria-current="page">{{ localize(product.name, locale) }}</span>
      </nav>

      <header class="head">
        <div class="head-copy">
          <div class="tags rise stagger-2">
            <span class="tag tag-type">{{ t(`card.type.${product.type}`) }}</span>
            <span class="tag tag-cat">{{ localize(product.category, locale) }}</span>
            <span v-if="product.flagship" class="tag tag-flag">{{ t('card.flagship') }}</span>
          </div>

          <h1 class="title rise stagger-3">{{ localize(product.name, locale) }}</h1>
          <p v-if="product.tradeName && localize(product.tradeName, locale) !== localize(product.name, locale)" class="trade-name rise stagger-3">
            {{ localize(product.tradeName, locale) }}
          </p>
          <p class="tagline rise stagger-4">{{ localize(product.tagline, locale) }}</p>
          <p class="head-description rise stagger-5">{{ localize(product.description, locale) }}</p>

          <div class="head-actions rise stagger-5">
            <RouterLink to="/contact" class="btn-ink">
              {{ t('detail.contactSales') }}
              <span class="arrow" aria-hidden="true">→</span>
            </RouterLink>
            <a :href="product.catalog" class="btn-ghost-ink" download>
              {{ t('detail.downloadCatalog') }}
            </a>
          </div>
        </div>

        <figure class="head-media rise stagger-3">
          <img
            :src="product.image"
            :alt="galleryAlt[0] || localize(product.name, locale)"
            width="760"
            height="860"
            fetchpriority="high"
          />
        </figure>
      </header>

      <section ref="metricsEl" class="highlight-strip detail-reveal" :aria-label="t('detail.highlightsLabel')">
        <article v-for="(value, index) in metricValues" :key="index" class="highlight-stat">
          <strong>{{ String(value).padStart(2, '0') }}</strong>
          <span>{{ t(`detail.highlights.${['features', 'applications', 'assurances'][index]}`) }}</span>
        </article>
        <div class="highlight-note">
          <span class="highlight-pulse" aria-hidden="true"></span>
          <p>{{ t('detail.highlights.note') }}</p>
        </div>
      </section>

      <section class="story section-rule detail-reveal" :aria-labelledby="`overview-${product.id}`">
        <div class="section-heading">
          <span class="section-no" aria-hidden="true">01</span>
          <div>
            <p class="eyebrow">{{ t('detail.clinicalEyebrow') }}</p>
            <h2 :id="`overview-${product.id}`">{{ t('detail.overview') }}</h2>
          </div>
        </div>
        <div class="story-content">
          <p class="story-lead">{{ localize(product.description, locale) }}</p>
          <aside class="users-panel">
            <span class="users-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 20v-2.2A4.8 4.8 0 0 1 8.3 13h1.4a4.8 4.8 0 0 1 4.8 4.8V20" />
                <path d="M16 5.5a3 3 0 0 1 0 5.8M17 13.2a4.8 4.8 0 0 1 3.5 4.6V20" />
              </svg>
            </span>
            <div>
              <p class="eyebrow">{{ t('detail.typicalUsersEyebrow') }}</p>
              <h3>{{ t('detail.typicalUsers') }}</h3>
              <ul>
                <li v-for="user in typicalUsers" :key="user">{{ user }}</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section class="capabilities section-rule detail-reveal" :aria-labelledby="`features-${product.id}`">
        <div class="section-heading">
          <span class="section-no" aria-hidden="true">02</span>
          <div>
            <p class="eyebrow">{{ t('detail.capabilitiesEyebrow') }}</p>
            <h2 :id="`features-${product.id}`">{{ t('detail.capabilities') }}</h2>
          </div>
        </div>
        <ol class="feature-grid">
          <li
            v-for="(feature, index) in features"
            :key="feature"
            class="feature-card"
            :style="{ '--card-delay': `${index * 80}ms` }"
          >
            <span class="feature-graphic" aria-hidden="true"></span>
            <div class="feature-top">
              <span class="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                  <g v-if="index === 0">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 7v5l3 2" />
                  </g>
                  <g v-else-if="index === 1">
                    <path d="M5 5h5v5H5zM14 14h5v5h-5zM14 5h5v5h-5z" />
                    <path d="M10 7.5h4M16.5 10v4M10 9.5l4.5 5" />
                  </g>
                  <g v-else-if="index === 2">
                    <path d="M3 12h4l2.2-5 4 10 2.1-5H21" />
                    <path d="M12 3a9 9 0 1 1-8.5 6" />
                  </g>
                  <g v-else>
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
                    <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
                  </g>
                </svg>
              </span>
              <span class="feature-no" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <p>{{ feature }}</p>
            <span class="feature-more" aria-hidden="true">↗</span>
          </li>
        </ol>
      </section>

      <section class="workflow section-rule detail-reveal" :aria-labelledby="`workflow-${product.id}`">
        <div class="section-heading">
          <span class="section-no" aria-hidden="true">03</span>
          <div>
            <p class="eyebrow">{{ t('detail.workflowEyebrow') }}</p>
            <h2 :id="`workflow-${product.id}`">{{ t('detail.workflowTitle') }}</h2>
          </div>
        </div>
        <ol class="workflow-track">
          <li
            v-for="(key, index) in workflowKeys"
            :key="key"
            class="workflow-step"
            :style="{ '--step-delay': `${index * 100}ms` }"
          >
            <span class="workflow-dot" aria-hidden="true">{{ index + 1 }}</span>
            <div>
              <p class="workflow-label">{{ t('detail.stepLabel', { number: index + 1 }) }}</p>
              <h3>{{ t(`detail.workflow.${workflowType}.${key}.title`) }}</h3>
              <p>{{ t(`detail.workflow.${workflowType}.${key}.body`) }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="value-grid section-rule detail-reveal">
        <article class="value-panel value-benefits">
          <p class="eyebrow">{{ t('detail.outcomesEyebrow') }}</p>
          <h2>{{ t('detail.whyChoose') }}</h2>
          <ul>
            <li v-for="benefit in benefits" :key="benefit">
              <span class="list-mark" aria-hidden="true">✓</span>
              <span>{{ benefit }}</span>
            </li>
          </ul>
        </article>

        <article class="value-panel value-applications">
          <p class="eyebrow">{{ t('detail.applicationsEyebrow') }}</p>
          <h2>{{ t('detail.applications') }}</h2>
          <ul>
            <li v-for="application in applications" :key="application">
              <span class="list-mark" aria-hidden="true">→</span>
              <span>{{ application }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="facts section-rule detail-reveal" :aria-labelledby="`specs-${product.id}`">
        <div class="section-heading">
          <span class="section-no" aria-hidden="true">04</span>
          <div>
            <p class="eyebrow">{{ t('detail.technologiesEyebrow') }}</p>
            <h2 :id="`specs-${product.id}`">{{ t('detail.technologies') }}</h2>
          </div>
        </div>

        <div class="facts-grid">
          <dl class="spec-table">
            <div v-for="spec in product.specs" :key="localize(spec.label, locale)" class="spec-row">
              <dt>{{ localize(spec.label, locale) }}</dt>
              <dd>{{ localize(spec.value, locale) }}</dd>
            </div>
          </dl>

          <aside class="assurance-card">
            <span class="assurance-icon" aria-hidden="true">
              <ProductIcon :name="product.icon" :size="30" />
            </span>
            <h3>{{ t('detail.assurances') }}</h3>
            <ul>
              <li v-for="assurance in assurances" :key="assurance">
                <span aria-hidden="true">✓</span>
                <span>{{ assurance }}</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section class="comparison section-rule detail-reveal" :aria-labelledby="`comparison-${product.id}`">
        <div class="section-heading">
          <span class="section-no" aria-hidden="true">05</span>
          <div>
            <p class="eyebrow">{{ t('detail.comparisonEyebrow') }}</p>
            <h2 :id="`comparison-${product.id}`">{{ t('detail.comparison') }}</h2>
          </div>
        </div>
        <div class="comparison-table" role="table" :aria-label="t('detail.comparison')">
          <div class="comparison-head" role="row">
            <span role="columnheader">{{ t('detail.comparisonFeature') }}</span>
            <span role="columnheader">{{ t('detail.comparisonOutcome') }}</span>
          </div>
          <div v-for="(row, index) in comparisonRows" :key="row.feature" class="comparison-row" role="row">
            <span class="comparison-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <strong role="cell">{{ row.feature }}</strong>
            <span role="cell">{{ row.outcome }}</span>
          </div>
        </div>
      </section>

      <section v-if="product.id === 'violence-detection'" class="responsibility section-rule detail-reveal" :aria-labelledby="`responsibility-${product.id}`">
        <div class="section-heading">
          <span class="section-no" aria-hidden="true">06</span>
          <div>
            <p class="eyebrow">{{ t('detail.responsibility.eyebrow') }}</p>
            <h2 :id="`responsibility-${product.id}`">{{ t('detail.responsibility.title') }}</h2>
          </div>
        </div>

        <div class="responsibility-alert" role="note">
          <strong>{{ t('detail.responsibility.reviewRequired') }}</strong>
          <p>{{ t('detail.responsibility.intro') }}</p>
        </div>

        <div class="responsibility-grid">
          <article class="boundary-card boundary-card-output">
            <h3>{{ t('detail.responsibility.includes') }}</h3>
            <ul>
              <li v-for="item in outputContract" :key="item"><span aria-hidden="true">✓</span><span>{{ item }}</span></li>
            </ul>
          </article>
          <article class="boundary-card boundary-card-limits">
            <h3>{{ t('detail.responsibility.excludes') }}</h3>
            <ul>
              <li v-for="item in limitations" :key="item"><span aria-hidden="true">—</span><span>{{ item }}</span></li>
            </ul>
          </article>
        </div>

        <div class="responsibility-media">
          <img :src="product.gallery[1]" :alt="galleryAlt[1]" width="1400" height="900" loading="lazy" decoding="async" />
          <img :src="product.gallery[2]" :alt="galleryAlt[2]" width="1400" height="900" loading="lazy" decoding="async" />
        </div>

        <aside class="technical-report" aria-labelledby="technical-report-title">
          <p class="eyebrow">{{ t('detail.technicalReport.eyebrow') }}</p>
          <h3 id="technical-report-title">{{ t('detail.technicalReport.title') }}</h3>
          <p>{{ t('detail.technicalReport.unavailable') }}</p>
          <span class="report-status">{{ t('detail.technicalReport.status') }}</span>
        </aside>
      </section>

      <section v-if="product.type === 'equipment'" id="product-gallery" class="gallery section-rule detail-reveal" :aria-labelledby="`gallery-${product.id}`">
        <div class="section-heading">
          <span class="section-no" aria-hidden="true">06</span>
          <div>
            <p class="eyebrow">{{ t('detail.galleryEyebrow') }}</p>
            <h2 :id="`gallery-${product.id}`">{{ t('detail.gallery') }}</h2>
          </div>
        </div>
        <div class="gallery-grid">
          <figure v-for="(image, index) in product.gallery" :key="image" class="gallery-item">
            <img
              :src="image"
              :alt="galleryAlt[index] || localize(product.name, locale)"
              width="720"
              height="540"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section class="resources section-rule detail-reveal" :aria-labelledby="`resources-${product.id}`">
        <div class="section-heading">
          <span class="section-no" aria-hidden="true">{{ product.type === 'equipment' ? '07' : '06' }}</span>
          <div>
            <p class="eyebrow">{{ t('detail.resourcesEyebrow') }}</p>
            <h2 :id="`resources-${product.id}`">{{ t('detail.resources') }}</h2>
          </div>
        </div>
        <div class="resource-grid">
          <a :href="product.catalog" class="resource-card resource-download" download>
            <span class="resource-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
              </svg>
            </span>
            <span>
              <strong>{{ t('detail.resourceCatalog') }}</strong>
              <small>{{ t('detail.resourceCatalogBody') }}</small>
            </span>
            <span class="resource-arrow" aria-hidden="true">↓</span>
          </a>
          <RouterLink to="/contact" class="resource-card">
            <span class="resource-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                <path d="M4 5h16v11H8l-4 4z" />
                <path d="M8 9h8M8 12h5" />
              </svg>
            </span>
            <span>
              <strong>{{ t('detail.resourceConsultation') }}</strong>
              <small>{{ t('detail.resourceConsultationBody') }}</small>
            </span>
            <span class="resource-arrow" aria-hidden="true">↗</span>
          </RouterLink>
          <RouterLink to="/contact" class="resource-card">
            <span class="resource-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                <path d="M5 20V10M12 20V4M19 20v-7" />
                <path d="M3 20h18" />
              </svg>
            </span>
            <span>
              <strong>{{ t('detail.resourceSupport') }}</strong>
              <small>{{ t(`detail.resourceSupportBody.${product.type}`) }}</small>
            </span>
            <span class="resource-arrow" aria-hidden="true">↗</span>
          </RouterLink>
        </div>
        <div class="support-band">
          <div>
            <p class="eyebrow">{{ t('detail.supportEyebrow') }}</p>
            <h3>{{ t('detail.supportTitle') }}</h3>
          </div>
          <ul>
            <li v-for="key in ['planning', 'training', 'continuity']" :key="key">
              <span aria-hidden="true">✓</span>
              <span>
                <strong>{{ t(`detail.support.${key}.title`) }}</strong>
                <small>{{ t(`detail.support.${key}.body`) }}</small>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section class="faq section-rule detail-reveal" :aria-labelledby="`faq-${product.id}`">
        <div class="section-heading">
          <span class="section-no" aria-hidden="true">{{ product.type === 'equipment' ? '08' : '07' }}</span>
          <div>
            <p class="eyebrow">{{ t('detail.faqEyebrow') }}</p>
            <h2 :id="`faq-${product.id}`">{{ t('detail.faq') }}</h2>
          </div>
        </div>
        <div class="faq-list">
          <details v-for="(item, index) in product.faq" :key="index" class="faq-item">
            <summary>
              <span>{{ localize(item.question, locale) }}</span>
              <span class="faq-plus" aria-hidden="true"></span>
            </summary>
            <div class="faq-answer">
              <p>{{ localize(item.answer, locale) }}</p>
            </div>
          </details>
        </div>
      </section>

      <section class="closing detail-reveal">
        <div>
          <p class="eyebrow closing-eyebrow">{{ t('detail.ctaEyebrow') }}</p>
          <h2>{{ t('detail.ctaText') }}</h2>
        </div>
        <div class="closing-actions">
          <RouterLink to="/contact" class="btn-ink">
            {{ t('detail.contactSales') }}
            <span class="arrow" aria-hidden="true">→</span>
          </RouterLink>
          <a :href="product.catalog" class="btn-ghost-light" download>
            {{ t('detail.downloadCatalog') }}
          </a>
        </div>
      </section>
    </div>

    <section v-else class="detail-inner missing">
      <h1>{{ t('detail.notFound') }}</h1>
      <RouterLink to="/products" class="btn-ink">
        {{ t('detail.backToProducts') }}
        <span class="arrow" aria-hidden="true">→</span>
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.detail {
  position: relative;
  min-height: 100vh;
  padding: 11rem 2.5rem 6rem;
  color: var(--ink);
}

.detail-inner { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; }
.detail-orb { display: none; }

.crumb {
  display: flex; align-items: center; gap: 0.625rem;
  margin-bottom: 2.5rem;
  color: var(--muted); font-size: 0.8125rem; font-weight: 600;
}

.crumb-link { color: var(--muted); text-decoration: none; transition: color 0.3s ease; }
.crumb-link:hover { color: var(--accent); }
.crumb-sep { opacity: 0.5; }

.head {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
  padding-bottom: 4rem;
  margin-bottom: 4rem;
  border-bottom: 1px solid var(--line);
}

.tags { display: flex; flex-wrap: wrap; gap: 0.625rem; margin-bottom: 1.5rem; }

.tag {
  padding: 0.375rem 0.875rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tag-type { color: var(--accent); border-color: var(--accent); }
.tag-cat { color: var(--ink-soft); }
.tag-flag { color: #001B00; background: var(--warm); border-color: var(--warm); }

.title {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 550;
  line-height: 1.05;
  letter-spacing: var(--track-display);
}

html[lang='fa'] .title { line-height: 1.25; font-weight: 800; }

.trade-name {
  margin: 0.7rem 0 0;
  color: var(--coral-deep);
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  direction: ltr;
}

.tagline {
  max-width: 46ch;
  margin: 1.25rem 0 0;
  color: var(--ink-soft);
  font-size: 1.125rem;
  line-height: 1.5;
}

.head-description {
  max-width: 58ch;
  margin: 1.25rem 0 0;
  color: var(--ink-soft);
  font-size: 0.9375rem;
  line-height: 1.75;
}

.head-actions { display: flex; flex-wrap: wrap; gap: 0.875rem; align-items: center; margin-top: 2.5rem; }

.head-media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  margin: 0;
  background: var(--cream-deep);
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  box-shadow: var(--shadow-card);
}

.head-media img { width: 100%; height: 100%; display: block; object-fit: cover; }

.highlight-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 0.6fr)) minmax(260px, 1.2fr);
  margin: 0 0 4rem;
  overflow: hidden;
  background: rgba(252, 252, 242, 0.7);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.highlight-stat,
.highlight-note {
  min-height: 112px;
  padding: 1.25rem;
  border-inline-end: 1px solid var(--line);
}

.highlight-note { border-inline-end: 0; }
.highlight-stat { display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem; }

.highlight-stat strong {
  color: var(--coral-deep);
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  line-height: 1;
}

.highlight-stat span,
.highlight-note p {
  margin: 0;
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.45;
}

.highlight-note { display: flex; align-items: center; gap: 1rem; background: var(--warm-soft); }
.highlight-pulse { width: 10px; height: 10px; flex: 0 0 auto; background: var(--orange); border-radius: 50%; }

.section-rule {
  padding: 3.5rem 0;
  border-top: 1px solid var(--line);
}

.section-heading {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-no {
  color: var(--coral-deep);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.1em;
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--coral-deep); font-size: 0.75rem; font-weight: 750;
  letter-spacing: 0.11em; text-transform: uppercase;
}

html[lang='fa'] .eyebrow { letter-spacing: 0; text-transform: none; }

.section-heading h2,
.value-panel h2,
.closing h2 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 2.4vw, 1.75rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: var(--track-display);
}

html[lang='fa'] .section-heading h2,
html[lang='fa'] .value-panel h2,
html[lang='fa'] .closing h2 { line-height: 1.35; font-weight: 800; }

.story { display: grid; grid-template-columns: 7fr 4fr; gap: 2rem 4rem; }
.story .section-heading { grid-column: 1 / -1; }
.story-content { display: contents; }
.story-lead { margin: 0; max-width: 64ch; color: var(--ink-soft); font-size: 1.0625rem; line-height: 1.75; }

.users-panel {
  position: relative;
  display: grid; grid-template-columns: auto 1fr; gap: 1.25rem;
  padding: 1.75rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: #FCFCF2;
  box-shadow: var(--shadow-card);
}

.users-panel::after { display: none; }

.users-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 48px; height: 48px; border-radius: 15px;
  color: var(--ink); background: var(--grad-orange);
  box-shadow: 0 14px 28px -19px rgba(229, 100, 42, 0.9);
}

.users-icon svg { width: 24px; height: 24px; }
.users-panel h3 { margin: 0; font-family: var(--font-display); font-size: 1.4rem; }
.users-panel ul {
  display: flex; flex-wrap: wrap; gap: 0.55rem;
  list-style: none; margin: 1rem 0 0; padding: 0;
}
.users-panel li {
  padding: 0.55rem 0.8rem; border-radius: 999px;
  color: var(--ink-soft); background: rgba(0, 41, 0, 0.065);
  font-size: 0.78rem; font-weight: 700;
}

.feature-grid {
  list-style: none; margin: 0; padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.feature-card {
  position: relative;
  display: grid;
  grid-template-columns: auto 3rem minmax(0, 1fr);
  align-items: center;
  gap: 1rem;
  min-height: 0;
  padding: 1rem 0;
  opacity: 0;
  transform: translateY(12px);
  border-bottom: 1px solid var(--line);
  transition: opacity 520ms ease var(--card-delay),
              transform 520ms cubic-bezier(0.16, 1, 0.3, 1) var(--card-delay),
              color 250ms ease;
}

.capabilities.detail-reveal.is-visible .feature-card { opacity: 1; transform: translateY(0); }
.feature-card:hover {
  transition-delay: 0s;
  color: var(--coral-deep);
}

.feature-graphic,
.feature-more { display: none; }
.feature-top { display: contents; }
.feature-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 42px; height: 42px; border-radius: 50%;
  color: #001B00; background: var(--grad-orange);
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
}
.feature-icon svg { width: 21px; height: 21px; }
.feature-card:hover .feature-icon { transform: rotate(-4deg) scale(1.06); }
.feature-no { color: var(--coral-deep); font-size: 0.75rem; font-weight: 700; }
.feature-card p { max-width: none; margin: 0; color: var(--ink-soft); font-size: 1rem; font-weight: 500; line-height: 1.55; }

.workflow-track {
  position: relative;
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.25rem;
  list-style: none; margin: 0; padding: 2.25rem 0 0;
}

.workflow-track::before {
  content: ''; position: absolute; z-index: 0;
  top: 1.12rem; inset-inline: calc(12.5% - 0.5rem);
  height: 2px;
  background: linear-gradient(90deg, var(--orange), rgba(0, 41, 0, 0.17));
  transform: scaleX(0); transform-origin: left;
  transition: transform 1s 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

html[dir='rtl'] .workflow-track::before { transform-origin: right; }
.workflow.detail-reveal.is-visible .workflow-track::before { transform: scaleX(1); }

.workflow-step {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: auto 1fr; align-items: start; gap: 0.9rem;
  padding: 1.35rem; border-radius: 20px;
  background: rgba(250, 250, 240, 0.72);
  border: 1px solid rgba(0, 41, 0, 0.13);
  opacity: 0; transform: translateY(16px);
  transition: opacity 550ms ease var(--step-delay),
              transform 550ms cubic-bezier(0.16, 1, 0.3, 1) var(--step-delay),
              border-color 250ms ease, box-shadow 250ms ease;
}

.workflow.detail-reveal.is-visible .workflow-step { opacity: 1; transform: translateY(0); }
.workflow-step:hover { border-color: rgba(255, 146, 92, 0.75); box-shadow: var(--shadow-card); }
.workflow-dot {
  display: inline-flex; align-items: center; justify-content: center;
  width: 2rem; height: 2rem; border-radius: 50%;
  color: var(--ink); background: var(--orange);
  font-size: 0.75rem; font-weight: 800;
}
.workflow-label { margin: 0 0 0.45rem; color: var(--coral-deep); font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
html[lang='fa'] .workflow-label { letter-spacing: 0; }
.workflow-step h3 { margin: 0; font-family: var(--font-display); font-size: 1.2rem; line-height: 1.25; }
.workflow-step p:last-child { margin: 0.7rem 0 0; color: var(--ink-soft); font-size: 0.85rem; line-height: 1.65; }

.value-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }

.value-panel {
  padding: clamp(1.75rem, 3vw, 2.5rem);
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.value-benefits { background: #FCFCF2; }
.value-applications { background: var(--warm-soft); color: var(--ink); }

.value-panel ul,
.assurance-card ul {
  list-style: none; padding: 0; margin: 2rem 0 0;
  display: flex; flex-direction: column; gap: 1rem;
}

.value-panel li,
.assurance-card li { display: flex; gap: 0.875rem; align-items: flex-start; line-height: 1.55; }

.list-mark { color: var(--coral-deep); font-weight: 800; }
.value-applications .list-mark { color: var(--coral-deep); }
html[dir='rtl'] .value-applications .list-mark { transform: rotate(180deg); }

.facts-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(290px, 0.6fr); gap: 2rem; }
.facts-grid > * { min-width: 0; }
.spec-table {
  overflow: hidden;
  align-self: start;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  background: #FCFCF2;
  border: 1px solid var(--line);
  border-radius: 16px;
}
.spec-row {
  display: grid;
  grid-template-columns: minmax(8.75rem, 0.88fr) minmax(0, 1.12fr);
  align-items: stretch;
  width: 100%;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid var(--line);
}
.spec-row:last-child { border-bottom: 0; }
.spec-row dt,
.spec-row dd {
  min-width: 0;
  padding: 1rem 1.25rem;
  box-sizing: border-box;
  line-height: 1.55;
  overflow-wrap: anywhere;
}
.spec-row dt {
  color: var(--ink);
  background: var(--warm-soft);
  border-inline-end: 1px solid var(--line);
  font-size: 0.9375rem;
  font-weight: 600;
}
.spec-row dd { margin: 0; color: var(--ink-soft); font-size: 0.9375rem; font-weight: 400; }

.assurance-card {
  align-self: start;
  padding: 1.75rem;
  color: var(--ink);
  background: #FCFCF2;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.assurance-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 48px; height: 48px; margin-bottom: 1.25rem;
  color: #001B00; background: var(--grad-orange); border-radius: 50%;
}

.assurance-card h3 { margin: 0; color: var(--coral-deep); font-size: 0.8125rem; font-weight: 700; }
.assurance-card li > span:first-child { color: var(--coral-deep); font-weight: 800; }

.gallery-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1rem; }
.gallery-item { overflow: hidden; margin: 0; min-height: 280px; border-radius: 26px; background: var(--cream-deep); }
.gallery-item:first-child { grid-row: span 2; min-height: 570px; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1); }
.gallery-item:hover img { transform: scale(1.035); }

.comparison-table {
  overflow: hidden;
  border: 1px solid rgba(0, 41, 0, 0.17);
  border-radius: 24px;
  background: rgba(250, 250, 240, 0.64);
  box-shadow: 0 24px 55px -48px rgba(0, 41, 0, 0.85);
}

.comparison-head,
.comparison-row {
  display: grid; grid-template-columns: 3.25rem minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center; gap: 1.25rem;
}

.comparison-head {
  padding: 0.9rem 1.5rem;
  color: rgba(245, 245, 229, 0.68); background: var(--ink);
  font-size: 0.72rem; font-weight: 750; letter-spacing: 0.06em; text-transform: uppercase;
}

.comparison-head span:first-child { grid-column: 2; }
.comparison-row {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(0, 41, 0, 0.11);
  transition: background 240ms ease, transform 240ms ease;
}
.comparison-row:hover { background: rgba(255, 146, 92, 0.08); transform: translateX(4px); }
html[dir='rtl'] .comparison-row:hover { transform: translateX(-4px); }
.comparison-index { color: var(--coral-deep); font-family: var(--font-display); font-weight: 700; }
.comparison-row strong { font-size: 0.94rem; line-height: 1.5; }
.comparison-row > span:last-child { color: var(--ink-soft); font-size: 0.88rem; line-height: 1.6; }

.responsibility-alert {
  display: grid;
  grid-template-columns: minmax(180px, 0.45fr) minmax(0, 1.55fr);
  gap: 2rem;
  padding: clamp(1.5rem, 3vw, 2.4rem);
  color: var(--sand);
  background: var(--ink);
  border: 1px solid rgba(255, 146, 92, 0.42);
  border-radius: 24px;
}
.responsibility-alert strong { color: var(--orange); font-family: var(--font-display); font-size: 1.18rem; }
.responsibility-alert p { max-width: 68ch; margin: 0; color: rgba(245, 245, 229, 0.76); line-height: 1.75; }
.responsibility-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.boundary-card { padding: clamp(1.5rem, 3vw, 2.25rem); border: 1px solid var(--line); border-radius: 24px; background: rgba(252, 252, 242, 0.72); }
.boundary-card-limits { background: rgba(255, 146, 92, 0.08); border-color: rgba(190, 75, 36, 0.25); }
.boundary-card h3 { margin: 0 0 1.25rem; color: var(--ink); font-family: var(--font-display); font-size: 1.35rem; }
.boundary-card ul { display: grid; gap: 0.9rem; margin: 0; padding: 0; list-style: none; }
.boundary-card li { display: grid; grid-template-columns: 1.25rem minmax(0, 1fr); gap: 0.7rem; color: var(--ink-soft); line-height: 1.6; }
.boundary-card li > span:first-child { color: var(--coral-deep); font-weight: 850; }
.responsibility-media { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.responsibility-media img { width: 100%; aspect-ratio: 14 / 9; object-fit: cover; border-radius: 22px; border: 1px solid var(--line); }
.technical-report { margin-top: 1rem; padding: clamp(1.5rem, 3vw, 2.25rem); border: 1px dashed rgba(0, 41, 0, 0.32); border-radius: 22px; background: rgba(245, 245, 229, 0.55); }
.technical-report h3 { margin: 0.45rem 0 0; font-family: var(--font-display); font-size: clamp(1.45rem, 3vw, 2rem); }
.technical-report > p:not(.eyebrow) { max-width: 72ch; margin: 0.9rem 0 0; color: var(--ink-soft); line-height: 1.7; }
.report-status { display: inline-flex; margin-top: 1.15rem; padding: 0.45rem 0.8rem; color: var(--coral-deep); border: 1px solid rgba(190, 75, 36, 0.3); border-radius: 999px; font-size: 0.76rem; font-weight: 750; }

.resource-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.resource-card {
  position: relative;
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 1rem;
  min-height: 150px; padding: 1.4rem;
  color: var(--ink); text-decoration: none;
  border: 1px solid rgba(0, 41, 0, 0.15); border-radius: 22px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.64), rgba(245, 245, 229, 0.52)),
    rgba(250, 250, 240, 0.68);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 300ms ease, box-shadow 300ms ease;
}
.resource-card:hover { transform: translateY(-6px); border-color: var(--orange); box-shadow: var(--shadow-lift); }
.resource-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 46px; height: 46px; border-radius: 14px;
  color: var(--ink); background: rgba(255, 146, 92, 0.86);
}
.resource-icon svg { width: 22px; height: 22px; }
.resource-card strong { display: block; font-family: var(--font-display); font-size: 1.05rem; }
.resource-card small { display: block; margin-top: 0.5rem; color: var(--ink-soft); font-size: 0.76rem; line-height: 1.55; }
.resource-arrow { color: var(--coral-deep); font-size: 1.2rem; transition: transform 250ms ease; }
.resource-card:hover .resource-arrow { transform: translate(3px, -3px); }
html[dir='rtl'] .resource-card:hover .resource-arrow { transform: translate(-3px, -3px); }
.resource-download { color: var(--sand); background: var(--grad-green); }
.resource-download small { color: rgba(245, 245, 229, 0.72); }
.resource-download .resource-arrow { color: var(--orange); }

.support-band {
  display: grid; grid-template-columns: minmax(230px, 0.7fr) minmax(0, 1.3fr);
  gap: 3rem; margin-top: 1.25rem; padding: clamp(2rem, 4vw, 3.25rem);
  color: var(--sand);
  border-radius: 26px;
  background:
    radial-gradient(circle at 88% 12%, rgba(255, 146, 92, 0.18), transparent 28%),
    var(--ink);
}
.support-band .eyebrow { color: var(--orange); }
.support-band h3 { max-width: 13ch; margin: 0; font-family: var(--font-display); font-size: clamp(1.65rem, 3vw, 2.4rem); line-height: 1.12; }
.support-band ul {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem;
  list-style: none; margin: 0; padding: 0;
}
.support-band li {
  display: grid; grid-template-columns: auto 1fr; align-items: start; gap: 0.7rem;
  padding: 1rem; border: 1px solid rgba(245, 245, 229, 0.12); border-radius: 17px;
  background: rgba(245, 245, 229, 0.055);
}
.support-band li > span:first-child { color: var(--orange); font-weight: 850; }
.support-band strong { display: block; font-size: 0.84rem; }
.support-band small { display: block; margin-top: 0.45rem; color: rgba(245, 245, 229, 0.62); font-size: 0.73rem; line-height: 1.55; }

.faq-list { max-width: 920px; margin-inline-start: auto; border-top: 1px solid rgba(0, 41, 0, 0.2); }
.faq-item { border-bottom: 1px solid rgba(0, 41, 0, 0.2); }
.faq-item summary {
  list-style: none; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between; gap: 2rem;
  padding: 1.5rem 0; color: var(--ink); font-weight: 700; font-size: 1.0625rem;
}
.faq-item summary::-webkit-details-marker { display: none; }
.faq-answer {
  display: grid; grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 420ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease;
}
.faq-answer > p { overflow: hidden; }
.faq-item[open] .faq-answer { grid-template-rows: 1fr; opacity: 1; }
.faq-item p { max-width: 70ch; margin: 0; padding: 0 3rem 1.5rem 0; color: var(--ink-soft); line-height: 1.75; }
html[dir='rtl'] .faq-item p { padding: 0 0 1.5rem 3rem; }
.faq-plus { position: relative; flex: 0 0 22px; width: 22px; height: 22px; }
.faq-plus::before, .faq-plus::after { content: ''; position: absolute; inset: 50% 0 auto; height: 2px; background: var(--orange); transition: transform 250ms ease; }
.faq-plus::after { transform: rotate(90deg); }
.faq-item[open] .faq-plus::after { transform: rotate(0); }

.detail-reveal {
  opacity: 0;
  transform: translate3d(0, 28px, 0);
  transition: opacity 650ms ease, transform 720ms cubic-bezier(0.16, 1, 0.3, 1);
}
.detail-reveal.is-visible { opacity: 1; transform: translate3d(0, 0, 0); }

.closing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 4rem 0 0;
  color: var(--ink);
  text-align: center;
  border-top: 1px solid var(--line);
}

.closing::after { display: none; }
.closing h2 {
  max-width: 44ch;
  color: var(--ink-soft);
  font-family: var(--font-body);
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.5;
}
.closing-eyebrow { color: var(--coral-deep); }
.closing-actions { display: flex; flex-wrap: wrap; gap: 0.875rem; flex-shrink: 0; }

.btn-ghost-light {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.875rem 1.5rem; border: 1px solid var(--accent);
  border-radius: var(--radius-btn); color: var(--coral-deep); text-decoration: none; font-weight: 700;
  transition: color 250ms ease, border-color 250ms ease, background 250ms ease;
}
.btn-ghost-light:hover { color: var(--ink); background: var(--warm-soft); border-color: var(--coral-deep); }

.missing { min-height: 60vh; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 2rem; }
.missing h1 { max-width: 18ch; margin: 0; font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 5rem); line-height: 1.05; }

@media (max-width: 980px) {
  .detail { padding: 9rem 1.75rem 4rem; }
  .head { grid-template-columns: 1fr; gap: 2.5rem; }
  .head-media { order: -1; }
  .highlight-strip { grid-template-columns: repeat(3, 1fr); }
  .highlight-note { grid-column: 1 / -1; min-height: 88px; }
  .story { grid-template-columns: 1fr; gap: 0; }
  .workflow-track { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .workflow-track::before { display: none; }
  .facts-grid { grid-template-columns: 1fr; }
  .resource-grid { grid-template-columns: 1fr; }
  .resource-card { min-height: 120px; }
  .support-band { grid-template-columns: 1fr; gap: 2rem; }
  .responsibility-alert { grid-template-columns: 1fr; gap: 0.75rem; }
}

@media (max-width: 700px) {
  .detail { padding: 7.5rem 1.25rem 3rem; }
  .title { font-size: clamp(2.5rem, 12vw, 4rem); }
  .head-media { border-radius: var(--radius-card); }
  .highlight-strip { grid-template-columns: repeat(3, 1fr); border-radius: 18px; }
  .highlight-stat { min-height: 110px; padding: 1rem 0.8rem; }
  .highlight-stat strong { font-size: 1.85rem; }
  .highlight-stat span { font-size: 0.67rem; }
  .highlight-note { padding: 1.1rem; }
  .feature-grid, .value-grid, .gallery-grid, .responsibility-grid, .responsibility-media { grid-template-columns: 1fr; }
  .feature-card { min-height: 0; grid-template-columns: auto 2.5rem minmax(0, 1fr); }
  .workflow-track { grid-template-columns: 1fr; }
  .gallery-item, .gallery-item:first-child { grid-row: auto; min-height: 330px; }
  .spec-row { grid-template-columns: 1fr; gap: 0; }
  .spec-row dt { border-inline-end: 0; border-bottom: 1px solid var(--line); }
  .comparison-head { display: none; }
  .comparison-row { grid-template-columns: 2.5rem 1fr; gap: 0.7rem 1rem; }
  .comparison-row > span:last-child { grid-column: 2; }
  .support-band ul { grid-template-columns: 1fr; }
  .closing-actions, .closing-actions > * { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .detail-orb-a, .detail-orb-b { transform: none; }
  .highlight-pulse::after { animation: none; }
  .detail-reveal, .feature-card, .workflow-step { opacity: 1; transform: none; }
  .workflow-track::before { transform: scaleX(1); }
  .feature-card, .feature-graphic, .feature-icon, .gallery-item img,
  .faq-answer, .faq-plus::after, .closing::after { transition: none; }
}
</style>
