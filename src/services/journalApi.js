const API_BASE = String(import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const TOKEN_KEY = 'pezeshk-afzar-admin-token'
const MAX_IMAGE_BYTES = 400 * 1024

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = localStorage.getItem(TOKEN_KEY)

  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem(TOKEN_KEY)
    throw new Error(payload.message || 'ارتباط با سرور انجام نشد.')
  }

  return payload
}

export const journalApi = {
  get token() { return localStorage.getItem(TOKEN_KEY) },
  async login(credentials) {
    const payload = await request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
    localStorage.setItem(TOKEN_KEY, payload.token)
    return payload.user
  },
  logout() { localStorage.removeItem(TOKEN_KEY) },
  me() { return request('/auth/me') },
  listPublic() { return request('/articles') },
  listCategories() { return request('/categories') },
  getPublic(slug) { return request(`/articles/${encodeURIComponent(slug)}`) },
  listAdmin() { return request('/admin/articles') },
  listAdminCategories() { return request('/admin/categories') },
  createCategory(category) { return request('/admin/categories', { method: 'POST', body: JSON.stringify(category) }) },
  removeCategory(id) { return request(`/admin/categories/${id}`, { method: 'DELETE' }) },
  create(article) { return request('/admin/articles', { method: 'POST', body: JSON.stringify(article) }) },
  update(id, article) { return request(`/admin/articles/${id}`, { method: 'PUT', body: JSON.stringify(article) }) },
  remove(id) { return request(`/admin/articles/${id}`, { method: 'DELETE' }) },
  upload(file) {
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error('حجم تصویر نباید بیشتر از ۴۰۰ کیلوبایت باشد.')
    }
    const body = new FormData()
    body.append('image', file)
    return request('/admin/uploads', { method: 'POST', body })
  },
}
