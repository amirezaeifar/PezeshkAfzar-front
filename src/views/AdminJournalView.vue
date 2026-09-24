<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { journalCategories } from '../data/journal.js'
import { journalApi } from '../services/journalApi.js'
import { useJournal } from '../composables/useJournal.js'
import RichTextEditor from '../components/RichTextEditor.vue'

const { loadArticles } = useJournal()
const checkingSession = ref(true)
const authenticated = ref(false)
const articles = ref([])
const adminCategories = ref([...journalCategories])
const categoryDraft = ref({ key: '', label: { en: '', fa: '' } })
const categoryBusy = ref(false)
const categoryNotice = ref({ type: '', text: '' })
const selectedId = ref(null)
const saving = ref(false)
const uploading = ref(false)
const message = ref('')
const error = ref('')
const bodyError = ref('')
const bodySection = ref(null)
const credentials = ref({ username: '', password: '' })

const today = () => new Date().toISOString().slice(0, 10)
const localized = (en = '', fa = '') => ({ en, fa })
const emptyArticle = () => ({
  slug: '',
  category: 'medicalSoftware',
  featured: false,
  published: false,
  medical: true,
  title: localized(),
  summary: localized(),
  author: localized('Editorial desk', 'تحریریه'),
  reviewer: localized(),
  datePublished: today(),
  dateModified: today(),
  readingMinutes: 5,
  image: '',
  imageSrcset: '',
  imageWidth: 800,
  imageHeight: 600,
  alt: localized(),
  bodyHtml: localized(),
  sections: [],
  sources: [],
})

const draft = ref(emptyArticle())
const selectedArticle = computed(() => articles.value.find((item) => item.id === selectedId.value))

function resetNotice() {
  message.value = ''
  error.value = ''
  bodyError.value = ''
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function sectionsToHtml(sections = [], locale) {
  return sections.map((section) => {
    if (section.html?.[locale]) return section.html[locale]
    const heading = section.heading?.[locale]
    const paragraphs = (section.paragraphs || [])
      .map((paragraph) => paragraph?.[locale])
      .filter(Boolean)
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join('')
    const bullets = (section.bullets || [])
      .map((bullet) => bullet?.[locale])
      .filter(Boolean)
    const list = bullets.length
      ? `<ul>${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>`
      : ''
    const sectionId = escapeHtml(section.id || '')
    return `${heading ? `<h2${sectionId ? ` id="${sectionId}"` : ''}>${escapeHtml(heading)}</h2>` : ''}${paragraphs}${list}`
  }).join('')
}

function hydrateArticle(article) {
  const copy = JSON.parse(JSON.stringify(article))
  copy.bodyHtml = localized(
    sectionsToHtml(copy.sections, 'en'),
    sectionsToHtml(copy.sections, 'fa'),
  )
  return copy
}

function cleanRichHtml(html = '', locale) {
  const template = document.createElement('template')
  template.innerHTML = html
  template.content.querySelectorAll('script, style, iframe, object, embed').forEach((node) => node.remove())
  template.content.querySelectorAll('h1').forEach((heading) => {
    const replacement = document.createElement('h2')
    replacement.innerHTML = heading.innerHTML
    heading.replaceWith(replacement)
  })
  template.content.querySelectorAll('*').forEach((element) => {
    ;[...element.attributes].forEach((attribute) => {
      if (attribute.name.startsWith('on') || attribute.name === 'style' || attribute.name === 'class') {
        element.removeAttribute(attribute.name)
      }
    })
    if (element.tagName === 'A') {
      element.setAttribute('rel', 'noopener noreferrer')
      if (element.getAttribute('href')?.startsWith('http')) element.setAttribute('target', '_blank')
    }
    if (element.tagName === 'IMG') element.setAttribute('loading', 'lazy')
  })
  let headingIndex = 0
  template.content.querySelectorAll('h2, h3').forEach((heading) => {
    headingIndex += 1
    heading.id = `article-${locale}-${headingIndex}`
  })
  return template.innerHTML.trim()
}

function hasRichContent(html = '') {
  const template = document.createElement('template')
  template.innerHTML = html
  return Boolean(template.content.textContent?.trim() || template.content.querySelector('img'))
}

function showFieldRequirement(event) {
  const field = event.target
  if (!field?.setCustomValidity) return
  if (field.validity?.valueMissing) field.setCustomValidity('پر کردن این فیلد الزامی است.')
  else if (field.validity?.patternMismatch) field.setCustomValidity('فرمت واردشده برای این فیلد صحیح نیست.')
  else if (field.validity?.typeMismatch) field.setCustomValidity('یک مقدار معتبر وارد کنید.')
}

function clearFieldRequirement(event) {
  event.target?.setCustomValidity?.('')
}

function articlePayload() {
  const payload = JSON.parse(JSON.stringify(draft.value))
  const persistedImage = selectedArticle.value?.image || ''
  const persistedSrcset = selectedArticle.value?.imageSrcset || ''
  payload.image = String(payload.image || persistedImage).trim()
  if (!payload.imageSrcset && payload.image === persistedImage) payload.imageSrcset = persistedSrcset
  const html = localized(
    cleanRichHtml(payload.bodyHtml.en, 'en'),
    cleanRichHtml(payload.bodyHtml.fa, 'fa'),
  )
  payload.sections = [{
    id: 'article-content',
    heading: localized('Article content', 'متن مقاله'),
    html,
    paragraphs: [],
    bullets: [],
  }]
  delete payload.bodyHtml
  return payload
}

function startNew() {
  resetNotice()
  selectedId.value = null
  draft.value = emptyArticle()
}

function editArticle(article) {
  resetNotice()
  selectedId.value = article.id
  draft.value = hydrateArticle(article)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function loadAdminArticles() {
  const payload = await journalApi.listAdmin()
  articles.value = payload.articles || []
  if (selectedId.value) {
    const refreshed = articles.value.find((item) => item.id === selectedId.value)
    if (refreshed) draft.value = hydrateArticle(refreshed)
  }
}

async function loadAdminCategories() {
  try {
    const payload = await journalApi.listAdminCategories()
    adminCategories.value = payload.categories || []
  } catch (categoryError) {
    adminCategories.value = [...journalCategories]
    throw categoryError
  }
}

async function createCategory() {
  categoryNotice.value = { type: '', text: '' }
  const category = {
    key: categoryDraft.value.key.trim(),
    label: {
      fa: categoryDraft.value.label.fa.trim(),
      en: categoryDraft.value.label.en.trim(),
    },
  }
  if (!category.key || !category.label.fa || !category.label.en) {
    categoryNotice.value = { type: 'error', text: 'شناسه و عنوان فارسی و انگلیسی دسته‌بندی الزامی است.' }
    return
  }
  categoryBusy.value = true
  try {
    await journalApi.createCategory(category)
    await loadAdminCategories()
    categoryDraft.value = { key: '', label: localized('', '') }
    categoryNotice.value = { type: 'success', text: 'دسته‌بندی اضافه شد.' }
  } catch (createError) {
    categoryNotice.value = { type: 'error', text: createError.message }
  } finally {
    categoryBusy.value = false
  }
}

async function deleteCategory(category) {
  if (category.articleCount > 0) {
    categoryNotice.value = { type: 'error', text: 'دسته‌بندی دارای مقاله را نمی‌توان حذف کرد؛ ابتدا مقاله‌ها را به دسته دیگری منتقل کنید.' }
    return
  }
  if (!window.confirm(`دسته‌بندی «${category.label.fa || category.label.en}» حذف شود؟`)) return
  categoryBusy.value = true
  try {
    await journalApi.removeCategory(category.id)
    await loadAdminCategories()
    if (draft.value.category === category.key) draft.value.category = adminCategories.value[0]?.key || ''
    categoryNotice.value = { type: 'success', text: 'دسته‌بندی حذف شد.' }
  } catch (deleteError) {
    categoryNotice.value = { type: 'error', text: deleteError.message }
  } finally {
    categoryBusy.value = false
  }
}

async function login() {
  resetNotice()
  try {
    await journalApi.login(credentials.value)
    authenticated.value = true
    await Promise.all([loadAdminArticles(), loadAdminCategories()])
  } catch (loginError) {
    error.value = loginError.message
  }
}

function logout() {
  journalApi.logout()
  authenticated.value = false
  credentials.value.password = ''
  articles.value = []
}

function addSource() {
  draft.value.sources.push({ label: localized(), url: '' })
}

async function uploadImage(event) {
  const file = event.target.files?.[0]
  if (!file) return
  resetNotice()
  uploading.value = true
  try {
    const payload = await journalApi.upload(file)
    draft.value.image = payload.url
    draft.value.imageSrcset = ''
    message.value = 'تصویر بارگذاری شد.'
  } catch (uploadError) {
    error.value = uploadError.message
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

async function uploadInlineImage(file) {
  resetNotice()
  try {
    const payload = await journalApi.upload(file)
    return payload.url
  } catch (uploadError) {
    error.value = uploadError.message
    throw uploadError
  }
}

async function saveArticle() {
  resetNotice()
  if (!hasRichContent(draft.value.bodyHtml.fa) || !hasRichContent(draft.value.bodyHtml.en)) {
    bodyError.value = 'متن کامل مقاله در هر دو زبانه فارسی و انگلیسی الزامی است.'
    await nextTick()
    bodySection.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  saving.value = true
  try {
    const article = articlePayload()
    const payload = selectedId.value
      ? await journalApi.update(selectedId.value, article)
      : await journalApi.create(article)
    selectedId.value = payload.article.id
    await Promise.all([loadAdminArticles(), loadAdminCategories()])
    await loadArticles({ force: true })
    message.value = 'مقاله ذخیره شد.'
  } catch (saveError) {
    error.value = saveError.message
  } finally {
    saving.value = false
  }
}

async function deleteArticle() {
  if (!selectedArticle.value || !window.confirm(`مقاله «${selectedArticle.value.title.fa || selectedArticle.value.title.en}» حذف شود؟`)) return
  resetNotice()
  try {
    await journalApi.remove(selectedId.value)
    await Promise.all([loadAdminArticles(), loadAdminCategories()])
    await loadArticles({ force: true })
    startNew()
    message.value = 'مقاله حذف شد.'
  } catch (deleteError) {
    error.value = deleteError.message
  }
}

onMounted(async () => {
  if (journalApi.token) {
    try {
      await journalApi.me()
      authenticated.value = true
      await Promise.all([loadAdminArticles(), loadAdminCategories()])
    } catch {
      journalApi.logout()
    }
  }
  checkingSession.value = false
})
</script>

<template>
  <main class="admin" dir="rtl">
    <div v-if="checkingSession" class="admin-state">در حال بررسی ورود…</div>

    <section v-else-if="!authenticated" class="login-card">
      <RouterLink to="/" class="admin-brand">
        <span class="brand-mark" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c.5 2 1.6 3.4 3 4.4l-1.2.6c1.4 1.2 3 1.9 4.9 2l-.9 1.4c1.2.6 2.6.9 4.2.8-1 1.7-2.5 2.9-4.5 3.5.2.7.6 1.3 1.1 1.8-1.7.5-3.4.4-5-.3l-.6 5.8h-2l-.6-5.8c-1.6.7-3.3.8-5 .3.5-.5.9-1.1 1.1-1.8-2-.6-3.5-1.8-4.5-3.5 1.6.1 3-.2 4.2-.8L5.3 9c1.9-.1 3.5-.8 4.9-2L9 6.4c1.4-1 2.5-2.4 3-4.4z"/>
          </svg>
        </span>
        <span>پزشک‌افزار</span>
      </RouterLink>
      <div class="login-heading">
        <p class="kicker">پنل مدیریت</p>
        <h1>ورود به پنل ادمین</h1>
        <p class="login-lead">برای مدیریت محتوای سایت، اطلاعات حساب مدیر را وارد کنید.</p>
      </div>
      <form class="login-form" @submit.prevent="login">
        <label>
          <span>نام کاربری</span>
          <input v-model.trim="credentials.username" autocomplete="username" required />
        </label>
        <label>
          <span>رمز عبور</span>
          <input v-model="credentials.password" type="password" autocomplete="current-password" required />
        </label>
        <p v-if="error" class="notice notice--error">{{ error }}</p>
        <button class="primary-action" type="submit">ورود به پنل <span>←</span></button>
      </form>
      <RouterLink to="/" class="back-link">بازگشت به سایت</RouterLink>
    </section>

    <template v-else>
      <header class="admin-header">
        <RouterLink to="/" class="admin-brand">
          <span class="brand-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c.5 2 1.6 3.4 3 4.4l-1.2.6c1.4 1.2 3 1.9 4.9 2l-.9 1.4c1.2.6 2.6.9 4.2.8-1 1.7-2.5 2.9-4.5 3.5.2.7.6 1.3 1.1 1.8-1.7.5-3.4.4-5-.3l-.6 5.8h-2l-.6-5.8c-1.6.7-3.3.8-5 .3.5-.5.9-1.1 1.1-1.8-2-.6-3.5-1.8-4.5-3.5 1.6.1 3-.2 4.2-.8L5.3 9c1.9-.1 3.5-.8 4.9-2L9 6.4c1.4-1 2.5-2.4 3-4.4z"/>
            </svg>
          </span>
          <span>پزشک‌افزار</span>
        </RouterLink>
        <div class="header-copy"><span>پنل ادمین</span><strong>مدیریت محتوا</strong></div>
        <div class="header-actions">
          <RouterLink to="/journal" target="_blank">نمایش مجله ↗</RouterLink>
          <button type="button" @click="logout">خروج</button>
        </div>
      </header>

      <div class="admin-layout">
        <aside class="article-rail">
          <div class="rail-head">
            <div><span>مقاله‌ها</span><strong>{{ articles.length }}</strong></div>
            <button type="button" @click="startNew">+ مقاله تازه</button>
          </div>
          <div v-if="articles.length" class="article-list">
            <button
              v-for="article in articles"
              :key="article.id"
              type="button"
              :class="{ active: article.id === selectedId }"
              @click="editArticle(article)"
            >
              <span class="status-dot" :class="{ published: article.published }"></span>
              <span class="list-copy">
                <strong>{{ article.title.fa || article.title.en }}</strong>
                <small>{{ article.published ? 'منتشرشده' : 'پیش‌نویس' }} · {{ article.dateModified }}</small>
              </span>
            </button>
          </div>
          <p v-else class="rail-empty">هنوز مقاله‌ای در پایگاه داده نیست.</p>
        </aside>

        <form class="editor" @submit.prevent="saveArticle" @invalid.capture="showFieldRequirement" @input.capture="clearFieldRequirement">
          <div class="editor-topline">
            <div>
              <p class="kicker">{{ selectedId ? 'ویرایش مقاله' : 'مقاله تازه' }}</p>
              <h1>{{ draft.title.fa || draft.title.en || 'بدون عنوان' }}</h1>
            </div>
            <div class="editor-actions">
              <button class="new-article-action" type="button" @click="startNew">+ مقاله تازه</button>
            </div>
          </div>

          <section class="editor-card intro-card">
            <div class="field-grid field-grid--two">
              <label><span>عنوان فارسی</span><input v-model.trim="draft.title.fa" required /></label>
              <label class="field-en" dir="ltr"><span>English title</span><input v-model.trim="draft.title.en" required /></label>
            </div>
            <div class="field-grid field-grid--two">
              <label><span>خلاصه فارسی</span><textarea v-model.trim="draft.summary.fa" rows="4" required></textarea></label>
              <label class="field-en" dir="ltr"><span>English summary</span><textarea v-model.trim="draft.summary.en" rows="4" required></textarea></label>
            </div>
          </section>

          <section class="editor-card">
            <div class="card-heading"><span>هویت و انتشار</span><small>آدرس، دسته‌بندی و وضعیت نمایش</small></div>
            <div class="field-grid field-grid--three">
              <label class="field-en" dir="ltr"><span>Slug</span><input v-model.trim="draft.slug" pattern="[a-z0-9-]+" required /></label>
              <label><span>دسته‌بندی</span><select v-model="draft.category" required><option v-for="item in adminCategories" :key="item.key" :value="item.key">{{ item.label.fa }}</option></select></label>
              <label><span>زمان مطالعه</span><input v-model.number="draft.readingMinutes" type="number" min="1" max="120" required /></label>
              <label><span>تاریخ انتشار</span><input v-model="draft.datePublished" type="date" required /></label>
              <label><span>آخرین ویرایش</span><input v-model="draft.dateModified" type="date" required /></label>
            </div>
            <div class="switch-row">
              <label><input v-model="draft.published" type="checkbox" /><span>منتشر شود</span></label>
              <label><input v-model="draft.featured" type="checkbox" /><span>مقاله ویژه</span></label>
              <label><input v-model="draft.medical" type="checkbox" /><span>نمایش یادداشت پزشکی</span></label>
            </div>
          </section>

          <section class="editor-card category-card">
            <div class="card-heading"><span>دسته‌بندی‌های مجله</span><small>دسته‌های دارای مقاله منتشرشده خودکار در Journal دیده می‌شوند</small></div>
            <div class="category-create-grid">
              <label><span>عنوان فارسی</span><input v-model.trim="categoryDraft.label.fa" placeholder="مثلاً سلامت دیجیتال" /></label>
              <label class="field-en" dir="ltr"><span>English title</span><input v-model.trim="categoryDraft.label.en" placeholder="Digital Health" /></label>
              <label class="field-en" dir="ltr"><span>Identifier</span><input v-model.trim="categoryDraft.key" pattern="[A-Za-z][A-Za-z0-9-]*" placeholder="digitalHealth" /></label>
              <button class="category-add" type="button" :disabled="categoryBusy" @click="createCategory">+ افزودن دسته‌بندی</button>
            </div>
            <p class="category-help">شناسه با حرف انگلیسی شروع شود و فقط شامل حروف انگلیسی، عدد و خط تیره باشد.</p>
            <p v-if="categoryNotice.text" class="notice" :class="categoryNotice.type === 'error' ? 'notice--error' : 'notice--success'">{{ categoryNotice.text }}</p>
            <div class="category-list">
              <div v-for="category in adminCategories" :key="category.key" class="category-item">
                <div>
                  <strong>{{ category.label.fa }}</strong>
                  <small>{{ category.label.en }} · {{ category.articleCount || 0 }} مقاله</small>
                </div>
                <button
                  v-if="category.id"
                  type="button"
                  :disabled="categoryBusy || category.articleCount > 0"
                  :title="category.articleCount > 0 ? 'ابتدا مقاله‌های این دسته را منتقل کنید' : 'حذف دسته‌بندی'"
                  @click="deleteCategory(category)"
                >
                  حذف
                </button>
              </div>
            </div>
          </section>

          <section class="editor-card">
            <div class="card-heading"><span>تصویر مقاله</span><small>همان تصویر در Home و Journal دیده می‌شود</small></div>
            <div class="image-editor">
              <div class="image-preview"><img v-if="draft.image" :src="draft.image" alt="" /><span v-else>پیش‌نمایش تصویر</span></div>
              <div class="image-fields">
                <label><span>نشانی تصویر</span><input v-model.trim="draft.image" required /></label>
                <label class="upload-button"><input type="file" accept="image/png,image/jpeg,image/webp" @change="uploadImage" /><span>{{ uploading ? 'در حال بارگذاری…' : 'بارگذاری تصویر تازه — حداکثر ۴۰۰ کیلوبایت' }}</span></label>
                <div class="field-grid field-grid--two">
                  <label><span>توضیح فارسی تصویر</span><input v-model.trim="draft.alt.fa" required /></label>
                  <label class="field-en" dir="ltr"><span>English image description</span><input v-model.trim="draft.alt.en" required /></label>
                </div>
              </div>
            </div>
          </section>

          <section class="editor-card">
            <div class="card-heading"><span>نام نویسنده و بازبین</span><small>در سربرگ مقاله نمایش داده می‌شود</small></div>
            <div class="field-grid field-grid--two">
              <label><span>نویسنده فارسی</span><input v-model.trim="draft.author.fa" required /></label>
              <label class="field-en" dir="ltr"><span>English author</span><input v-model.trim="draft.author.en" required /></label>
              <label><span>بازبین فارسی</span><input v-model.trim="draft.reviewer.fa" /></label>
              <label class="field-en" dir="ltr"><span>English reviewer</span><input v-model.trim="draft.reviewer.en" /></label>
            </div>
          </section>

          <section ref="bodySection" class="editor-card body-card">
            <div class="card-heading">
              <span>بدنه مقاله <b class="required-mark" aria-label="الزامی">*</b></span>
              <small>ویرایشگر یکپارچه و ساختاریافته برای SEO</small>
            </div>
            <RichTextEditor
              :key="selectedId || 'new'"
              v-model="draft.bodyHtml"
              :upload-image="uploadInlineImage"
              :invalid="Boolean(bodyError)"
            />
            <p v-if="bodyError" class="field-error">{{ bodyError }}</p>
          </section>

          <section class="editor-card">
            <div class="card-heading"><span>منابع</span><button type="button" @click="addSource">+ افزودن منبع</button></div>
            <div v-for="(source, index) in draft.sources" :key="index" class="source-row">
              <input v-model.trim="source.label.fa" placeholder="عنوان فارسی" required />
              <input v-model.trim="source.label.en" class="field-en" dir="ltr" placeholder="English title" required />
              <input v-model.trim="source.url" class="field-en" dir="ltr" type="url" placeholder="https://…" required />
              <button type="button" @click="draft.sources.splice(index, 1)">×</button>
            </div>
          </section>

          <div class="editor-footer">
            <div class="footer-status" aria-live="polite">
              <p v-if="message" class="notice notice--success">{{ message }}</p>
              <p v-else-if="error" class="notice notice--error">{{ error }}</p>
              <span v-else>{{ draft.published ? 'پس از ذخیره، مقاله روی سایت دیده می‌شود.' : 'این مقاله به‌صورت پیش‌نویس ذخیره می‌شود.' }}</span>
            </div>
            <div class="footer-controls">
              <div class="footer-actions">
                <button v-if="selectedId" class="danger-action" type="button" @click="deleteArticle">حذف</button>
                <button class="primary-action" type="submit" :disabled="saving">{{ saving ? 'در حال ذخیره…' : 'ذخیره تغییرات' }}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </template>
  </main>
</template>

<style scoped>
.admin { min-height: 100vh; color: #17352a; background: #f5f6f2; font-family: 'FarsiFont', var(--font-body); }
.admin *, .admin *::before, .admin *::after { box-sizing: border-box; }
.admin-state { display: grid; min-height: 100vh; place-items: center; color: #66776f; }
.login-card {
  position: relative;
  width: min(100% - 2rem, 440px);
  margin: clamp(2rem, 10vh, 7rem) auto;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  overflow: hidden;
  background: #fff;
  border: 1px solid #dfe5df;
  border-radius: 20px;
  box-shadow: 0 24px 70px rgba(23, 53, 42, .09);
}
.login-card::before { content: ''; position: absolute; inset: 0 0 auto; height: 5px; background: #ff925c; }
.admin-brand { display: inline-flex; align-items: center; gap: .7rem; color: inherit; font-weight: 800; text-decoration: none; }
.brand-mark { display: inline-flex; width: 40px; height: 40px; align-items: center; justify-content: center; color: #ff925c; background: #002900; border-radius: 50%; box-shadow: 0 8px 20px -12px rgba(0,41,0,.65); }
.brand-mark svg { width: 20px; height: 20px; }
.login-heading { margin: 2.75rem 0 2rem; }
.kicker { margin: 0 0 .55rem; color: #b9542c; font-size: .76rem; font-weight: 800; }
.login-card h1 { margin: 0; font-size: clamp(1.75rem, 7vw, 2.25rem); font-weight: 900; line-height: 1.4; }
.login-lead { margin: .65rem 0 0; color: #66776f; font-size: .9rem; line-height: 1.85; }
.login-form { display: grid; gap: 1.1rem; }
label { display: grid; gap: .5rem; min-width: 0; color: #4d6259; font-size: .78rem; font-weight: 700; }
label:has(input[required], textarea[required], select[required]) > span::after { content: ' *'; color: #bd4939; }
.required-mark { color: #bd4939; }
input, textarea, select { width: 100%; color: #17352a; background: #fff; border: 1px solid #d6ded8; border-radius: 10px; padding: .82rem .9rem; font: inherit; font-size: .92rem; outline: none; transition: border-color .2s, box-shadow .2s; }
textarea { resize: vertical; line-height: 1.8; }
input:focus, textarea:focus, select:focus { border-color: #ff925c; box-shadow: 0 0 0 3px rgba(255,146,92,.18); }
input:user-invalid, textarea:user-invalid, select:user-invalid { border-color: #c64c3c; background: #fff9f7; box-shadow: 0 0 0 3px rgba(198,76,60,.1); }
.primary-action { display: inline-flex; align-items: center; justify-content: center; gap: .7rem; min-height: 46px; padding: .7rem 1.2rem; color: #fff; background: #17352a; border: 0; border-radius: 10px; font: inherit; font-weight: 800; cursor: pointer; transition: background .2s, transform .2s; }
.primary-action:hover { background: #244b3c; transform: translateY(-1px); }
.primary-action:disabled { opacity: .55; cursor: wait; }
.login-form .primary-action { width: 100%; margin-top: .5rem; }
.back-link { display: block; width: fit-content; margin: 1.5rem auto 0; color: #66776f; font-size: .82rem; text-underline-offset: 4px; }
.notice { padding: .8rem 1rem; border-radius: 10px; font-size: .85rem; }
.notice--error { color: #862e23; background: #ffe5dc; }
.notice--success { color: #1c5e3e; background: #dff1e3; }
.admin-header { position: sticky; top: 0; z-index: 20; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; min-height: 70px; padding: .75rem clamp(1rem, 3vw, 2rem); color: #17352a; background: rgba(255,255,255,.96); border-bottom: 1px solid #dfe5df; backdrop-filter: blur(12px); }
.admin-header .brand-mark { width: 36px; height: 36px; }
.header-copy { display: grid; text-align: center; }
.header-copy span { color: #b9542c; font-size: .7rem; }
.header-copy strong { font-size: .95rem; }
.header-actions { display: flex; justify-content: flex-end; gap: .6rem; }
.header-actions a, .header-actions button { padding: .55rem .8rem; color: #40584e; background: #fff; border: 1px solid #d6ded8; border-radius: 9px; font: inherit; font-size: .76rem; text-decoration: none; cursor: pointer; }
.header-actions a:hover, .header-actions button:hover { color: #17352a; border-color: #ff925c; }
.admin-layout { display: grid; grid-template-columns: 280px minmax(0, 1fr); max-width: 1500px; margin: 0 auto; }
.article-rail { position: sticky; top: 70px; align-self: start; height: calc(100vh - 70px); padding: 1.5rem 1rem; background: #fff; border-left: 1px solid #dfe5df; overflow-y: auto; }
.rail-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0 .5rem 1.3rem; }
.rail-head div { display: flex; align-items: baseline; gap: .5rem; }
.rail-head span { font-weight: 800; }
.rail-head strong { color: #b9542c; font-size: .76rem; }
.rail-head button, .card-heading button { color: #1c5e3e; background: transparent; border: 0; font: inherit; font-size: .78rem; font-weight: 800; cursor: pointer; }
.article-list { display: grid; gap: .5rem; }
.article-list > button { display: grid; grid-template-columns: 9px 1fr; gap: .7rem; width: 100%; padding: .9rem; text-align: right; color: inherit; background: transparent; border: 1px solid transparent; border-radius: 10px; font: inherit; cursor: pointer; }
.article-list > button:hover, .article-list > button.active { background: #f5f6f2; border-color: #dfe5df; }
.status-dot { width: 8px; height: 8px; margin-top: .35rem; background: #c5bdb0; border-radius: 50%; }
.status-dot.published { background: #3e9767; box-shadow: 0 0 0 4px rgba(62,151,103,.12); }
.list-copy { display: grid; gap: .35rem; }
.list-copy strong { font-size: .86rem; line-height: 1.6; }
.list-copy small, .rail-empty { color: #75877d; font-size: .7rem; }
.rail-empty { padding: 2rem .8rem; line-height: 1.8; }
.editor { width: min(100%, 1080px); padding: clamp(1.5rem, 4vw, 3rem); }
.editor-topline { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; margin-bottom: 2rem; }
.editor-topline .kicker { margin: 0 0 .4rem; }
.editor-topline h1 { max-width: 20ch; margin: 0; font-size: clamp(1.8rem, 4vw, 3.2rem); line-height: 1.3; }
.editor-actions { display: flex; gap: .7rem; flex-shrink: 0; }
.new-article-action { min-height: 42px; padding: .65rem 1rem; color: #17352a; background: #fff; border: 1px solid #cfd9d2; border-radius: 10px; font: inherit; font-weight: 800; cursor: pointer; }
.new-article-action:hover { border-color: #ff925c; }
.danger-action { padding: .7rem 1rem; color: #9b3d2e; background: #fff; border: 1px solid #e4c7c0; border-radius: 10px; font: inherit; font-weight: 800; cursor: pointer; }
.editor-card { display: grid; gap: 1.35rem; margin: 1rem 0; padding: clamp(1.25rem, 3vw, 1.75rem); background: #fff; border: 1px solid #dfe5df; border-radius: 14px; box-shadow: 0 8px 30px rgba(23,53,42,.035); }
.intro-card { border-top: 3px solid #ff925c; }
.card-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(6,45,28,.1); }
.card-heading > span { font-size: 1.05rem; font-weight: 900; }
.card-heading small { margin-inline-start: auto; color: #75877d; }
.field-grid { display: grid; gap: 1rem; }
.field-grid--two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.field-grid--three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.field-en { text-align: left; }
.switch-row { display: flex; flex-wrap: wrap; gap: 1.5rem; padding-top: .5rem; }
.switch-row label { display: flex; align-items: center; gap: .6rem; color: #173e2d; }
.switch-row input { width: 18px; height: 18px; accent-color: #1c5e3e; }
.category-create-grid { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: .8rem; align-items: end; }
.category-add { min-height: 43px; padding: .65rem 1rem; color: #fff; background: #315f49; border: 0; border-radius: 10px; font: inherit; font-size: .78rem; font-weight: 800; white-space: nowrap; cursor: pointer; }
.category-add:disabled { opacity: .55; cursor: wait; }
.category-help { margin: -.45rem 0 0; color: #75877d; font-size: .7rem; }
.category-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .65rem; }
.category-item { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .8rem .9rem; background: #f7f8f5; border: 1px solid #e0e6e1; border-radius: 10px; }
.category-item div { display: grid; gap: .25rem; }
.category-item strong { font-size: .82rem; }
.category-item small { color: #75877d; font-size: .66rem; }
.category-item button { color: #9b3d2e; background: transparent; border: 0; font: inherit; font-size: .72rem; font-weight: 800; cursor: pointer; }
.category-item button:disabled { color: #98a49e; cursor: not-allowed; }
.image-editor { display: grid; grid-template-columns: 240px 1fr; gap: 1.3rem; }
.image-preview { overflow: hidden; display: grid; min-height: 190px; place-items: center; color: #75877d; background: #edf0eb; border-radius: 12px; }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }
.image-fields { display: grid; align-content: start; gap: 1rem; }
.upload-button input { position: absolute; opacity: 0; pointer-events: none; }
.upload-button span { width: fit-content; padding: .65rem 1rem; color: #1c5e3e; border: 1px dashed #65a17c; border-radius: 999px; cursor: pointer; }
.body-card { scroll-margin-top: 90px; }
.field-error { margin: -.35rem 0 0; color: #a33c30; font-size: .78rem; font-weight: 700; }
.source-row button { color: #9b3d2e; background: transparent; border: 0; cursor: pointer; }
.source-row { display: grid; grid-template-columns: 1fr 1fr 1.35fr auto; gap: .7rem; align-items: center; }
.editor-footer { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; padding: 1.4rem .25rem 4rem; color: #547060; font-size: .82rem; }
.footer-status { min-height: 46px; display: flex; align-items: center; }
.footer-status .notice { margin: 0; }
.footer-controls { display: grid; justify-items: end; gap: .75rem; min-width: min(100%, 290px); }
.footer-actions { display: flex; direction: rtl; justify-content: flex-end; gap: .65rem; }
@media (max-width: 960px) {
  .admin-layout { grid-template-columns: 1fr; }
  .article-rail { position: static; height: auto; border-left: 0; border-bottom: 1px solid rgba(6,45,28,.12); }
  .article-list { grid-template-columns: repeat(3, minmax(220px, 1fr)); overflow-x: auto; }
  .field-grid--three { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .category-create-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 680px) {
  .admin-header { grid-template-columns: 1fr auto; }
  .header-copy { display: none; }
  .header-actions a { display: none; }
  .editor { padding: 1.25rem; }
  .editor-topline { align-items: stretch; flex-direction: column; }
  .editor-actions { justify-content: space-between; }
  .field-grid--two, .field-grid--three, .category-create-grid, .category-list, .image-editor, .source-row { grid-template-columns: 1fr; }
  .image-preview { min-height: 230px; }
  .card-heading { align-items: flex-start; flex-direction: column; }
  .card-heading small { margin: 0; }
  .editor-footer { align-items: stretch; flex-direction: column; }
  .footer-status { min-height: 0; }
  .footer-status .notice { width: 100%; }
  .footer-controls { width: 100%; min-width: 0; justify-items: stretch; }
  .footer-actions { justify-content: stretch; }
  .footer-actions > * { flex: 1; }
}
</style>
