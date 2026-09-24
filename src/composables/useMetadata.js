import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getProductById } from '../data/products.js'
import { useJournal } from './useJournal.js'
import { localize } from '../utils/localized.js'

const SOCIAL_IMAGE_PATH = '/images/og/pezeshk-afzar-social.jpg'
const ROBOTS_DIRECTIVE = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

function compactDescription(value, maxLength = 160) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text

  const shortened = text.slice(0, maxLength - 1)
  const lastSpace = shortened.lastIndexOf(' ')
  return `${shortened.slice(0, Math.max(lastSpace, 100))}…`
}

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function removeMeta(attribute, key) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove()
}

function updateArticleJsonLd(article, category, language, canonicalUrl, socialImageUrl, brand) {
  let script = document.head.querySelector('#article-json-ld')

  if (!article) {
    script?.remove()
    return
  }

  if (!script) {
    script = document.createElement('script')
    script.id = 'article-json-ld'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: localize(article.title, language),
    description: compactDescription(localize(article.summary, language)),
    image: [socialImageUrl],
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: language,
    articleSection: localize(category?.label, language),
    mainEntityOfPage: canonicalUrl,
    author: { '@type': 'Organization', name: localize(article.author, language) },
    publisher: { '@type': 'Organization', name: brand },
  })
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

function getSiteOrigin() {
  const configuredOrigin = String(import.meta.env.VITE_SITE_URL ?? '').trim()
  const origin = configuredOrigin || window.location.origin
  return origin.endsWith('/') ? origin : `${origin}/`
}

export function useMetadata() {
  const route = useRoute()
  const { t, locale } = useI18n()
  const { articles, categories, getArticle, getCategory, loadArticles } = useJournal()
  loadArticles()

  const updateMetadata = () => {
    const language = locale.value === 'fa' ? 'fa' : 'en'
    const seoKey = route.meta.seoKey ?? 'home'
    const product = seoKey === 'product' ? getProductById(route.params.id) : null
    const article = seoKey === 'journalArticle' ? getArticle(route.params.slug) : null

    const title = article
      ? `${localize(article.title, language)} — ${t('brand')}`
      : product
        ? (localize(product.seo?.title, language) || t('meta.productTitle', { product: localize(product.name, language) }))
        : t(`meta.pages.${seoKey}.title`)

    const description = compactDescription(
      article
        ? localize(article.summary, language)
        : product
          ? (localize(product.seo?.description, language) || `${localize(product.tagline, language)} ${localize(product.description, language)}`)
          : t(`meta.pages.${seoKey}.description`),
    )

    const siteOrigin = getSiteOrigin()
    const canonicalUrl = new URL(route.path, siteOrigin).href
    const socialImageUrl = new URL(article?.image ?? product?.socialImage ?? SOCIAL_IMAGE_PATH, siteOrigin).href
    const socialImageAlt = article
      ? localize(article.alt, language)
      : product?.galleryAlt
        ? (product.galleryAlt[language]?.[0] ?? product.galleryAlt.en?.[0] ?? t('meta.socialImageAlt'))
        : t('meta.socialImageAlt')
    const openGraphLocale = language === 'fa' ? 'fa_IR' : 'en_US'
    const alternateLocale = language === 'fa' ? 'en_US' : 'fa_IR'
    const direction = language === 'fa' ? 'rtl' : 'ltr'

    document.title = title
    document.documentElement.setAttribute('lang', language)
    document.documentElement.setAttribute('dir', direction)

    upsertLink('canonical', canonicalUrl)

    upsertMeta('name', 'description', description)
    const robotsDirective = route.meta.admin ? 'noindex, nofollow' : ROBOTS_DIRECTIVE
    upsertMeta('name', 'robots', robotsDirective)
    upsertMeta('name', 'googlebot', robotsDirective)
    upsertMeta('name', 'application-name', t('brand'))
    upsertMeta('name', 'apple-mobile-web-app-title', t('brand'))

    upsertMeta('property', 'og:type', article ? 'article' : 'website')
    upsertMeta('property', 'og:site_name', t('brand'))
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:image', socialImageUrl)
    upsertMeta('property', 'og:image:secure_url', socialImageUrl)
    upsertMeta('property', 'og:image:alt', socialImageAlt)
    upsertMeta('property', 'og:locale', openGraphLocale)
    upsertMeta('property', 'og:locale:alternate', alternateLocale)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', socialImageUrl)
    upsertMeta('name', 'twitter:image:alt', socialImageAlt)

    if (article) {
      upsertMeta('property', 'article:published_time', article.datePublished)
      upsertMeta('property', 'article:modified_time', article.dateModified)
      upsertMeta('property', 'article:author', localize(article.author, language))
      upsertMeta('property', 'article:section', localize(getCategory(article.category)?.label, language))
    } else {
      ;['article:published_time', 'article:modified_time', 'article:author', 'article:section']
        .forEach((key) => removeMeta('property', key))
    }

    updateArticleJsonLd(article, article ? getCategory(article.category) : null, language, canonicalUrl, socialImageUrl, t('brand'))
  }

  watch(
    [() => route.fullPath, locale, articles, categories],
    updateMetadata,
    { immediate: true },
  )
}
