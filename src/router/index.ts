import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/layout-preview',
    name: 'layout-preview',
    component: () => import(/* webpackChunkName: "static" */ '../views/LayoutPreviewView.vue')
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
  {
    path: '/combo/:id',
    name: 'combo-detail',
    component: () => import(/* webpackChunkName: "product-detail" */ '../views/ComboProductView.vue')
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
    path: '/category/:categoryId',
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
    component: () => import(/* webpackChunkName: "checkout" */ '../views/CheckoutView.vue')
  },
  {
    path: '/order-complete',
    name: 'order-complete',
    component: () => import(/* webpackChunkName: "order-complete" */ '../views/OrderCompleteView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "auth" */ '../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "auth" */ '../views/RegisterView.vue')
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    redirect: '/login'
  },
  {
    path: '/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "account" */ '../views/account/AccountView.vue')
  },
  {
    path: '/account/addresses',
    alias: '/account/address',
    name: 'address-list',
    component: () => import(/* webpackChunkName: "account" */ '../views/account/AddressView.vue')
  },
  {
    path: '/account/coupons',
    name: 'coupon-list',
    component: () => import(/* webpackChunkName: "account" */ '../views/account/CouponView.vue')
  },
  {
    path: '/account/orders',
    name: 'order-list',
    component: () => import(/* webpackChunkName: "account" */ '../views/account/OrderListView.vue')
  },
  {
    path: '/account/orders/:id',
    name: 'order-detail',
    component: () => import(/* webpackChunkName: "account" */ '../views/account/OrderDetailView.vue')
  },
  {
    path: '/account/credits',
    alias: '/account/wallet',
    name: 'wallet',
    component: () => import(/* webpackChunkName: "account" */ '../views/account/WalletView.vue')
  },
  {
    path: '/account/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "account" */ '../views/account/ProfileView.vue')
  },
  {
    path: '/account/password',
    name: 'password',
    component: () => import(/* webpackChunkName: "account" */ '../views/account/ProfileView.vue')
  },
  {
    path: '/account/wishlist',
    name: 'wishlist',
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
  {
    path: '/content-center',
    name: 'content-center',
    component: () => import(/* webpackChunkName: "static" */ '../views/ContentCenterView.vue')
  },
  {
    path: '/health-journal',
    name: 'health-journal',
    component: () => import(/* webpackChunkName: "static" */ '../views/HealthJournalView.vue')
  },
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
    name: 'inspection-detail',
    component: () => import(/* webpackChunkName: "inspections" */ '../views/InspectionDetailView.vue')
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

export default router
