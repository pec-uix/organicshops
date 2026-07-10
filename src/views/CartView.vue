<template>
  <div class="max-w-7xl mx-auto px-4 py-8">

    <!-- ── 頁首 ── -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-brand-dark">購物車</h1>
        <p class="text-sm text-gray-500 mt-0.5">共 {{ totalCount }} 件商品</p>
      </div>
      <router-link to="/products" class="flex items-center gap-1.5 text-brand-primary hover:text-brand-dark text-sm font-medium transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        繼續購物
      </router-link>
    </div>

    <!-- ── 空購物車 ── -->
    <div v-if="totalCount === 0" class="flex flex-col items-center justify-center py-28 gap-5 text-center">
      <span class="text-8xl select-none">🛍️</span>
      <h2 class="text-xl font-bold text-gray-700">您的購物車是空的</h2>
      <p class="text-gray-400 text-sm">快去挑選您喜歡的有機好物吧！</p>
      <router-link to="/products" class="btn-primary px-8 py-3 text-base">去逛逛</router-link>
    </div>

    <div v-else class="space-y-6">

      <!-- ══ 溫層分區商品列表 ══ -->
      <div class="space-y-6">

        <!-- ── 溫層分開結帳說明 ── -->
        <div class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <span class="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-amber-400"></span>
          <div class="text-sm text-amber-800">
            <p class="font-semibold mb-0.5">不同溫層需分開付款</p>
            <p class="leading-relaxed opacity-80">
              常溫、冷藏、冷凍、產地直送商品由不同配送車輛運送，
              各溫層需個別結帳。每個溫層下方均有獨立「前往結帳」按鈕。
            </p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="border-b border-gray-100 px-3 py-3 sm:px-5">
            <div class="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 snap-x snap-mandatory">
              <button
                v-for="zone in visibleZones"
                :key="zone.key"
                type="button"
                class="snap-start flex min-w-[10.5rem] flex-shrink-0 items-center justify-between gap-3 rounded-full border px-4 py-3 text-left transition-all sm:min-w-[11.5rem]"
                :class="activeZoneKey === zone.key
                  ? 'shadow-sm ring-2 ring-offset-2 ring-offset-white'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'"
                :style="activeZoneKey === zone.key ? {
                  borderColor: zone.color,
                  backgroundColor: `${zone.color}14`,
                  color: zone.color,
                  ringColor: `${zone.color}22`,
                } : {}"
                @click="activeZoneKey = zone.key"
              >
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-base">{{ zone.icon }}</span>
                    <span class="text-sm font-bold whitespace-nowrap">{{ zone.label }}</span>
                  </div>
                  <p class="mt-1 text-[11px] font-medium opacity-70">
                    {{ zone.items.length }} 項商品
                  </p>
                </div>
                <span
                  class="inline-flex flex-shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold"
                  :style="{
                    backgroundColor: activeZoneKey === zone.key ? '#FFFFFFCC' : `${zone.color}12`,
                    color: zone.color,
                  }"
                >
                  ${{ zoneSubtotal(zone).toLocaleString() }}
                </span>
              </button>
            </div>
          </div>

          <!-- ── 目前溫層區塊 ── -->
          <template v-if="activeZone">
          <!-- 溫層標題 -->
          <div
            class="flex items-center justify-between px-5 py-3"
            :style="{ backgroundColor: activeZone.color + '18', borderLeft: `4px solid ${activeZone.color}` }"
          >
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ activeZone.icon }}</span>
              <span class="font-bold text-base" :style="{ color: activeZone.color }">{{ activeZone.label }}</span>
              <span class="text-xs text-gray-500 bg-white bg-opacity-70 px-2 py-0.5 rounded-full">
                {{ activeZone.items.length }} 項
              </span>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-700">
                小計 <span class="text-base" :style="{ color: activeZone.color }">${{ zoneSubtotal(activeZone).toLocaleString() }}</span>
              </p>
              <p v-if="zoneOpPoints(activeZone) > 0" class="text-xs font-semibold text-brand-accent mt-0.5">
                此溫層 OP 換購 {{ zoneOpPoints(activeZone).toLocaleString() }} 點
              </p>
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="divide-y divide-gray-50">
            <template v-for="item in activeZone.items">
            <div
              :key="item.product.id"
              class="flex flex-wrap items-start gap-3 px-5 py-4 sm:flex-nowrap"
            >
              <!-- 商品圖 -->
              <div
                class="h-24 w-24 min-h-[6rem] min-w-[6rem] flex-shrink-0 rounded-xl flex items-center justify-center text-3xl select-none sm:h-16 sm:w-16 sm:min-h-[4rem] sm:min-w-[4rem]"
                :style="{ backgroundColor: activeZone.color + '15' }"
              >
                <img
                  v-if="isImageUrl(item.product.image)"
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="h-full w-full rounded-xl object-cover"
                />
                <span v-else>{{ item.product.image }}</span>
              </div>

              <!-- 商品資訊 -->
              <div class="min-w-[12rem] flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    v-if="productBadgeText(item.product)"
                    class="inline-flex shrink-0 items-center rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-black leading-none text-brand-primary"
                  >
                    {{ productBadgeText(item.product) }}
                  </span>
                  <router-link
                    :to="`/products/${item.product.id}`"
                    class="text-sm font-semibold text-gray-800 transition-colors line-clamp-1 hover:text-brand-primary"
                  >
                    {{ displayCartProductName(item.product) }}
                  </router-link>
                </div>
                <p class="text-xs text-gray-400 mt-0.5">{{ item.product.unit }}・{{ item.product.origin }}</p>
                <div
                  v-if="selectedVariantDetails(item).length"
                  class="mt-1.5 grid gap-x-4 gap-y-0.5 pr-2 text-xs leading-5 text-gray-500"
                  :class="selectedVariantDetails(item).length >= 6 ? 'grid-cols-2' : 'grid-cols-1'"
                >
                  <p
                    v-for="detail in selectedVariantDetails(item)"
                    :key="detail"
                    class="min-w-0 truncate"
                  >
                    {{ detail }}
                  </p>
                </div>
                <p class="mt-2 text-sm font-bold text-brand-primary">
                  ${{ displayPrice(item.product).toLocaleString() }}
                </p>
                <p
                  v-if="lineOpPoints(item) > 0"
                  class="mt-1 text-xs font-semibold text-brand-accent"
                >
                  OP 換購：{{ item.product.requiredOpPoints }} 點 / 件
                  <span class="text-gray-400">，本項共 {{ lineOpPoints(item).toLocaleString() }} 點</span>
                </p>
                <GiftPromotionNote
                  v-if="item.product.promotionMessage || giftProgressText(item)"
                  class="mt-3"
                  compact
                  :message="item.product.promotionMessage"
                  :progress-text="giftProgressText(item)"
                />
              </div>

              <!-- 數量 +/- -->
              <div class="flex flex-shrink-0 items-center overflow-hidden rounded-xl border border-gray-200">
                <button
                  class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-medium"
                  @click="decrement(item)"
                >−</button>
                <span class="w-9 text-center text-sm font-semibold text-gray-800 select-none">
                  {{ item.quantity }}
                </span>
                <button
                  class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-medium"
                  @click="increment(item)"
                >+</button>
              </div>

              <!-- 小計 -->
              <div class="min-w-[5rem] flex-shrink-0 text-left sm:text-right">
                <p class="text-sm font-bold text-gray-800">
                  ${{ (displayPrice(item.product) * item.quantity).toLocaleString() }}
                </p>
                <p v-if="lineOpPoints(item) > 0" class="mt-1 text-[11px] font-bold text-brand-accent">
                  + {{ lineOpPoints(item).toLocaleString() }} OP
                </p>
              </div>

              <!-- 刪除 -->
              <button
                class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400"
                @click="removeItem(item.product.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <template v-if="giftRowQuantity(item) > 0">
              <div :key="`gift-row-${item.product.id}`" class="flex flex-wrap items-start gap-3 rounded-2xl border border-brand-primary/10 bg-brand-surface/30 px-5 py-4 sm:flex-nowrap">
                <div
                  class="h-24 w-24 min-h-[6rem] min-w-[6rem] flex-shrink-0 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-2xl shadow-sm sm:h-16 sm:w-16 sm:min-h-[4rem] sm:min-w-[4rem]"
                >
                  <img
                    v-if="isImageUrl(giftRowImage(item))"
                    :src="giftRowImage(item)"
                    :alt="giftRowName(item)"
                    class="h-full w-full rounded-xl object-cover"
                  />
                  <span v-else>{{ giftRowImage(item) }}</span>
                </div>

                <div class="min-w-[12rem] flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="inline-flex shrink-0 items-center rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-black leading-none text-brand-primary">
                      贈品
                    </span>
                    <router-link
                      :to="`/products/${giftRowProductId(item)}`"
                      class="text-sm font-semibold text-gray-700 transition-colors line-clamp-1 hover:text-brand-primary"
                    >
                      {{ giftRowName(item) }}
                    </router-link>
                  </div>
                  <p class="mt-0.5 text-xs text-gray-400">{{ giftRowUnit(item) }}・{{ giftRowOrigin(item) }}</p>
                  <p class="mt-2 text-sm font-bold text-gray-800">$0</p>
                </div>

                <div class="flex h-8 w-[6.5rem] flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-500">
                  {{ giftRowQuantity(item) }}
                </div>

                <div class="min-w-[5rem] flex-shrink-0 text-left sm:text-right">
                  <p class="text-sm font-bold text-gray-800">$0</p>
                </div>

                <div class="hidden h-7 w-7 flex-shrink-0 sm:block" aria-hidden="true"></div>
              </div>
            </template>
            </template>

            <template v-if="showAmbientGiftRows(activeZone)">
              <div
                v-for="gift in zoneGiftItems(activeZone)"
                :key="gift.id"
                class="flex flex-wrap items-start gap-3 rounded-2xl border border-brand-primary/10 bg-brand-surface/30 px-5 py-4 sm:flex-nowrap"
              >
                <!-- 贈品圖 -->
                <div
                  class="flex h-24 w-24 min-h-[6rem] min-w-[6rem] flex-shrink-0 items-center justify-center rounded-xl bg-white text-3xl shadow-sm sm:h-16 sm:w-16 sm:min-h-[4rem] sm:min-w-[4rem]"
                >
                  {{ gift.image }}
                </div>

                <!-- 贈品資訊 -->
                <div class="min-w-[12rem] flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-black text-brand-primary">贈品</span>
                    <h4 class="line-clamp-1 text-sm font-semibold text-gray-800">
                      {{ gift.name }}
                    </h4>
                  </div>
                  <p class="mt-0.5 text-xs text-gray-400">{{ gift.unit }}</p>
                  <p class="mt-2 text-sm font-bold text-brand-primary">$0</p>
                </div>

                <!-- 贈品數量 -->
                <div class="flex h-8 w-[6.5rem] flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-500">
                  {{ gift.quantity }}
                </div>

                <!-- 贈品小計 -->
                <div class="min-w-[5rem] flex-shrink-0 text-left sm:text-right">
                  <p class="text-sm font-bold text-gray-800">$0</p>
                </div>

                <div class="hidden h-7 w-7 flex-shrink-0 sm:block" aria-hidden="true"></div>
              </div>
            </template>
          </div>

          <!-- 免運進度條 -->
          <div class="px-5 py-3 border-t border-gray-50" :style="{ backgroundColor: activeZone.color + '08' }">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span :style="{ color: activeZone.color }" class="font-medium">
                {{ zoneProgressTitle(activeZone) }}
              </span>
              <span class="text-gray-400">門檻 ${{ zoneProgressThreshold(activeZone).toLocaleString() }}</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: `${zoneProgress(activeZone)}%`, backgroundColor: activeZone.color }"
              />
            </div>
            <div
              v-if="zoneShippingNotes(activeZone).length"
              class="mt-3 grid gap-y-1 border-s-2 border-brand-primary/20 px-3 text-xs font-medium leading-5 text-gray-500"
            >
              <p
                v-for="note in zoneShippingNotes(activeZone)"
                :key="note.text"
                :class="note.reached ? 'text-brand-primary' : 'text-gray-500'"
              >
                {{ note.text }}
                <span
                  v-if="note.description"
                  class="block pl-5 text-[11px] leading-5 text-gray-400"
                >
                  <span
                    v-for="line in note.description"
                    :key="line"
                    class="block"
                  >
                    {{ line }}
                  </span>
                </span>
              </p>
            </div>
          </div>

          <div class="px-5 py-4 border-t border-gray-50 space-y-4">
            <h3 class="text-sm font-bold text-gray-800">折價券 / 折扣碼</h3>

            <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
              <div>
                <p class="text-xs font-bold text-gray-400 mb-2">選擇折價券</p>
                <select
                  v-model.number="zoneCouponDrafts[activeZone.key].selectedCouponId"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option :value="null">不使用折價券</option>
                  <option
                    v-for="coupon in zoneSelectableCoupons(activeZone)"
                    :key="coupon.id"
                    :value="coupon.id"
                  >
                    {{ coupon.title }} - {{ couponLabel(coupon) }}
                  </option>
                </select>
                <p v-if="zoneSelectedCoupon(activeZone)" class="mt-2 text-xs text-gray-400">
                  {{ zoneSelectedCoupon(activeZone).scope }}｜{{ zoneSelectedCoupon(activeZone).expiryDate }} 到期｜{{ couponLabel(zoneSelectedCoupon(activeZone)) }}，本次折抵 NT.{{ zoneSelectedCouponDiscount(activeZone).toLocaleString() }}
                </p>
              </div>

              <div>
                <p class="text-xs font-bold text-gray-400 mb-2">輸入折價券 / 折扣碼</p>
                <div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <input
                    ref="couponCodeInput"
                    v-model="zoneCouponDrafts[activeZone.key].couponCode"
                    type="text"
                    placeholder="輸入券號或折扣碼"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm uppercase tracking-wider text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    @input="handleCouponCodeInput(activeZone.key)"
                  />
                  <button
                    type="button"
                    class="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm font-bold text-brand-primary transition-colors hover:bg-brand-surface sm:w-auto"
                    @click="applyCouponCode(activeZone.key)"
                  >
                    套用
                  </button>
                </div>
                <p
                  v-if="zoneCouponDrafts[activeZone.key].couponCodeStatus"
                  class="mt-2 text-xs font-medium"
                  :class="zoneCouponDrafts[activeZone.key].couponCodeStatus === 'error' ? 'text-red-400' : 'text-brand-primary'"
                >
                  {{ zoneCouponCodeMessage(activeZone.key) }}
                </p>
                <p class="mt-2 text-xs text-gray-400">
                  折價券 / 折扣碼折抵 NT.{{ zoneCouponCodeDiscount(activeZone).toLocaleString() }}
                </p>
              </div>
            </div>

            <div
              v-if="zoneCouponDiscount(activeZone) > 0"
              class="rounded-2xl border border-brand-primary/10 bg-brand-surface px-4 py-3 text-sm font-semibold text-brand-primary"
            >
              已套用折抵：-${{ zoneCouponDiscount(activeZone).toLocaleString() }}
            </div>
            <div
              v-else-if="zoneCouponCodeAppliedLabel(activeZone)"
              class="rounded-2xl border border-brand-primary/10 bg-brand-surface px-4 py-3 text-sm font-semibold text-brand-primary"
            >
              已套用：{{ zoneCouponCodeAppliedLabel(activeZone) }}
            </div>
          </div>

          <!-- 結帳明細 -->
          <div class="border-t border-gray-50 bg-gray-50 px-5 py-5">
            <section class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 class="text-base font-black text-gray-800">結帳明細</h3>
                  </div>
                  <span
                    class="rounded-full px-3 py-1 text-xs font-black"
                    :style="{ backgroundColor: activeZone.color + '14', color: activeZone.color }"
                  >
                    {{ activeZone.items.length }} 項商品
                  </span>
                </div>

                <div class="mb-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                  <p class="mb-2 text-xs font-black text-gray-400">配送方式</p>
                  <div class="grid gap-2 sm:grid-cols-2">
                    <button
                      v-for="option in zoneDeliveryOptions(activeZone)"
                      :key="option.value"
                      type="button"
                      class="rounded-xl border bg-white px-4 py-3 text-left transition-all"
                      :class="selectedZoneDelivery(activeZone.key) === option.value
                        ? 'border-brand-primary shadow-sm'
                        : 'border-gray-100 text-gray-500 hover:border-gray-200'"
                      @click="selectZoneDelivery(activeZone.key, option.value)"
                    >
                      <span class="block text-sm font-black" :class="selectedZoneDelivery(activeZone.key) === option.value ? 'text-brand-primary' : 'text-gray-700'">
                        {{ option.label }}
                      </span>
                      <span class="mt-1 block text-xs font-medium text-gray-400">
                        {{ deliveryRuleText(activeZone, option.value) }}
                      </span>
                    </button>
                  </div>
                </div>

                <div class="space-y-3 text-sm">
                  <div class="flex items-center justify-between gap-4 text-gray-500">
                    <span>商品小計</span>
                    <span class="font-bold text-gray-700">${{ zoneSubtotal(activeZone).toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center justify-between gap-4 text-gray-500">
                    <span>{{ selectedZoneDeliveryLabel(activeZone) }}運費</span>
                    <span class="font-bold" :class="zoneShippingFee(activeZone) === 0 ? 'text-brand-primary' : 'text-gray-700'">
                      {{ zoneShippingFee(activeZone) === 0 ? (zoneHasFreeShippingCode(activeZone) ? '優惠碼免運' : '免運') : `$${zoneShippingFee(activeZone).toLocaleString()}` }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between gap-4 text-gray-500">
                    <span>折價券 / 折扣碼折抵</span>
                    <span class="font-bold" :class="zoneCouponDiscount(activeZone) > 0 ? 'text-brand-primary' : 'text-gray-400'">
                      {{ zoneCouponDiscount(activeZone) > 0 ? `-$${zoneCouponDiscount(activeZone).toLocaleString()}` : '$0' }}
                    </span>
                  </div>
                  <div
                    v-for="row in zoneAutomaticDiscountRows(activeZone)"
                    :key="row.label"
                    class="flex items-center justify-between gap-4 text-brand-primary"
                  >
                    <span>{{ row.label }}</span>
                    <span class="font-bold">-${{ row.amount.toLocaleString() }}</span>
                  </div>
                  <div
                    v-for="row in zoneMemberDiscountRows(activeZone)"
                    :key="row.label"
                    class="flex items-center justify-between gap-4 text-brand-primary"
                  >
                    <span>{{ row.label }}</span>
                    <span class="font-bold">-${{ row.amount.toLocaleString() }}</span>
                  </div>
                  <div
                    v-if="zoneMemberBenefitRows(activeZone).length"
                    class="rounded-xl border border-brand-primary/10 bg-white px-3 py-3"
                  >
                    <div class="mb-2 text-xs font-black text-gray-800">會員與次數優惠</div>
                    <div
                      v-for="row in zoneMemberBenefitRows(activeZone)"
                      :key="row.label"
                      class="flex items-center justify-between gap-4 text-xs font-bold"
                      :class="row.reached ? 'text-brand-primary' : 'text-gray-500'"
                    >
                      <span>{{ row.label }}</span>
                      <span>{{ row.status }}</span>
                    </div>
                  </div>
                  <div
                    v-if="zonePickupPromotionRows(activeZone).length"
                    class="rounded-xl border border-brand-primary/10 bg-brand-surface/40 px-3 py-3"
                  >
                    <div class="mb-2 text-xs font-black text-gray-800">超商取貨專屬優惠</div>
                    <div
                      v-for="row in zonePickupPromotionRows(activeZone)"
                      :key="row.label"
                      class="space-y-1 border-b border-white/70 pb-2 last:border-b-0 last:pb-0"
                    >
                      <div class="flex items-center justify-between gap-4 text-xs font-bold" :class="row.reached ? 'text-brand-primary' : 'text-gray-500'">
                        <span>{{ row.label }}</span>
                        <span>{{ row.status }}</span>
                      </div>
                      <p class="text-[11px] leading-5 text-gray-400">{{ row.description }}</p>
                    </div>
                  </div>
                  <div
                    v-if="zoneOpRewardRows(activeZone).length"
                    class="rounded-xl border border-brand-accent/10 bg-white px-3 py-3"
                  >
                    <div class="mb-2 text-xs font-black text-gray-800">滿額加贈 OP 點</div>
                    <div
                      v-for="row in zoneOpRewardRows(activeZone)"
                      :key="row.label"
                      class="space-y-1 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
                    >
                      <div class="flex items-center justify-between gap-4 text-xs font-bold" :class="row.reached ? 'text-brand-accent' : 'text-gray-500'">
                        <span>{{ row.label }}</span>
                        <span>{{ row.status }}</span>
                      </div>
                      <p class="text-[11px] leading-5 text-gray-400">
                        達成後可獲得 {{ row.points.toLocaleString() }} 點。
                      </p>
                    </div>
                    <div
                      v-if="zoneOpRewardTotal(activeZone) > 0"
                      class="mt-2 flex items-center justify-between rounded-lg bg-brand-accent/10 px-3 py-2 text-xs font-black text-brand-accent"
                    >
                      <span>本區可獲得 OP 點</span>
                      <span>{{ zoneOpRewardTotal(activeZone).toLocaleString() }} 點</span>
                    </div>
                  </div>
                  <div
                    v-if="zoneOpPoints(activeZone) > 0"
                    class="flex items-center justify-between gap-4 rounded-xl bg-brand-accent bg-opacity-10 px-3 py-2 text-brand-accent"
                  >
                    <span class="font-bold">OP 點</span>
                    <span class="font-black">{{ zoneOpPoints(activeZone).toLocaleString() }} 點</span>
                  </div>
                  <div
                    v-if="zoneCreditRewardRows(activeZone).length"
                    class="rounded-xl bg-brand-surface/70 px-3 py-3"
                  >
                    <div class="mb-2 flex items-center justify-between gap-4 text-brand-primary">
                      <span class="font-black">本次預計獲得購物金</span>
                      <span class="font-black">+${{ zoneCreditRewardTotal(activeZone).toLocaleString() }}</span>
                    </div>
                    <div
                      v-for="row in zoneCreditRewardRows(activeZone)"
                      :key="row.label"
                      class="flex items-center justify-between gap-4 text-xs font-bold text-gray-500"
                    >
                      <span>{{ row.label }}</span>
                      <span>+${{ row.amount.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-4 space-y-2 border-t border-gray-100 pt-4">
                  <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div class="space-y-2">
                      <div class="flex items-end justify-between gap-4 sm:items-center sm:justify-start sm:gap-6">
                        <span class="text-sm font-black text-gray-800">總金額</span>
                        <span class="text-[1.75rem] font-black tabular-nums leading-none text-brand-primary">
                          <span class="mr-1 text-sm">$</span>{{ zonePayableTotal(activeZone).toLocaleString() }}
                        </span>
                      </div>
                      <div
                        v-if="zoneOpPoints(activeZone) > 0"
                        class="flex items-end justify-between gap-4 sm:items-center sm:justify-start sm:gap-6"
                      >
                        <span class="text-sm font-black text-gray-800">OP 點</span>
                        <span class="text-[1.75rem] font-black tabular-nums leading-none text-brand-accent">
                          {{ zoneOpPoints(activeZone).toLocaleString() }} 點
                        </span>
                      </div>
                    </div>

                    <button
                      class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-95 sm:min-w-[11rem]"
                      :style="{ backgroundColor: activeZone.color }"
                      @click="checkoutZone(activeZone.key)"
                    >
                      前往結帳
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </section>

          </div>
          </template>
        </div>

        <!-- ── 溫層滿額加價購區塊 ── -->
        <section
          v-if="totalCount > 0 && activeZoneAddOns.length > 0 && activeZone"
          class="rounded-2xl border border-gray-100 bg-brand-bg p-5 shadow-sm"
        >
          <div class="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div class="border-l-4 border-brand-primary pl-3">
              <h3 class="text-base font-black text-gray-800">{{ activeZone.label }}滿額加價購</h3>
              <p class="mt-1 text-xs font-normal text-gray-400">
                此區商品小計達指定門檻後，可用加購價帶回同溫層精選商品。
              </p>
            </div>
            <span
              class="mt-2 inline-flex w-fit rounded-full px-3 py-1 text-xs font-black sm:mt-0"
              :style="{ backgroundColor: activeZone.color + '14', color: activeZone.color }"
            >
              {{ activeZone.label }}專屬
            </span>
          </div>

          <div class="mb-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <span class="text-gray-500">目前{{ activeZone.label }}小計</span>
              <span :style="{ color: activeZone.color }">${{ activeZoneSubtotal().toLocaleString() }}</span>
            </div>
            <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full transition-all duration-300"
                :style="{ width: `${activeZoneAddOnProgress}%`, backgroundColor: activeZone.color }"
              />
            </div>
          </div>

          <div class="-mx-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
            <div class="flex w-max flex-nowrap gap-3 lg:w-auto lg:max-w-[1148px] lg:flex-wrap">
              <article
                v-for="addon in activeZoneAddOns"
                :key="addon.id"
                class="flex h-full w-[220px] flex-none flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all"
                :class="isAddOnUnlocked(addon)
                  ? 'hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-md'
                  : 'opacity-55'"
              >
              <div class="flex flex-1 flex-col">
                <router-link
                  :to="addOnProductPath(addon)"
                  class="mb-3 flex aspect-[4/3] w-full items-center justify-center rounded-2xl text-4xl"
                  :style="{ backgroundColor: activeZone.color + '10' }"
                  :aria-label="`查看${addon.name}`"
                >
                  <img
                    v-if="isImageUrl(addon.image)"
                    :src="addon.image"
                    :alt="addon.name"
                    class="h-full w-full rounded-2xl object-cover"
                  />
                  <span v-else>{{ addon.image }}</span>
                </router-link>

                <h4 class="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 text-gray-800">
                  {{ addon.name }}
                </h4>
                <p class="mt-2 text-base font-black text-brand-primary">
                  加購價 ${{ addon.addOnPrice.toLocaleString() }}
                </p>
                <p
                  v-if="addOnStatusText(addon)"
                  class="mt-2 min-h-[1.25rem] text-xs font-bold leading-5 text-gray-400"
                  :class="isAddOnUnlocked(addon) ? 'text-brand-primary' : 'text-gray-400'"
                >
                  {{ addOnStatusText(addon) }}
                </p>
              </div>

              <div class="mt-4">
                <button
                  type="button"
                  class="w-full rounded-xl px-4 py-2 text-sm font-black transition-all"
                  :class="isAddOnUnlocked(addon)
                    ? 'bg-brand-primary text-white shadow-sm hover:bg-brand-dark'
                    : 'cursor-not-allowed bg-gray-100 text-gray-400'"
                  :disabled="!isAddOnUnlocked(addon)"
                  @click="openAddOnQuantityModal(addon)"
                >
                  加入購物車
                </button>
              </div>
              </article>
            </div>
          </div>
        </section>

        <transition name="fade">
          <div
            v-if="selectedAddOn"
            class="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40 px-4 py-5 sm:items-center"
            @click.self="closeAddOnQuantityModal"
          >
            <section class="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div class="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-base font-black text-gray-800">選擇加購數量</h3>
                  <p class="mt-1 text-xs font-medium text-gray-400">確認數量後，商品會加入目前溫層購物車。</p>
                </div>
                <button
                  type="button"
                  class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
                  aria-label="關閉"
                  @click="closeAddOnQuantityModal"
                >
                  ×
                </button>
              </div>

              <div class="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <router-link
                  :to="addOnProductPath(selectedAddOn)"
                  class="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-3xl"
                  :aria-label="`查看${selectedAddOn.name}`"
                >
                  <img
                    v-if="isImageUrl(selectedAddOn.image)"
                    :src="selectedAddOn.image"
                    :alt="selectedAddOn.name"
                    class="h-full w-full rounded-2xl object-cover"
                  />
                  <span v-else>{{ selectedAddOn.image }}</span>
                </router-link>
                <div class="min-w-0 flex-1">
                  <h4 class="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 text-gray-800">
                    {{ selectedAddOn.name }}
                  </h4>
                  <p class="mt-2 text-base font-black text-brand-primary">
                    加購 ${{ selectedAddOn.addOnPrice.toLocaleString() }}
                  </p>
                </div>
              </div>

              <div class="mt-5 flex items-center justify-between gap-4">
                <span class="text-sm font-bold text-gray-700">數量</span>
                <div class="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <button
                    type="button"
                    class="flex h-10 w-10 items-center justify-center text-lg font-bold text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                    :disabled="addOnQuantity <= 1"
                    @click="decrementAddOnQuantity"
                  >
                    −
                  </button>
                  <span class="w-12 text-center text-sm font-black text-gray-800">{{ addOnQuantity }}</span>
                  <button
                    type="button"
                    class="flex h-10 w-10 items-center justify-center text-lg font-bold text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                    :disabled="addOnQuantity >= maxAddOnQuantity"
                    @click="incrementAddOnQuantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="mt-5 grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)]">
                <button
                  type="button"
                  class="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
                  @click="closeAddOnQuantityModal"
                >
                  取消
                </button>
                <button
                  type="button"
                  class="rounded-xl bg-brand-primary px-5 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-brand-dark"
                  @click="confirmAddOnToCart"
                >
                  確認加入
                </button>
              </div>
            </section>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CartItem, Product, TempZone, AddOnItem, PromotionTier } from '@/types'
import { mockProducts, mockPromotionTiers } from '@/mock/data'
import { getGiftProgressText, getGiftPromotion, getGiftQuantity } from '@/utils/promotions'
import GiftPromotionNote from '@/components/promotion/GiftPromotionNote.vue'

const CART_COUPON_DRAFT_KEY = 'organicshops:cart-coupon-draft'

interface CartAddOnItem extends AddOnItem {
  productId: string
}

interface AmbientGiftItem {
  id: string
  name: string
  image: string
  unit: string
  quantity: number
}

const CART_ADD_ON_ITEMS: CartAddOnItem[] = [
  {
    id: 'ambient-granola',
    productId: 'p101',
    name: '有機堅果燕麥脆片',
    image: '🥣',
    originalPrice: 260,
    addOnPrice: 168,
    unit: '280g/包',
    unlockAt: 599,
    tempZone: 'ambient',
  },
  {
    id: 'ambient-herbal-tea',
    productId: 'op201',
    name: '紅棗枸杞養生茶',
    image: '🫖',
    originalPrice: 220,
    addOnPrice: 139,
    unit: '10入/盒',
    unlockAt: 1200,
    tempZone: 'ambient',
  },
  {
    id: 'chilled-soy-milk',
    productId: 'p102',
    name: '有機無糖豆乳',
    image: '🥛',
    originalPrice: 180,
    addOnPrice: 119,
    unit: '295ml x 6瓶',
    unlockAt: 800,
    tempZone: 'chilled',
  },
  {
    id: 'chilled-yogurt',
    productId: 'p102',
    name: '希臘式優格組',
    image: '🍶',
    originalPrice: 240,
    addOnPrice: 158,
    unit: '120g x 4杯',
    unlockAt: 1500,
    tempZone: 'chilled',
  },
  {
    id: 'frozen-edamame',
    productId: 'op202',
    name: '薄鹽毛豆莢',
    image: '🫛',
    originalPrice: 160,
    addOnPrice: 99,
    unit: '300g/包',
    unlockAt: 800,
    tempZone: 'frozen',
  },
  {
    id: 'frozen-soup',
    productId: 'op202',
    name: '南瓜濃湯冷凍包',
    image: '🥣',
    originalPrice: 280,
    addOnPrice: 189,
    unit: '500g/包',
    unlockAt: 1600,
    tempZone: 'frozen',
  },
  {
    id: 'fresh-greens',
    productId: 'p105',
    name: '產地鮮採沙拉盒',
    image: '🥗',
    originalPrice: 180,
    addOnPrice: 119,
    unit: '250g/盒',
    unlockAt: 600,
    tempZone: 'fresh',
  },
  {
    id: 'fresh-mushroom',
    productId: 'p105',
    name: '綜合菇菇料理組',
    image: '🍄',
    originalPrice: 240,
    addOnPrice: 159,
    unit: '350g/組',
    unlockAt: 1200,
    tempZone: 'fresh',
  },
]

const AMBIENT_GIFT_ITEMS: AmbientGiftItem[] = [
  {
    id: 'seaweed-potato-chips',
    name: '海苔薄切洋芋片',
    image: '🍘',
    unit: '59.5公克/包',
    quantity: 2,
  },
  {
    id: 'dried-apricot',
    name: '杏桃乾',
    image: '🍑',
    unit: '200公克/包',
    quantity: 1,
  },
  {
    id: 'cashew-pack',
    name: '原味腰果隨手包',
    image: '🥜',
    unit: '30g/包',
    quantity: 1,
  },
]

const AMBIENT_GIFT_TIERS: Array<{ threshold: number; label: string; items: AmbientGiftItem[]; note: string }> = [
  {
    threshold: 1500,
    label: '滿 $1,500 贈海苔薄切洋芋片、杏桃乾、原味腰果隨手包',
    items: AMBIENT_GIFT_ITEMS,
    note: '商品效期至 2026/9/2。',
  },
  {
    threshold: 2000,
    label: '滿 $2,000 加贈有機燕麥飲',
    items: [
      {
        id: 'organic-oat-drink',
        name: '有機燕麥飲',
        image: '🥛',
        unit: '250ml/瓶',
        quantity: 2,
      },
    ],
    note: '數量有限，依購物車達成門檻顯示。',
  },
]

const AUTO_AMOUNT_OFFERS = [
  { threshold: 1800, label: '滿 $1,800 現折 $50', amount: 50 },
]

const AUTO_PERCENT_OFFERS = [
  { threshold: 1800, label: '滿 $1,800 享 95 折', percent: 95 },
]

const PICKUP_PROMOTION_OFFERS = [
  {
    threshold: 1200,
    label: '滿 $1,200 可加價購',
    description: '超商取貨滿額可加購指定加價購商品。',
  },
  {
    threshold: 1500,
    label: '滿 $1,500 送購物金 $100',
    description: '超商取貨滿額加碼回饋購物金。',
  },
  {
    threshold: 1800,
    label: '滿 $1,800 送贈品',
    description: '超商取貨滿額再送指定贈品。',
  },
]

const PICKUP_OP_POINT_TIERS = [
  { threshold: 1500, label: '滿 $1,500 加贈 10 點', points: 10 },
  { threshold: 2000, label: '滿 $2,000 加贈 30 點', points: 30 },
]

interface ZoneConfig {
  key: TempZone
  label: string
  icon: string
  color: string
  fee: number
  freeAt: number
  items: CartItem[]
}

interface CartCouponOption {
  id: number
  title: string
  amount?: number
  percent?: number
  minTotal: number
  scope: string
  expiryDate: string
}

interface ZoneCouponDraft {
  selectedCouponId: number | null
  couponCode: string
  appliedCouponCode: string
  couponCodeStatus: '' | 'success' | 'error' | 'cleared'
}

interface CouponCodeOffer {
  type: 'amount' | 'free-shipping' | 'gift' | 'percent'
  label: string
  minTotal: number
  amount?: number
  percent?: number
  gift?: AmbientGiftItem
}

interface ShippingNote {
  text: string
  reached: boolean
  description?: string[]
}

interface PromotionProgressRow {
  label: string
  description: string
  status: string
  reached: boolean
}

interface OpRewardRow {
  label: string
  points: number
  status: string
  reached: boolean
}

type CartDeliveryMethod = 'home' | 'store-pickup'

interface DeliveryRule {
  value: CartDeliveryMethod
  label: string
  threshold: number
  fee: number
}

const ZONE_DELIVERY_RULES: Record<TempZone, DeliveryRule[]> = {
  ambient: [
    { value: 'home', label: '宅配', threshold: 1200, fee: 120 },
    { value: 'store-pickup', label: '超商取貨', threshold: 599, fee: 60 },
  ],
  chilled: [
    { value: 'home', label: '宅配', threshold: 1500, fee: 100 },
  ],
  frozen: [
    { value: 'home', label: '宅配', threshold: 800, fee: 120 },
    { value: 'store-pickup', label: '超商取貨', threshold: 800, fee: 100 },
  ],
  fresh: [
    { value: 'home', label: '宅配', threshold: 800, fee: 120 },
  ],
}

export default Vue.extend({
  name: 'CartView',
  components: { GiftPromotionNote },

  data() {
    return {
      addOns:        CART_ADD_ON_ITEMS as CartAddOnItem[],
      ambientGiftItems: AMBIENT_GIFT_ITEMS,
      promotionTiers: mockPromotionTiers as PromotionTier[],
      activeZoneKey: 'fresh' as TempZone,
      selectedAddOn: null as CartAddOnItem | null,
      addOnQuantity: 1,
      maxAddOnQuantity: 10,
      zoneCouponDrafts: {
        fresh: { selectedCouponId: null, couponCode: '', appliedCouponCode: '', couponCodeStatus: '' },
        chilled: { selectedCouponId: null, couponCode: '', appliedCouponCode: '', couponCodeStatus: '' },
        frozen: { selectedCouponId: null, couponCode: '', appliedCouponCode: '', couponCodeStatus: '' },
        ambient: { selectedCouponId: null, couponCode: '', appliedCouponCode: '', couponCodeStatus: '' },
      } as Record<TempZone, ZoneCouponDraft>,
      zoneDeliveryMethods: {
        fresh: 'home',
        chilled: 'home',
        frozen: 'home',
        ambient: 'home',
      } as Record<TempZone, CartDeliveryMethod>,
      availableCoupons: [
        { id: 1, title: '新會員專屬禮金', amount: 100, minTotal: 1000, scope: '全館商品', expiryDate: '2026-04-29' },
        { id: 2, title: '端午佳節慶祝券', amount: 50, minTotal: 500, scope: '冷凍/冷藏商品', expiryDate: '2026-05-13' },
        { id: 3, title: '綠色生活節', amount: 200, minTotal: 1500, scope: '有機蔬菜、在地水果', expiryDate: '2026-05-28' },
        { id: 4, title: '會員首購禮', amount: 80, minTotal: 0, scope: '全館商品', expiryDate: '2026-06-12' },
        { id: 5, title: '會員感謝 9 折券', percent: 90, minTotal: 1200, scope: '全館商品', expiryDate: '2026-06-30' },
      ] as CartCouponOption[],
      couponCodeOffers: {
        ORGANIC100: { type: 'amount', label: '折抵 $100', amount: 100, minTotal: 0 },
        GREEN50: { type: 'amount', label: '折抵 $50', amount: 50, minTotal: 0 },
        FULL1800: { type: 'amount', label: '滿 $1,800 折 $50', amount: 50, minTotal: 1800 },
        FREESHIP1800: { type: 'free-shipping', label: '滿 $1,800 免運', minTotal: 1800 },
        GIFT1500: {
          type: 'gift',
          label: '滿 $1,500 送有機燕麥飲',
          minTotal: 1500,
          gift: { id: 'coupon-oat-drink', name: '有機燕麥飲', image: '🥛', unit: '250ml/瓶', quantity: 1 },
        },
        SAVE95: { type: 'percent', label: '滿 $1,800 享 95 折', percent: 95, minTotal: 1800 },
      } as Record<string, CouponCodeOffer>,

      ZONE_META: [
        { key: 'fresh'   as TempZone, label: '產地直送', icon: '🌱', color: '#E8A020', fee: 120, freeAt: 800  },
        { key: 'chilled' as TempZone, label: '冷藏',     icon: '❄️', color: '#29B6F6', fee: 100, freeAt: 1500 },
        { key: 'frozen'  as TempZone, label: '冷凍',     icon: '🧊', color: '#5C6BC0', fee: 150, freeAt: 2000 },
        { key: 'ambient' as TempZone, label: '常溫',     icon: '☀️', color: '#8BC34A', fee: 60,  freeAt: 990  },
      ],
    }
  },

  computed: {
    totalCount(): number {
      return this.$store.getters['cart/totalCount']
    },

    totalPrice(): number {
      return this.$store.getters['cart/totalPrice']
    },
    itemsByZone(): Record<TempZone, CartItem[]> {
      return this.$store.getters['cart/itemsByZone']
    },

    visibleZones(): ZoneConfig[] {
      return (this as any).ZONE_META
        .map((meta: any) => ({ ...meta, items: this.itemsByZone[meta.key as TempZone] }))
        .filter((z: ZoneConfig) => z.items.length > 0)
    },
    activeZone(): ZoneConfig | null {
      return this.visibleZones.find((zone) => zone.key === this.activeZoneKey) || this.visibleZones[0] || null
    },

    activeZoneAddOns(): CartAddOnItem[] {
      const zone = this.activeZone
      if (!zone || zone.items.length === 0) return []
      return this.addOns.filter((addon) => addon.tempZone === zone.key)
    },
    activeZoneAddOnProgress(): number {
      if (!this.activeZone || this.activeZoneAddOns.length === 0) return 0
      const firstThreshold = Math.min(...this.activeZoneAddOns.map((addon) => addon.unlockAt))
      if (!firstThreshold) return 0
      return Math.min(100, Math.round((this.activeZoneSubtotal() / firstThreshold) * 100))
    },

    // 滿額活動
    currentTier(): PromotionTier | null {
      const tiers = [...this.promotionTiers].sort((a, b) => b.minTotal - a.minTotal)
      return tiers.find(t => this.totalPrice >= t.minTotal) || null
    },

    nextTier(): PromotionTier | null {
      return this.promotionTiers.find(t => this.totalPrice < t.minTotal) || null
    },

    tierDiscount(): number {
      if (!this.currentTier) return 0
      const discount = 1 - this.currentTier.discountPercent / 100
      return Math.round(this.totalPrice * discount)
    },
  },

  methods: {
    isImageUrl(image: string) {
      return /^https?:\/\//.test(image) || image.startsWith('/')
    },

    // ── 商品顯示價格 ──
    displayPrice(product: Product): number {
      return Math.round(product.memberPrice ?? product.originalPrice ?? product.price)
    },

    displayCartProductName(product: Product): string {
      return product.name.replace(/^\[加價購\]\s*/, '')
    },

    isAddOnProduct(product: Product): boolean {
      const tags = product.tags || []
      return product.id.startsWith('addon-') || tags.includes('加價購') || product.name.includes('[加價購]')
    },

    isBuyOneGetOneProduct(product: Product): boolean {
      return (product.tags || []).includes('買1送1')
    },

    productBadgeText(product: Product): string {
      const promotion = getGiftPromotion(product.id)
      if (this.isAddOnProduct(product)) return '加價購'
      if (this.isBuyOneGetOneProduct(product)) return '買 1 送 1'
      if (promotion) return promotion.label
      return ''
    },

    giftRowQuantity(item: CartItem): number {
      if (this.isBuyOneGetOneProduct(item.product)) {
        return item.quantity
      }

      return this.lineGiftQuantity(item)
    },
    giftRowPromotion(item: CartItem) {
      return getGiftPromotion(item.product.id)
    },
    giftRowProductId(item: CartItem): string {
      return this.giftRowPromotion(item)?.giftProductId || item.product.id
    },
    giftRowProduct(item: CartItem): Product {
      return mockProducts.find((product) => product.id === this.giftRowProductId(item)) || item.product
    },
    giftRowName(item: CartItem): string {
      return this.giftRowPromotion(item)?.giftName || this.displayCartProductName(item.product)
    },
    giftRowImage(item: CartItem): string {
      return this.giftRowProduct(item).image
    },
    giftRowUnit(item: CartItem): string {
      return this.giftRowProduct(item).unit
    },
    giftRowOrigin(item: CartItem): string {
      return this.giftRowProduct(item).origin
    },

    regularPrice(product: Product): number {
      return Math.round(product.originalPrice ?? product.price)
    },

    hasMemberPrice(product: Product): boolean {
      return !!product.memberPrice && this.regularPrice(product) > this.displayPrice(product)
    },

    savingLabel(product: Product): string {
      const saving = Math.max(0, this.regularPrice(product) - this.displayPrice(product))
      return saving > 0 ? `省 $${saving.toLocaleString()}` : ''
    },

    priceBadge(product: Product): string {
      if (product.requiredOpPoints) return 'OP 換購'
      if (this.hasMemberPrice(product)) return '會員專屬價'
      return ''
    },

    // ── 溫層運算 ──
    zoneSubtotal(zone: ZoneConfig): number {
      return zone.items.reduce((sum, i) => sum + this.displayPrice(i.product) * i.quantity, 0)
    },

    lineOpPoints(item: CartItem): number {
      return (item.product.requiredOpPoints || 0) * item.quantity
    },
    lineGiftQuantity(item: CartItem): number {
      return getGiftQuantity(item.product.id, item.quantity)
    },
    giftProgressText(item: CartItem): string {
      return getGiftProgressText(item.product, item.quantity)
    },
    selectedVariantDetails(item: CartItem): string[] {
      const itemSource = item as any
      const productSource = item.product as any
      const selectedVariants = itemSource.selectedVariants || productSource.selectedVariants
      if (Array.isArray(productSource.comboItems)) {
        return productSource.comboItems.map((detail: string) => `• ${detail}`)
      }

      if (Array.isArray(selectedVariants)) {
        return selectedVariants
          .map((variant) => this.formatSelectedVariant(variant))
          .filter((detail): detail is string => Boolean(detail))
      }

      const specDetails = itemSource.specDetails || productSource.specDetails
      if (specDetails && typeof specDetails === 'object') {
        return Object.entries(specDetails)
          .map(([label, value]) => `• ${label}：${value}`)
          .filter((detail) => detail.trim() !== '• ：')
      }

      return []
    },
    formatSelectedVariant(variant: any): string {
      if (typeof variant === 'string') return `• ${variant}`
      if (!variant || typeof variant !== 'object') return ''

      const label = variant.label || variant.name || variant.title || variant.variantLabel || variant.flavor
      const quantity = variant.quantity || variant.qty || variant.count
      if (!label) return ''

      return quantity ? `• ${label} x ${quantity}` : `• ${label}`
    },

    zoneOpPoints(zone: ZoneConfig): number {
      return zone.items.reduce((sum, item) => sum + this.lineOpPoints(item), 0)
    },

    zoneDeliveryOptions(zone: ZoneConfig): DeliveryRule[] {
      return ZONE_DELIVERY_RULES[zone.key]
    },

    selectedZoneDelivery(zoneKey: TempZone): CartDeliveryMethod {
      const selected = this.zoneDeliveryMethods[zoneKey]
      const options = ZONE_DELIVERY_RULES[zoneKey]
      return options.some((option) => option.value === selected) ? selected : options[0].value
    },

    selectZoneDelivery(zoneKey: TempZone, method: CartDeliveryMethod) {
      if (!ZONE_DELIVERY_RULES[zoneKey].some((option) => option.value === method)) return
      this.zoneDeliveryMethods[zoneKey] = method
    },

    selectedZoneDeliveryRule(zone: ZoneConfig): DeliveryRule {
      const method = this.selectedZoneDelivery(zone.key)
      return ZONE_DELIVERY_RULES[zone.key].find((option) => option.value === method) || ZONE_DELIVERY_RULES[zone.key][0]
    },

    selectedZoneDeliveryLabel(zone: ZoneConfig): string {
      return this.selectedZoneDeliveryRule(zone).label
    },

    deliveryRuleText(zone: ZoneConfig, method: CartDeliveryMethod): string {
      const rule = ZONE_DELIVERY_RULES[zone.key].find((option) => option.value === method) || ZONE_DELIVERY_RULES[zone.key][0]
      return `滿 $${rule.threshold.toLocaleString()} 免運，未滿運費 $${rule.fee.toLocaleString()}`
    },

    zoneRemaining(zone: ZoneConfig): number {
      return Math.max(0, this.zoneProgressThreshold(zone) - this.zoneSubtotal(zone))
    },

    zoneProgressThreshold(zone: ZoneConfig): number {
      return this.selectedZoneDeliveryRule(zone).threshold
    },

    zoneProgressTitle(zone: ZoneConfig): string {
      const deliveryLabel = this.selectedZoneDeliveryLabel(zone)
      const remaining = this.zoneRemaining(zone)
      return remaining > 0
        ? `再買 $${remaining.toLocaleString()} 享${zone.label}${deliveryLabel}免運`
        : `已達${zone.label}${deliveryLabel}免運門檻！`
    },

    zoneProgress(zone: ZoneConfig): number {
      return Math.min(100, Math.round((this.zoneSubtotal(zone) / this.zoneProgressThreshold(zone)) * 100))
    },
    zoneShippingNotes(zone: ZoneConfig): ShippingNote[] {
      const subtotal = this.zoneSubtotal(zone)
      const notes = this.zoneDeliveryOptions(zone).map((rule) => {
        return this.shippingNote(rule.label, subtotal, rule.threshold, rule.fee)
      })

      if (zone.key === 'ambient') {
        notes.push(...this.ambientGiftNotes(subtotal))
        notes.push(...this.automaticDiscountNotes(subtotal))
      }

      if (this.selectedZoneDelivery(zone.key) === 'store-pickup') {
        notes.push(...this.pickupPromotionNotes(subtotal))
        notes.push(...this.pickupOpPointNotes(subtotal))
      }

      return notes
    },
    shippingNote(label: string, subtotal: number, threshold: number, fee: number): ShippingNote {
      const remaining = Math.max(0, threshold - subtotal)

      if (remaining === 0) {
        return {
          text: `${label}：已達免運門檻！`,
          reached: true,
        }
      }

      return {
        text: `${label}：還差 ${remaining.toLocaleString()} 元免運費（未滿需加收 ${fee} 元運費）`,
        reached: false,
      }
    },
    ambientGiftNotes(subtotal: number): ShippingNote[] {
      return AMBIENT_GIFT_TIERS.map((tier) => {
        const remaining = Math.max(0, tier.threshold - subtotal)
        return {
          text: remaining === 0 ? `滿額贈：已達成 ${tier.label}` : `滿額贈：再買 ${remaining.toLocaleString()} 元可達成 ${tier.label}`,
          description: [tier.note],
          reached: remaining === 0,
        }
      })
    },
    automaticDiscountNotes(subtotal: number): ShippingNote[] {
      return [
        ...AUTO_PERCENT_OFFERS.map((offer) => {
          const remaining = Math.max(0, offer.threshold - subtotal)
          return {
            text: remaining === 0 ? `自動折扣：已套用 ${offer.label}` : `自動折扣：再買 ${remaining.toLocaleString()} 元可享 ${offer.label}`,
            reached: remaining === 0,
          }
        }),
        ...AUTO_AMOUNT_OFFERS.map((offer) => {
          const remaining = Math.max(0, offer.threshold - subtotal)
          return {
            text: remaining === 0 ? `自動折價：已套用 ${offer.label}` : `自動折價：再買 ${remaining.toLocaleString()} 元可享 ${offer.label}`,
            reached: remaining === 0,
          }
        }),
      ]
    },
    pickupPromotionNotes(subtotal: number): ShippingNote[] {
      return PICKUP_PROMOTION_OFFERS.map((offer) => {
        const remaining = Math.max(0, offer.threshold - subtotal)
        return {
          text: remaining === 0 ? `超商取貨優惠：已達成 ${offer.label}` : `超商取貨優惠：再買 ${remaining.toLocaleString()} 元可享 ${offer.label}`,
          description: [offer.description],
          reached: remaining === 0,
        }
      })
    },
    pickupOpPointNotes(subtotal: number): ShippingNote[] {
      return PICKUP_OP_POINT_TIERS.map((tier) => {
        const remaining = Math.max(0, tier.threshold - subtotal)
        return {
          text: remaining === 0 ? `滿額加贈 OP 點：已達成 ${tier.label}` : `滿額加贈 OP 點：再買 ${remaining.toLocaleString()} 元可享 ${tier.label}`,
          reached: remaining === 0,
        }
      })
    },
    showAmbientGiftRows(zone: ZoneConfig): boolean {
      return zone.items.length > 0 && this.zoneGiftItems(zone).length > 0
    },
    ambientGiftItemsForZone(zone: ZoneConfig): AmbientGiftItem[] {
      if (zone.key !== 'ambient') return []
      const subtotal = this.zoneSubtotal(zone)
      return AMBIENT_GIFT_TIERS
        .filter((tier) => subtotal >= tier.threshold)
        .flatMap((tier) => tier.items)
    },
    zoneGiftItems(zone: ZoneConfig): AmbientGiftItem[] {
      return [
        ...this.ambientGiftItemsForZone(zone),
        ...this.zoneCouponCodeGiftItems(zone),
      ]
    },
    zoneAppliedCouponCodeOffer(zone: ZoneConfig): CouponCodeOffer | null {
      const code = this.zoneDraft(zone.key).appliedCouponCode.trim().toUpperCase()
      if (!code) return null
      const offer = this.couponCodeOffers[code]
      if (!offer || this.zoneSubtotal(zone) < offer.minTotal) return null
      return offer
    },
    zoneHasFreeShippingCode(zone: ZoneConfig): boolean {
      return this.zoneAppliedCouponCodeOffer(zone)?.type === 'free-shipping'
    },
    zoneCouponCodeGiftItems(zone: ZoneConfig): AmbientGiftItem[] {
      const offer = this.zoneAppliedCouponCodeOffer(zone)
      if (offer?.type === 'gift' && offer.gift) return [offer.gift]
      return []
    },
    zoneCouponCodeAppliedLabel(zone: ZoneConfig): string {
      return this.zoneAppliedCouponCodeOffer(zone)?.label || ''
    },
    couponMatchesZone(coupon: CartCouponOption, zoneKey: TempZone): boolean {
      if (coupon.scope.includes('全館')) return true
      if (coupon.scope.includes('冷凍/冷藏')) return ['chilled', 'frozen'].includes(zoneKey)
      if (coupon.scope.includes('有機蔬菜、在地水果')) return ['fresh', 'ambient'].includes(zoneKey)
      return true
    },

    zoneDraft(zoneKey: TempZone): ZoneCouponDraft {
      return this.zoneCouponDrafts[zoneKey]
    },

    zoneSelectableCoupons(zone: ZoneConfig): CartCouponOption[] {
      return this.availableCoupons.filter((coupon) => {
        return this.zoneSubtotal(zone) >= coupon.minTotal && this.couponMatchesZone(coupon, zone.key)
      })
    },

    zoneSelectedCoupon(zone: ZoneConfig): CartCouponOption | null {
      return this.availableCoupons.find((coupon) => coupon.id === this.zoneDraft(zone.key).selectedCouponId) || null
    },

    zoneSelectedCouponDiscount(zone: ZoneConfig): number {
      const selectedCoupon = this.zoneSelectedCoupon(zone)
      if (!selectedCoupon) return 0
      const canUseCoupon = this.zoneSubtotal(zone) >= selectedCoupon.minTotal && this.couponMatchesZone(selectedCoupon, zone.key)
      if (!canUseCoupon) return 0
      if (selectedCoupon.percent) {
        return Math.round(this.zoneSubtotal(zone) * (1 - selectedCoupon.percent / 100))
      }
      return selectedCoupon.amount || 0
    },

    couponLabel(coupon: CartCouponOption): string {
      if (coupon.percent) return `${coupon.percent / 10} 折`
      return `折抵 $${(coupon.amount || 0).toLocaleString()}`
    },

    zoneCouponCodeDiscount(zone: ZoneConfig): number {
      const offer = this.zoneAppliedCouponCodeOffer(zone)
      if (!offer) return 0
      if (offer.type === 'percent' && offer.percent) return Math.round(this.zoneSubtotal(zone) * (1 - offer.percent / 100))
      if (offer.type === 'amount') return offer.amount || 0
      return 0
    },

    zoneCouponDiscount(zone: ZoneConfig): number {
      return this.zoneSelectedCouponDiscount(zone) + this.zoneCouponCodeDiscount(zone)
    },
    zoneAutomaticDiscountRows(zone: ZoneConfig): Array<{ label: string; amount: number }> {
      if (zone.key !== 'ambient') return []
      const subtotal = this.zoneSubtotal(zone)
      const percentRows = AUTO_PERCENT_OFFERS
        .filter((offer) => subtotal >= offer.threshold)
        .map((offer) => ({
          label: offer.label,
          amount: Math.round(subtotal * (1 - offer.percent / 100)),
        }))
      const amountRows = AUTO_AMOUNT_OFFERS
        .filter((offer) => subtotal >= offer.threshold)
        .map((offer) => ({ label: offer.label, amount: offer.amount }))
      return [...percentRows, ...amountRows]
    },
    zoneAutomaticDiscount(zone: ZoneConfig): number {
      return this.zoneAutomaticDiscountRows(zone).reduce((sum, row) => sum + row.amount, 0)
    },
    zoneMemberDiscountRows(zone: ZoneConfig): Array<{ label: string; amount: number }> {
      if (zone.items.length === 0) return []
      return [
        {
          label: 'VIP 首筆訂單 9 折',
          amount: Math.round(this.zoneSubtotal(zone) * 0.1),
        },
      ]
    },
    zoneMemberDiscount(zone: ZoneConfig): number {
      return this.zoneMemberDiscountRows(zone).reduce((sum, row) => sum + row.amount, 0)
    },
    zoneMemberBenefitRows(zone: ZoneConfig): Array<{ label: string; status: string; reached: boolean }> {
      if (zone.items.length === 0) return []
      return [
        { label: '生日購物金 $200', status: '可領取', reached: true },
        { label: '消費一次禮', status: '本次達成', reached: true },
        { label: '第 3 筆消費贈品', status: '本次達成', reached: true },
        { label: '第 5 筆購物金 $100', status: '尚差 2 筆', reached: false },
      ]
    },
    zoneCreditRewardRows(zone: ZoneConfig): Array<{ label: string; amount: number }> {
      const rows: Array<{ label: string; amount: number }> = []
      if (this.zoneSubtotal(zone) >= 1800) rows.push({ label: '滿 $1,800 送購物金', amount: 100 })
      if (zone.items.some((item) => item.product.id.startsWith('bundle-'))) rows.push({ label: '套餐加碼購物金', amount: 80 })
      if (zone.items.length > 0 && zone.key === 'ambient') rows.push({ label: '首購送購物金', amount: 150 })
      return rows
    },
    zoneCreditRewardTotal(zone: ZoneConfig): number {
      return this.zoneCreditRewardRows(zone).reduce((sum, row) => sum + row.amount, 0)
    },
    zonePickupPromotionRows(zone: ZoneConfig): PromotionProgressRow[] {
      if (this.selectedZoneDelivery(zone.key) !== 'store-pickup') return []
      const subtotal = this.zoneSubtotal(zone)
      return PICKUP_PROMOTION_OFFERS.map((offer) => {
        const remaining = Math.max(0, offer.threshold - subtotal)
        return {
          label: offer.label,
          description: offer.description,
          status: remaining === 0 ? '已達成' : `尚差 $${remaining.toLocaleString()}`,
          reached: remaining === 0,
        }
      })
    },
    zoneOpRewardRows(zone: ZoneConfig): OpRewardRow[] {
      if (this.selectedZoneDelivery(zone.key) !== 'store-pickup') return []
      const subtotal = this.zoneSubtotal(zone)
      return PICKUP_OP_POINT_TIERS.map((tier) => {
        const remaining = Math.max(0, tier.threshold - subtotal)
        return {
          label: tier.label,
          points: tier.points,
          status: remaining === 0 ? '已達成' : `尚差 $${remaining.toLocaleString()}`,
          reached: remaining === 0,
        }
      })
    },
    zoneOpRewardTotal(zone: ZoneConfig): number {
      return this.zoneOpRewardRows(zone).filter((row) => row.reached).reduce((sum, row) => sum + row.points, 0)
    },

    zoneShippingFee(zone: ZoneConfig): number {
      if (this.zoneHasFreeShippingCode(zone)) return 0
      return this.zoneRemaining(zone) <= 0 ? 0 : this.selectedZoneDeliveryRule(zone).fee
    },

    zonePayableTotal(zone: ZoneConfig): number {
      return Math.max(0, this.zoneSubtotal(zone) + this.zoneShippingFee(zone) - this.zoneCouponDiscount(zone) - this.zoneAutomaticDiscount(zone) - this.zoneMemberDiscount(zone))
    },

    handleCouponCodeInput(zoneKey: TempZone) {
      this.zoneDraft(zoneKey).couponCodeStatus = ''
    },

    applyCouponCode(zoneKey: TempZone) {
      const draft = this.zoneDraft(zoneKey)
      const code = draft.couponCode.trim().toUpperCase()

      this.blurCouponCodeInput()

      if (!code) {
        draft.appliedCouponCode = ''
        draft.couponCode = ''
        draft.couponCodeStatus = 'cleared'
        this.persistCouponDraft()
        return
      }

      const offer = this.couponCodeOffers[code]
      if (!offer) {
        draft.couponCodeStatus = 'error'
        return
      }

      const zone = this.visibleZones.find((item) => item.key === zoneKey)
      if (zone && this.zoneSubtotal(zone) < offer.minTotal) {
        draft.appliedCouponCode = ''
        draft.couponCode = code
        draft.couponCodeStatus = 'error'
        return
      }

      draft.couponCode = code
      draft.appliedCouponCode = code
      draft.couponCodeStatus = 'success'
      this.persistCouponDraft()
    },

    blurCouponCodeInput() {
      const inputRef = this.$refs.couponCodeInput as HTMLInputElement | HTMLInputElement[] | undefined
      const input = Array.isArray(inputRef) ? inputRef[0] : inputRef
      if (input && typeof input.blur === 'function') input.blur()
    },

    zoneCouponCodeMessage(zoneKey: TempZone): string {
      const status = this.zoneDraft(zoneKey).couponCodeStatus
      const code = this.zoneDraft(zoneKey).couponCode.trim().toUpperCase()
      const offer = this.couponCodeOffers[code]
      const zone = this.visibleZones.find((item) => item.key === zoneKey)
      if (status === 'error' && offer && zone && this.zoneSubtotal(zone) < offer.minTotal) {
        const remaining = offer.minTotal - this.zoneSubtotal(zone)
        return `此優惠碼${offer.label}，還差 $${remaining.toLocaleString()}。`
      }
      if (status === 'success' && offer) return `已套用：${offer.label}。`
      if (status === 'success') return '已成功套用優惠碼。'
      if (status === 'error') return '查無可用折扣碼，請重新輸入。'
      if (status === 'cleared') return '已取消使用折扣碼。'
      return ''
    },

    syncSelectedCoupon(zoneKey: TempZone) {
      const zone = this.visibleZones.find((item) => item.key === zoneKey)
      if (!zone) return

      const selectedCoupon = this.availableCoupons.find((coupon) => coupon.id === this.zoneDraft(zoneKey).selectedCouponId)
      if (!selectedCoupon) return

      const canUseCoupon = this.zoneSubtotal(zone) >= selectedCoupon.minTotal && this.couponMatchesZone(selectedCoupon, zoneKey)
      if (canUseCoupon) return

      this.zoneDraft(zoneKey).selectedCouponId = null
    },

    syncAllZoneCoupons() {
      ;(['fresh', 'chilled', 'frozen', 'ambient'] as TempZone[]).forEach((zoneKey) => this.syncSelectedCoupon(zoneKey))
    },
    persistCouponDraft() {
      if (typeof window === 'undefined') return
      const persistedDraft = (['fresh', 'chilled', 'frozen', 'ambient'] as TempZone[]).reduce((draft, zoneKey) => {
        const zoneDraft = this.zoneCouponDrafts[zoneKey]
        draft[zoneKey] = {
          selectedCouponId: zoneDraft.selectedCouponId,
          couponCode: zoneDraft.couponCode,
          appliedCouponCode: zoneDraft.appliedCouponCode,
        }
        return draft
      }, {} as Record<TempZone, Pick<ZoneCouponDraft, 'selectedCouponId' | 'couponCode' | 'appliedCouponCode'>>)

      window.localStorage.setItem(CART_COUPON_DRAFT_KEY, JSON.stringify(persistedDraft))
    },
    restoreCouponDraft() {
      if (typeof window === 'undefined') return
      const rawDraft = window.localStorage.getItem(CART_COUPON_DRAFT_KEY)
      if (!rawDraft) return

      try {
        const draft = JSON.parse(rawDraft) as Partial<Record<TempZone, Partial<ZoneCouponDraft>>> & {
          selectedCouponId?: number | null
          couponCode?: string
          appliedCouponCode?: string
        }

        ;(['fresh', 'chilled', 'frozen', 'ambient'] as TempZone[]).forEach((zoneKey) => {
          const zoneDraft = draft[zoneKey]
          if (zoneDraft) {
            this.zoneCouponDrafts[zoneKey].selectedCouponId = zoneDraft.selectedCouponId ?? null
            this.zoneCouponDrafts[zoneKey].couponCode = zoneDraft.couponCode ?? ''
            this.zoneCouponDrafts[zoneKey].appliedCouponCode = zoneDraft.appliedCouponCode ?? ''
            this.zoneCouponDrafts[zoneKey].couponCodeStatus = ''
          }
        })

        // backward compatibility for the old single-draft format
        if (draft.selectedCouponId !== undefined || draft.couponCode !== undefined || draft.appliedCouponCode !== undefined) {
          this.zoneCouponDrafts.ambient.selectedCouponId = draft.selectedCouponId ?? null
          this.zoneCouponDrafts.ambient.couponCode = draft.couponCode ?? ''
          this.zoneCouponDrafts.ambient.appliedCouponCode = draft.appliedCouponCode ?? ''
          this.zoneCouponDrafts.ambient.couponCodeStatus = ''
        }

        this.syncAllZoneCoupons()
      } catch (_error) {
        window.localStorage.removeItem(CART_COUPON_DRAFT_KEY)
      }
    },

    // ── 購物車操作 ──
    increment(item: CartItem) {
      this.$store.dispatch('cart/setQuantity', {
        productId: item.product.id,
        quantity:  item.quantity + 1,
      })
    },

    decrement(item: CartItem) {
      this.$store.dispatch('cart/setQuantity', {
        productId: item.product.id,
        quantity:  item.quantity - 1,
      })
    },

    removeItem(productId: string) {
      this.$store.dispatch('cart/removeItem', productId)
    },

    clearCart() {
      if (confirm('確定要清空購物車嗎？')) {
        this.$store.dispatch('cart/clearCart')
      }
    },

    // ── 加價購 ──
    activeZoneSubtotal(): number {
      return this.activeZone ? this.zoneSubtotal(this.activeZone) : 0
    },
    isAddOnUnlocked(addon: CartAddOnItem): boolean {
      if (!this.activeZone) return false
      if (addon.tempZone !== this.activeZone.key) return false
      return this.activeZoneSubtotal() >= addon.unlockAt
    },
    addOnStatusText(addon: CartAddOnItem): string {
      const remaining = Math.max(0, addon.unlockAt - this.activeZoneSubtotal())
      return remaining > 0
        ? `還差 $${remaining.toLocaleString()} 解鎖`
        : `已達 $${addon.unlockAt.toLocaleString()} 門檻`
    },
    addOnProductPath(addon: CartAddOnItem): string {
      return `/products/${addon.productId}`
    },
    openAddOnQuantityModal(addon: CartAddOnItem) {
      if (!this.isAddOnUnlocked(addon)) return
      this.selectedAddOn = addon
      this.addOnQuantity = 1
    },
    closeAddOnQuantityModal() {
      this.selectedAddOn = null
      this.addOnQuantity = 1
    },
    incrementAddOnQuantity() {
      this.addOnQuantity = Math.min(this.maxAddOnQuantity, this.addOnQuantity + 1)
    },
    decrementAddOnQuantity() {
      this.addOnQuantity = Math.max(1, this.addOnQuantity - 1)
    },
    isValidAddOnQuantity(): boolean {
      return this.addOnQuantity >= 1 && this.addOnQuantity <= this.maxAddOnQuantity
    },
    confirmAddOnToCart() {
      if (!this.selectedAddOn) return
      if (!this.isAddOnUnlocked(this.selectedAddOn)) return
      if (!this.isValidAddOnQuantity()) return

      this.addAddOnToCart(this.selectedAddOn, this.addOnQuantity)
      this.closeAddOnQuantityModal()
    },
    addAddOnToCart(addon: CartAddOnItem, quantity = 1) {
      if (!this.isAddOnUnlocked(addon)) return
      const qtyToAdd = Math.max(1, Math.min(this.maxAddOnQuantity, Math.round(quantity)))

      const product: Product & { quantity: number } = {
        id:           `addon-${addon.id}`,
        name:         `[加價購] ${addon.name}`,
        description:  '',
        price:        addon.addOnPrice,
        originalPrice: addon.originalPrice,
        memberPrice:  addon.addOnPrice,
        unit:         addon.unit,
        categoryId:   'pantry',
        tempZone:     addon.tempZone,
        image:        addon.image,
        inStock:      true,
        isOrganic:    false,
        origin:       '台灣',
        tags:         ['加價購'],
        quantity:     qtyToAdd,
      }
      this.$store.dispatch('cart/addItem', product)
    },

    // ── 結帳 ──
    checkoutZone(zoneKey: TempZone) {
      const deliveryMethod = this.selectedZoneDelivery(zoneKey)
      this.$router.push({
        path: '/checkout',
        query: {
          zone: zoneKey,
          deliveryMethod,
        },
      }).catch(() => {/* ignore */})
    },
    syncActiveZone() {
      if (!this.visibleZones.length) return
      if (this.visibleZones.some((zone) => zone.key === this.activeZoneKey)) return
      this.activeZoneKey = this.visibleZones[0].key
    },
  },
  created() {
    this.restoreCouponDraft()
    this.syncActiveZone()
  },
  watch: {
    visibleZones: {
      immediate: true,
      handler() {
        this.syncActiveZone()
      },
    },
    totalPrice() {
      this.syncAllZoneCoupons()
      this.persistCouponDraft()
    },
    zoneCouponDrafts: {
      deep: true,
      handler() {
        this.persistCouponDraft()
      },
    },
  },
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
