<script setup>
import { nextTick, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ fa: '', en: '' }),
  },
  uploadImage: {
    type: Function,
    required: true,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
const activeLocale = ref('fa')
const editor = ref(null)
const fileInput = ref(null)
const uploading = ref(false)
let savedRange = null

const localeMeta = {
  fa: { label: 'فارسی', direction: 'rtl', placeholder: 'متن کامل فارسی مقاله را اینجا بنویسید…' },
  en: { label: 'English', direction: 'ltr', placeholder: 'Write the complete English article here…' },
}

function currentHtml() {
  return props.modelValue?.[activeLocale.value] || ''
}

function updateValue(html) {
  emit('update:modelValue', {
    fa: props.modelValue?.fa || '',
    en: props.modelValue?.en || '',
    [activeLocale.value]: html,
  })
}

function onInput() {
  updateValue(editor.value?.innerHTML || '')
}

function switchLocale(locale) {
  if (editor.value) onInput()
  activeLocale.value = locale
  savedRange = null
  nextTick(() => editor.value?.focus())
}

function rememberSelection() {
  const selection = window.getSelection()
  if (selection?.rangeCount && editor.value?.contains(selection.anchorNode)) {
    savedRange = selection.getRangeAt(0).cloneRange()
  }
}

function restoreSelection() {
  editor.value?.focus()
  if (!savedRange) return
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(savedRange)
}

function runCommand(command, value = null) {
  restoreSelection()
  document.execCommand(command, false, value)
  rememberSelection()
  onInput()
}

function changeBlock(event) {
  const value = event.target.value
  if (value) runCommand('formatBlock', value)
  event.target.value = ''
}

function addLink() {
  rememberSelection()
  const url = window.prompt('نشانی کامل لینک را وارد کنید:', 'https://')
  if (!url) return
  runCommand('createLink', url)
  const selection = window.getSelection()
  const anchor = selection?.anchorNode?.parentElement?.closest('a')
  if (anchor) {
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    onInput()
  }
}

function chooseImage() {
  rememberSelection()
  fileInput.value?.click()
}

async function insertImage(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const alt = window.prompt('توضیح کوتاه و دقیق تصویر برای دسترس‌پذیری و SEO:', '') ?? ''
  uploading.value = true
  try {
    const url = await props.uploadImage(file)
    restoreSelection()
    document.execCommand('insertImage', false, url)
    const images = editor.value?.querySelectorAll('img')
    const image = images?.[images.length - 1]
    if (image) {
      image.alt = alt.trim()
      image.loading = 'lazy'
    }
    onInput()
  } catch {
    // The parent surface shows the localized upload error.
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}
</script>

<template>
  <div class="rich-editor" :class="{ 'is-invalid': invalid }">
    <div class="editor-language" role="tablist" aria-label="زبان متن مقاله">
      <button
        v-for="locale in ['fa', 'en']"
        :key="locale"
        type="button"
        role="tab"
        :aria-selected="activeLocale === locale"
        :class="{ active: activeLocale === locale }"
        @click="switchLocale(locale)"
      >
        {{ localeMeta[locale].label }}
      </button>
    </div>

    <div class="editor-toolbar" role="toolbar" aria-label="ابزارهای ویرایش متن" @mouseup="rememberSelection">
      <select aria-label="ساختار متن" @change="changeBlock">
        <option value="">ساختار متن</option>
        <option value="p">پاراگراف</option>
        <option value="h2">تیتر بخش — H2</option>
        <option value="h3">زیرتیتر — H3</option>
        <option value="blockquote">نقل‌قول</option>
      </select>
      <span class="toolbar-separator" aria-hidden="true"></span>
      <button type="button" title="پررنگ" aria-label="پررنگ" @mousedown.prevent="runCommand('bold')"><strong>B</strong></button>
      <button type="button" title="مورب" aria-label="مورب" @mousedown.prevent="runCommand('italic')"><em>I</em></button>
      <button type="button" title="فهرست نشانه‌دار" aria-label="فهرست نشانه‌دار" @mousedown.prevent="runCommand('insertUnorderedList')">• فهرست</button>
      <button type="button" title="فهرست شماره‌دار" aria-label="فهرست شماره‌دار" @mousedown.prevent="runCommand('insertOrderedList')">۱. فهرست</button>
      <button type="button" title="افزودن لینک" aria-label="افزودن لینک" @mousedown.prevent="addLink">لینک</button>
      <button type="button" title="حذف لینک" aria-label="حذف لینک" @mousedown.prevent="runCommand('unlink')">حذف لینک</button>
      <button type="button" :disabled="uploading" title="قرار دادن تصویر" aria-label="قرار دادن تصویر" @mousedown.prevent="chooseImage">
        {{ uploading ? 'در حال بارگذاری…' : 'تصویر' }}
      </button>
      <input ref="fileInput" class="hidden-file" type="file" accept="image/png,image/jpeg,image/webp" @change="insertImage" />
    </div>

    <div
      :key="activeLocale"
      ref="editor"
      class="editor-canvas"
      :dir="localeMeta[activeLocale].direction"
      :data-placeholder="localeMeta[activeLocale].placeholder"
      contenteditable="true"
      spellcheck="true"
      role="textbox"
      aria-multiline="true"
      :aria-invalid="invalid"
      @input="onInput"
      @keyup="rememberSelection"
      @mouseup="rememberSelection"
      v-html="currentHtml()"
    ></div>

    <div class="editor-help">
      <span>عنوان اصلی مقاله H1 است؛ در متن از H2 و H3 استفاده کنید.</span>
      <span>{{ activeLocale === 'fa' ? 'در حال ویرایش نسخه فارسی' : 'Editing English version' }}</span>
    </div>
  </div>
</template>

<style scoped>
.rich-editor { overflow: hidden; border: 1px solid #d6ded8; border-radius: 12px; background: #fff; transition: border-color .2s, box-shadow .2s; }
.rich-editor:focus-within { border-color: #ff925c; box-shadow: 0 0 0 3px rgba(255,146,92,.14); }
.rich-editor.is-invalid { border-color: #c64c3c; box-shadow: 0 0 0 3px rgba(198,76,60,.12); }
.editor-language { display: flex; gap: .25rem; padding: .55rem .65rem 0; background: #f5f6f2; border-bottom: 1px solid #dfe5df; }
.editor-language button { min-width: 82px; padding: .6rem .85rem; color: #63746c; background: transparent; border: 0; border-radius: 9px 9px 0 0; font: inherit; font-size: .8rem; font-weight: 800; cursor: pointer; }
.editor-language button.active { color: #17352a; background: #fff; box-shadow: 0 -1px 0 #dfe5df, 1px 0 0 #dfe5df, -1px 0 0 #dfe5df; }
.editor-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: .35rem; padding: .65rem; background: #fff; border-bottom: 1px solid #e3e8e3; }
.editor-toolbar button, .editor-toolbar select { width: auto; min-height: 34px; padding: .38rem .65rem; color: #40584e; background: #f7f8f5; border: 1px solid #dfe5df; border-radius: 7px; font: inherit; font-size: .73rem; font-weight: 750; cursor: pointer; }
.editor-toolbar button:hover, .editor-toolbar select:hover { color: #17352a; border-color: #ff925c; }
.editor-toolbar button:disabled { opacity: .55; cursor: wait; }
.toolbar-separator { width: 1px; height: 24px; margin-inline: .2rem; background: #dfe5df; }
.hidden-file { display: none; }
.editor-canvas { min-height: 440px; padding: clamp(1.25rem, 3vw, 2rem); color: #17352a; font-size: 1rem; line-height: 2; outline: none; }
.editor-canvas:empty::before { content: attr(data-placeholder); color: #91a098; pointer-events: none; }
.editor-canvas :deep(h2) { margin: 2rem 0 .8rem; font-size: 1.65rem; line-height: 1.5; }
.editor-canvas :deep(h3) { margin: 1.6rem 0 .65rem; font-size: 1.25rem; line-height: 1.6; }
.editor-canvas :deep(p) { margin: 0 0 1rem; }
.editor-canvas :deep(ul), .editor-canvas :deep(ol) { padding-inline-start: 1.6rem; }
.editor-canvas :deep(blockquote) { margin: 1.5rem 0; padding: .7rem 1rem; color: #4d6259; background: #f5f6f2; border-inline-start: 4px solid #ff925c; }
.editor-canvas :deep(a) { color: #b9542c; text-underline-offset: 3px; }
.editor-canvas :deep(img) { display: block; max-width: 100%; height: auto; margin: 1.5rem auto; border-radius: 10px; }
.editor-help { display: flex; justify-content: space-between; gap: 1rem; padding: .65rem .85rem; color: #75877d; background: #f8f9f6; border-top: 1px solid #e3e8e3; font-size: .68rem; line-height: 1.6; }
@media (max-width: 680px) {
  .editor-canvas { min-height: 360px; }
  .editor-help { flex-direction: column; gap: .2rem; }
  .toolbar-separator { display: none; }
}
</style>
