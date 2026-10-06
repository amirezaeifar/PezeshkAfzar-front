<script setup>
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = reactive({ name: '', email: '', phone: '', subject: '', message: '' })
const touched = reactive({ name: false, email: false, subject: false, message: false })

const draftOpened = ref(false)
const showSummary = ref(false)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors = computed(() => ({
  name: form.name.trim() ? null : 'required',
  email: !form.email.trim() ? 'required' : !emailRe.test(form.email.trim()) ? 'email' : null,
  subject: form.subject.trim() ? null : 'required',
  message: !form.message.trim() ? 'required' : form.message.trim().length < 20 ? 'minMessage' : null,
}))

const isValid = computed(() =>
  !errors.value.name && !errors.value.email && !errors.value.subject && !errors.value.message
)

const errMsg = (field) => {
  const code = errors.value[field]
  if (!code) return null
  if (!touched[field] && !showSummary.value) return null
  return t(`contact.errors.${code}`)
}

const onBlur = (field) => { touched[field] = true }

const handleSubmit = () => {
  touched.name = true
  touched.email = true
  touched.subject = true
  touched.message = true

  if (!isValid.value) { showSummary.value = true; return }

  showSummary.value = false
  const body = [
    `${t('contact.form.name')}: ${form.name.trim()}`,
    `${t('contact.form.email')}: ${form.email.trim()}`,
    ...(form.phone.trim() ? [`${t('contact.form.phone')}: ${form.phone.trim()}`] : []),
    '',
    form.message.trim(),
  ].join('\n')
  const recipient = t('contact.meta.emailVal')
  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(form.subject.trim())}&body=${encodeURIComponent(body)}`
  draftOpened.value = true
}

</script>

<template>
  <main class="view contact">
    <div class="contact-inner">
      <header class="head">
        <span class="eyebrow cine-focus" style="animation-delay: 0.1s">{{ t('contact.eyebrow') }}</span>
        <h1 class="head-title">
          <span class="cine-mask"><span class="cine-lift" style="animation-delay: 0.25s">{{ t('contact.titleA') }}</span></span>
          <span class="cine-mask"><span class="cine-lift" style="animation-delay: 0.4s"><em class="text-fire">{{ t('contact.titleB') }}</em></span></span>
        </h1>
      </header>

      <div class="layout">
        <!-- The invitation — a deep green frame with a rising sun -->
        <aside class="meta cine-focus" style="animation-delay: 0.55s">
          <span class="meta-sun breathe" aria-hidden="true"></span>

          <p class="intro">{{ t('contact.intro') }}</p>
          <dl class="meta-list">
            <div class="meta-item">
              <dt>{{ t('contact.meta.studio') }}</dt>
              <dd>{{ t('contact.meta.studioVal') }}</dd>
            </div>
            <div class="meta-item">
              <dt>{{ t('contact.meta.secondStudio') }}</dt>
              <dd>{{ t('contact.meta.secondStudioVal') }}</dd>
            </div>
            <div class="meta-item">
              <dt>{{ t('contact.meta.hours') }}</dt>
              <dd>{{ t('contact.meta.hoursVal') }}</dd>
            </div>
            <div class="meta-item">
              <dt>{{ t('contact.meta.email') }}</dt>
              <dd>
                <a :href="`mailto:${t('contact.meta.emailVal')}`" class="meta-mail">
                  {{ t('contact.meta.emailVal') }}
                </a>
              </dd>
            </div>
          </dl>
        </aside>

        <!-- The note — warm paper, ember accents -->
        <section class="panel cine-focus" style="animation-delay: 0.7s">
          <transition name="swap" mode="out-in">
            <form key="form" class="form" novalidate @submit.prevent="handleSubmit">
              <div class="form-section-label">
                <span class="label-bar" aria-hidden="true"></span>
                <span>{{ t('contact.form.section') }}</span>
              </div>

              <transition name="fade">
                <div v-if="showSummary && !isValid" class="alert">
                  {{ t('contact.errors.summary') }}
                </div>
              </transition>
              <p v-if="draftOpened" class="alert" role="status">{{ t('contact.form.emailDraftNotice') }}</p>

              <div class="field" :class="{ 'has-error': errMsg('name') }">
                <label for="name">
                  <span class="lbl-num">01</span>
                  <span class="lbl-text">{{ t('contact.form.name') }}</span>
                  <span class="req" aria-hidden="true">*</span>
                </label>
                <input id="name" v-model="form.name" type="text"
                       :placeholder="t('contact.form.namePh')"
                       autocomplete="name" @blur="onBlur('name')" />
                <span v-if="errMsg('name')" class="err">{{ errMsg('name') }}</span>
              </div>

              <div class="field" :class="{ 'has-error': errMsg('email') }">
                <label for="email">
                  <span class="lbl-num">02</span>
                  <span class="lbl-text">{{ t('contact.form.email') }}</span>
                  <span class="req" aria-hidden="true">*</span>
                </label>
                <input id="email" v-model="form.email" type="email" dir="ltr"
                       :placeholder="t('contact.form.emailPh')"
                       autocomplete="email" @blur="onBlur('email')" />
                <span v-if="errMsg('email')" class="err">{{ errMsg('email') }}</span>
              </div>

              <div class="field">
                <label for="phone">
                  <span class="lbl-num">03</span>
                  <span class="lbl-text">{{ t('contact.form.phone') }}</span>
                </label>
                <input id="phone" v-model="form.phone" type="tel" dir="ltr"
                       :placeholder="t('contact.form.phonePh')" autocomplete="tel" />
              </div>

              <div class="field" :class="{ 'has-error': errMsg('subject') }">
                <label for="subject">
                  <span class="lbl-num">04</span>
                  <span class="lbl-text">{{ t('contact.form.subject') }}</span>
                  <span class="req" aria-hidden="true">*</span>
                </label>
                <input id="subject" v-model="form.subject" type="text"
                       :placeholder="t('contact.form.subjectPh')" @blur="onBlur('subject')" />
                <span v-if="errMsg('subject')" class="err">{{ errMsg('subject') }}</span>
              </div>

              <div class="field" :class="{ 'has-error': errMsg('message') }">
                <label for="message">
                  <span class="lbl-num">05</span>
                  <span class="lbl-text">{{ t('contact.form.message') }}</span>
                  <span class="req" aria-hidden="true">*</span>
                </label>
                <textarea id="message" v-model="form.message" rows="5"
                          :placeholder="t('contact.form.messagePh')" @blur="onBlur('message')"></textarea>
                <span v-if="errMsg('message')" class="err">{{ errMsg('message') }}</span>
              </div>

              <div class="actions">
                <button type="submit" class="btn-ink pulse-cta">
                  <span>{{ t('contact.form.submit') }}</span>
                  <span class="arrow">→</span>
                </button>
              </div>
            </form>
          </transition>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.contact { padding: 10.5rem 2.5rem 6rem; position: relative; }

.contact-inner { max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }

.head {
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 4.5rem;
}

.head-title {
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 7.5vw, 6.5rem);
  line-height: 1; font-weight: 550;
  letter-spacing: var(--track-display); margin: 0; color: var(--ink);
}

html[lang='fa'] .head-title {
  font-size: clamp(2.25rem, 6vw, 5rem);
  line-height: 1.25; font-weight: 800;
}

.head-title em { font-style: italic; }
html[lang='fa'] .head-title em { font-style: normal; }

/* The two frames overlap slightly — invitation under, note above */
.layout {
  display: grid; grid-template-columns: 1fr 1.4fr;
  gap: 0;
  align-items: stretch;
}

/* ── The invitation — the page's one molten frame ────── */
.meta {
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; gap: 2.5rem;
  padding: 3.25rem 3.5rem 3.25rem 3rem;
  background: var(--grad-orange-deep);
  background-size: 220% 100%;
  animation: gradientShift 14s ease-in-out infinite;
  border-radius: var(--radius-panel) 0 0 var(--radius-panel);
  color: #001B00;
  box-shadow: var(--glow-fire);
}

html[dir='rtl'] .meta { border-radius: 0 var(--radius-panel) var(--radius-panel) 0; }

/* Heat shimmer pooling in the corner */
.meta-sun {
  position: absolute;
  width: 380px; height: 380px;
  bottom: -220px; inset-inline-start: -140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 245, 229, 0.5) 0%, rgba(245, 245, 229, 0) 70%);
  pointer-events: none;
}

.intro {
  position: relative;
  font-size: 1.0625rem; line-height: 1.75;
  color: rgba(0, 27, 0, 0.82); margin: 0; max-width: 38ch;
  font-weight: 500;
}

.meta-list {
  position: relative;
  display: flex; flex-direction: column; gap: 1.5rem; margin: 0;
}

.meta-item {
  display: flex; flex-direction: column; gap: 0.375rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(0, 27, 0, 0.22);
}

.meta-item dt {
  font-size: 0.8125rem; font-weight: 700;
  letter-spacing: 0.05em;
  color: rgba(0, 27, 0, 0.6);
}

html[lang='fa'] .meta-item dt { letter-spacing: 0; }

.meta-item dd {
  font-size: 1.0313rem; color: #001B00; margin: 0; font-weight: 700;
}

.meta-mail {
  color: #001B00; text-decoration: none;
  border-bottom: 2px solid rgba(0, 27, 0, 0.4);
  padding-bottom: 2px;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.meta-mail:hover { color: #F5F5E5; border-color: #F5F5E5; }

/* ── The note — clean white paper ────────────────────── */
.panel {
  position: relative;
  background: #FCFCF2;
  border: 1px solid var(--line);
  border-radius: 0 var(--radius-panel) var(--radius-panel) 0;
  padding: 3.25rem 3.5rem;
  box-shadow: var(--shadow-lift);
}

html[dir='rtl'] .panel { border-radius: var(--radius-panel) 0 0 var(--radius-panel); }

.form { display: flex; flex-direction: column; gap: 1.625rem; }

.form-section-label {
  display: flex; align-items: center; gap: 1rem;
  font-size: 0.875rem; font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--coral-deep); margin-bottom: 0.5rem;
}

html[lang='fa'] .form-section-label { letter-spacing: 0; }

.label-bar {
  flex: 0 0 36px; height: 4px; border-radius: 2px;
  background: var(--grad-orange);
}

.alert {
  padding: 1rem 1.25rem;
  border: 1.5px solid var(--coral);
  background: var(--warm-soft);
  color: var(--coral-deep);
  font-size: 0.875rem; font-weight: 600;
  border-radius: 14px;
}

.field {
  display: flex; flex-direction: column; gap: 0.5rem; position: relative;
}

.field label {
  display: inline-flex; align-items: baseline; gap: 0.625rem;
  font-size: 0.9063rem; color: var(--ink); font-weight: 600;
}

.lbl-num {
  font-family: var(--font-display);
  font-size: 0.8125rem; font-weight: 700;
  color: var(--coral-deep);
}

.req { color: var(--coral-deep); font-weight: 700; }

.field input, .field textarea {
  width: 100%; background: rgba(245, 245, 229, 0.7);
  border: none; border-bottom: 2px solid var(--coral-soft);
  border-radius: 12px 12px 0 0;
  padding: 0.875rem 1rem;
  font-family: inherit; font-size: 1rem;
  color: var(--ink); outline: none;
  resize: vertical;
  -webkit-appearance: none; appearance: none;
  transition: border-color 225ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 225ms ease,
              background-color 225ms ease;
}

.field textarea { min-height: 130px; }

.field input::placeholder, .field textarea::placeholder {
  color: var(--muted); opacity: 0.7;
}

.field input:focus::placeholder,
.field textarea:focus::placeholder {
  opacity: 0.48;
  transform: translateY(-1px);
}

.field input:focus, .field textarea:focus {
  border-bottom-color: var(--coral);
  background: rgba(245, 245, 229, 0.95);
  box-shadow: 0 0 0 3px rgba(255, 146, 92, 0.12),
              0 12px 28px -22px rgba(0, 41, 0, 0.48);
}

.field.has-error input, .field.has-error textarea {
  border-bottom-color: var(--coral-deep);
}

.err {
  font-size: 0.8125rem; font-weight: 600; color: var(--coral-deep);
  animation: fadeUp 0.3s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.actions { margin-top: 1rem; display: flex; justify-content: flex-end; }
html[dir='rtl'] .actions { justify-content: flex-start; }

.btn-ink:disabled { opacity: 0.65; cursor: not-allowed; }

.success {
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 1.25rem; padding: 1.5rem 0;
}

.success-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--grad-orange); color: #001B00;
  animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.6); }
  100% { opacity: 1; transform: scale(1); }
}

.success-title {
  font-family: var(--font-display);
  font-size: clamp(1.625rem, 3vw, 2.125rem);
  line-height: 1.15; font-weight: 550;
  color: var(--ink); margin: 0;
  letter-spacing: var(--track-display); max-width: 24ch;
}

html[lang='fa'] .success-title { font-weight: 800; }

.success-body {
  font-size: 1rem; color: var(--ink-soft);
  line-height: 1.7; margin: 0; max-width: 40ch;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }

.swap-enter-active, .swap-leave-active { transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.swap-enter-from { opacity: 0; transform: translateY(12px); }
.swap-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 1024px) {
  .contact { padding: 9rem 1.75rem 4rem; }
  .layout { grid-template-columns: 1fr; }
  .meta { border-radius: var(--radius-panel) var(--radius-panel) 0 0 !important; padding: 2.5rem 2.25rem; }
  .panel { border-radius: 0 0 var(--radius-panel) var(--radius-panel) !important; padding: 2.5rem 2.25rem; }
  .head { margin-bottom: 3.5rem; }
}

@media (max-width: 720px) {
  .contact { padding: 7.5rem 1.25rem 3rem; }
  .meta { border-radius: var(--radius-card) var(--radius-card) 0 0 !important; padding: 2rem 1.5rem; }
  .panel { border-radius: 0 0 var(--radius-card) var(--radius-card) !important; padding: 2rem 1.5rem; }
  .head { margin-bottom: 3rem; }
}
</style>
