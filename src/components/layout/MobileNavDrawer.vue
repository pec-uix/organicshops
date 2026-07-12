<template>
  <transition
    enter-active-class="transition-opacity duration-300 ease-in-out"
    leave-active-class="transition-opacity duration-300 ease-in-out"
    enter-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[100] lg:hidden">
      <div class="absolute inset-0 bg-black/50" @click="close"></div>

      <transition
        enter-active-class="transform transition duration-300 ease-in-out"
        leave-active-class="transform transition duration-300 ease-in-out"
        enter-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside
          v-if="isOpen"
          class="absolute inset-y-0 left-0 flex w-[92%] max-w-[430px] flex-col overflow-hidden rounded-r-xl bg-white shadow-2xl"
        >
          <div class="flex-1 overflow-y-auto bg-white">
            <nav class="divide-y divide-gray-100">
              <!-- 第 0 行：品牌綠關閉控制列 -->
              <div class="flex w-full items-center justify-between bg-[#76B82A] px-5 py-3.5">
                <div
                  v-if="!isLoggedIn"
                  class="flex items-center gap-4 text-sm font-medium text-white"
                >
                  <router-link to="/login" class="hover:opacity-80" @click.native="close">
                    登入
                  </router-link>
                  <span class="h-3 w-[1px] bg-white/30"></span>
                  <router-link to="/register-agreement" class="hover:opacity-80" @click.native="close">
                    註冊
                  </router-link>
                </div>
                <div v-else class="h-8"></div>
                <button
                  type="button"
                  class="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
                  @click="close"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <section v-if="isLoggedIn" class="bg-white">
                <div class="bg-white">
                  <button
                    type="button"
                    class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-5 text-left transition-colors hover:bg-gray-50"
                    :class="memberAccordionOpen ? 'text-[#76B82A]' : 'text-gray-800'"
                    @click="memberAccordionOpen = !memberAccordionOpen"
                  >
                    <span class="min-w-0 pr-4">
                      <span class="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span class="text-base font-semibold text-gray-800">{{ displayWelcomeName }}，您好！</span>
                        <span
                          class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold leading-none"
                          :class="memberIdentityBadgeClass"
                        >
                          {{ memberIdentityLabel }}
                        </span>
                        <span
                          class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold leading-none"
                          :class="isVipMember ? 'bg-[#F5E7B8] text-[#A66A00]' : 'border border-gray-200 bg-white text-gray-500'"
                        >
                          {{ memberLevelLabel }}
                        </span>
                      </span>
                      <span class="mt-1.5 block text-xs text-gray-500">
                        購物金 ${{ memberAssetCredits }}&nbsp;&nbsp;|&nbsp;&nbsp;OP 點數 {{ formattedOpPoints }}&nbsp;&nbsp;|&nbsp;&nbsp;折價券 {{ memberCouponCount }}張
                      </span>
                    </span>
                    <svg
                      class="h-4 w-4 shrink-0 transition-transform duration-200"
                      :class="memberAccordionOpen ? 'rotate-180 text-[#76B82A]' : 'text-gray-400'"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <transition
                    enter-active-class="transition-all duration-200 ease-in-out overflow-hidden"
                    leave-active-class="transition-all duration-200 ease-in-out overflow-hidden"
                    enter-class="max-h-0 opacity-0"
                    enter-to-class="max-h-[640px] opacity-100"
                    leave-class="max-h-[640px] opacity-100"
                    leave-to-class="max-h-0 opacity-0"
                  >
                    <div v-if="memberAccordionOpen" class="flex min-h-[360px] bg-white">
                    <div class="w-28 shrink-0 border-r border-gray-100 bg-gray-50/50">
                      <div class="flex min-h-[64px] w-full items-center border-l-4 border-[#76B82A] bg-white px-3 py-3 text-left">
                        <span class="text-[15px] font-bold leading-snug text-[#76B82A]">會員中心</span>
                      </div>
                    </div>

                    <div class="flex-1 overflow-y-auto bg-white p-4">
                      <div class="space-y-4">
                        <router-link
                          to="/account"
                          class="block text-lg font-bold tracking-[0.02em] text-gray-900 transition-colors hover:text-[#76B82A]"
                          @click.native="close"
                        >
                          會員中心
                        </router-link>

                        <div class="grid grid-cols-1 gap-3">
                          <router-link
                            v-for="link in accountAccordionLinks"
                            :key="'mobile-member-card-link-' + link.to"
                            :to="link.to"
                            class="rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm font-bold leading-6 text-gray-800 transition-colors hover:border-[#76B82A]/30 hover:bg-gray-50 hover:text-[#76B82A]"
                            @click.native="close"
                          >
                            {{ link.label }}
                          </router-link>
                          <button
                            type="button"
                            class="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm font-bold leading-6 text-gray-500 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                            @click="logout"
                          >
                            <span>登出會員</span>
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    </div>
                  </transition>
                </div>
              </section>

              <section
                v-for="(section, sectionIndex) in menuSections"
                :key="'mobile-section-' + section.key + '-' + sectionIndex"
                class="bg-white"
              >
                <router-link
                  v-if="!section.hasMenu"
                  :to="section.to"
                  class="flex w-full items-center justify-between px-4 py-4 text-left text-base font-bold tracking-[0.03em] text-gray-800 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                  @click.native="close"
                >
                  {{ section.label }}
                </router-link>

                <template v-else>
                  <button
                    type="button"
                    class="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-gray-50"
                    :class="openSectionKey === section.key ? 'text-[#76B82A]' : 'text-gray-800'"
                    @click="toggleSection(section.key)"
                  >
                    <span class="text-base font-bold tracking-[0.03em]">{{ section.label }}</span>
                    <svg
                      class="h-4 w-4 shrink-0 transition-transform duration-200"
                      :class="openSectionKey === section.key ? 'rotate-180 text-[#76B82A]' : 'text-gray-400'"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <transition
                    enter-active-class="transition-all duration-200 ease-in-out overflow-hidden"
                    leave-active-class="transition-all duration-200 ease-in-out overflow-hidden"
                    enter-class="max-h-0 opacity-0"
                    enter-to-class="max-h-[1200px] opacity-100"
                    leave-class="max-h-[1200px] opacity-100"
                    leave-to-class="max-h-0 opacity-0"
                  >
                    <div v-if="openSectionKey === section.key" class="border-t border-gray-100 bg-white">
                      <div v-if="section.key === 'shop'" class="flex min-h-[520px] bg-white">
                        <div class="w-28 shrink-0 border-r border-gray-100 bg-white">
                          <button
                            v-for="(category, categoryIndex) in shopRootCategories"
                            :key="'shop-root-' + section.key + '-' + categoryIndex"
                            type="button"
                            class="flex min-h-[64px] w-full items-center border-l-4 px-3 py-3 text-left transition-colors"
                            :class="activeRootCategoryIndex === categoryIndex ? 'border-[#76B82A] bg-gray-50/50 text-[#76B82A]' : 'border-transparent text-gray-800 hover:bg-gray-50'"
                            @click="selectRootCategory(categoryIndex)"
                          >
                            <span class="text-[15px] font-bold leading-snug">{{ category.title }}</span>
                          </button>
                        </div>

                        <div class="flex-1 overflow-y-auto bg-white p-4">
                          <div v-if="activeRootCategory" class="space-y-5">
                            <router-link
                              :key="'shop-active-root-' + activeRootCategoryIndex"
                              :to="buildMegaGroupLink('shop', activeRootCategory.title)"
                              class="block text-lg font-bold tracking-[0.02em] text-gray-900 transition-colors hover:text-[#76B82A]"
                              @click.native="close"
                            >
                              {{ activeRootCategory.title }}
                            </router-link>

                            <div v-if="activeMiddleCategories.length" class="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                              <button
                                v-for="(middle, middleIndex) in activeMiddleCategories"
                                :key="'shop-middle-tab-' + activeRootCategoryIndex + '-' + middleIndex"
                                type="button"
                                class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors"
                                :class="activeMiddleCategoryIndex === middleIndex ? 'border-[#76B82A] bg-[#F1F8EA] text-[#4D8F16]' : 'border-gray-200 bg-white text-gray-700 hover:border-[#76B82A]/50 hover:text-[#4D8F16]'"
                                @click="selectMiddleCategory(middleIndex)"
                              >
                                {{ middle.label }}
                              </button>
                            </div>

                            <div class="space-y-7">
                              <div
                                v-for="(group, groupIndex) in visibleCategoryGroups"
                                :key="'shop-content-group-' + activeRootCategoryIndex + '-' + groupIndex"
                              >
                                <router-link
                                  :to="buildMegaItemLink(activeRootCategory.title, group)"
                                  class="block text-base font-bold text-gray-900 transition-colors hover:text-[#76B82A]"
                                  @click.native="close"
                                >
                                  {{ group.label }}
                                </router-link>

                                <div
                                  v-if="getMegaChildren(group).length"
                                  class="mt-4 grid grid-cols-2 gap-x-5 gap-y-4"
                                >
                                  <router-link
                                    v-for="(leaf, leafIndex) in getMegaChildren(group)"
                                    :key="'shop-leaf-' + activeRootCategoryIndex + '-' + groupIndex + '-' + leafIndex"
                                    :to="buildMegaChildLink(activeRootCategory.title, group.label, leaf)"
                                    class="text-sm font-medium leading-6 text-gray-700 transition-colors hover:text-[#76B82A]"
                                    @click.native="close"
                                  >
                                    {{ leaf.label }}
                                  </router-link>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div v-else class="py-16 text-center text-sm font-medium text-gray-500">
                            商品分類整理中
                          </div>
                        </div>
                      </div>

                      <div v-else-if="section.key === 'account'" class="flex min-h-[360px] bg-white">
                        <div class="w-28 shrink-0 border-r border-gray-100 bg-gray-50/50">
                          <div class="flex min-h-[64px] w-full items-center border-l-4 border-[#76B82A] bg-white px-3 py-3 text-left">
                            <span class="text-[15px] font-bold leading-snug text-[#76B82A]">會員中心</span>
                          </div>
                        </div>

                        <div class="flex-1 overflow-y-auto bg-white p-4">
                          <div class="space-y-4">
                            <router-link
                              to="/account"
                              class="block text-lg font-bold tracking-[0.02em] text-gray-900 transition-colors hover:text-[#76B82A]"
                              @click.native="close"
                            >
                              會員中心
                            </router-link>

                            <div class="grid grid-cols-1 gap-3">
                              <router-link
                                v-for="link in accountAccordionLinks"
                                :key="'account-accordion-link-' + link.to"
                                :to="link.to"
                                class="rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm font-bold leading-6 text-gray-800 transition-colors hover:border-[#76B82A]/30 hover:bg-gray-50 hover:text-[#76B82A]"
                                @click.native="close"
                              >
                                {{ link.label }}
                              </router-link>
                              <button
                                type="button"
                                class="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm font-bold leading-6 text-gray-500 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                                @click="logout"
                              >
                                <span>登出會員</span>
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-else-if="usesTwoColumnMegaMenu(section.key)" class="flex min-h-[360px] bg-white">
                        <div class="w-28 shrink-0 border-r border-gray-100 bg-gray-50/50">
                          <button
                            v-for="(group, groupIndex) in getMegaMenuGroups(section.key)"
                            :key="'two-column-root-' + section.key + '-' + groupIndex"
                            type="button"
                            class="flex min-h-[64px] w-full items-center border-l-4 px-3 py-3 text-left transition-colors"
                            :class="getActiveMegaGroupIndex(section.key) === groupIndex ? 'border-[#76B82A] bg-white text-[#76B82A]' : 'border-transparent text-gray-800 hover:bg-white'"
                            @click="selectMegaGroup(section.key, groupIndex)"
                          >
                            <span class="text-[15px] font-bold leading-snug">{{ group.title }}</span>
                          </button>
                        </div>

                        <div class="flex-1 overflow-y-auto bg-white p-4">
                          <div v-if="getActiveMegaGroup(section.key)" class="space-y-4">
                            <router-link
                              :key="'two-column-active-group-' + section.key + '-' + getActiveMegaGroupIndex(section.key)"
                              :to="buildMegaGroupLink(section.key, getActiveMegaGroup(section.key).title)"
                              class="block text-lg font-bold tracking-[0.02em] text-gray-900 transition-colors hover:text-[#76B82A]"
                              @click.native="close"
                            >
                              {{ getActiveMegaGroup(section.key).title }}
                            </router-link>

                            <div class="grid grid-cols-1 gap-3">
                              <template
                                v-for="(item, itemIndex) in getActiveMegaItems(section.key)"
                              >
                                <a
                                  v-if="isExternalMegaLink(item)"
                                  :key="'two-column-item-link-' + section.key + '-' + getActiveMegaGroupIndex(section.key) + '-' + itemIndex"
                                  :href="item.href"
                                  target="_blank"
                                  rel="noopener"
                                  class="rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm font-bold leading-6 text-gray-800 transition-colors hover:border-[#76B82A]/30 hover:bg-gray-50 hover:text-[#76B82A]"
                                  @click="close"
                                >
                                  {{ item.label }}
                                </a>
                                <button
                                  v-else-if="item.pdfUrl"
                                  :key="'two-column-item-pdf-' + section.key + '-' + getActiveMegaGroupIndex(section.key) + '-' + itemIndex"
                                  type="button"
                                  class="rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm font-bold leading-6 text-gray-800 transition-colors hover:border-[#76B82A]/30 hover:bg-gray-50 hover:text-[#76B82A] text-left"
                                  @click="openPdf(item.pdfUrl, item.label)"
                                >
                                  {{ item.label }}
                                </button>
                                <router-link
                                  v-else
                                  :key="'two-column-item-' + section.key + '-' + getActiveMegaGroupIndex(section.key) + '-' + itemIndex"
                                  :to="buildMegaItemLink(getActiveMegaGroup(section.key).title, item)"
                                  class="rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm font-bold leading-6 text-gray-800 transition-colors hover:border-[#76B82A]/30 hover:bg-gray-50 hover:text-[#76B82A]"
                                  @click.native="close"
                                >
                                  {{ item.label }}
                                </router-link>
                              </template>
                            </div>
                          </div>

                          <div v-else class="py-16 text-center text-sm font-medium text-gray-500">
                            內容整理中
                          </div>
                        </div>
                      </div>

                      <div v-else class="bg-white">
                        <div
                          v-for="(group, groupIndex) in getMegaMenuGroups(section.key)"
                          :key="'mobile-menu-group-' + section.key + '-' + groupIndex"
                          class="border-b border-gray-100 last:border-b-0"
                        >
                          <div class="px-4 pt-4 text-xs font-bold tracking-[0.16em] text-gray-400">
                            {{ group.title }}
                          </div>
                          <template
                            v-for="(item, itemIndex) in group.items"
                          >
                            <a
                              v-if="isExternalMegaLink(item)"
                              :key="'mobile-menu-item-link-' + section.key + '-' + groupIndex + '-' + itemIndex"
                              :href="item.href"
                              target="_blank"
                              rel="noopener"
                              class="block px-4 py-4 text-[15px] font-bold text-gray-800 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                              @click="close"
                            >
                              {{ item.label }}
                            </a>
                            <button
                              v-else-if="item.pdfUrl"
                              :key="'mobile-menu-item-pdf-' + section.key + '-' + groupIndex + '-' + itemIndex"
                              type="button"
                              class="block w-full px-4 py-4 text-left text-[15px] font-bold text-gray-800 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                              @click="openPdf(item.pdfUrl, item.label)"
                            >
                              {{ item.label }}
                            </button>
                            <router-link
                              v-else
                              :key="'mobile-menu-item-' + section.key + '-' + groupIndex + '-' + itemIndex"
                              :to="buildMegaItemLink(group.title, item)"
                              class="block px-4 py-4 text-[15px] font-bold text-gray-800 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                              @click.native="close"
                            >
                              {{ item.label }}
                            </router-link>
                          </template>
                        </div>
                      </div>
                    </div>
                  </transition>
                </template>
              </section>
            </nav>
          </div>
        </aside>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  MAIN_NAV_ITEMS,
  MEGA_MENUS,
  MainNavItem,
  MegaMenuGroup,
  MegaMenuLink,
} from '@/constants/navigation'

function parseTo(to: string) {
  if (!to.includes('?')) return { path: to }
  const [path, qs] = to.split('?')
  const query = Object.fromEntries(new URLSearchParams(qs))
  return { path, query }
}

export default Vue.extend({
  name: 'MobileNavDrawer',
  data() {
    return {
      openSectionKey: 'shop' as MainNavItem['key'] | '',
      memberAccordionOpen: true,
      memberQuickLinks: [
        { label: '會員中心', to: '/account' },
        { label: '我的訂單', to: '/account/orders' },
        { label: '折價券', to: '/account/coupons' },
        { label: '購物金明細', to: '/account/bonus' },
        { label: '收藏清單', to: '/account/wishlist' },
      ],
      activeRootCategoryIndex: 0,
      activeMiddleCategoryIndex: 0,
      memberSummary: {
        credits: 900,
        opPoints: 1250,
        couponCount: 3,
      },
      activeMegaGroupIndexes: {
        campaign: 0,
        safety: 0,
        about: 0,
      } as Record<string, number>,
    }
  },
  computed: {
    isOpen(): boolean { return this.$store.getters['ui/mobileMenuOpen'] },
    isLoggedIn(): boolean { return this.$store.getters['auth/isLoggedIn'] },
    userProfile(): { name?: string; email?: string; memberLevel?: 'normal' | 'vip'; memberRoleLabel?: string; memberTierLabel?: string } | null {
      return this.$store.getters['auth/currentUser']
    },
    displayWelcomeName(): string {
      return this.isLoggedIn ? (this.userProfile?.name || 'UNI會員') : 'UNI會員'
    },
    memberLevel(): 'normal' | 'vip' {
      return this.userProfile?.memberLevel || 'normal'
    },
    isVipMember(): boolean {
      return this.memberLevel === 'vip'
    },
    memberLevelLabel(): string {
      return this.isVipMember ? '尊榮 VIP' : '一般會員'
    },
    memberIdentityLabel(): string {
      const role = this.userProfile?.memberRoleLabel || ''
      if (role === '生機員工' || role === '集團員工') return role
      return '一般消費者'
    },
    memberIdentityBadgeClass(): string {
      const role = this.userProfile?.memberRoleLabel || ''
      if (role === '生機員工') return 'bg-[#EBF5D9] text-[#4D8F16]'
      if (role === '集團員工') return 'bg-blue-50 text-blue-600'
      return 'border border-gray-200 bg-white text-gray-500'
    },
    memberAssetCredits(): number {
      return this.memberSummary.credits
    },
    formattedOpPoints(): string {
      return this.memberSummary.opPoints.toLocaleString()
    },
    memberCouponCount(): number {
      return this.memberSummary.couponCount
    },
    menuSections(): MainNavItem[] {
      return [
        ...MAIN_NAV_ITEMS,
        { key: 'account', label: '會員中心', to: '/account', hasMenu: true },
      ]
    },
    accountAccordionLinks(): Array<{ label: string; to: string }> {
      return this.memberQuickLinks.filter((link) => link.label !== '會員中心')
    },
    shopRootCategories(): MegaMenuGroup[] {
      return MEGA_MENUS.shop?.groups || []
    },
    activeRootCategory(): MegaMenuGroup | undefined {
      return this.shopRootCategories[this.activeRootCategoryIndex]
    },
    activeMiddleCategories(): MegaMenuLink[] {
      return this.activeRootCategory?.items || []
    },
    activeMiddleCategory(): MegaMenuLink | undefined {
      return this.activeMiddleCategories[this.activeMiddleCategoryIndex]
    },
    visibleCategoryGroups(): MegaMenuLink[] {
      if (this.activeMiddleCategory) return [this.activeMiddleCategory]
      if (this.activeMiddleCategories.length) return this.activeMiddleCategories
      return []
    },
  },
  watch: {
    isOpen(nextOpen: boolean) {
      if (nextOpen) this.ensureDefaultMenuState()
    },
    $route() {
      this.resetOpenState()
    },
  },
  mounted() {
    this.ensureDefaultMenuState()
  },
  methods: {
    close() {
      this.resetOpenState()
      this.$store.dispatch('ui/closeMobileMenu')
    },
    openPdf(url: string, title: string) {
      this.close()
      this.$store.dispatch('ui/openPdfViewer', { url, title })
    },
    logout() {
      this.$store.dispatch('auth/logout')
      this.close()
    },
    resetOpenState() {
      this.openSectionKey = 'shop'
      this.memberAccordionOpen = true
      this.ensureDefaultMenuState()
    },
    ensureDefaultMenuState() {
      if (this.activeRootCategoryIndex >= this.shopRootCategories.length) {
        this.activeRootCategoryIndex = 0
      }

      const middleCount = this.activeMiddleCategories.length
      if (this.activeMiddleCategoryIndex >= middleCount) {
        this.activeMiddleCategoryIndex = 0
      }

      this.normalizeMegaGroupIndex('campaign')
      this.normalizeMegaGroupIndex('safety')
      this.normalizeMegaGroupIndex('about')
    },
    toggleSection(sectionKey: MainNavItem['key']) {
      this.openSectionKey = this.openSectionKey === sectionKey ? '' : sectionKey
      if (this.openSectionKey === 'shop' || this.usesTwoColumnMegaMenu(this.openSectionKey)) this.ensureDefaultMenuState()
    },
    selectRootCategory(categoryIndex: number) {
      this.activeRootCategoryIndex = categoryIndex
      this.activeMiddleCategoryIndex = 0
    },
    selectMiddleCategory(categoryIndex: number) {
      this.activeMiddleCategoryIndex = categoryIndex
    },
    usesTwoColumnMegaMenu(menuKey: string) {
      return menuKey === 'campaign' || menuKey === 'safety' || menuKey === 'about'
    },
    normalizeMegaGroupIndex(menuKey: string) {
      const groups = this.getMegaMenuGroups(menuKey)
      if ((this.activeMegaGroupIndexes[menuKey] || 0) >= groups.length) {
        this.activeMegaGroupIndexes[menuKey] = 0
      }
    },
    getActiveMegaGroupIndex(menuKey: string) {
      return this.activeMegaGroupIndexes[menuKey] || 0
    },
    selectMegaGroup(menuKey: string, groupIndex: number) {
      this.activeMegaGroupIndexes[menuKey] = groupIndex
    },
    getActiveMegaGroup(menuKey: string): MegaMenuGroup {
      return this.getMegaMenuGroups(menuKey)[this.getActiveMegaGroupIndex(menuKey)] || { title: '', items: [] }
    },
    getActiveMegaItems(menuKey: string): MegaMenuLink[] {
      return this.getActiveMegaGroup(menuKey).items || []
    },
    getMegaMenuGroups(menuKey: string): MegaMenuGroup[] {
      return MEGA_MENUS[menuKey]?.groups || []
    },
    getMegaChildren(item: MegaMenuLink): MegaMenuLink[] {
      return item.children || []
    },
    isExternalMegaLink(item: MegaMenuLink): boolean {
      return Boolean(item.href)
    },
    buildMegaMenuBaseRoute(key: string): string {
      const navItem = MAIN_NAV_ITEMS.find((item) => item.key === key)
      return navItem?.to || '/'
    },
    buildMegaGroupLink(menuKey: string, groupTitle: string) {
      if (menuKey === 'shop') {
        return { name: 'category', params: { root: groupTitle } }
      }
      return { path: this.buildMegaMenuBaseRoute(menuKey) }
    },
    buildMegaItemLink(groupTitle: string, item: MegaMenuLink) {
      return parseTo(item.to || '/')
    },
    buildMegaChildLink(groupTitle: string, itemLabel: string, child: MegaMenuLink) {
      return parseTo(child.to || '/')
    },
  },
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
