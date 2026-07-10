<template>
  <div class="bg-brand-bg min-h-screen">
    <div class="max-w-7xl mx-auto px-4 py-8">

      <!-- ── Breadcrumb ── -->
      <nav class="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500">
        <router-link to="/" class="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-primary" aria-label="返回首頁">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11.5L12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-5.5h5V20" />
          </svg>
          <span>首頁</span>
        </router-link>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span>›</span>
          <router-link to="/products" class="transition-colors hover:text-brand-primary">全部商品</router-link>
        </span>
        <template v-for="item in categoryBreadcrumbLinks">
          <span
            v-if="item.isCurrent"
            :key="item.label"
            class="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-800"
          >
            <span>›</span>
            {{ item.label }}
          </span>
          <button
            v-else
            :key="item.label"
            type="button"
            class="inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-brand-primary focus:outline-none focus-visible:text-brand-primary"
            @click="navigateToBreadcrumb(item.to)"
          >
            <span>›</span>
            {{ item.label }}
          </button>
        </template>
        <template v-if="searchQuery">
          <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-800">
            <span>›</span>
            搜尋結果
          </span>
        </template>
      </nav>

      <section v-if="pageVariant === 'root'" class="mb-8">
        <div class="group relative h-[320px] overflow-hidden rounded-2xl shadow-sm sm:h-[380px] lg:h-[460px]">
          <img
            v-if="isImageUrl(heroBannerImage)"
            :src="heroBannerImage"
            :alt="heroBannerTitle"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-brand-dark/70 via-brand-dark/45 to-transparent"></div>
          <div class="relative z-10 flex h-full flex-col justify-center px-6 text-white lg:px-16">
            <p class="inline-flex w-fit bg-brand-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">
              新鮮嚴選
            </p>
            <h1 class="mt-5 text-4xl font-black leading-tight tracking-widest drop-shadow-sm lg:text-6xl">
              {{ heroBannerTitle }}
            </h1>
            <p class="mt-5 max-w-xl text-sm font-bold leading-8 tracking-widest text-white/85 lg:text-base">
              {{ heroBannerDescription }}
            </p>
          </div>
        </div>
      </section>

      <section v-if="pageVariant === 'root' && middleEntryCards.length" class="mb-8">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <router-link
            v-for="card in middleEntryCards"
            :key="card.id"
            :to="card.to"
            class="group overflow-hidden rounded-3xl border border-brand-primary/20 border-l-4 border-l-brand-primary bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-primary/45 hover:shadow-md"
          >
            <div class="flex items-center gap-3">
              <div class="h-14 w-14 overflow-hidden rounded-2xl bg-brand-surface ring-1 ring-brand-primary/15">
                <img :src="card.image" :alt="card.label" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div class="min-w-0">
                <h3 class="truncate text-base font-black text-brand-dark group-hover:text-brand-primary">{{ card.label }}</h3>
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <!-- ── Header & Switcher ── -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div v-if="pageVariant === 'all' || pageVariant === 'root' || searchQuery" class="flex flex-wrap items-center gap-3">
          <h1 class="type-page-title tracking-tight text-brand-dark">
            {{ pageTitle }}
          </h1>
          <p v-if="pageVariant !== 'root' && activeSummary" class="mt-1 text-[10px] font-bold uppercase text-gray-400">
            {{ activeSummary }}
          </p>
          <button
            class="inline-flex items-center gap-2 rounded-xl border border-brand-primary/20 bg-white px-4 py-2.5 text-sm font-bold text-brand-primary transition-all hover:bg-brand-surface"
            @click="filtersOpen = true"
          >
            <span>進階篩選</span>
            <span v-if="activeFilterCount > 0" class="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-black text-white">
              {{ activeFilterCount }}
            </span>
          </button>
        </div>

        <div v-if="pageVariant !== 'middle' && (totalCount > 0 || activeFilterCount > 0 || searchQuery)" class="flex flex-wrap items-center gap-4 sm:gap-6">
          <div class="flex items-center gap-2">
            <label class="text-sm font-bold text-gray-400 tracking-tighter">排序方式</label>
            <select
              v-model="sortBy"
              class="text-sm border-0 bg-transparent font-bold text-brand-primary focus:ring-0 cursor-pointer"
            >
              <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <!-- View Switcher -->
          <div class="flex items-center bg-gray-100 p-1 rounded-md shadow-inner">
            <button
              @click="viewMode = 'grid'"
              class="p-1.5 rounded transition-all"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              class="p-1.5 rounded transition-all"
              :class="viewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      <section v-if="pageVariant === 'middle'" class="mb-4 overflow-hidden rounded-3xl bg-white">
        <div>
          <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="type-page-title tracking-tight text-brand-dark">
                {{ currentCategory ? currentCategory.name : pageTitle }}
              </h2>
              <button
                class="inline-flex items-center gap-2 rounded-xl border border-brand-primary/20 bg-white px-4 py-2.5 text-sm font-bold text-brand-primary transition-all hover:bg-brand-surface"
                @click="filtersOpen = true"
              >
                <span>進階篩選</span>
                <span v-if="activeFilterCount > 0" class="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-black text-white">
                  {{ activeFilterCount }}
                </span>
              </button>
            </div>
            <div class="flex flex-wrap items-center gap-4 sm:gap-6">
              <div class="flex items-center gap-2">
                <label class="text-sm font-bold text-gray-400 tracking-tighter">排序方式</label>
                <select
                  v-model="sortBy"
                  class="text-sm border-0 bg-transparent font-bold text-brand-primary focus:ring-0 cursor-pointer"
                >
                  <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
              <div class="flex items-center bg-gray-100 p-1 rounded-md shadow-inner">
                <button
                  @click="viewMode = 'grid'"
                  class="p-1.5 rounded transition-all"
                  :class="viewMode === 'grid' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  @click="viewMode = 'list'"
                  class="p-1.5 rounded transition-all"
                  :class="viewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <button
              v-for="cat in subcategoryOptions"
              :key="cat.id"
              type="button"
              class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-all"
              :class="leafCategory && leafCategory.id === cat.id ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-brand-primary hover:text-brand-primary'"
              @click="selectCategory(cat.id)"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
      </section>

      <section v-else-if="pageVariant === 'leaf'" class="mb-4 overflow-hidden rounded-3xl bg-white">
        <div>
          <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="type-page-title tracking-tight text-brand-dark">
                {{ currentCategory ? currentCategory.name : pageTitle }}
              </h2>
              <button
                class="inline-flex items-center gap-2 rounded-xl border border-brand-primary/20 bg-white px-4 py-2.5 text-sm font-bold text-brand-primary transition-all hover:bg-brand-surface"
                @click="filtersOpen = true"
              >
                <span>進階篩選</span>
                <span v-if="activeFilterCount > 0" class="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-black text-white">
                  {{ activeFilterCount }}
                </span>
              </button>
            </div>
            <div class="flex flex-wrap items-center gap-4 sm:gap-6">
              <div class="flex items-center gap-2">
                <label class="text-sm font-bold text-gray-400 tracking-tighter">排序方式</label>
                <select
                  v-model="sortBy"
                  class="text-sm border-0 bg-transparent font-bold text-brand-primary focus:ring-0 cursor-pointer"
                >
                  <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
              <div class="flex items-center bg-gray-100 p-1 rounded-md shadow-inner">
                <button
                  @click="viewMode = 'grid'"
                  class="p-1.5 rounded transition-all"
                  :class="viewMode === 'grid' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  @click="viewMode = 'list'"
                  class="p-1.5 rounded transition-all"
                  :class="viewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ── Active Filter Summary ── -->
      <div v-if="activeFilterChips.length" class="mb-8 rounded-2xl border-2 border-brand-primary/25 bg-brand-bg/40 p-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p v-if="activeFilterSummary" class="text-sm text-gray-400">{{ activeFilterSummary }}</p>
          <div class="ml-auto flex items-center gap-2">
            <button
              v-if="activeFilterCount > 0"
              class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-500 transition-all hover:border-brand-primary hover:text-brand-primary"
              @click="clearAllFilters"
            >
              清除全部條件
            </button>
          </div>
        </div>

        <div v-if="activeFilterChips.length" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="chip in activeFilterChips"
            :key="chip.key"
            class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-brand-primary border border-brand-primary/10"
          >
            <span>{{ chip.label }}</span>
            <button
              type="button"
              class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              :aria-label="`移除 ${chip.label}`"
              @click="removeFilter(chip.type)"
            >
              ×
            </button>
          </span>
        </div>

      </div>

      <!-- ── Product Grid/List ── -->
      <div v-if="totalCount > 0">
        <div
          :class="viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5 xl:gap-6 justify-items-center' : 'flex flex-col gap-4 w-full'"
        >
          <ProductCard
            v-for="product in pagedProducts"
            :key="product.id"
            :product="product"
            :layout="viewMode"
          />
        </div>

        <!-- ── Pagination ── -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-16">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="w-9 h-9 rounded-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-primary disabled:opacity-30"
          >‹</button>
          <div class="flex items-center gap-1">
            <button
              v-for="page in pageNumbers"
              :key="page"
              class="w-9 h-9 rounded-md text-xs font-black transition-all"
              :class="page === currentPage ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-gray-400 hover:bg-gray-50'"
              @click="typeof page === 'number' && (currentPage = page)"
            >{{ page }}</button>
          </div>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="w-9 h-9 rounded-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-primary disabled:opacity-30"
          >›</button>
        </div>
      </div>

      <!-- ── Search Empty State ── -->
      <div v-else class="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
        <div class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-surface text-brand-primary">
          <svg class="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </div>
        <h2 class="type-section-title mb-2">抱歉，找不到相關商品</h2>
        <p class="text-sm text-gray-400 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
          請嘗試更換關鍵字搜尋，或瀏覽下方的為您推薦商品。
        </p>
        
        <div class="w-full border-t border-gray-100 pt-16">
          <h3 class="text-lg font-bold text-brand-primary mb-8">為您推薦的商品</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <ProductCard
              v-for="product in recommendedProducts"
              :key="'rec-'+product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>

    <transition name="mask-fade">
      <div
        v-if="filtersOpen"
        class="fixed inset-0 z-40 bg-brand-dark/40 backdrop-blur-sm"
        @click="closeFilters"
      />
    </transition>

    <transition name="drawer-slide">
      <aside
        v-if="filtersOpen"
        class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl"
      >
        <div class="flex flex-shrink-0 items-center justify-between border-b border-gray-100 bg-brand-surface/20 px-6 py-5">
          <div>
            <p class="type-eyebrow text-brand-primary">商品篩選</p>
            <h2 class="mt-1 text-lg font-bold tracking-widest text-brand-dark">進階篩選</h2>
          </div>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-all hover:text-brand-primary active:scale-90"
            aria-label="關閉篩選"
            @click="closeFilters"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
          <div v-if="activeFilterChips.length" class="mb-6">
            <div class="mb-3 flex items-center justify-between gap-3">
              <p class="text-xs font-bold text-gray-400">{{ activeFilterSummary }}</p>
              <button
                type="button"
                class="text-xs font-bold text-brand-primary hover:text-brand-dark"
                @click="clearAllFilters"
              >
                清除全部
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="chip in activeFilterChips"
                :key="chip.key"
                class="inline-flex items-center gap-2 rounded-full border border-brand-primary/10 bg-brand-surface px-3 py-1.5 text-[11px] font-bold text-brand-primary"
              >
                <span>{{ chip.label }}</span>
                <button
                  type="button"
                  class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black text-gray-400 hover:bg-white hover:text-gray-700"
                  :aria-label="`移除 ${chip.label}`"
                  @click="removeFilter(chip.type)"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <div class="space-y-7 text-left">
            <section class="space-y-3">
              <p class="type-eyebrow text-gray-400">商品分類</p>
              <div class="space-y-3">
                <div class="relative">
                  <select
                    v-model="filterRootCategoryId"
                    class="filter-select"
                  >
                    <option value="">請選擇大分類</option>
                    <option v-for="cat in rootCategoryOptions" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                  <svg class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div class="relative">
                  <select
                    v-model="filterMiddleCategoryId"
                    class="filter-select"
                    :disabled="!filterRootCategoryId"
                  >
                    <option value="">請選擇中分類</option>
                    <option v-for="cat in middleCategoryOptions" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                  <svg class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div class="relative">
                  <select
                    v-model="filterLeafCategoryId"
                    class="filter-select"
                    :disabled="!filterMiddleCategoryId"
                  >
                    <option value="">請選擇小分類</option>
                    <option v-for="cat in leafCategoryOptions" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                  <svg class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </section>

            <section class="space-y-3">
              <p class="type-eyebrow text-gray-400">配送方式</p>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  class="filter-option"
                  :class="deliveryMethod === 'pickup' ? 'filter-option-active' : 'filter-option-idle'"
                  @click="deliveryMethod = deliveryMethod === 'pickup' ? '' : 'pickup'"
                >
                  超商取貨
                </button>
                <button
                  type="button"
                  class="filter-option"
                  :class="deliveryMethod === 'delivery' ? 'filter-option-active' : 'filter-option-idle'"
                  @click="deliveryMethod = deliveryMethod === 'delivery' ? '' : 'delivery'"
                >
                  宅配
                </button>
              </div>
            </section>

            <section class="space-y-3">
              <p class="type-eyebrow text-gray-400">溫層</p>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="zone in tempZones"
                  :key="zone.value"
                  type="button"
                  class="filter-option"
                  :class="selectedTempZone === zone.value ? 'filter-option-active' : 'filter-option-idle'"
                  @click="toggleTempZone(zone.value)"
                >
                  {{ zone.label }}
                </button>
              </div>
            </section>

            <section class="space-y-3">
              <p class="type-eyebrow text-gray-400">價格區間</p>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="relative">
                  <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">最低價</span>
                  <input
                    v-model.trim="priceMin"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="filter-input pl-20"
                  />
                </div>
                <div class="relative">
                  <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">最高價</span>
                  <input
                    v-model.trim="priceMax"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="filter-input pl-20"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <div class="flex-shrink-0 space-y-3 border-t border-gray-100 bg-white px-6 py-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button
            type="button"
            class="w-full rounded-xl bg-brand-primary py-4 text-sm font-black tracking-[0.12em] text-white shadow-sm transition-all hover:bg-brand-dark active:scale-[0.98]"
            @click="closeFilters"
          >
            查看 {{ totalCount }} 件商品
          </button>
          <button
            type="button"
            class="w-full py-1 text-[10px] font-bold tracking-widest text-gray-300 transition-colors hover:text-gray-500"
            @click="clearAllFilters"
          >
            清除全部條件
          </button>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Category, Product, TempZone } from '@/types'
import { SortOption } from '@/store/modules/products'
import ProductCard from '@/components/product/ProductCard.vue'
import { mockProducts } from '@/mock/data'
import {
  buildCategoryPathFromCategory,
  buildCategoryPathFromSegments,
  buildCategoryPathFromTrail,
  buildCategoryTrail,
  resolveCategoryTrail,
} from '@/utils/category-path'

function firstQueryValue(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : ''
  return typeof value === 'string' ? value : ''
}

function comparablePath(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch (_error) {
    return value
  }
}

export default Vue.extend({
  name: 'ProductListView',
  components: { ProductCard },
  data() {
    return {
      sortBy: 'latest' as SortOption,
      viewMode: 'grid' as 'grid' | 'list',
      currentPage: 1,
      pageSize: 12,
      localSearch: '',
      filtersOpen: false,
      filterRootCategoryId: '',
      filterMiddleCategoryId: '',
      filterLeafCategoryId: '',
      deliveryMethod: '' as '' | 'pickup' | 'delivery',
      priceMin: '',
      priceMax: '',
      selectedTempZone: '' as TempZone | '',
      sortOptions: [
        { value: 'latest',     label: '最新上架' },
        { value: 'price_asc',  label: '價格：低到高' },
        { value: 'price_desc', label: '價格：高到低' },
        { value: 'sales',      label: '熱銷排行' },
      ],
      tempZones: [
        { value: 'ambient', label: '常溫' },
        { value: 'chilled', label: '冷藏' },
        { value: 'frozen',  label: '冷凍' },
        { value: 'fresh',   label: '產地直送' },
      ] as { value: TempZone; label: string }[],
    }
  },
  computed: {
    routeCategorySegments(): string[] {
      const routeSegments = [
        (this.$route.params.root as string) || '',
        (this.$route.params.middle as string) || '',
        (this.$route.params.leaf as string) || '',
      ].filter(Boolean)
      if (routeSegments.length) return routeSegments
      if (this.$route.query.group || this.$route.query.item || this.$route.query.sub) {
        return [firstQueryValue(this.$route.query.group), firstQueryValue(this.$route.query.item), firstQueryValue(this.$route.query.sub)].filter(Boolean)
      }
      return []
    },
    searchQuery(): string { return (this.$route.query.q as string) || '' },
    categories(): Category[] {
      return this.$store.getters['products/allCategories']
    },
    rootCategories(): Category[] {
      return this.$store.getters['products/rootCategories']
    },
    rootCategoryOptions(): Category[] {
      return this.rootCategories
    },
    categoryTrail(): Category[] {
      return resolveCategoryTrail(this.categories, this.routeCategorySegments)
    },
    pageVariant(): 'all' | 'root' | 'middle' | 'leaf' {
      const depth = this.categoryTrail.length
      if (depth >= 3) return 'leaf'
      if (depth === 2) return 'middle'
      if (depth === 1) return 'root'
      return 'all'
    },
    rootCategory(): Category | undefined {
      return this.categoryTrail[0]
    },
    middleCategory(): Category | undefined {
      return this.categoryTrail[1]
    },
    leafCategory(): Category | undefined {
      return this.categoryTrail[2]
    },
    currentCategory(): Category | undefined {
      return this.categoryTrail[this.categoryTrail.length - 1]
    },
    subcategoryOptions(): Category[] {
      if (!this.currentCategory) return []
      return this.$store.getters['products/childrenByCategoryId'](this.currentCategory.id)
    },
    pageScopeCategoryId(): string {
      return this.currentCategory?.id || ''
    },
    selectedCategoryId(): string {
      return this.filterLeafCategoryId || this.filterMiddleCategoryId || this.filterRootCategoryId || ''
    },
    middleCategoryOptions(): Category[] {
      if (!this.filterRootCategoryId) return []
      return this.$store.getters['products/childrenByCategoryId'](this.filterRootCategoryId)
    },
    leafCategoryOptions(): Category[] {
      if (!this.filterMiddleCategoryId) return []
      return this.$store.getters['products/childrenByCategoryId'](this.filterMiddleCategoryId)
    },
    pageTitle(): string {
      if (this.searchQuery) return `搜尋「${this.searchQuery}」`
      if (this.currentCategory) return this.currentCategory.name
      return '全部商品'
    },
    heroBannerTitle(): string {
      if (this.pageVariant === 'root' && this.rootCategory) return this.rootCategory.name
      if (this.pageVariant === 'middle' && this.currentCategory) return this.currentCategory.name
      if (this.pageVariant === 'leaf' && this.currentCategory) return this.currentCategory.name
      return '全部商品'
    },
    heroBannerDescription(): string {
      if (this.pageVariant === 'root' && this.rootCategory) {
        return '嚴選安心食材，讓每日餐桌更自然新鮮。'
      }
      if (this.pageVariant === 'middle' && this.currentCategory) {
        return `先用小分類 Tabs 縮小範圍，再搭配篩選條件快速找到 ${this.currentCategory.name}。`
      }
      if (this.pageVariant === 'leaf' && this.currentCategory) {
        return `透過麵包屑與精準篩選，快速比價並直接加入購物車。`
      }
      return '瀏覽商品、探索品牌、篩選需要的商品。'
    },
    heroBannerImage(): string {
      if (this.currentCategory?.icon) return this.currentCategory.icon
      if (this.rootCategory?.icon) return this.rootCategory.icon
      return mockProducts[0]?.image || ''
    },
    rootRankingCards(): Array<{ id: string; label: string; path: string; to: object; count: number; rank: number; image: string }> {
      return this.rootCategories
        .map((category) => ({
          id: category.id,
          label: category.name,
          path: buildCategoryPathFromCategory(this.categories, category.id),
          to: this.buildCategoryRouteFromId(category.id),
          count: this.categoryProductCount(category.id),
          image: category.icon,
        }))
        .sort((a, b) => b.count - a.count)
        .map((item, index) => ({ ...item, rank: index + 1 }))
    },
    middleEntryCards(): Array<{ id: string; label: string; path: string; to: object; count: number; image: string }> {
      return this.subcategoryOptions.map((category) => ({
        id: category.id,
        label: category.name,
        path: buildCategoryPathFromCategory(this.categories, category.id),
        to: this.buildCategoryRouteFromId(category.id),
        count: this.categoryProductCount(category.id),
        image: category.icon,
      }))
    },
    categoryBreadcrumbLinks(): Array<{ label: string; path: string; to: object; isCurrent: boolean }> {
      return this.categoryTrail.map((category, index) => ({
        label: category.name,
        path: buildCategoryPathFromTrail(this.categoryTrail.slice(0, index + 1)),
        to: this.buildCategoryRouteFromTrail(this.categoryTrail.slice(0, index + 1)),
        isCurrent: index === this.categoryTrail.length - 1,
      }))
    },
    breadcrumbLabel(): string {
      if (this.searchQuery) return '搜尋結果'
      if (this.currentCategory) return this.currentCategory.name
      return '全部商品'
    },
    activeSummary(): string {
      const parts: string[] = []
      if (this.filterRootCategoryId) {
        const root = this.$store.getters['products/categoryById'](this.filterRootCategoryId)
        if (root) parts.push(`大分類：${root.name}`)
      }
      if (this.filterMiddleCategoryId) {
        const middle = this.$store.getters['products/categoryById'](this.filterMiddleCategoryId)
        if (middle) parts.push(`中分類：${middle.name}`)
      }
      if (this.filterLeafCategoryId) {
        const leaf = this.$store.getters['products/categoryById'](this.filterLeafCategoryId)
        if (leaf) parts.push(`小分類：${leaf.name}`)
      }
      if (this.deliveryMethod) {
        parts.push(`配送方式：${this.deliveryMethod === 'pickup' ? '超商取貨' : '宅配'}`)
      }
      if (this.selectedTempZone) {
        const zone = this.tempZones.find((item) => item.value === this.selectedTempZone)
        if (zone) parts.push(`溫層：${zone.label}`)
      }
      const minPrice = this.parsedMinPrice
      const maxPrice = this.parsedMaxPrice
      if (minPrice !== null || maxPrice !== null) {
        const left = minPrice !== null ? `$${minPrice}` : '不限'
        const right = maxPrice !== null ? `$${maxPrice}` : '不限'
        parts.push(`價格：${left} - ${right}`)
      }
      return parts.join(' ｜ ')
    },
    activeFilterCount(): number {
      return [
        !!this.selectedCategoryId,
        !!this.deliveryMethod,
        !!this.selectedTempZone,
        this.parsedMinPrice !== null || this.parsedMaxPrice !== null,
      ].filter(Boolean).length
    },
    activeFilterChips(): Array<{ key: string; label: string; type: string }> {
      const chips: Array<{ key: string; label: string; type: string }> = []
      if (this.filterRootCategoryId) {
        const root = this.$store.getters['products/categoryById'](this.filterRootCategoryId)
        if (root) chips.push({ key: 'category-root', label: `大分類：${root.name}`, type: 'category-root' })
      }
      if (this.filterMiddleCategoryId) {
        const middle = this.$store.getters['products/categoryById'](this.filterMiddleCategoryId)
        if (middle) chips.push({ key: 'category-middle', label: `中分類：${middle.name}`, type: 'category-middle' })
      }
      if (this.filterLeafCategoryId) {
        const leaf = this.$store.getters['products/categoryById'](this.filterLeafCategoryId)
        if (leaf) chips.push({ key: 'category-leaf', label: `小分類：${leaf.name}`, type: 'category-leaf' })
      }
      if (this.deliveryMethod) chips.push({ key: 'delivery', label: `配送方式：${this.deliveryMethod === 'pickup' ? '超商取貨' : '宅配'}`, type: 'delivery' })
      if (this.selectedTempZone) {
        const zone = this.tempZones.find((item) => item.value === this.selectedTempZone)
        if (zone) chips.push({ key: 'temp', label: `溫層：${zone.label}`, type: 'temp' })
      }
      const minPrice = this.parsedMinPrice
      const maxPrice = this.parsedMaxPrice
      if (minPrice !== null || maxPrice !== null) {
        const left = minPrice !== null ? `$${minPrice}` : '不限'
        const right = maxPrice !== null ? `$${maxPrice}` : '不限'
        chips.push({ key: 'price', label: `價格：${left} - ${right}`, type: 'price' })
      }
      return chips
    },
    activeFilterSummary(): string {
      if (this.activeFilterCount === 0) return ''
      return `已套用 ${this.activeFilterCount} 個條件`
    },
    parsedMinPrice(): number | null {
      const value = Number(this.priceMin)
      return this.priceMin === '' || Number.isNaN(value) ? null : value
    },
    parsedMaxPrice(): number | null {
      const value = Number(this.priceMax)
      return this.priceMax === '' || Number.isNaN(value) ? null : value
    },
    effectiveCategoryId(): string {
      return this.selectedCategoryId || this.pageScopeCategoryId
    },
    baseFiltered(): Product[] {
      return this.$store.getters['products/filteredAndSorted'](this.effectiveCategoryId || null, this.sortBy, this.searchQuery)
    },
    allFiltered(): Product[] {
      return this.baseFiltered.filter((product: Product) => {
        if (this.deliveryMethod === 'pickup' && !product.conveniencePickup) return false
        if (this.deliveryMethod === 'delivery' && product.conveniencePickup) return false
        if (this.selectedTempZone && product.tempZone !== this.selectedTempZone) return false

        const price = product.memberPrice ?? product.originalPrice ?? product.price
        const minPrice = this.parsedMinPrice
        const maxPrice = this.parsedMaxPrice
        const lower = minPrice !== null && maxPrice !== null && minPrice > maxPrice ? maxPrice : minPrice
        const upper = minPrice !== null && maxPrice !== null && minPrice > maxPrice ? minPrice : maxPrice
        if (lower !== null && price < lower) return false
        if (upper !== null && price > upper) return false

        return true
      })
    },
    totalCount(): number { return this.allFiltered.length },
    totalPages(): number { return Math.max(1, Math.ceil(this.totalCount / this.pageSize)) },
    pagedProducts(): Product[] { return this.allFiltered.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize) },
    recommendedProducts(): Product[] { return mockProducts.slice(0, 6) },
    pageNumbers(): (number | '…')[] {
      const total = this.totalPages; const cur = this.currentPage
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
      const pages: (number | '…')[] = [1]
      if (cur > 3) pages.push('…')
      for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p)
      if (cur < total - 2) pages.push('…')
      pages.push(total)
      return pages
    },
  },
  watch: {
    routeCategorySegments() {
      this.syncCategorySelection()
    },
    sortBy() { this.currentPage = 1 },
    searchQuery() { this.localSearch = this.searchQuery; this.currentPage = 1 },
    filterRootCategoryId() {
      this.filterMiddleCategoryId = ''
      this.filterLeafCategoryId = ''
      this.currentPage = 1
    },
    filterMiddleCategoryId() {
      this.filterLeafCategoryId = ''
      this.currentPage = 1
    },
    filterLeafCategoryId() { this.currentPage = 1 },
    filtersOpen(value: boolean) {
      document.body.style.overflow = value ? 'hidden' : ''
    },
    deliveryMethod() { this.currentPage = 1 },
    priceMin() { this.currentPage = 1 },
    priceMax() { this.currentPage = 1 },
    selectedTempZone() { this.currentPage = 1 },
    '$route'() {
      this.syncCategorySelection()
      this.currentPage = 1
    }
  },
  created() {
    this.localSearch = this.searchQuery
    this.filtersOpen = false
    this.syncCategorySelection()
  },
  beforeDestroy() {
    document.body.style.overflow = ''
  },
  methods: {
    isImageUrl(value: string) {
      return /^https?:\/\//.test(value) || value.startsWith('/')
    },
    syncCategorySelection() {
      const segments = this.routeCategorySegments
      const trail = resolveCategoryTrail(this.categories, segments)
      this.viewMode = this.pageVariant === 'leaf' ? 'list' : 'grid'

      const canonicalSegments = trail.length
        ? [
            ...trail.map((category) => category.name),
            ...segments.slice(trail.length),
          ]
        : segments

      const canonicalPath = buildCategoryPathFromSegments(canonicalSegments)
      const currentPath = this.$route.path
      if (canonicalPath && comparablePath(currentPath) !== comparablePath(canonicalPath)) {
        this.$router.replace({
          path: canonicalPath,
          query: this.searchQuery ? { q: this.searchQuery } : undefined,
        }).catch(() => {})
      }
    },
    selectCategory(categoryId: string | null) {
      const route = categoryId
        ? this.buildCategoryRouteFromId(categoryId)
        : { path: '/products' }
      this.$router.push({ ...route, query: this.searchQuery ? { q: this.searchQuery } : undefined }).catch(() => {})
    },
    navigateToBreadcrumb(route: object) {
      this.$router.push({ ...route, query: this.searchQuery ? { q: this.searchQuery } : undefined }).catch(() => {})
    },
    buildCategoryRouteFromId(categoryId: string) {
      return this.buildCategoryRouteFromTrail(buildCategoryTrail(this.categories, categoryId))
    },
    buildCategoryRouteFromTrail(trail: Category[]) {
      if (!trail.length) return { path: '/products' }
      const params: Record<string, string> = { root: trail[0].name }
      if (trail[1]) params.middle = trail[1].name
      if (trail[2]) params.leaf = trail[2].name
      return { name: 'category', params }
    },
    applySearch() {
      const trimmed = this.localSearch.trim()
      const query = trimmed ? { q: trimmed } : undefined
      this.$router.push({ path: this.$route.path, query }).catch(() => {})
    },
    clearSearch() {
      this.localSearch = ''
      this.$router.push({ path: this.$route.path }).catch(() => {})
    },
    toggleTempZone(zone: TempZone) {
      this.selectedTempZone = this.selectedTempZone === zone ? '' : zone
    },
    closeFilters() {
      this.filtersOpen = false
    },
    removeFilter(type: string) {
      if (type === 'category-root') {
        this.filterRootCategoryId = ''
        return
      }
      if (type === 'category-middle') {
        this.filterMiddleCategoryId = ''
        return
      }
      if (type === 'category-leaf') {
        this.filterLeafCategoryId = ''
        return
      }
      if (type === 'delivery') {
        this.deliveryMethod = ''
        return
      }
      if (type === 'price') {
        this.priceMin = ''
        this.priceMax = ''
        return
      }
      if (type === 'temp') {
        this.selectedTempZone = ''
        return
      }
    },
    resetFilters() {
      this.filterRootCategoryId = ''
      this.filterMiddleCategoryId = ''
      this.filterLeafCategoryId = ''
      this.deliveryMethod = ''
      this.priceMin = ''
      this.priceMax = ''
      this.selectedTempZone = ''
    },
    clearAllFilters() {
      this.resetFilters()
      const query = { ...this.$route.query }
      if ('q' in query) delete query.q
      this.$router.push({
        path: this.$route.path,
        query: Object.keys(query).length ? query : undefined,
      }).catch(() => {})
    },
    categoryProductCount(categoryId: string): number {
      return this.$store.getters['products/filteredAndSorted'](categoryId, 'latest', '').length
    },
  },
})
</script>

<style scoped>
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.drawer-slide-enter,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: opacity 0.4s ease;
}

.mask-fade-enter,
.mask-fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}

.filter-select {
  @apply w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-bold text-gray-700 outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300;
}

.filter-input {
  @apply w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10;
}

.filter-option {
  @apply rounded-xl border px-4 py-3 text-sm font-bold transition-all;
}

.filter-option-active {
  @apply border-brand-primary bg-brand-primary text-white shadow-sm;
}

.filter-option-idle {
  @apply border-gray-200 bg-white text-gray-600 hover:border-brand-primary hover:text-brand-primary;
}
</style>
