import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('../views/HomeView.vue'), meta: { seoKey: 'home' } },
    { path: '/products', name: 'Products', component: () => import('../views/ProductsView.vue'), meta: { seoKey: 'products' } },
    { path: '/products/:id', name: 'ProductDetail', component: () => import('../views/ProductDetailView.vue'), props: true, meta: { seoKey: 'product' } },
    { path: '/life-in-motion', name: 'LifeInMotion', component: () => import('../views/LifeInMotionView.vue'), meta: { seoKey: 'lifeInMotion' } },
    { path: '/about', name: 'About', component: () => import('../views/AboutView.vue'), meta: { seoKey: 'about' } },
    { path: '/contact', name: 'Contact', component: () => import('../views/ContactView.vue'), meta: { seoKey: 'contact' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
