<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-10">
      <div class="flex items-center justify-center gap-0">
        <template v-for="(step, idx) in steps">
          <div :key="`step-${idx}`" class="flex flex-col items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all" :class="stepCircleClass(idx + 1)">
              <span v-if="currentStep > idx + 1">✓</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span class="text-xs mt-2 font-black tracking-widest uppercase" :class="currentStep === idx + 1 ? 'text-brand-primary' : 'text-gray-300'">{{ step }}</span>
          </div>
          <div v-if="idx < steps.length - 1" :key="`line-${idx}`" class="h-0.5 w-16 sm:w-24 mb-6 transition-all" :class="currentStep > idx + 1 ? 'bg-brand-primary' : 'bg-gray-100'" />
        </template>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      <div class="lg:col-span-2 space-y-8">
        <template v-if="currentStep === 1">
          <section class="bg-white p-8 rounded-md border border-gray-100 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-gray-50 pb-4">
              <h2 class="text-xl font-serif font-black text-gray-800 tracking-widest">訂購資料</h2>
              <span class="text-xs font-bold text-gray-400">本次結帳溫層：{{ zoneLabel }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div><label class="form-label">姓名</label><input v-model="form.orderer.name" type="text" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="王小明" @input="syncReceiverIfSameAsOrderer" /></div>
              <div><label class="form-label">手機</label><input v-model="form.orderer.phone" type="tel" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="0912-345-678" @input="syncReceiverIfSameAsOrderer" /></div>
              <div><label class="form-label">Email</label><input v-model="form.orderer.email" type="email" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="example@email.com" /></div>
            </div>
          </section>

          <section class="bg-white p-8 rounded-md border border-gray-100 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-gray-50 pb-4">
              <h2 class="text-xl font-serif font-black text-gray-800 tracking-widest">配送方式與收件資料</h2>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="sameAsOrderer" type="checkbox" class="accent-brand-primary" @change="onSameAsOrderer" />
                <span class="text-sm font-bold text-gray-400">同訂購人</span>
              </label>
            </div>

            <div class="space-y-3">
              <label v-for="opt in availableDeliveryOptions" :key="opt.value" class="flex items-center gap-4 border rounded-md p-4 cursor-pointer transition-all" :class="form.deliveryMethod === opt.value ? 'border-brand-primary bg-brand-surface' : 'border-gray-100'">
                <input v-model="form.deliveryMethod" type="radio" :value="opt.value" class="accent-brand-primary" />
                <span class="text-2xl">{{ opt.icon }}</span>
                <div class="flex-1">
                  <p class="text-sm font-black text-gray-800">{{ opt.label }}</p>
                  <p class="text-xs font-bold text-gray-400">{{ opt.desc }}</p>
                </div>
              </label>
            </div>

            <div class="rounded-2xl border border-brand-primary/10 bg-brand-surface/30 p-4">
              <template v-if="!requiresStoreSelection">
                <div class="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm font-black text-gray-800">常用收件資料</p>
                    <p class="text-xs font-bold text-gray-400">預設地址已帶入，需要時再更換</p>
                  </div>
                  <button type="button" class="text-xs font-black text-brand-primary hover:text-brand-dark" @click="showSavedAddresses = !showSavedAddresses">
                    {{ showSavedAddresses ? '收合其他常用地址' : '選擇其他常用地址' }}
                  </button>
                </div>

                <div v-if="selectedAddress" class="rounded-2xl border border-gray-200 bg-white p-4">
                  <div class="mb-1 flex items-center gap-2">
                    <span class="text-sm font-black text-gray-800">{{ selectedAddress.name }}</span>
                    <span class="text-xs font-bold text-gray-400">{{ selectedAddress.phone }}</span>
                    <span class="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-black text-white">目前使用</span>
                  </div>
                  <p class="text-sm text-gray-500">{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</p>
                </div>

                <div v-if="showSavedAddresses" class="mt-3 grid gap-3 md:grid-cols-2">
                  <button
                    v-for="address in otherAddresses"
                    :key="address.id"
                    type="button"
                    class="rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-brand-primary/40"
                    @click="applySavedAddress(address.id)"
                  >
                    <div class="mb-1 flex items-center gap-2">
                      <span class="text-sm font-black text-gray-800">{{ address.name }}</span>
                      <span class="text-xs font-bold text-gray-400">{{ address.phone }}</span>
                      <span v-if="address.isDefault" class="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-black text-white">預設</span>
                    </div>
                    <p class="text-sm text-gray-500">{{ address.city }}{{ address.district }}{{ address.detail }}</p>
                  </button>
                </div>
              </template>

              <div v-if="requiresStoreSelection" class="rounded-2xl border border-[#0f8f62]/15 bg-[#f3fbf7] p-4">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm font-black text-gray-800">7-ELEVEN 取貨門市</p>
                    <p class="text-xs font-bold text-gray-400">選擇門市後才能完成超商取貨結帳</p>
                  </div>
                  <button type="button" class="rounded-xl bg-[#0f8f62] px-4 py-2.5 text-xs font-black text-white transition-all hover:opacity-90" @click="selectStore">
                    {{ selectedStore ? '更換門市' : '選擇門市' }}
                  </button>
                </div>
                <div v-if="selectedStore" class="mt-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
                  <p class="font-black text-gray-800">{{ selectedStore.name }}</p>
                  <p class="mt-1">{{ selectedStore.address }}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><label class="form-label">收件人姓名</label><input v-model="form.receiver.name" type="text" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" :disabled="sameAsOrderer" @input="syncReceiverIfSameAsOrderer" /></div>
              <div><label class="form-label">收件人手機</label><input v-model="form.receiver.phone" type="tel" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" :disabled="sameAsOrderer" @input="syncReceiverIfSameAsOrderer" /></div>
            </div>

            <div v-if="!requiresStoreSelection" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div><label class="form-label">縣市</label><input v-model="form.receiver.city" type="text" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="台北市" /></div>
              <div><label class="form-label">行政區</label><input v-model="form.receiver.district" type="text" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="大安區" /></div>
            </div>
            <div v-if="!requiresStoreSelection">
              <label class="form-label">詳細地址</label>
              <input v-model="form.receiver.detail" type="text" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="請輸入街道、門牌、樓層" />
            </div>
            <p v-if="currentStep === 1 && step1HasErrors" class="text-sm font-bold text-red-500">請完成配送資料的必填欄位。</p>
          </section>

          <section class="bg-white p-8 rounded-md border border-gray-100 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-gray-50 pb-4">
              <h2 class="text-xl font-serif font-black text-gray-800 tracking-widest">備註</h2>
              <span class="text-xs font-bold text-gray-400">可填寫送貨或包裝需求</span>
            </div>
            <div>
              <label class="form-label">訂單備註</label>
              <textarea
                v-model="form.note"
                class="form-input min-h-[120px]"
                placeholder="例如：請協助放管理室、希望週末配送、包裝請加強防撞"
              ></textarea>
            </div>
          </section>
        </template>

        <template v-else-if="currentStep === 2">
          <section class="bg-white p-8 rounded-md border border-gray-100 shadow-sm space-y-6">
            <h2 class="text-xl font-serif font-black text-gray-800 tracking-widest border-b border-gray-50 pb-4">付款方式</h2>
            <div v-if="payableTotal > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label v-for="opt in filteredPaymentOptions" :key="opt.value" class="flex items-center gap-3 border rounded-md p-4 cursor-pointer" :class="form.paymentMethod === opt.value ? 'border-brand-primary bg-brand-surface' : 'border-gray-100'">
                <input v-model="form.paymentMethod" type="radio" :value="opt.value" class="accent-brand-primary" />
                <div class="flex items-center gap-2">
                  <span class="text-sm font-black text-gray-700">{{ opt.label }}</span>
                  <img
                    v-if="opt.image"
                    :src="opt.image"
                    :alt="opt.label"
                    class="h-6 w-auto object-contain"
                  />
                </div>
              </label>
            </div>
            <div v-else class="bg-brand-surface border border-brand-primary/10 p-6 rounded-md shadow-sm">
              <h3 class="text-lg font-serif font-black text-brand-primary tracking-widest mb-2">本筆訂單無需付款</h3>
              <p class="text-sm text-gray-500">已使用換購點數、OP 點數與購物金完成全額折抵。</p>
            </div>
            <p v-if="currentStep === 2 && step2HasErrors" class="text-sm font-bold text-red-500">請先選擇付款方式，或確認折抵金額沒有超過上限。</p>
          </section>

          <section class="bg-white p-8 rounded-md border border-gray-100 shadow-sm space-y-6">
            <h2 class="text-xl font-serif font-black text-gray-800 tracking-widest border-b border-gray-50 pb-4">折抵設定</h2>

            <div v-if="totalRequiredOpPoints > 0" class="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-black text-gray-800">OP 點數換購折抵</p>
                  <p class="text-xs text-gray-400 mt-1">換購商品會依數量自動累計所需 OP 點數。</p>
                  <div class="mt-3 space-y-2">
                    <div
                      v-for="item in opExchangeItems"
                      :key="`op-${item.product.id}`"
                      class="flex items-center justify-between text-xs font-semibold text-gray-500"
                    >
                      <span>{{ item.product.name }} x{{ item.quantity }}</span>
                      <span>{{ lineOpPoints(item).toLocaleString() }} 點</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-lg font-black text-brand-accent">{{ totalRequiredOpPoints.toLocaleString() }} 點</p>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-gray-100 p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-black text-gray-800">OP 點數折抵</p>
                  <p class="text-xs text-gray-400 mt-1">可用點數餘額：{{ pointBalance.toLocaleString() }} 點</p>
                  <p class="text-xs text-gray-400 mt-1">待確認計算規則</p>
                </div>
                <div class="w-full max-w-[12rem]">
                  <input v-model.number="pointsToRedeem" type="number" min="0" :max="maxRedeemablePoints" class="form-input text-right" placeholder="輸入點數" />
                  <p class="mt-2 text-xs text-gray-400 text-right">折抵 NT.{{ appliedPointDiscount.toLocaleString() }}</p>
                </div>
              </div>
              <p v-if="pointError" class="mt-2 text-xs font-bold text-red-500">{{ pointError }}</p>
            </div>

            <div class="rounded-2xl border border-gray-100 p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-black text-gray-800">購物金折抵</p>
                  <p class="text-xs text-gray-400 mt-1">可用購物金餘額：${{ creditBalance.toLocaleString() }}</p>
                  <p class="text-xs text-red-500 mt-1">最近到期日：{{ creditExpiry }}</p>
                  <p class="text-xs text-gray-400 mt-1">待確認計算規則</p>
                </div>
                <div class="w-full max-w-[12rem]">
                  <input v-model.number="creditsToRedeem" type="number" min="0" :max="maxCreditRedeemable" class="form-input text-right" placeholder="輸入購物金" />
                  <p class="mt-2 text-xs text-gray-400 text-right">折抵 NT.{{ appliedCreditDiscount.toLocaleString() }}</p>
                </div>
              </div>
              <p v-if="creditError" class="mt-2 text-xs font-bold text-red-500">{{ creditError }}</p>
            </div>

            <div class="rounded-2xl border border-gray-100 p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-black text-gray-800">折價券</p>
                  <p class="text-xs text-gray-400 mt-1">請選擇本次結帳要使用的折價券。</p>
                </div>
                <div class="w-full max-w-[16rem]">
                  <select v-model.number="selectedCouponId" class="form-input text-right">
                    <option :value="null">不使用折價券</option>
                    <option
                      v-for="coupon in selectableCoupons"
                      :key="coupon.id"
                      :value="coupon.id"
                    >
                      {{ coupon.title }} - 折抵 ${{ coupon.amount }}
                    </option>
                  </select>
                  <p v-if="selectedCoupon" class="mt-2 text-xs text-gray-400 text-right">
                    {{ selectedCoupon.scope }}｜{{ selectedCoupon.expiryDate }} 到期
                  </p>
                  <p class="mt-2 text-xs text-gray-400 text-right">折抵 NT.{{ selectedCouponDiscount.toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-gray-100 p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-black text-gray-800">折扣碼</p>
                  <p class="text-xs text-gray-400 mt-1">優惠券 / 折扣碼已從購物車移至此步驟設定。</p>
                </div>
                <div class="w-full max-w-[12rem]">
                  <input v-model="couponCode" type="text" class="form-input text-right" placeholder="輸入折扣碼" />
                  <p class="mt-2 text-xs text-gray-400 text-right">折抵 NT.{{ couponDiscount.toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-brand-primary/10 bg-brand-surface/30 p-4">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm font-black text-gray-800">折抵後預估金額</p>
                  <p class="text-xs text-gray-400 mt-1">將即時依折抵內容更新</p>
                </div>
                <p class="text-2xl font-black text-brand-primary">${{ payableTotal.toLocaleString() }}</p>
              </div>
            </div>
          </section>
        </template>

        <template v-else>
          <section class="bg-white p-8 rounded-md border border-gray-100 shadow-sm space-y-6">
            <h2 class="text-xl font-serif font-black text-gray-800 tracking-widest border-b border-gray-50 pb-4">完成訂單</h2>

            <div class="space-y-6">
              <div class="rounded-2xl border border-gray-100 p-4">
                <p class="text-sm font-black text-gray-800 mb-4">訂購商品</p>
                <div class="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  <div v-for="item in checkoutItems" :key="item.product.id" class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-gray-50 rounded-sm flex-shrink-0 p-2">
                      <img :src="item.product.image" class="w-full h-full object-contain" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-black text-gray-800 truncate">{{ item.product.name }}</p>
                      <p class="text-[10px] text-gray-400">數量 x{{ item.quantity }} · 單價 ${{ itemLineTotal(item).toLocaleString() }}</p>
                      <p v-if="item.product.promotionMessage" class="text-[10px] font-bold text-orange-500">
                        {{ item.product.promotionMessage }}
                      </p>
                      <p v-if="giftProgressText(item)" class="text-[10px] font-bold text-brand-primary">
                        {{ giftProgressText(item) }}
                      </p>
                      <p v-if="lineOpPoints(item) > 0" class="text-[10px] font-bold text-brand-accent">
                        OP 換購 {{ lineOpPoints(item).toLocaleString() }} 點
                      </p>
                    </div>
                    <p class="text-sm font-black text-gray-700">${{ itemLineTotal(item).toLocaleString() }}</p>
                  </div>
                </div>
                <div v-if="giftSummaries.length > 0" class="mt-4 rounded-2xl border border-brand-primary/15 bg-brand-surface/40 p-3">
                  <p class="text-xs font-black text-gray-800 mb-2">本次贈品</p>
                  <div v-for="gift in giftSummaries" :key="`${gift.sourceProductId}-${gift.giftProductId}`" class="flex items-center justify-between text-xs text-gray-600">
                    <span>{{ gift.giftName }}</span>
                    <span class="font-black text-brand-primary">x{{ gift.giftQuantity }}</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="rounded-2xl border border-gray-100 p-4 space-y-3">
                  <p class="text-sm font-black text-gray-800">配送資訊</p>
                  <p class="text-sm text-gray-600">收件人：{{ form.receiver.name }}</p>
                  <p class="text-sm text-gray-600">電話：{{ form.receiver.phone }}</p>
                  <p class="text-sm text-gray-600">配送方式：{{ deliverySummary }}</p>
                  <p v-if="selectedStore" class="text-sm text-gray-600">門市：{{ selectedStore.name }}</p>
                  <p v-else class="text-sm text-gray-600">地址：{{ form.receiver.city }}{{ form.receiver.district }}{{ form.receiver.detail }}</p>
                </div>
                <div class="rounded-2xl border border-gray-100 p-4 space-y-3">
                  <p class="text-sm font-black text-gray-800">付款資訊</p>
                  <p class="text-sm text-gray-600">付款方式：{{ paymentSummary }}</p>
                  <p class="text-sm text-gray-600">折價券 / 折扣碼：{{ couponSummary }}</p>
                  <p class="text-sm text-gray-600">OP 點數折抵：{{ appliedPointDiscount.toLocaleString() }} 點</p>
                  <p class="text-sm text-gray-600">購物金折抵：${{ appliedCreditDiscount.toLocaleString() }}</p>
                </div>
              </div>

              <div class="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <div class="flex justify-between text-sm font-bold text-gray-500"><span>商品小計</span><span>${{ totalPrice.toLocaleString() }}</span></div>
                <div class="flex justify-between text-sm font-bold text-gray-500"><span>運費</span><span>{{ shippingFee === 0 ? '免運' : `$${shippingFee.toLocaleString()}` }}</span></div>
                <div v-if="giftSummaries.length > 0" class="flex justify-between text-sm font-bold text-brand-primary"><span>活動贈品</span><span>{{ giftSummaries.map((gift) => `${gift.giftName} x${gift.giftQuantity}`).join('、') }}</span></div>
                <div v-if="couponDiscount > 0" class="flex justify-between text-sm font-bold text-gray-500"><span>折價券 / 折扣碼折抵</span><span>-${{ couponDiscount.toLocaleString() }}</span></div>
                <div v-if="totalRequiredOpPoints > 0" class="flex justify-between text-sm font-bold text-gray-500"><span>OP 換購折抵</span><span>{{ totalRequiredOpPoints.toLocaleString() }} 點</span></div>
                <div v-if="appliedPointDiscount > 0" class="flex justify-between text-sm font-bold text-gray-500"><span>OP 點數折抵</span><span>-${{ appliedPointDiscount.toLocaleString() }}</span></div>
                <div v-if="appliedCreditDiscount > 0" class="flex justify-between text-sm font-bold text-gray-500"><span>購物金折抵</span><span>-${{ appliedCreditDiscount.toLocaleString() }}</span></div>
                <div class="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                  <span class="text-sm font-black text-gray-800 tracking-widest">實際付款金額</span>
                  <span class="text-3xl font-serif font-black text-brand-primary tracking-tighter italic"><span class="text-sm not-italic mr-1">$</span>{{ payableTotal.toLocaleString() }}</span>
                </div>
              </div>

              <label class="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <input v-model="form.agreeToTerms" type="checkbox" class="mt-1 accent-brand-primary" />
                <span class="text-sm text-gray-700 leading-relaxed">
                  我已詳閱並同意
                  <router-link to="/member-terms" class="font-bold text-brand-primary hover:underline">會員條款</router-link>
                  與
                  <router-link to="/privacy" class="font-bold text-brand-primary hover:underline">隱私權政策</router-link>
                </span>
              </label>

              <p v-if="!canSubmitOrder && form.agreeToTerms" class="text-xs font-bold text-red-500">
                請先完成必填資料或確認折抵上限。
              </p>
            </div>
          </section>
        </template>

        <div class="flex justify-between items-center pt-8 border-t border-gray-50">
          <button v-if="currentStep > 1" @click="currentStep--" class="text-sm font-black text-gray-400 hover:text-brand-primary tracking-widest">← 上一步</button>
          <div v-else />
          <button
            v-if="currentStep < 3"
            @click="nextStep"
            :disabled="(currentStep === 1 && !canProceedStep1) || (currentStep === 2 && !canProceedStep2)"
            class="px-12 py-4 bg-brand-primary text-white text-sm font-black tracking-[0.2em] shadow-lg shadow-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            下一步
          </button>
          <button v-else @click="submitOrder" :disabled="!canSubmitOrder" class="px-12 py-4 bg-brand-accent text-white text-sm font-black tracking-[0.2em] shadow-lg shadow-brand-accent/20 disabled:cursor-not-allowed disabled:opacity-40">確認送出訂單</button>
        </div>
      </div>

      <aside class="hidden lg:block sticky top-32 space-y-6">
        <div class="bg-white p-8 rounded-md border border-gray-100 shadow-sm">
          <h3 class="text-lg font-serif font-black text-gray-800 tracking-widest mb-8 border-b border-gray-50 pb-4">訂單摘要</h3>
          <div class="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="item in checkoutItems" :key="item.product.id" class="flex gap-4">
              <div class="w-16 h-16 bg-gray-50 rounded-sm flex-shrink-0 p-2"><img :src="item.product.image" class="w-full h-full object-contain" /></div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-black text-gray-800 truncate mb-1">{{ item.product.name }}</p>
                <div class="flex justify-between items-center">
                  <p class="text-[10px] font-bold text-gray-400">x{{ item.quantity }}</p>
                  <p class="text-xs font-black text-gray-700">${{ itemLineTotal(item).toLocaleString() }}</p>
                </div>
                <p v-if="item.product.promotionMessage" class="mt-1 text-[10px] font-bold text-orange-500">
                  {{ item.product.promotionMessage }}
                </p>
                <p v-if="giftProgressText(item)" class="mt-1 text-[10px] font-bold text-brand-primary">
                  {{ giftProgressText(item) }}
                </p>
                <p v-if="lineOpPoints(item) > 0" class="mt-1 text-[10px] font-bold text-brand-accent">
                  OP 換購 {{ lineOpPoints(item).toLocaleString() }} 點
                </p>
              </div>
            </div>
          </div>
          <div v-if="giftSummaries.length > 0" class="mb-6 rounded-2xl border border-brand-primary/15 bg-brand-surface/40 p-3">
            <p class="text-xs font-black text-gray-800 mb-2">本次贈品</p>
            <div v-for="gift in giftSummaries" :key="`${gift.sourceProductId}-${gift.giftProductId}-aside`" class="flex items-center justify-between text-xs text-gray-600">
              <span>{{ gift.giftName }}</span>
              <span class="font-black text-brand-primary">x{{ gift.giftQuantity }}</span>
            </div>
          </div>
          <div class="space-y-3 pt-6 border-t border-gray-50 font-bold">
            <div class="flex justify-between text-xs text-gray-400"><span>商品小計</span><span>${{ totalPrice.toLocaleString() }}</span></div>
            <div class="flex justify-between text-xs text-gray-400"><span>運費</span><span>{{ shippingFee === 0 ? '免運' : `$${shippingFee.toLocaleString()}` }}</span></div>
            <div v-if="giftSummaries.length > 0" class="flex justify-between text-xs text-brand-primary"><span>活動贈品</span><span>{{ giftSummaries.map((gift) => `${gift.giftName} x${gift.giftQuantity}`).join('、') }}</span></div>
            <div v-if="couponDiscount > 0" class="flex justify-between text-xs text-brand-primary"><span>折價券 / 折扣碼折抵</span><span>- ${{ couponDiscount.toLocaleString() }}</span></div>
            <div v-if="totalRequiredOpPoints > 0" class="flex justify-between text-xs text-brand-accent"><span>OP 換購折抵</span><span>{{ totalRequiredOpPoints.toLocaleString() }} 點</span></div>
            <div v-if="appliedPointDiscount > 0" class="flex justify-between text-xs text-brand-primary"><span>OP 點數折抵</span><span>- ${{ appliedPointDiscount.toLocaleString() }}</span></div>
            <div v-if="appliedCreditDiscount > 0" class="flex justify-between text-xs text-brand-primary"><span>購物金折抵</span><span>- ${{ appliedCreditDiscount.toLocaleString() }}</span></div>
            <div class="flex justify-between items-baseline pt-4 border-t border-gray-100">
              <span class="text-sm font-black text-gray-800 tracking-widest">實際付款金額</span>
              <span class="text-3xl font-serif font-black text-brand-primary tracking-tighter italic"><span class="text-sm not-italic mr-1">$</span>{{ payableTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <div class="lg:hidden mt-8">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button class="w-full px-5 py-4 flex items-center justify-between" @click="showMobileSummary = !showMobileSummary">
          <div>
            <p class="text-xs font-black text-gray-300 uppercase tracking-widest">訂單摘要</p>
            <p class="text-sm font-bold text-gray-700">點擊展開 / 收合</p>
          </div>
          <span class="text-brand-primary font-black">{{ showMobileSummary ? '收合' : '展開' }}</span>
        </button>
        <div v-if="showMobileSummary" class="px-5 pb-5 border-t border-gray-50">
          <div class="space-y-3 pt-4 font-bold">
            <div class="flex justify-between text-xs text-gray-400"><span>商品小計</span><span>${{ totalPrice.toLocaleString() }}</span></div>
            <div class="flex justify-between text-xs text-gray-400"><span>運費</span><span>{{ shippingFee === 0 ? '免運' : `$${shippingFee.toLocaleString()}` }}</span></div>
            <div v-if="giftSummaries.length > 0" class="flex justify-between text-xs text-brand-primary"><span>活動贈品</span><span>{{ giftSummaries.map((gift) => `${gift.giftName} x${gift.giftQuantity}`).join('、') }}</span></div>
            <div v-if="couponDiscount > 0" class="flex justify-between text-xs text-brand-primary"><span>折價券 / 折扣碼折抵</span><span>- ${{ couponDiscount.toLocaleString() }}</span></div>
            <div v-if="totalRequiredOpPoints > 0" class="flex justify-between text-xs text-brand-accent"><span>OP 換購折抵</span><span>{{ totalRequiredOpPoints.toLocaleString() }} 點</span></div>
            <div v-if="appliedPointDiscount > 0" class="flex justify-between text-xs text-brand-primary"><span>OP 點數折抵</span><span>- ${{ appliedPointDiscount.toLocaleString() }}</span></div>
            <div v-if="appliedCreditDiscount > 0" class="flex justify-between text-xs text-brand-primary"><span>購物金折抵</span><span>- ${{ appliedCreditDiscount.toLocaleString() }}</span></div>
            <div class="flex justify-between items-baseline pt-4 border-t border-gray-100">
              <span class="text-sm font-black text-gray-800 tracking-widest">實際付款金額</span>
              <span class="text-2xl font-serif font-black text-brand-primary tracking-tighter italic"><span class="text-sm not-italic mr-1">$</span>{{ payableTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CartItem, TempZone, TEMP_ZONE_LABEL } from '@/types'
import { mockAddresses, SavedAddress } from '@/mock/addresses'
import { getCartGiftSummaries, getGiftProgressText } from '@/utils/promotions'

const ZONE_RULES: Record<TempZone, { fee: number; freeAt: number }> = {
  ambient: { fee: 60, freeAt: 1200 },
  chilled: { fee: 100, freeAt: 800 },
  frozen: { fee: 150, freeAt: 800 },
  fresh: { fee: 120, freeAt: 800 },
}

const CART_COUPON_DRAFT_KEY = 'organicshops:cart-coupon-draft'

interface CheckoutCouponOption {
  id: number
  title: string
  amount: number
  minTotal: number
  scope: string
  expiryDate: string
}

interface ZoneCouponDraft {
  selectedCouponId: number | null
  couponCode: string
}

export default Vue.extend({
  name: 'CheckoutView',
  data() {
    const icashPayImage = require('../../images/icash Pay.png')

    return {
      currentStep: 1,
      sameAsOrderer: false,
      showSavedAddresses: false,
      showMobileSummary: false,
      selectedAddressId: 1,
      pointsToRedeem: 0,
      creditsToRedeem: 0,
      selectedCouponId: null as number | null,
      couponCode: '',
      steps: ['配送資料', '付款方式', '完成訂單'],
      form: {
        orderer: { name: '', phone: '', email: '' },
        receiver: { name: '', phone: '', city: '', district: '', detail: '' },
        note: '',
        agreeToTerms: false,
        deliveryMethod: 'home',
        paymentMethod: 'credit'
      },
      selectedStore: null as null | { name: string; address: string },
      savedAddresses: mockAddresses.map((address) => ({ ...address })) as SavedAddress[],
      deliveryOptions: [
        { value: 'home', icon: '🚛', label: '宅配', desc: '安心配送到府' },
        { value: 'cvs-pickup', icon: '🏪', label: '7-ELEVEN 超商取貨', desc: '超商取貨，線上先付款' },
        { value: 'cvs-cod', icon: '💵', label: '7-ELEVEN 取貨付款', desc: '超商取貨時於門市付款' }
      ],
      paymentOptions: [
        { value: 'credit', label: '信用卡' },
        { value: 'credit-installment', label: '信用卡分期' },
        { value: 'linepay', label: 'LINE Pay' },
        { value: 'icash', label: 'icash Pay', image: icashPayImage },
        { value: 'cod', label: '貨到付款' },
        { value: 'cvs-cod', label: '超商貨到付款' }
      ],
      availableCoupons: [
        { id: 1, title: '新會員專屬禮金', amount: 100, minTotal: 1000, scope: '全館商品', expiryDate: '2026-04-29' },
        { id: 2, title: '端午佳節慶祝券', amount: 50, minTotal: 500, scope: '冷凍/冷藏商品', expiryDate: '2026-05-13' },
        { id: 3, title: '綠色生活節', amount: 200, minTotal: 1500, scope: '有機蔬菜、在地水果', expiryDate: '2026-05-28' },
        { id: 4, title: 'APP 下單首購禮', amount: 80, minTotal: 0, scope: '全館商品', expiryDate: '2026-06-12' },
      ] as CheckoutCouponOption[],
      couponCodeOffers: {
        ORGANIC100: 100,
        GREEN50: 50,
      } as Record<string, number>
    }
  },
  computed: {
    currentZone(): TempZone {
      const zone = this.$route.query.zone as TempZone | undefined
      return zone && ['ambient', 'chilled', 'frozen', 'fresh'].includes(zone) ? zone : 'ambient'
    },
    zoneLabel(): string {
      return TEMP_ZONE_LABEL[this.currentZone] || '常溫'
    },
    checkoutItems(): CartItem[] {
      return this.$store.state.cart.items.filter((item: CartItem) => item.product.tempZone === this.currentZone)
    },
    opExchangeItems(): CartItem[] {
      return this.checkoutItems.filter((item) => (item.product.requiredOpPoints || 0) > 0)
    },
    giftSummaries() {
      const zone = this.$route.query.zone as TempZone | undefined
      const currentZone = zone && ['ambient', 'chilled', 'frozen', 'fresh'].includes(zone) ? zone : 'ambient'
      const zoneItems = (this.$store.state.cart.items as CartItem[]).filter((item) => item.product.tempZone === currentZone)
      return getCartGiftSummaries(zoneItems)
    },
    totalPrice(): number {
      return this.checkoutItems.reduce((sum, item) => sum + this.itemLineTotal(item), 0)
    },
    shippingFee(): number {
      if (this.totalPrice === 0) return 0
      const rule = ZONE_RULES[this.currentZone]
      return this.totalPrice >= rule.freeAt ? 0 : rule.fee
    },
    selectedAddress(): SavedAddress | undefined {
      return this.savedAddresses.find((address) => address.id === this.selectedAddressId)
    },
    otherAddresses(): SavedAddress[] {
      return this.savedAddresses.filter((address) => address.id !== this.selectedAddressId)
    },
    availableDeliveryOptions(): { value: string; icon: string; label: string; desc: string }[] {
      return this.deliveryOptions
    },
    requiresStoreSelection(): boolean {
      return this.form.deliveryMethod === 'cvs-pickup' || this.form.deliveryMethod === 'cvs-cod'
    },
    filteredPaymentOptions(): { value: string; label: string }[] {
      if (this.form.deliveryMethod === 'cvs-cod') {
        return this.paymentOptions.filter((item) => item.value === 'cvs-cod')
      }
      if (this.form.deliveryMethod === 'cvs-pickup') {
        return this.paymentOptions.filter((item) => !['cod', 'cvs-cod'].includes(item.value))
      }
      return this.paymentOptions.filter((item) => item.value !== 'cvs-cod')
    },
    pointBalance(): number {
      return this.$store.getters['user/pointBalance']
    },
    creditBalance(): number {
      return this.$store.getters['user/creditBalance']
    },
    creditExpiry(): string {
      return this.$store.getters['user/creditExpiry']
    },
    totalRequiredOpPoints(): number {
      return this.checkoutItems.reduce((sum, item) => sum + (item.product.requiredOpPoints || 0) * item.quantity, 0)
    },
    selectableCoupons(): CheckoutCouponOption[] {
      return this.availableCoupons.filter((coupon) => this.totalPrice >= coupon.minTotal && this.couponMatchesZone(coupon))
    },
    selectedCoupon(): CheckoutCouponOption | null {
      return this.availableCoupons.find((coupon) => coupon.id === this.selectedCouponId) || null
    },
    selectedCouponDiscount(): number {
      if (!this.selectedCoupon) return 0
      return this.totalPrice >= this.selectedCoupon.minTotal ? this.selectedCoupon.amount : 0
    },
    couponCodeDiscount(): number {
      const code = this.couponCode.trim().toUpperCase()
      return this.couponCodeOffers[code] || 0
    },
    maxRedeemablePoints(): number {
      return Math.max(0, Math.min(this.pointBalance - this.totalRequiredOpPoints, this.totalPrice))
    },
    appliedPointDiscount(): number {
      return Math.max(0, Math.min(Number(this.pointsToRedeem) || 0, this.maxRedeemablePoints))
    },
    pointError(): string {
      if ((Number(this.pointsToRedeem) || 0) > this.maxRedeemablePoints) return '折抵點數已超過可使用上限'
      if (this.pointBalance < this.totalRequiredOpPoints + this.appliedPointDiscount) return '目前帳號點數不足'
      return ''
    },
    maxCreditRedeemable(): number {
      return Math.max(0, Math.min(this.creditBalance, this.totalPrice - this.appliedPointDiscount - this.couponDiscount))
    },
    couponDiscount(): number {
      return this.selectedCouponDiscount + this.couponCodeDiscount
    },
    couponSummary(): string {
      const parts = []
      if (this.selectedCoupon) parts.push(this.selectedCoupon.title)
      if (this.couponCode.trim()) parts.push(this.couponCode.trim().toUpperCase())
      return parts.length ? parts.join(' / ') : '未使用'
    },
    appliedCreditDiscount(): number {
      return Math.max(0, Math.min(Number(this.creditsToRedeem) || 0, this.maxCreditRedeemable))
    },
    creditError(): string {
      if ((Number(this.creditsToRedeem) || 0) > this.maxCreditRedeemable) return '購物金折抵已超過可使用上限'
      return ''
    },
    payableTotal(): number {
      return Math.max(0, this.totalPrice + this.shippingFee - this.couponDiscount - this.appliedPointDiscount - this.appliedCreditDiscount)
    },
    deliverySummary(): string {
      if (this.form.deliveryMethod === 'cvs-cod') return '7-ELEVEN 取貨付款'
      if (this.form.deliveryMethod === 'cvs-pickup') return '7-ELEVEN 超商取貨'
      return '宅配'
    },
    paymentSummary(): string {
      return this.paymentOptions.find((item) => item.value === this.form.paymentMethod)?.label || '未選擇'
    },
    canProceedStep1(): boolean {
      if (this.checkoutItems.length === 0) return false
      if (!this.form.orderer.name.trim() || !this.form.orderer.phone.trim() || !this.form.orderer.email.trim()) return false
      if (!this.form.receiver.name.trim() || !this.form.receiver.phone.trim()) return false
      if (this.requiresStoreSelection) return !!this.selectedStore
      return !!this.form.receiver.city.trim() && !!this.form.receiver.district.trim() && !!this.form.receiver.detail.trim()
    },
    canProceedStep2(): boolean {
      if (this.pointError || this.creditError) return false
      if (this.payableTotal > 0 && !this.filteredPaymentOptions.some((item) => item.value === this.form.paymentMethod)) return false
      if (this.payableTotal > 0 && !this.form.paymentMethod) return false
      return true
    },
    canProceedStep3(): boolean {
      return this.canProceedStep1 && this.canProceedStep2
    },
    step1HasErrors(): boolean {
      return !this.canProceedStep1
    },
    step2HasErrors(): boolean {
      return !this.canProceedStep2
    },
    canSubmitOrder(): boolean {
      return this.canProceedStep3 && this.form.agreeToTerms
    }
  },
  methods: {
    stepCircleClass(step: number) {
      if (this.currentStep > step) return 'bg-brand-primary border-brand-primary text-white'
      if (this.currentStep === step) return 'border-brand-primary text-brand-primary bg-white'
      return 'border-gray-100 text-gray-200'
    },
    itemLineTotal(item: CartItem): number {
      const price = item.product.memberPrice ?? item.product.originalPrice ?? item.product.price
      return Math.round(price) * item.quantity
    },
    lineOpPoints(item: CartItem): number {
      return (item.product.requiredOpPoints || 0) * item.quantity
    },
    giftProgressText(item: CartItem): string {
      return getGiftProgressText(item.product, item.quantity)
    },
    syncPaymentMethodForDelivery() {
      const allowed = this.filteredPaymentOptions.map((item) => item.value)
      if (allowed.includes(this.form.paymentMethod)) return
      this.form.paymentMethod = allowed[0] || ''
    },
    syncSelectedCoupon() {
      if (!this.selectedCoupon) return
      if (this.totalPrice >= this.selectedCoupon.minTotal && this.couponMatchesZone(this.selectedCoupon)) return
      this.selectedCouponId = null
    },
    couponMatchesZone(coupon: CheckoutCouponOption) {
      if (coupon.scope.includes('全館')) return true
      if (coupon.scope.includes('冷凍/冷藏')) return ['chilled', 'frozen'].includes(this.currentZone)
      if (coupon.scope.includes('有機蔬菜、在地水果')) return ['fresh', 'ambient'].includes(this.currentZone)
      return true
    },
    restoreCouponDraft() {
      if (typeof window === 'undefined') return
      const rawDraft = window.localStorage.getItem(CART_COUPON_DRAFT_KEY)
      if (!rawDraft) return

      try {
        const draft = JSON.parse(rawDraft) as Partial<Record<TempZone, Partial<ZoneCouponDraft>>> & {
          selectedCouponId?: number | null
          couponCode?: string
        }
        const zoneDraft = draft[this.currentZone]

        this.selectedCouponId = zoneDraft?.selectedCouponId ?? draft.selectedCouponId ?? null
        this.couponCode = zoneDraft?.couponCode ?? draft.couponCode ?? ''
        this.syncSelectedCoupon()
      } catch (_error) {
        window.localStorage.removeItem(CART_COUPON_DRAFT_KEY)
      }
    },
    persistCouponDraft() {
      if (typeof window === 'undefined') return
      let draftMap: Partial<Record<TempZone, ZoneCouponDraft>> = {}

      try {
        const rawDraft = window.localStorage.getItem(CART_COUPON_DRAFT_KEY)
        if (rawDraft) {
          draftMap = JSON.parse(rawDraft) as Partial<Record<TempZone, ZoneCouponDraft>>
        }
      } catch (_error) {
        draftMap = {}
      }

      draftMap[this.currentZone] = {
        selectedCouponId: this.selectedCouponId,
        couponCode: this.couponCode,
      }

      window.localStorage.setItem(
        CART_COUPON_DRAFT_KEY,
        JSON.stringify(draftMap)
      )
    },
    onSameAsOrderer() {
      if (this.sameAsOrderer) {
        this.syncReceiverIfSameAsOrderer()
      }
    },
    syncReceiverIfSameAsOrderer() {
      if (!this.sameAsOrderer) return
      this.form.receiver.name = this.form.orderer.name
      this.form.receiver.phone = this.form.orderer.phone
    },
    applySavedAddress(addressId: number) {
      const address = this.savedAddresses.find((item) => item.id === addressId)
      if (!address) return
      this.selectedAddressId = addressId
      this.form.receiver.name = address.name
      this.form.receiver.phone = address.phone
      this.form.receiver.city = address.city
      this.form.receiver.district = address.district
      this.form.receiver.detail = address.detail
      this.sameAsOrderer = false
      this.showSavedAddresses = false
    },
    selectStore() {
      this.selectedStore = {
        name: '7-ELEVEN 忠孝門市',
        address: '台北市大安區忠孝東路四段 100 號 1 樓'
      }
    },
    nextStep() {
      if (this.currentStep === 1 && !this.canProceedStep1) return
      if (this.currentStep === 2 && !this.canProceedStep2) return
      if (this.currentStep < 3) this.currentStep++
      window.scrollTo(0, 0)
    },
    submitOrder() {
      if (!this.canSubmitOrder) return
      const orderNumber = `OG${Date.now().toString().slice(-8)}`
      this.$router.push({
        path: '/order-complete',
        query: {
          orderNumber,
          orderDate: String(Date.now()),
          total: String(this.payableTotal),
          delivery: this.form.deliveryMethod,
          receiverName: this.form.receiver.name || this.form.orderer.name,
          payment: this.payableTotal === 0 ? 'no-payment' : this.form.paymentMethod,
          zone: this.currentZone,
          opExchangePoints: String(this.totalRequiredOpPoints),
          opRedeemPoints: String(this.appliedPointDiscount),
          creditRedeem: String(this.appliedCreditDiscount),
        }
      })
    }
  },
  created() {
    if (this.savedAddresses.length > 0) {
      const defaultAddress = this.savedAddresses.find((address) => address.isDefault) || this.savedAddresses[0]
      this.applySavedAddress(defaultAddress.id)
    }
    this.restoreCouponDraft()
    this.syncPaymentMethodForDelivery()
  },
  watch: {
    'form.deliveryMethod'() {
      this.syncPaymentMethodForDelivery()
    },
    totalPrice() {
      this.syncSelectedCoupon()
      this.persistCouponDraft()
    },
    selectedCouponId() {
      this.persistCouponDraft()
    },
    couponCode() {
      this.persistCouponDraft()
    }
  }
})
</script>

<style scoped>
.form-label { @apply block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2; }
.form-input { @apply w-full border border-gray-100 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all bg-gray-50/30; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #F3F4F6; border-radius: 10px; }
</style>
