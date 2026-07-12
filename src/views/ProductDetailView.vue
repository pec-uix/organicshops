<template>
  <div class="bg-brand-bg min-h-screen">

    <!-- ── 找不到商品 ── -->
    <div v-if="!product" class="max-w-3xl mx-auto px-4 py-24">
      <div class="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center shadow-sm">
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surface text-brand-primary">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-700 mb-2">找不到此商品</h2>
        <router-link :to="productListBackTo" class="text-brand-primary hover:underline text-sm">返回商品列表</router-link>
      </div>
    </div>

    <template v-else>

      <!-- ── 麵包屑 ── -->
      <div class="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <nav class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500">
          <router-link to="/" class="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-primary" aria-label="返回首頁">
            <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11.5L12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-5.5h5V20" />
            </svg>
            <span>首頁</span>
          </router-link>
          <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>›</span>
            <router-link :to="productListBackTo" class="transition-colors hover:text-brand-primary">全部商品</router-link>
          </span>
          <template v-for="item in categoryBreadcrumb">
            <span :key="item.id" class="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span>›</span>
              <router-link :to="buildCategoryPathFromCategory(categories, item.id)" class="transition-colors hover:text-brand-primary">
              {{ item.name }}
              </router-link>
            </span>
          </template>
          <span class="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap text-gray-800">
            <span>›</span>
            <span class="max-w-[13rem] truncate sm:max-w-[18rem]">{{ product.name }}</span>
          </span>
        </nav>
      </div>

      <!-- ── 主內容區 ── -->
      <div class="mx-auto max-w-[1360px] px-4 py-6">
        <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(28rem,32rem)_minmax(0,39rem)] lg:justify-center lg:gap-12">

          <!-- ── 左欄：商品圖 ── -->
          <div>
            <div
              class="bg-brand-surface rounded-2xl flex items-center justify-center cursor-zoom-in select-none relative overflow-hidden"
              style="aspect-ratio: 1/1; max-height: 520px;"
              @click="lightboxOpen = true"
              @touchstart="onGalleryTouchStart"
              @touchend="onGalleryTouchEnd"
            >
          <img
                v-if="selectedGalleryImage && shouldShowImage(selectedGalleryImage.src)"
                :src="selectedGalleryImage.src"
                :alt="product.name"
                class="w-full h-full object-cover"
                :style="{ objectPosition: selectedGalleryImage.objectPosition || 'center' }"
                @error="markImageFailed(selectedGalleryImage.src)"
              />
              <span v-else class="text-[120px] md:text-[160px]">{{ placeholderText }}</span>

              <!-- Zoom hint -->
              <span class="absolute bottom-3 right-3 text-xs text-gray-400 bg-white bg-opacity-70 px-2 py-1 rounded-full">
                點擊放大
              </span>
            </div>

            <div v-if="galleryImages.length > 1" class="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
              <button
                v-for="(image, index) in galleryImages"
                :key="`${image.src}-${index}`"
                :aria-label="`查看第 ${index + 1} 張商品圖`"
                class="w-24 flex-shrink-0 overflow-hidden rounded-xl border bg-white transition-all"
                :class="selectedImageIndex === index ? 'border-brand-primary shadow-sm' : 'border-gray-200 hover:border-brand-primary/40'"
                @click="selectedImageIndex = index"
              >
                <img
                  v-if="shouldShowImage(image.src)"
                  :src="image.src"
                  :alt="`${product.name}-${index + 1}`"
                  class="h-16 w-full object-cover"
                  :style="{ objectPosition: image.objectPosition || 'center' }"
                  @error="markImageFailed(image.src)"
                />
                <span v-else class="flex h-16 w-full items-center justify-center text-3xl">{{ placeholderText }}</span>
              </button>
            </div>

          </div>

          <!-- ── 右欄：商品資訊 ── -->
          <div class="flex flex-col gap-4">

            <!-- 限時標籤 -->
            <div v-if="product.promotionLabel" class="flex items-center gap-2">
              <span class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                {{ product.promotionLabel }}
              </span>
            </div>

            <!-- 商品名稱 + 商品摘要 -->
            <div>
              <h1 class="text-2xl font-bold text-brand-dark leading-snug">{{ product.name }}</h1>
              <div v-if="product.isOrganic || product.tags.length" class="mt-2 flex flex-wrap gap-1.5">
                <span v-if="product.isOrganic" class="rounded-full border border-brand-surface bg-brand-surface px-2.5 py-1 text-xs font-bold text-brand-primary">
                  有機認證
                </span>
                <span
                  v-for="tag in product.tags"
                  :key="tag"
                  class="rounded-full border border-brand-surface bg-brand-surface px-2.5 py-1 text-xs font-bold text-brand-primary"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="mt-5 border-t border-gray-200 pt-5">
                <p v-if="productSummary" class="text-sm leading-7 text-gray-500">
                  {{ productSummary }}
                </p>

                <dl class="mt-5 space-y-3 text-sm leading-6">
                  <div v-if="!isBundleProductDetail" class="grid grid-cols-[1.5rem_4.5rem_1fr] items-center gap-x-2.5 text-gray-500 sm:grid-cols-[1.5rem_5.25rem_1fr]">
                    <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 7h10M7 11h10M7 15h6M5 3h14a1 1 0 011 1v16l-3-2-2 2-2-2-2 2-2-2-3 2V4a1 1 0 011-1z" />
                    </svg>
                    <dt>商品編號</dt>
                    <dd class="text-gray-700">{{ displayProductNo }}</dd>
                  </div>

                  <div v-if="displayUnit" class="grid grid-cols-[1.5rem_4.5rem_1fr] items-center gap-x-2.5 text-gray-500 sm:grid-cols-[1.5rem_5.25rem_1fr]">
                    <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 19h14M7 19l1.5-8h7L17 19M9 11V8a3 3 0 016 0v3M8 15h8" />
                    </svg>
                    <dt>商品規格</dt>
                    <dd class="text-gray-700">{{ displayUnit }}</dd>
                  </div>

                  <div class="grid grid-cols-[1.5rem_4.5rem_1fr] items-center gap-x-2.5 text-gray-500 sm:grid-cols-[1.5rem_5.25rem_1fr]">
                    <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21s7-4.4 7-11a7 7 0 10-14 0c0 6.6 7 11 7 11z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.5 10.5l1.6 1.6 3.4-4" />
                    </svg>
                    <dt>產地</dt>
                    <dd class="text-gray-700">{{ product.origin }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- 庫存狀態 badge -->
            <div v-if="stockStatus !== 'in-stock'" class="flex">
              <span :class="stockBadgeClass" class="text-sm font-semibold px-3 py-1 rounded-full">
                {{ stockLabel }}
              </span>
            </div>

            <!-- 價格區 -->
            <div class="py-2">
              <div class="space-y-5">
                <div>
                  <p v-if="hasRegularPrice" class="text-xs font-bold text-gray-400 line-through">
                    一般售價 ${{ regularPrice.toLocaleString() }}
                  </p>

                  <template v-if="displayRequiredOpPoints">
                    <p class="mt-2 flex flex-wrap items-baseline gap-0.5 whitespace-nowrap text-base font-bold leading-none text-brand-primary sm:text-lg">
                      <span>OP 點數加價購：</span>
                      <span>{{ displayRequiredOpPoints.toLocaleString() }}</span>
                      <span>OP 點</span>
                      <span v-if="displayPrice > 0">+ ${{ displayPrice.toLocaleString() }}</span>
                    </p>
                  </template>

                  <template v-else-if="hasDisplayPrice">
                    <p class="mt-2 flex flex-wrap items-baseline gap-0.5 whitespace-nowrap text-base font-bold leading-none text-brand-primary sm:text-lg">
                      <span>會員價：</span>
                      <span>$</span>{{ displayPrice.toLocaleString() }}
                    </p>
                  </template>
                </div>

                <label v-if="productVariants.length > 1 && !isBundleProductDetail" class="grid gap-2 sm:grid-cols-[4.5rem_1fr] sm:items-center">
                  <span class="text-sm font-bold text-gray-500">規格</span>
                  <span class="relative block">
                    <select
                      v-model="selectedVariantId"
                      class="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 pr-10 text-sm font-bold text-brand-dark outline-none transition-colors hover:border-brand-primary/40 focus:border-brand-primary focus:bg-white"
                    >
                      <option
                        v-for="variant in productVariants"
                        :key="variant.id"
                        :value="variant.id"
                      >
                        {{ variant.label }}｜{{ variant.unit }}
                      </option>
                    </select>
                    <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </label>

                <div v-if="!isBundleProductDetail" class="grid gap-3 sm:grid-cols-2 sm:items-end">
                  <div class="grid gap-2">
                    <label class="text-sm font-bold text-gray-500">{{ isBundleProductDetail ? '本商品數量' : '購買數量' }}</label>
                    <div class="flex w-full items-center overflow-hidden rounded-2xl border border-gray-300 bg-white">
                      <button
                        class="flex h-12 flex-1 items-center justify-center text-lg font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        :disabled="quantity <= 1"
                        :class="quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''"
                        @click="decrementMainQuantity"
                      >−</button>
                      <span class="flex h-12 flex-1 items-center justify-center text-sm font-semibold text-gray-800">{{ quantity }}</span>
                      <button
                        class="flex h-12 flex-1 items-center justify-center text-lg font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        :disabled="isBundleProductDetail && bundleSelectedCount >= bundleRequiredCount"
                        :class="isBundleProductDetail && bundleSelectedCount >= bundleRequiredCount ? 'opacity-40 cursor-not-allowed' : ''"
                        @click="incrementMainQuantity"
                      >+</button>
                    </div>
                  </div>

                  <button
                    class="flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold shadow-sm transition-all"
                    :class="canAddToCart
                      ? 'bg-brand-primary text-white hover:bg-brand-dark active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                    :disabled="!canAddToCart"
                    @click="addToCart"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M7 13H5.4M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    {{ addToCartLabel }}
                  </button>
                </div>
              </div>

              <!-- 促銷訊息 -->
              <GiftPromotionNote
                v-if="product.promotionMessage || giftProgressText"
                class="mt-4"
                :message="product.promotionMessage"
                :progress-text="giftProgressText"
                compact
              />
            </div>

            <!-- 配送狀態 -->
            <div class="py-2">
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-surface text-brand-primary">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h11v8H3V7zm11 3h4l3 3v2h-7v-5zM7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-800 whitespace-nowrap">配送方式</p>
                    <p class="text-sm leading-6 text-gray-400 whitespace-nowrap">全台配送・{{ tempLabel }}配送</p>
                  </div>
                </div>

                <div class="grid gap-2 sm:grid-cols-2 sm:gap-3">
                  <div
                    v-for="rule in availableDeliveryRules"
                    :key="rule.method"
                    class="rounded-xl bg-gray-50 px-3 py-2.5"
                    :class="deliveryRemaining(rule) === 0 ? 'bg-brand-surface/60' : 'bg-gray-50'"
                  >
                    <p class="text-sm font-bold text-gray-700 whitespace-nowrap">{{ rule.label }}</p>
                    <p
                      class="mt-1 text-sm leading-6"
                      :class="deliveryRemaining(rule) === 0 ? 'font-bold text-brand-primary' : 'text-gray-500'"
                    >
                      {{ deliveryRuleStatusText(rule) }}
                    </p>
                  </div>
                </div>

                <div class="w-full">
                  <div class="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span class="text-gray-600">
                      <template v-if="freeShippingRemaining > 0">
                        再買 <strong class="text-brand-primary">${{ freeShippingRemaining }}</strong> 享宅配免運
                      </template>
                      <template v-else>
                        已達宅配免運門檻
                      </template>
                    </span>
                    <span class="shrink-0 text-xs text-gray-400">門檻 ${{ zoneRule.freeAt }}</span>
                  </div>
                  <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      class="h-full rounded-full bg-brand-primary transition-all duration-500"
                      :style="{ width: `${freeShippingProgress}%` }"
                    />
                  </div>
                  <div class="mt-3 flex flex-wrap items-center justify-start gap-2">
                    <button
                      class="inline-flex h-10 min-w-[104px] items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-red-500"
                      :class="isWishlisted ? 'text-red-500' : ''"
                      :title="isWishlisted ? '取消收藏' : '加入收藏'"
                      @click.stop="isWishlisted = !isWishlisted"
                      :aria-label="isWishlisted ? '已收藏' : '收藏'"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="isWishlisted ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span class="whitespace-nowrap text-sm font-semibold">{{ isWishlisted ? '已收藏' : '收藏' }}</span>
                    </button>
                    <button
                      class="inline-flex h-10 min-w-[96px] items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-[#06C755] shadow-sm transition-colors hover:bg-gray-50"
                      @click="shareTo('line')"
                      aria-label="LINE 分享"
                      title="LINE 分享"
                    >
                      <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314zm-14.962 2.359c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.565zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629zm9.28-.629c0 .27-.174.51-.432.596a.64.64 0 01-.199.031c-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.65.65 0 01.194-.033c.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.565zm2.97.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629z"/>
                      </svg>
                      <span class="whitespace-nowrap text-sm font-semibold">分享</span>
                    </button>
                    <button
                      class="inline-flex h-10 min-w-[96px] items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-[#1877F2] shadow-sm transition-colors hover:bg-gray-50"
                      @click="shareTo('facebook')"
                      aria-label="Facebook 分享"
                      title="Facebook 分享"
                    >
                      <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span class="whitespace-nowrap text-sm font-semibold">分享</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 加入購物車成功提示 -->
            <transition name="fade">
              <div v-if="addedNotice" class="flex items-center gap-2 bg-brand-surface border border-brand-primary text-brand-primary text-sm px-4 py-2.5 rounded-xl">
                <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                已加入 {{ quantity }} 件到購物車！
              </div>
            </transition>

          </div>
        </div>

        <!-- 套組選購示意 -->
        <div v-if="showBundlePreview" class="mt-10 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm lg:p-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-base font-bold text-brand-primary">套組選購</p>
              <p class="mt-1 text-sm leading-6 text-gray-500">
                {{ bundlePreviewRuleText }}
              </p>
              <p class="mt-3 text-sm font-bold text-gray-700">
                已選 {{ bundleSelectedCount }} / {{ bundleRequiredCount }} 件
                <span class="text-brand-primary">{{ bundleRemainingCount > 0 ? `，再選 ${bundleRemainingCount} 件即可享組合價` : '，已符合組合價' }}</span>
              </p>
            </div>
            <span class="shrink-0 rounded-full bg-brand-surface px-3 py-1 text-xs font-bold text-brand-primary">組合價 ${{ bundlePreviewPrice.toLocaleString() }}</span>
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="(item, index) in bundlePreviewProducts"
              :key="item.id"
              class="rounded-2xl border border-gray-200 bg-gray-50 p-4"
            >
              <div class="flex gap-4">
                <div class="h-32 w-28 shrink-0 overflow-hidden rounded-2xl bg-white">
                  <img
                    v-if="shouldShowImage(item.image)"
                    :src="item.image"
                    :alt="item.name"
                    class="h-full w-full object-cover"
                    @error="markImageFailed(item.image)"
                  >
                  <span v-else class="flex h-full w-full items-center justify-center text-5xl">{{ placeholderText }}</span>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-start gap-2">
                    <span class="inline-flex h-6 shrink-0 items-center justify-center rounded-full bg-brand-surface px-2 text-xs font-bold text-brand-primary">
                      {{ index + 1 }}
                    </span>
                    <router-link
                      :to="bundleProductTo(item.id)"
                      class="min-w-0 flex-1 text-left text-sm font-bold leading-6 text-brand-dark transition-colors hover:text-brand-primary"
                    >
                      <span class="block truncate">{{ item.name }}</span>
                    </router-link>
                  </div>

                  <p class="mt-1 text-xs leading-5 text-gray-500">
                    {{ item.id.toUpperCase() }}｜{{ item.unit }}
                  </p>

                  <p class="mt-2 text-lg font-bold text-brand-primary">
                    ${{ previewPrice(item).toLocaleString() }}
                  </p>

                  <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <span class="font-semibold text-gray-600">數量</span>
                      <div class="inline-flex items-center rounded-full border border-gray-200 bg-white text-gray-700">
                      <button
                        type="button"
                        class="flex h-8 w-9 items-center justify-center text-base font-bold text-gray-400 transition-colors hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-30"
                        :disabled="bundlePreviewQuantity(item) <= bundleMinQuantity(item)"
                        @click="decrementBundleQuantity(item)"
                      >−</button>
                      <span class="w-8 text-center font-semibold">{{ bundlePreviewQuantity(item) }}</span>
                      <button
                        type="button"
                        class="flex h-8 w-9 items-center justify-center text-base font-bold text-gray-400 transition-colors hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-30"
                        :disabled="bundleSelectedCount >= bundleRequiredCount"
                        @click="incrementBundleQuantity(item)"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>

              <router-link
                :to="bundleProductTo(item.id)"
                class="mt-4 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brand-primary shadow-sm transition-colors hover:bg-brand-surface"
              >
                查看商品詳情
              </router-link>
            </article>
          </div>

          <div class="mt-5 flex flex-col gap-3 rounded-2xl bg-brand-surface px-4 py-3 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <span>{{ bundleRemainingCount > 0 ? `已選 ${bundleSelectedCount} 件，再選 ${bundleRemainingCount} 件即可享組合價。` : `已選滿 ${bundleRequiredCount} 件，可用組合價加入購物車。` }}</span>
            <button
              type="button"
              class="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-bold transition-colors"
              :class="isBundleComplete ? 'bg-brand-primary text-white hover:bg-brand-dark' : 'bg-white text-brand-primary'"
            >
              {{ isBundleComplete ? '加入購物車' : `再選 ${bundleRemainingCount} 件` }}
            </button>
          </div>
        </div>

        <!-- ── 詳細 Tab ── -->
        <div class="mt-12">
          <!-- Tab 標題列 -->
          <div class="flex border-b-2 border-gray-200 gap-0">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="px-6 py-3 text-sm font-medium transition-colors relative"
              :class="activeTab === tab.key
                ? 'text-brand-primary'
                : 'text-gray-500 hover:text-gray-700'"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
              <div
                v-if="activeTab === tab.key"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
              />
            </button>
          </div>

          <!-- Tab 內容 -->
          <div class="bg-white rounded-b-2xl rounded-tr-2xl p-6 min-h-[200px]">

            <!-- 產品特色 -->
            <div v-if="activeTab === 'features'">
              <ul v-if="displayFeatures.length" class="space-y-3">
                <li
                  v-for="(f, i) in displayFeatures"
                  :key="i"
                  class="flex items-start gap-3 text-gray-700"
                >
                  <span class="mt-0.5 w-6 h-6 flex-shrink-0 rounded-full bg-brand-surface text-brand-primary flex items-center justify-center text-xs font-bold">
                    {{ i + 1 }}
                  </span>
                  <span class="text-sm leading-relaxed">{{ f }}</span>
                </li>
              </ul>
            </div>

            <!-- 產品介紹 -->
            <div v-else-if="activeTab === 'introduction'">
              <div
                v-if="product.productDescriptionHtml"
                class="product-html text-sm text-gray-700 leading-8"
                v-html="product.productDescriptionHtml"
              />
              <p v-else class="text-sm text-gray-700 leading-8 whitespace-pre-line">{{ displayIntroduction }}</p>
            </div>

            <!-- 成分規格 -->
            <div v-else-if="activeTab === 'specs'">
              <div
                v-if="product.specificationHtml"
                class="product-html text-sm text-gray-700 leading-8"
                v-html="product.specificationHtml"
              />
              <div class="text-sm text-gray-700 leading-8">
                <div
                  v-if="!product.specificationHtml"
                  v-for="(line, i) in displaySpecs.split('\n')"
                  :key="i"
                  class="flex gap-2 py-1.5 border-b border-gray-50 last:border-0"
                >
                  <template v-if="line.includes('：')">
                    <span class="text-gray-400 w-28 flex-shrink-0">{{ line.split('：')[0] }}</span>
                    <span class="text-gray-800">{{ line.split('：').slice(1).join('：') }}</span>
                  </template>
                  <span v-else class="text-gray-600">{{ line }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── 推薦商品 ── -->
        <div v-if="relatedProducts.length" class="mt-14">
          <h2 class="text-xl font-bold text-brand-dark mb-5">您可能也喜歡</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ProductCard
              v-for="p in relatedProducts"
              :key="p.id"
              :product="p"
              layout="grid"
            />
          </div>
        </div>

      </div>
    </template>

    <!-- ── Lightbox ── -->
    <transition name="fade">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center"
        @click.self="lightboxOpen = false"
      >
        <div class="relative bg-white rounded-2xl p-10 flex items-center justify-center" style="min-width: 300px; min-height: 300px;">
          <button
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            @click="lightboxOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
            <img
            v-if="selectedGalleryImage && shouldShowImage(selectedGalleryImage.src)"
            :src="selectedGalleryImage.src"
            :alt="product.name"
            class="max-w-[70vw] max-h-[70vh] object-contain"
            :style="{ objectPosition: selectedGalleryImage.objectPosition || 'center' }"
            @error="markImageFailed(selectedGalleryImage.src)"
          />
          <span v-else class="text-[200px] leading-none select-none">{{ placeholderText }}</span>
        </div>
      </div>
    </transition>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Product, ProductVariant, Category, TempZone, TEMP_ZONE_LABEL } from '@/types'
import ProductCard from '@/components/product/ProductCard.vue'
import GiftPromotionNote from '@/components/promotion/GiftPromotionNote.vue'
import { getGiftProgressText } from '@/utils/promotions'
import { buildCategoryPathFromCategory, buildCategoryTrail } from '@/utils/category-path'
import { mockProducts } from '@/mock/data'

type StockStatus = 'in-stock' | 'sold-out' | 'restocking' | 'preorder'
type ProductDeliveryMethod = 'home' | 'cvs-pickup'

interface ProductDeliveryRule {
  method: ProductDeliveryMethod
  label: string
  fee: number
  freeAt: number
}

const ZONE_DELIVERY_RULES: Record<TempZone, { home: ProductDeliveryRule; 'cvs-pickup'?: ProductDeliveryRule }> = {
  ambient: {
    home: { method: 'home', label: '宅配到府', fee: 120, freeAt: 1200 },
    'cvs-pickup': { method: 'cvs-pickup', label: '超商取貨', fee: 60, freeAt: 599 },
  },
  chilled: {
    home: { method: 'home', label: '宅配到府', fee: 100, freeAt: 1500 },
  },
  frozen: {
    home: { method: 'home', label: '宅配到府', fee: 120, freeAt: 800 },
    'cvs-pickup': { method: 'cvs-pickup', label: '超商取貨', fee: 100, freeAt: 800 },
  },
  fresh: {
    home: { method: 'home', label: '宅配到府', fee: 120, freeAt: 800 },
  },
}

interface Tab {
  key: string
  label: string
}

interface GalleryImage {
  src: string
  objectPosition?: string
}

function normalizeProductId(value: string): string {
  const raw = String(value || '').trim()
  const withoutQuery = raw.split('?')[0].split('#')[0]
  try {
    return decodeURIComponent(withoutQuery).toLowerCase()
  } catch (_error) {
    return withoutQuery.toLowerCase()
  }
}

export default Vue.extend({
  name: 'ProductDetailView',
  components: { ProductCard, GiftPromotionNote },

  data() {
    return {
      quantity:           1,
      isWishlisted:       false,
      lightboxOpen:       false,
      selectedImageIndex: 0,
      selectedVariantId:  '',
      galleryTouchStartX: 0,
      activeTab:          'features' as string,
      addedNotice:        false,
      shareNotice:        '',
      bundleQuantities:   {} as Record<string, number>,
      failedImageUrls:     {} as Record<string, boolean>,

      tabs: [
        { key: 'features',     label: '產品特色' },
        { key: 'introduction', label: '產品介紹' },
        { key: 'specs',        label: '成分規格' },
      ] as Tab[],
    }
  },

  computed: {
    product(): Product | undefined {
      const id = this.$route.params.id
      return this.$store.getters['products/productById'](id)
        || (mockProducts as Product[]).find((product) => normalizeProductId(product.id) === normalizeProductId(id))
    },
    categories(): Category[] {
      return this.$store.getters['products/allCategories']
    },

    category(): Category | undefined {
      if (!this.product) return undefined
      return this.$store.getters['products/categoryById'](this.product.categoryId)
    },
    categoryBreadcrumb(): Category[] {
      if (!this.product) return []
      return buildCategoryTrail(this.categories, this.product.categoryId)
    },

    productListBackTo(): string {
      const from = this.safePath(this.$route.query.from)
      if (from && !from.startsWith('/products/')) return from
      return this.category ? buildCategoryPathFromCategory(this.categories, this.category.id) : '/products'
    },

    relatedProducts(): Product[] {
      if (!this.product) return []
      return this.$store.getters['products/relatedProducts'](
        this.product.categoryId,
        this.product.id
      )
    },
    galleryImages(): GalleryImage[] {
      if (!this.product) return []
      const rawImages = this.product.images?.length ? this.product.images : [this.product.image]
      return rawImages.map((src, index) => ({
        src,
        objectPosition: this.galleryObjectPosition(index),
      }))
    },
    selectedGalleryImage(): GalleryImage | null {
      return this.galleryImages[this.selectedImageIndex] || this.galleryImages[0] || null
    },
    placeholderText(): string {
      return '🌿'
    },

    // 庫存狀態：優先使用 stockStatus 欄位，否則從 inStock 推斷
    stockStatus(): StockStatus {
      if (!this.product) return 'sold-out'
      if (this.product.stockStatus) return this.product.stockStatus
      return this.product.inStock ? 'in-stock' : 'sold-out'
    },

    stockLabel(): string {
      const map: Record<StockStatus, string> = {
        'in-stock':    '',
        'sold-out':    '已售完',
        'restocking':  '補貨中',
        'preorder':    '預購中',
      }
      return map[this.stockStatus]
    },

    stockBadgeClass(): string {
      const map: Record<StockStatus, string> = {
        'in-stock':   '',
        'sold-out':   'bg-red-100 text-red-600',
        'restocking': 'bg-orange-100 text-orange-600',
        'preorder':   'bg-blue-100 text-blue-600',
      }
      return map[this.stockStatus]
    },

    canAddToCart(): boolean {
      if (this.isBundleProductDetail) return this.isBundleComplete
      return this.stockStatus === 'in-stock' || this.stockStatus === 'preorder'
    },

    addToCartLabel(): string {
      if (this.isBundleProductDetail) {
        return this.isBundleComplete ? '加入購物車' : `再選 ${this.bundleRemainingCount} 件`
      }
      if (this.stockStatus === 'sold-out')   return '已售完'
      if (this.stockStatus === 'restocking') return '補貨中，無法購買'
      if (this.stockStatus === 'preorder')   return '加入預購車'
      return '加入購物車'
    },

    productSummary(): string {
      if (!this.product) return ''
      if (this.product.description) return this.product.description

      const organicText = this.product.isOrganic ? '有機' : '嚴選'
      return `${organicText}${this.product.name}，來自${this.product.origin}，${this.displayUnit}規格適合日常補給與家庭分享。`
    },

    productVariants(): ProductVariant[] {
      if (!this.product) return []
      if (this.product.variants?.length) return this.product.variants
      return [{
        id: 'default',
        label: this.product.unit,
        unit: this.product.unit,
        price: this.product.price,
        originalPrice: this.product.originalPrice,
        memberPrice: this.product.memberPrice,
        requiredOpPoints: this.product.requiredOpPoints,
      }]
    },

    selectedVariant(): ProductVariant {
      return this.productVariants.find((variant) => variant.id === this.selectedVariantId) || this.productVariants[0]
    },

    displayUnit(): string {
      return this.selectedVariant?.unit || this.product?.unit || ''
    },
    displayProductNo(): string {
      return (this.product?.productNo || this.product?.id || '').toUpperCase()
    },

    displayRequiredOpPoints(): number {
      return this.selectedVariant?.requiredOpPoints || this.product?.requiredOpPoints || 0
    },

    tempLabel(): string {
      if (!this.product) return ''
      return TEMP_ZONE_LABEL[this.product.tempZone as TempZone]
    },

    tempBadgeClass(): string {
      if (!this.product) return ''
      const map: Record<TempZone, string> = {
        ambient: 'bg-temp-ambient',
        chilled: 'bg-temp-chilled',
        frozen:  'bg-temp-frozen',
        fresh:   'bg-temp-fresh',
      }
      return map[this.product.tempZone as TempZone]
    },

    tempShippingFee(): string {
      if (!this.product) return ''
      return `宅配 $${this.zoneRule.fee.toLocaleString()}，滿 $${this.zoneRule.freeAt.toLocaleString()} 免運`
    },

    tempDetailLabel(): string {
      if (!this.product) return ''
      return `${this.tempLabel}（${this.tempShippingFee}）`
    },

    shippingMethodLabel(): string {
      if (!this.product) return ''
      return this.product.conveniencePickup ? '宅配到府、超商取貨' : '宅配到府'
    },

    displayPrice(): number {
      if (!this.product || !this.selectedVariant) return 0
      return Math.round(this.selectedVariant.memberPrice ?? this.selectedVariant.originalPrice ?? this.selectedVariant.price)
    },
    hasDisplayPrice(): boolean {
      return Number.isFinite(this.displayPrice) && this.displayPrice > 0
    },

    regularPrice(): number {
      if (!this.product || !this.selectedVariant) return 0
      return Math.round(this.selectedVariant.originalPrice ?? this.selectedVariant.price)
    },
    hasRegularPrice(): boolean {
      return Number.isFinite(this.regularPrice) && this.regularPrice > 0
    },

    hasMemberPrice(): boolean {
      if (!this.selectedVariant?.memberPrice) return false
      return this.regularPrice > this.displayPrice
    },

    savingAmount(): number {
      return Math.max(0, this.regularPrice - this.displayPrice)
    },

    savingLabel(): string {
      if (!this.savingAmount) return ''
      return `現省 $${this.savingAmount.toLocaleString()}`
    },

    priceBadge(): string {
      if (!this.product) return ''
      if (this.displayRequiredOpPoints) return 'OP 換購'
      if (this.hasMemberPrice) return '會員專屬價'
      return ''
    },

    subtotal(): number {
      return this.displayPrice * this.quantity
    },
    giftProgressText(): string {
      if (!this.product) return ''
      return getGiftProgressText(this.product, this.quantity)
    },

    zoneRule(): ProductDeliveryRule {
      if (!this.product) return ZONE_DELIVERY_RULES.ambient.home
      return ZONE_DELIVERY_RULES[this.product.tempZone].home
    },

    availableDeliveryRules(): ProductDeliveryRule[] {
      if (!this.product) return []
      const zoneRules = ZONE_DELIVERY_RULES[this.product.tempZone]
      const rules = [zoneRules.home]
      if (this.product.conveniencePickup && zoneRules['cvs-pickup']) rules.push(zoneRules['cvs-pickup'])
      return rules
    },

    currentZoneSubtotal(): number {
      if (!this.product) return 0
      const itemsByZone = this.$store.getters['cart/itemsByZone']
      return itemsByZone[this.product.tempZone].reduce((sum: number, item: { product: Product; quantity: number }) => {
        const price = item.product.memberPrice ?? item.product.originalPrice ?? item.product.price
        return sum + price * item.quantity
      }, 0)
    },

    projectedZoneSubtotal(): number {
      return this.currentZoneSubtotal + this.subtotal
    },

    freeShippingRemaining(): number {
      return Math.max(0, this.zoneRule.freeAt - this.projectedZoneSubtotal)
    },

    freeShippingProgress(): number {
      return Math.min(100, Math.round((this.projectedZoneSubtotal / this.zoneRule.freeAt) * 100))
    },

    shareUrl(): string {
      if (typeof window === 'undefined') return ''
      return window.location.href
    },

    displayFeatures(): string[] {
      if (this.product?.features?.length) return this.product.features
      return [
        '低溫烘焙保留食材原味與清爽口感。',
        '獨立包裝設計，外出攜帶與日常分食都方便。',
        '適合作為早餐、下午茶或運動後的輕食補充。'
      ]
    },
    displayIntroduction(): string {
      if (this.product?.introduction) return this.product.introduction
      return '嚴選原料搭配穩定製程，保留食材本身香氣與營養特色，適合日常家庭常備、個人補給與輕食搭配。開封後即可食用，也能搭配沙拉、優格或早餐穀物一起享用。'
    },
    bundlePreviewSourcePath(): string {
      const from = this.safePath(this.$route.query.from)
      if (!from) return ''

      const [path, queryString = ''] = from.split('?')
      if (path !== '/event/SUMMER2026') return ''

      const params = new URLSearchParams(queryString)
      return params.get('group') === 'flash' && params.get('item') === 'flash-bundle' ? from : ''
    },
    isBundleProductDetail(): boolean {
      return Boolean(this.bundlePreviewSourcePath)
    },
    showBundlePreview(): boolean {
      return Boolean(this.bundlePreviewSourcePath && this.bundlePreviewProducts.length)
    },
    bundleRequiredCount(): number {
      return this.bundlePreviewConfig.requiredCount
    },
    bundlePreviewPrice(): number {
      return this.bundlePreviewConfig.price
    },
    bundlePreviewRuleText(): string {
      return this.bundlePreviewConfig.ruleText
    },
    bundlePreviewConfig(): { requiredCount: number; price: number; ruleText: string } {
      const bundleId = Array.isArray(this.$route.query.bundle) ? this.$route.query.bundle[0] : this.$route.query.bundle
      const configs: Record<string, { requiredCount: number; price: number; ruleText: string }> = {
        'optional-fixed-999': {
          requiredCount: 3,
          price: 999,
          ruleText: '堅果果乾任選 3 件，原價 $1,260，折抵 $261，活動價 $999。',
        },
        'abc-daily-1290': {
          requiredCount: 3,
          price: 1290,
          ruleText: 'A+B+C 三區各選 1 件，原價 $1,580，折抵 $290，活動價 $1,290。',
        },
        'fixed-three-390': {
          requiredCount: 3,
          price: 390,
          ruleText: '指定商品任選 3 件，原價 $520，折抵 $130，活動價 $390。',
        },
        'same-zone-six': {
          requiredCount: 6,
          price: 1680,
          ruleText: '同區商品任選滿 6 件，原價 $1,980，折抵 $300，活動價 $1,680。',
        },
      }
      return configs[String(bundleId || '')] || {
        requiredCount: 2,
        price: 990,
        ruleText: 'A 區商品 1 件 + B 區商品 1 件，原價 $1,180，折抵 $190，活動價 $990。',
      }
    },
    bundleSelectedCount(): number {
      return this.bundlePreviewProducts.reduce((sum, item) => sum + this.bundlePreviewQuantity(item), 0)
    },
    bundleRemainingCount(): number {
      return Math.max(0, this.bundleRequiredCount - this.bundleSelectedCount)
    },
    isBundleComplete(): boolean {
      return this.bundleSelectedCount >= this.bundleRequiredCount
    },
    bundlePreviewProducts(): Product[] {
      if (!this.product) return []
      const fallback = (this.$store.getters['products/allProducts'] as Product[])
        .filter((item) => normalizeProductId(item.id) !== normalizeProductId(this.product!.id))
      const pool = this.relatedProducts.length ? this.relatedProducts : fallback
      if (!this.isBundleProductDetail) return pool.slice(0, 2)
      return [
        this.product,
        ...pool.filter((item) => normalizeProductId(item.id) !== normalizeProductId(this.product!.id)),
      ].slice(0, 2)
    },
    displaySpecs(): string {
      if (this.product?.specs) return this.product.specs
      return '內容物：嚴選食材綜合配方\n淨重：依商品包裝標示\n保存方式：請置於陰涼乾燥處，避免陽光直射\n有效日期：標示於包裝上\n產地：台灣'
    },
  },

  watch: {
    product: {
      immediate: true,
      handler() {
        this.selectedVariantId = this.productVariants[0]?.id || ''
      },
    },

    // 切換商品時重置狀態
    '$route.params.id'() {
      this.quantity = 1
      this.isWishlisted = false
      this.selectedImageIndex = 0
      this.selectedVariantId = ''
      this.activeTab = 'features'
      this.addedNotice = false
      this.shareNotice = ''
      this.bundleQuantities = {}
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },

  methods: {
    buildCategoryPathFromCategory,

    safePath(value: unknown): string {
      const path = Array.isArray(value) ? value[0] : value
      if (typeof path !== 'string') return ''
      if (!path.startsWith('/') || path.startsWith('//')) return ''
      if (path === this.$route.fullPath) return ''
      return path
    },

    isImageUrl(image: string) {
      return /^https?:\/\//.test(image) || image.startsWith('/')
    },
    shouldShowImage(image: string) {
      return this.isImageUrl(image) && !this.failedImageUrls[image]
    },
    markImageFailed(image: string) {
      this.$set(this.failedImageUrls, image, true)
    },

    previewPrice(product: Product): number {
      return Math.round(product.memberPrice ?? product.originalPrice ?? product.price)
    },

    bundlePreviewQuantity(product: Product): number {
      if (this.product && normalizeProductId(product.id) === normalizeProductId(this.product.id)) {
        return this.quantity
      }
      return this.bundleQuantities[normalizeProductId(product.id)] || 0
    },

    bundleMinQuantity(product: Product): number {
      return this.product && normalizeProductId(product.id) === normalizeProductId(this.product.id) ? 1 : 0
    },

    incrementMainQuantity() {
      if (this.isBundleProductDetail && this.bundleSelectedCount >= this.bundleRequiredCount) return
      this.quantity += 1
    },

    decrementMainQuantity() {
      if (this.quantity <= 1) return
      this.quantity -= 1
    },

    incrementBundleQuantity(product: Product) {
      if (this.bundleSelectedCount >= this.bundleRequiredCount) return
      if (this.product && normalizeProductId(product.id) === normalizeProductId(this.product.id)) {
        this.incrementMainQuantity()
        return
      }
      const id = normalizeProductId(product.id)
      this.$set(this.bundleQuantities, id, (this.bundleQuantities[id] || 0) + 1)
    },

    decrementBundleQuantity(product: Product) {
      if (this.bundlePreviewQuantity(product) <= this.bundleMinQuantity(product)) return
      if (this.product && normalizeProductId(product.id) === normalizeProductId(this.product.id)) {
        this.decrementMainQuantity()
        return
      }
      const id = normalizeProductId(product.id)
      this.$set(this.bundleQuantities, id, Math.max(0, (this.bundleQuantities[id] || 0) - 1))
    },

    bundleProductTo(productId: string): { path: string; query?: Record<string, string> } {
      const bundleId = Array.isArray(this.$route.query.bundle) ? this.$route.query.bundle[0] : this.$route.query.bundle
      const query = this.bundlePreviewSourcePath ? { from: this.bundlePreviewSourcePath, ...(bundleId ? { bundle: String(bundleId) } : {}) } : undefined
      return { path: `/products/${productId}`, query }
    },

    galleryObjectPosition(index: number) {
      if (!this.product) return 'center center'
      if (this.product.images && this.product.images.length > 1) return 'center center'
      if (this.product.id === 'op202') {
        return ['center center', '34% center', '78% center'][index] || 'center center'
      }
      return 'center center'
    },

    deliveryRemaining(rule: ProductDeliveryRule): number {
      return Math.max(0, rule.freeAt - this.projectedZoneSubtotal)
    },

    deliveryRuleStatusText(rule: ProductDeliveryRule): string {
      const remaining = this.deliveryRemaining(rule)
      if (remaining === 0) return '已達免運'
      return `還差 $${remaining.toLocaleString()} 免運，未滿 $${rule.fee.toLocaleString()}`
    },

    previousImage() {
      if (this.galleryImages.length <= 1) return
      this.selectedImageIndex = (this.selectedImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length
    },

    nextImage() {
      if (this.galleryImages.length <= 1) return
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.galleryImages.length
    },

    onGalleryTouchStart(event: TouchEvent) {
      this.galleryTouchStartX = event.changedTouches[0]?.clientX || 0
    },

    onGalleryTouchEnd(event: TouchEvent) {
      const touchEndX = event.changedTouches[0]?.clientX || 0
      const deltaX = touchEndX - this.galleryTouchStartX

      if (Math.abs(deltaX) < 40) return
      if (deltaX < 0) {
        this.nextImage()
        return
      }
      this.previousImage()
    },

    addToCart() {
      if (!this.product || !this.canAddToCart) return
      const variant = this.selectedVariant
      this.$store.dispatch('cart/addItem', {
        ...this.product,
        id: `${this.product.id}-${variant.id}`,
        name: `${this.product.name} (${variant.label})`,
        unit: variant.unit,
        price: Math.round(variant.price),
        originalPrice: variant.originalPrice,
        memberPrice: variant.memberPrice,
        requiredOpPoints: variant.requiredOpPoints ?? this.product.requiredOpPoints,
        quantity: this.quantity,
      })
      this.$store.dispatch('ui/openCartDrawer')
      this.addedNotice = true
      setTimeout(() => { this.addedNotice = false }, 3000)
    },

    shareTo(platform: 'line' | 'facebook') {
      if (!this.product || !this.shareUrl) return
      const text = encodeURIComponent(`${this.product.name}｜統一生機`)
      const url = encodeURIComponent(this.shareUrl)
      const target = platform === 'line'
        ? `https://social-plugins.line.me/lineit/share?url=${url}`
        : `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`

      window.open(target, '_blank', 'noopener,noreferrer,width=720,height=640')
    },

    async copyLink() {
      if (!this.shareUrl) return
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(this.shareUrl)
        } else {
          const input = document.createElement('input')
          input.value = this.shareUrl
          document.body.appendChild(input)
          input.select()
          document.execCommand('copy')
          document.body.removeChild(input)
        }
        this.shareNotice = '商品連結已複製'
        window.setTimeout(() => { this.shareNotice = '' }, 2500)
      } catch (_error) {
        this.shareNotice = '無法自動複製，請手動複製網址'
      }
    },
  },
})
</script>

<style scoped>
.product-html ::v-deep img {
  max-width: 100%;
  height: auto;
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
