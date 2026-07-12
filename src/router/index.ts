import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store'

Vue.use(VueRouter)

function firstQueryValue(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : ''
  return typeof value === 'string' ? value : ''
}

function normalizeRedirect(value: unknown): string {
  const redirect = firstQueryValue(value)
  if (!redirect.startsWith('/')) return ''
  if (redirect.startsWith('//')) return ''
  if (redirect === '/login' || redirect.startsWith('/login?')) return ''
  if (redirect === '/register' || redirect.startsWith('/register?')) return ''
  return redirect
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/products',
    name: 'products',
    component: () => import(/* webpackChunkName: "products" */ '../views/ProductListView.vue')
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import(/* webpackChunkName: "product-detail" */ '../views/ProductDetailView.vue')
  },
  { path: '/combo/:id', redirect: '/products' },
  {
    path: '/event/:eventId/bundles/:id',
    name: 'event-bundle-builder',
    component: () => import(/* webpackChunkName: "bundle-builder" */ '../views/BundleBuilderView.vue')
  },
  {
    path: '/bundles/:id',
    name: 'bundle-builder',
    component: () => import(/* webpackChunkName: "bundle-builder" */ '../views/BundleBuilderView.vue')
  },
  {
    path: '/event/op-exchange',
    name: 'event-op-exchange',
    component: () => import(/* webpackChunkName: "event" */ '../views/OPExchangeView.vue')
  },
  {
    path: '/event/:id',
    name: 'event',
    component: () => import(/* webpackChunkName: "event" */ '../views/EventView.vue')
  },
  {
    path: '/events',
    redirect: '/event/SUMMER2026'
  },
  {
    path: '/op-exchange',
    name: 'op-exchange',
    component: () => import(/* webpackChunkName: "account" */ '../views/OPExchangeView.vue')
  },
  {
    path: '/category/:root/:middle?/:leaf?',
    name: 'category',
    component: () => import(/* webpackChunkName: "products" */ '../views/ProductListView.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "products" */ '../views/SearchView.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import(/* webpackChunkName: "cart" */ '../views/CartView.vue')
  },
  {
    path: '/checkout',
    name: 'checkout',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "checkout" */ '../views/CheckoutView.vue')
  },
  {
    path: '/order-complete',
    name: 'order-complete',
    meta: { requiresOrderQuery: true },
    component: () => import(/* webpackChunkName: "order-complete" */ '../views/OrderCompleteView.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: { guestOnly: true },
    component: () => import(/* webpackChunkName: "auth" */ '../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: { guestOnly: true },
    component: () => import(/* webpackChunkName: "auth" */ '../views/RegisterView.vue')
  },
  {
    path: '/register-agreement',
    name: 'register-agreement',
    meta: { guestOnly: true },
    component: () => import(/* webpackChunkName: "auth" */ '../views/RegisterAgreement.vue')
  },
  {
    path: '/register-profile',
    name: 'register-profile',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "auth" */ '../views/RegisterProfileView.vue')
  },
  {
    path: '/register-success',
    name: 'register-success',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "auth" */ '../views/RegisterSuccess.vue')
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    redirect: '/login'
  },
  {
    path: '/account',
    alias: '/account/overview',
    name: 'account',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "account" */ '../views/account/AccountView.vue')
  },
  {
    path: '/account/addresses',
    alias: '/account/address',
    name: 'address-list',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "account" */ '../views/account/AddressView.vue')
  },
  {
    path: '/account/coupons',
    name: 'coupon-list',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "account" */ '../views/account/CouponView.vue')
  },
  {
    path: '/account/orders',
    name: 'order-list',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "account" */ '../views/account/OrderListView.vue')
  },
  {
    path: '/account/notifications',
    name: 'notification-center',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "account" */ '../views/account/NotificationCenterView.vue')
  },
  {
    path: '/account/orders/:id',
    name: 'order-detail',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "account" */ '../views/account/OrderDetailView.vue')
  },
  {
    path: '/account/credits',
    alias: ['/account/wallet', '/account/bonus'],
    name: 'wallet',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "account" */ '../views/account/WalletView.vue')
  },
  {
    path: '/account/profile',
    name: 'profile',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "account" */ '../views/account/ProfileView.vue')
  },
  {
    path: '/account/password',
    name: 'password',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "account" */ '../views/account/ProfileView.vue')
  },
  {
    path: '/account/wishlist',
    name: 'wishlist',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "account" */ '../views/account/WishlistView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "static" */ '../views/AboutView.vue')
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import(/* webpackChunkName: "static" */ '../views/FaqView.vue')
  },
  {
    path: '/shopping-guide',
    name: 'shopping-guide',
    component: () => import(/* webpackChunkName: "static" */ '../views/ShoppingGuideView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import(/* webpackChunkName: "static" */ '../views/ContactView.vue')
  },
  {
    path: '/stores',
    name: 'stores',
    component: () => import(/* webpackChunkName: "static" */ '../views/StoresView.vue')
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import(/* webpackChunkName: "static" */ '../views/PrivacyView.vue')
  },
  {
    path: '/member-terms',
    name: 'member-terms',
    component: () => import(/* webpackChunkName: "static" */ '../views/MemberTermsView.vue')
  },
  {
    path: '/news',
    name: 'news-list',
    component: () => import(/* webpackChunkName: "news" */ '../views/NewsListView.vue')
  },
  {
    path: '/news/:id',
    name: 'news-detail',
    component: () => import(/* webpackChunkName: "news" */ '../views/NewsDetailView.vue')
  },
  { path: '/content-center', redirect: '/' },
  { path: '/health-journal', redirect: '/' },
  { path: '/gift-catalog', redirect: '/' },
  {
    path: '/recipes',
    name: 'recipes',
    component: () => import(/* webpackChunkName: "static" */ '../views/RecipeView.vue')
  },
  {
    path: '/inspections',
    alias: '/inspection',
    name: 'inspection-list',
    component: () => import(/* webpackChunkName: "inspections" */ '../views/InspectionListView.vue')
  },
  {
    path: '/inspections/:id',
    alias: '/inspection/:id',
    redirect: '/inspections'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn']
  const redirect = normalizeRedirect(to.query.redirect)

  if (to.matched.some((record) => record.meta.requiresOrderQuery) && !to.query.orderNumber) {
    next({ name: 'cart' })
    return
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.matched.some((record) => record.meta.guestOnly) && isLoggedIn) {
    next(redirect || { name: 'account' })
    return
  }

  next()
})

export default router
