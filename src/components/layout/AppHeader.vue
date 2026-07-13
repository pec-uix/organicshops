<template>
  <header class="fixed left-0 top-0 z-50 w-full transition-all duration-300">
    <!-- 頂部資訊列 -->
    <div
      class="overflow-hidden bg-brand-primary text-white transition-all duration-300"
      :class="isScrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-10 opacity-100 py-2'"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-center px-4 text-center text-[11px] font-black tracking-widest">
        全館滿 $1,500 免運費 ｜ 安心、有機、在地直送
      </div>
    </div>

    <!-- 主導覽列：手機版 -->
    <div
      class="bg-white transition-all duration-300 lg:hidden"
      :class="isScrolled ? 'bg-white/95 shadow-sm backdrop-blur-md' : 'bg-white'"
    >
    <div class="mobile-header-shell max-w-7xl mx-auto flex min-w-0 items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4 sm:gap-5">
      <!-- 品牌標誌 -->
      <router-link to="/" class="mobile-brand flex min-w-0 items-center gap-2 sm:gap-3 flex-shrink-0 group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40">
        <div class="mobile-brand-mark flex-shrink-0 overflow-hidden rounded-md shadow-sm" style="width: 154px; height: 82px;">
          <img :src="publicAsset('/logo.gif')" alt="統一生機" class="h-full w-full object-contain" />
        </div>
      </router-link>

      <!-- 功能操作區 (真實精品 Icon 導入) -->
      <div class="mobile-header-actions flex flex-shrink-0 items-center gap-3 sm:gap-5">
        <button
          class="flex flex-col items-center text-gray-500 transition-colors hover:text-brand-primary"
          style="-webkit-tap-highlight-color: transparent;"
          @click="toggleMobileSearch"
        >
          <div class="rounded-full p-1 group-hover:bg-brand-surface transition-colors">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <span class="mt-1 hidden text-[10px] font-bold sm:block">搜尋</span>
        </button>

        <button
          class="flex flex-col items-center text-brand-primary transition-colors"
          style="-webkit-tap-highlight-color: transparent;"
          @click="toggleMobileMenu"
        >
          <div class="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md transition-transform duration-300">
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300"
              :class="isMenuOpen ? 'rotate-90' : ''"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </div>
          <span class="mt-1 hidden text-[10px] font-bold sm:block">選單</span>
        </button>
      </div>
    </div>

    <transition name="mobile-search">
      <div v-if="mobileSearchOpen" class="lg:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-inner">
        <div class="flex items-center gap-2">
          <input
            ref="mobileSearchInput"
            v-model="searchQuery"
            type="text"
            placeholder="搜尋商品、分類或關鍵字"
            class="min-w-0 flex-1 rounded-full border border-gray-200 bg-brand-surface px-4 py-3 text-sm font-medium outline-none focus:border-brand-primary"
            @keyup.enter="onSearch"
          />
          <button
            class="rounded-full bg-brand-primary px-4 py-3 text-xs font-black text-white"
            @click="onSearch"
          >
            搜尋
          </button>
        </div>
        <div class="mt-3 flex items-center justify-between text-[10px] font-bold tracking-[0.16em] text-gray-400">
          <span>搜尋結果將直接顯示在商品列表</span>
          <button class="text-brand-primary" @click="mobileSearchOpen = false">收合</button>
        </div>
      </div>
    </transition>

    </div>

    <!-- 主導覽列：桌機版 -->
    <div
      class="hidden w-full transition-all duration-300 lg:block"
      :class="isScrolled ? 'bg-white/95 shadow-sm backdrop-blur-md' : 'bg-white'"
      @mouseleave="closeMegaMenu"
    >
      <div class="relative">
        <div class="h-20 border-b border-gray-100">
          <div class="relative mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6">
            <div class="flex flex-shrink-0 items-center">
              <router-link to="/" class="flex-shrink-0" aria-label="回到首頁">
                <img :src="publicAsset('/logo.gif')" alt="統一生機" class="h-14 w-auto flex-shrink-0" />
              </router-link>
            </div>

            <nav class="absolute left-1/2 flex -translate-x-1/2 items-center justify-center space-x-7">
              <router-link
                v-for="item in mainNavItems"
                :key="item.key"
                :to="item.to"
                class="relative flex items-center gap-1 pb-[6px] text-[15px] font-bold transition-colors"
                :class="activeMegaMenuKey === item.key ? 'text-[#76B82A]' : 'text-gray-700 hover:text-[#76B82A]'"
                @mouseenter.native="item.hasMenu ? openMegaMenu(item.key) : closeMegaMenu()"
              >
                <span>{{ item.label }}</span>
                <span v-if="item.hasMenu" class="flex h-3 w-3 items-center justify-center">
                  <svg
                    class="h-3 w-3 transition-transform duration-200"
                    :class="activeMegaMenuKey === item.key ? 'rotate-180' : ''"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </span>
                <span
                  aria-hidden="true"
                  class="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#76B82A] transition-transform duration-200"
                  :class="activeMegaMenuKey === item.key ? 'scale-x-100' : 'scale-x-0'"
                ></span>
              </router-link>
            </nav>

            <div v-if="isLoggedIn" class="flex flex-shrink-0 items-center gap-5">
                <button
                  type="button"
                  class="order-1 flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                  :class="desktopSearchOpen ? 'bg-gray-50 text-[#76B82A]' : ''"
                  aria-label="開啟搜尋"
                  @click="toggleDesktopSearch"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>

                <router-link
                  to="/account/notifications"
                  class="relative order-3 flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                  aria-label="通知中心"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                  </svg>
                  <span class="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#76B82A] px-1 text-[9px] font-black leading-none text-white ring-2 ring-white">
                    3
                  </span>
                </router-link>

                <div
                  class="relative order-2"
                  @mouseenter="desktopMemberMenuOpen = true"
                  @mouseleave="desktopMemberMenuOpen = false"
                >
                  <button
                    type="button"
                    class="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                    :class="desktopMemberMenuOpen ? 'bg-gray-50 text-[#76B82A]' : ''"
                    aria-label="會員中心"
                    @click="desktopMemberMenuOpen = !desktopMemberMenuOpen"
                    @focus="desktopMemberMenuOpen = true"
                  >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 20.25a7.5 7.5 0 0115 0" />
                    </svg>
                  </button>

                  <transition
                    enter-active-class="transition-all duration-150 ease-out"
                    leave-active-class="transition-all duration-100 ease-in"
                    enter-class="opacity-0 translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-1"
                  >
                    <div
                      v-if="desktopMemberMenuOpen"
                      class="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-xl"
                    >
                      <div class="rounded-lg bg-gray-50 p-3">
                        <div class="min-w-0">
                          <p class="min-w-0 max-w-full break-words text-sm font-medium leading-5 text-gray-800">
                            {{ desktopGreetingName }}，您好！
                          </p>
                          <div class="mt-2 flex min-w-0 flex-wrap items-center gap-2">
                            <span
                              class="inline-flex min-w-max shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold leading-none"
                              :class="desktopMemberIdentityBadgeClass"
                            >
                              {{ desktopMemberIdentityLabel }}
                            </span>
                            <span class="inline-flex min-w-max shrink-0 items-center whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-bold leading-none text-[#76B82A] ring-1 ring-[#76B82A]/20">
                              <template v-if="desktopIsVip">👑 </template>{{ desktopMemberLevelLabel }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-3 gap-2 border-b border-gray-100 py-2">
                        <router-link
                          to="/account/bonus"
                          class="rounded-lg px-1.5 py-2 text-center transition-colors hover:bg-gray-50"
                          @click.native="desktopMemberMenuOpen = false"
                        >
                          <div class="text-[10px] font-medium text-gray-400">購物金</div>
                          <div class="mt-0.5 text-xs font-bold text-gray-800">${{ memberAssetCredits }}</div>
                        </router-link>
                        <router-link
                          to="/op-exchange"
                          class="rounded-lg px-1.5 py-2 text-center transition-colors hover:bg-gray-50"
                          @click.native="desktopMemberMenuOpen = false"
                        >
                          <div class="text-[10px] font-medium text-gray-400">OP 點數</div>
                          <div class="mt-0.5 text-xs font-bold text-gray-800">{{ formattedOpPoints }}</div>
                        </router-link>
                        <router-link
                          to="/account/coupons"
                          class="rounded-lg px-1.5 py-2 text-center transition-colors hover:bg-gray-50"
                          @click.native="desktopMemberMenuOpen = false"
                        >
                          <div class="text-[10px] font-medium text-gray-400">專屬折價券</div>
                          <div class="mt-0.5 text-xs font-bold text-gray-800">{{ memberCouponCount }}張</div>
                        </router-link>
                      </div>

                      <div class="mt-2 flex flex-col">
                        <router-link
                          to="/account"
                          class="py-2 text-xs text-gray-600 transition-colors hover:text-[#76B82A]"
                          @click.native="desktopMemberMenuOpen = false"
                        >
                          會員中心
                        </router-link>
                        <router-link
                          to="/account/orders"
                          class="py-2 text-xs text-gray-600 transition-colors hover:text-[#76B82A]"
                          @click.native="desktopMemberMenuOpen = false"
                        >
                          我的訂單
                        </router-link>
                        <router-link
                          to="/account/coupons"
                          class="py-2 text-xs text-gray-600 transition-colors hover:text-[#76B82A]"
                          @click.native="desktopMemberMenuOpen = false"
                        >
                          折價券
                        </router-link>
                        <router-link
                          to="/account/bonus"
                          class="py-2 text-xs text-gray-600 transition-colors hover:text-[#76B82A]"
                          @click.native="desktopMemberMenuOpen = false"
                        >
                          購物金明細
                        </router-link>
                        <router-link
                          to="/account/wishlist"
                          class="py-2 text-xs text-gray-600 transition-colors hover:text-[#76B82A]"
                          @click.native="desktopMemberMenuOpen = false"
                        >
                          收藏清單
                        </router-link>
                      </div>

                      <div class="mt-2 border-t border-gray-100 pt-2">
                        <button
                          type="button"
                          class="cursor-pointer text-xs text-[#76B82A] underline underline-offset-2 hover:font-medium"
                          @click="logoutFromDesktopMenu"
                        >
                          登出
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>

                <button
                  type="button"
                  class="relative order-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                  aria-label="開啟購物車"
                  @click="openCartDrawer"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                  <span
                    v-if="cartCount > 0"
                    class="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#76B82A] px-1 text-[9px] font-black leading-none text-white ring-2 ring-white"
                  >
                    {{ cartCount }}
                  </span>
                </button>
            </div>

            <div v-else class="flex flex-shrink-0 items-center gap-6">
              <div class="flex items-center text-sm font-bold">
                <template v-for="(link, linkIndex) in desktopUtilityLinks">
                  <router-link
                    :key="link.label"
                    :to="link.to"
                    class="text-gray-700 transition-colors hover:text-[#76B82A]"
                  >
                    {{ link.label }}
                  </router-link>
                  <span
                    v-if="!isLoggedIn && linkIndex === 0"
                    :key="'desktop-auth-separator-' + linkIndex"
                    class="mx-2 text-gray-300"
                  >
                    /
                  </span>
                </template>
              </div>

              <div class="flex items-center gap-4">
                <button
                  type="button"
                  class="order-1 flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                  :class="desktopSearchOpen ? 'bg-gray-50 text-[#76B82A]' : ''"
                  aria-label="開啟搜尋"
                  @click="toggleDesktopSearch"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>

                <router-link
                  to="/account/notifications"
                  class="relative order-3 flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                  aria-label="通知中心"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                  </svg>
                  <span class="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#76B82A] px-1 text-[9px] font-black leading-none text-white ring-2 ring-white">
                    3
                  </span>
                </router-link>

                <button
                  type="button"
                  class="relative order-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#76B82A]"
                  aria-label="開啟購物車"
                  @click="openCartDrawer"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                  <span
                    v-if="cartCount > 0"
                    class="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#76B82A] px-1 text-[9px] font-black leading-none text-white ring-2 ring-white"
                  >
                    {{ cartCount }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="desktopSearchOpen"
            class="animate-fade-in flex w-full items-center justify-between gap-6 border-b border-gray-100 bg-gray-50 px-8 py-3"
          >
            <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
              <div class="relative flex-1">
                <input
                  ref="desktopSearchInput"
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜尋商品、有機蔬果..."
                  class="h-10 w-full rounded-full border border-[#76B82A]/30 bg-white/50 pl-5 pr-11 text-sm font-medium text-gray-700 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#76B82A] focus:bg-white focus:ring-2 focus:ring-[#76B82A]/10"
                  @keyup.enter="onSearch"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-[#76B82A]"
                  @click="onSearch"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              </div>

              <div class="flex flex-shrink-0 items-center gap-2 text-xs font-bold text-gray-400">
                <span>熱門搜尋：</span>
                <template v-for="(keyword, index) in searchSuggestions">
                  <button
                    :key="keyword"
                    type="button"
                    class="transition-colors hover:text-[#76B82A]"
                    @click="applySearchSuggestion(keyword)"
                  >
                    {{ keyword }}
                  </button>
                  <span v-if="index < searchSuggestions.length - 1" :key="`${keyword}-sep`">｜</span>
                </template>
              </div>
            </div>
          </div>
        </transition>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="activeMegaMenu"
            class="absolute left-0 top-full z-40 h-[400px] max-h-[400px] w-full overflow-hidden border-t border-gray-100 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            @mouseenter="openMegaMenu(activeMegaMenuKey)"
            @mouseleave="closeMegaMenu"
          >
            <div class="mx-auto grid h-full max-w-7xl grid-cols-12 gap-6 px-4 py-3">
              <aside class="mega-scrollbar col-span-3 h-full overflow-y-auto border-r border-brand-primary/20 pr-5">
                <nav class="space-y-0.5 pt-1">
                  <button
                    v-for="(group, index) in activeMegaMenu.groups"
                    :key="buildMegaGroupKey(activeMegaMenuKey, group.title, index)"
                    type="button"
                    class="block w-full border-l-2 py-1.5 pl-3 text-left text-sm font-bold transition-all"
                    :class="currentSubTabId === buildMegaSubTabId(activeMegaMenuKey, index) ? 'border-[#76B82A] text-[#76B82A]' : 'border-transparent text-gray-700 hover:border-[#76B82A] hover:text-[#76B82A]'"
                    @click="handleMegaGroupNavigate(index)"
                    @mouseenter="selectSubTab(index)"
                    @focus="selectSubTab(index)"
                  >
                    {{ group.title }}
                  </button>
                </nav>
              </aside>

              <div class="mega-scrollbar col-span-9 h-full overflow-y-auto pr-1">
                <div class="grid grid-cols-3 content-start items-stretch gap-3">
                  <article
                    v-for="(item, itemIndex) in displayMegaItems"
                    :key="'desktop-mega-item-' + activeMegaMenuKey + '-' + currentSubTabId + '-' + itemIndex"
                    class="flex h-auto flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#76B82A]/20 hover:shadow-md"
                    :class="hasMegaSubItems(item) ? '' : 'items-center justify-center text-center'"
                  >
                    <a
                      v-if="isExternalMegaLink(item)"
                      :href="item.href"
                      target="_blank"
                      rel="noopener"
                      class="cursor-pointer text-sm font-black text-gray-800 transition-all hover:text-[#76B82A] hover:underline"
                      :class="hasMegaSubItems(item) ? 'mb-2 block border-b border-gray-100 pb-1.5' : 'flex w-full items-center justify-center'"
                    >
                      {{ item.label }}
                    </a>
                    <button
                      v-else-if="item.pdfUrl"
                      type="button"
                      class="cursor-pointer text-sm font-black text-gray-800 transition-all hover:text-[#76B82A] hover:underline"
                      :class="hasMegaSubItems(item) ? 'mb-2 block border-b border-gray-100 pb-1.5' : 'flex w-full items-center justify-center'"
                      @click="openPdf(item.pdfUrl, item.label)"
                    >
                      {{ item.label }}
                    </button>
                    <router-link
                      v-else
                      :to="buildMegaItemLink(activeMegaGroup.title, item)"
                      class="cursor-pointer text-sm font-black text-gray-800 transition-all hover:text-[#76B82A] hover:underline"
                      :class="hasMegaSubItems(item) ? 'mb-2 block border-b border-gray-100 pb-1.5' : 'flex w-full items-center justify-center'"
                    >
                      {{ item.label }}
                    </router-link>

                    <div v-if="hasMegaSubItems(item)" class="flex flex-wrap gap-x-4 gap-y-2">
                      <router-link
                        v-for="(child, childIndex) in item.children"
                        :key="'desktop-mega-child-' + activeMegaMenuKey + '-' + currentSubTabId + '-' + itemIndex + '-' + childIndex"
                        :to="buildMegaChildLink(activeMegaGroup.title, item.label, child)"
                        class="text-[13px] font-medium text-gray-400 transition-colors hover:text-[#76B82A]"
                      >
                        {{ child.label }}
                      </router-link>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { publicAssetPath } from '@/utils/public-path'
import {
  MAIN_NAV_ITEMS,
  MEGA_MENUS,
  MegaMenuConfig,
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
  name: 'AppHeader',
  data() {
    return {
      searchQuery: '',
      mobileSearchOpen: false,
      desktopSearchOpen: false,
      desktopMemberMenuOpen: false,
      activeMegaMenuKey: '',
      currentSubTabId: '',
      isScrolled: false,
      memberSummary: {
        annualSpent: 10500,
        annualCount: 8,
        credits: 900,
        opPoints: 1250,
        couponCount: 3,
      },
      searchSuggestions: ['有機優格', '鮮乳', '燕麥'],
      mainNavItems: MAIN_NAV_ITEMS,
      megaMenus: MEGA_MENUS as Record<string, MegaMenuConfig>,
      contentLinks: [
        { to: '/inspections', label: '檢驗報告' },
      ],
    }
  },
  computed: {
    cartCount(): number { return this.$store.getters['cart/totalCount'] },
    isMenuOpen(): boolean { return this.$store.getters['ui/mobileMenuOpen'] },
    isLoggedIn(): boolean { return this.$store.getters['auth/isLoggedIn'] },
    currentUser(): { name?: string; memberRoleLabel?: string; memberLevel?: 'normal' | 'vip'; memberTierLabel?: string } | null {
      return this.$store.getters['auth/currentUser']
    },
    desktopGreetingName(): string {
      return this.currentUser?.name || '會員'
    },
    desktopMemberLevelLabel(): string {
      const level = this.currentUser?.memberLevel || (this.currentUser?.memberTierLabel === 'VIP' ? 'vip' : 'normal')
      return level === 'vip' ? '尊榮 VIP' : '一般會員'
    },
    desktopMemberIdentityLabel(): string {
      const role = this.currentUser?.memberRoleLabel || ''
      if (role === '生機員工' || role === '集團員工') return role
      return '一般消費者'
    },
    desktopMemberIdentityBadgeClass(): string {
      const role = this.currentUser?.memberRoleLabel || ''
      if (role === '生機員工') return 'bg-[#EBF5D9] text-[#4D8F16]'
      if (role === '集團員工') return 'bg-blue-50 text-blue-600'
      return 'border border-gray-200 bg-white text-gray-500'
    },
    desktopIsVip(): boolean {
      const level = this.currentUser?.memberLevel || (this.currentUser?.memberTierLabel === 'VIP' ? 'vip' : 'normal')
      return level === 'vip'
    },
    desktopAnnualSpent(): string {
      return this.memberSummary.annualSpent.toLocaleString()
    },
    desktopAnnualCount(): number {
      return this.memberSummary.annualCount
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
    desktopUtilityLinks(): Array<{ label: string; to: string }> {
      return [
        { label: '登入', to: '/login' },
        { label: '註冊', to: '/register-agreement' },
      ]
    },
    activeMegaMenu(): MegaMenuConfig | null {
      return this.megaMenus[this.activeMegaMenuKey] || null
    },
    activeMegaGroup(): MegaMenuGroup {
      const groups = this.activeMegaMenu?.groups || []
      const activeIndex = groups.findIndex((group, index) => this.buildMegaSubTabId(this.activeMegaMenuKey, index) === this.currentSubTabId)
      return groups[activeIndex >= 0 ? activeIndex : 0] || { title: '', items: [] }
    },
    displayMegaItems(): MegaMenuLink[] {
      return this.activeMegaGroup?.items || []
    },
  },
  watch: {
    activeMegaMenuKey(newKey: string, oldKey: string) {
      if (newKey !== oldKey) {
        this.currentSubTabId = this.buildMegaSubTabId(newKey, 0)
      }
    },
  },
  mounted() {
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    publicAsset(path: string): string {
      return publicAssetPath(path)
    },
    openCartDrawer() { this.$store.dispatch('ui/openCartDrawer') },
    toggleMobileMenu() { this.$store.dispatch('ui/toggleMobileMenu') },
    openPdf(url: string, title: string) {
      this.closeMegaMenu()
      this.$store.dispatch('ui/openPdfViewer', { url, title })
    },
    logoutFromDesktopMenu() {
      this.desktopMemberMenuOpen = false
      this.$store.dispatch('auth/logout')
    },
    openMegaMenu(key: string) {
      this.activeMegaMenuKey = key
      this.currentSubTabId = this.buildMegaSubTabId(key, 0)
    },
    closeMegaMenu() {
      this.activeMegaMenuKey = ''
      this.currentSubTabId = ''
    },
    hasMegaSubItems(item: MegaMenuLink): boolean {
      return Array.isArray(item.children) && item.children.length > 0
    },
    isExternalMegaLink(item: MegaMenuLink): boolean {
      return Boolean(item.href)
    },
    selectSubTab(index: number) {
      if (!this.activeMegaMenuKey) return
      this.currentSubTabId = this.buildMegaSubTabId(this.activeMegaMenuKey, index)
    },
    handleMegaGroupNavigate(index: number) {
      if (!this.activeMegaMenuKey) return
      const menuKey = this.activeMegaMenuKey
      const group = this.activeMegaMenu?.groups[index]
      if (!group) return
      this.selectSubTab(index)
      this.closeMegaMenu()
      this.$router.push(this.buildMegaGroupLink(menuKey, group)).catch(() => {})
    },
    buildMegaMenuBaseRoute(key: string): string {
      const routes: Record<string, string> = {
        shop: '/products',
        campaign: '/events',
        safety: '/inspections',
        about: '/about',
      }
      return routes[key] || '/'
    },
    buildMegaSubTabId(menuKey: string, index: number): string {
      return `${menuKey}-${index}`
    },
    buildMegaGroupKey(menuKey: string, groupTitle: string, index: number): string {
      return `${menuKey}-${groupTitle}-${index}`
    },
    buildMegaGroupLink(menuKey: string, group: MegaMenuGroup) {
      if (menuKey === 'shop') {
        return { name: 'category', params: { root: group.categoryId || group.title } }
      }
      return { path: this.buildMegaMenuBaseRoute(menuKey) }
    },
    buildMegaItemLink(groupTitle: string, item: MegaMenuLink) {
      return parseTo(item.to || '/')
    },
    buildMegaChildLink(groupTitle: string, itemLabel: string, child: MegaMenuLink) {
      return parseTo(child.to || '/')
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 40
    },
    toggleDesktopSearch() {
      this.desktopSearchOpen = !this.desktopSearchOpen
      if (this.desktopSearchOpen) {
        this.mobileSearchOpen = false
        this.$nextTick(() => {
          const input = this.$refs.desktopSearchInput as HTMLInputElement | undefined
          input?.focus()
        })
      }
    },
    applySearchSuggestion(keyword: string) {
      this.searchQuery = keyword
      this.onSearch()
    },
    goToSearch() {
      if (this.$route.path === '/search') {
        this.$router.replace({ path: '/search', query: { ...this.$route.query, _t: String(Date.now()) } }).catch(() => {})
        return
      }
      this.$router.push('/search').catch(() => {})
    },
    toggleMobileSearch() {
      this.mobileSearchOpen = !this.mobileSearchOpen
      if (this.mobileSearchOpen) {
        this.$store.dispatch('ui/closeMobileMenu')
        this.$nextTick(() => {
          const input = this.$refs.mobileSearchInput as HTMLInputElement | undefined
          input?.focus()
        })
      }
    },
    onSearch() {
      if (this.searchQuery.trim()) {
        this.mobileSearchOpen = false
        this.desktopSearchOpen = false
        this.$router.push({ path: '/search', query: { q: this.searchQuery.trim() } }).catch(() => {})
      }
    },
  },
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.mega-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(118, 184, 42, 0.35) transparent;
}

.mega-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.mega-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.mega-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(118, 184, 42, 0.35);
  border-radius: 999px;
}

.mobile-search-enter-active,
.mobile-search-leave-active {
  transition: all 0.2s ease;
}

.mobile-search-enter,
.mobile-search-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

</style>
