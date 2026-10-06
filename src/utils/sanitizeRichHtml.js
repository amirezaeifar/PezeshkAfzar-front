export function safeContentUrl(value, { image = false } = {}) {
  const url = String(value || '').trim()
  if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) return url
  if (!image && url.startsWith('#')) return url
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol) ? url : ''
  } catch {
    return ''
  }
}

export function sanitizeRichHtml(html = '') {
  const template = document.createElement('template')
  template.innerHTML = String(html || '')
  const allowedTags = new Set(['P', 'H2', 'H3', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'A', 'IMG', 'BLOCKQUOTE', 'BR'])
  const allowedAttributes = {
    A: new Set(['href', 'target', 'rel']),
    IMG: new Set(['src', 'alt', 'loading', 'width', 'height']),
    H2: new Set(['id']),
    H3: new Set(['id']),
  }

  template.content.querySelectorAll('script, style, iframe, object, embed, svg, math, form, input, textarea, template, link, meta, base').forEach((node) => node.remove())
  ;[...template.content.querySelectorAll('*')].forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...element.childNodes)
      return
    }
    const allowed = allowedAttributes[element.tagName] || new Set()
    ;[...element.attributes].forEach((attribute) => {
      if (!allowed.has(attribute.name)) element.removeAttribute(attribute.name)
    })
    if (element.tagName === 'A') {
      const href = safeContentUrl(element.getAttribute('href'))
      if (!href) element.removeAttribute('href')
      else element.setAttribute('href', href)
      element.setAttribute('rel', 'noopener noreferrer')
      if (/^https?:/i.test(href)) element.setAttribute('target', '_blank')
      else element.removeAttribute('target')
    }
    if (element.tagName === 'IMG') {
      const src = safeContentUrl(element.getAttribute('src'), { image: true })
      if (!src) element.remove()
      else {
        element.setAttribute('src', src)
        element.setAttribute('loading', 'lazy')
      }
    }
  })
  return template.innerHTML
}
