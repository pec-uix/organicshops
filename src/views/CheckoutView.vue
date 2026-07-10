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
          <section class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-gray-50 pb-4">
              <h2 class="text-xl font-black text-gray-800">配送方式與門市</h2>
            </div>

            <div class="space-y-3">
              <label v-for="opt in availableDeliveryOptions" :key="opt.value" class="flex items-center gap-4 border rounded-2xl p-4 cursor-pointer transition-all" :class="form.deliveryMethod === opt.value ? 'border-brand-primary bg-brand-surface' : 'border-gray-100'">
                <input v-model="form.deliveryMethod" type="radio" :value="opt.value" class="accent-brand-primary" />
                <div class="flex-1">
                  <p class="text-sm font-black text-gray-800">{{ opt.label }}</p>
                  <p class="text-xs font-bold text-gray-400">{{ opt.desc }}</p>
                </div>
              </label>
            </div>

            <div v-if="deliveryNotices.length > 0" class="rounded-2xl border border-gray-100 bg-brand-surface/30 p-4 text-xs leading-6 text-gray-500">
              <ul class="space-y-2">
                <li v-for="(notice, idx) in deliveryNotices" :key="`delivery-notice-${idx}`" class="flex gap-2">
                  <span class="mt-0.5 flex-shrink-0">※</span>
                  <span v-html="notice" />
                </li>
              </ul>
            </div>

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
          </section>

          <section class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-gray-50 pb-4">
              <h2 class="text-xl font-black text-gray-800">訂購人明細</h2>
            </div>
            <div class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center">
                <label class="mb-0 text-sm font-bold text-gray-700">中文全名</label>
                <input v-model="form.orderer.name" type="text" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="王小明" @input="syncReceiverIfSameAsOrderer" />
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="rounded-xl border px-4 py-2 text-sm font-black transition-all"
                    :class="form.orderer.gender === 'male' ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-200 text-gray-500'"
                    @click="form.orderer.gender = 'male'"
                  >
                    先生
                  </button>
                  <button
                    type="button"
                    class="rounded-xl border px-4 py-2 text-sm font-black transition-all"
                    :class="form.orderer.gender === 'female' ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-200 text-gray-500'"
                    @click="form.orderer.gender = 'female'"
                  >
                    小姐
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <label class="mb-0 text-sm font-bold text-gray-700">聯絡電話</label>
                <input v-model="form.orderer.phone" type="tel" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="0912-345-678" @input="syncReceiverIfSameAsOrderer" />
              </div>
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <label class="mb-0 text-sm font-bold text-gray-700">聯絡地址</label>
                <input v-model="form.orderer.address" type="text" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="請輸入聯絡地址" />
              </div>
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <label class="mb-0 text-sm font-bold text-gray-700">電子郵件</label>
                <input v-model="form.orderer.email" type="email" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="example@email.com" />
              </div>
              <label class="flex items-center gap-3 text-sm font-bold text-gray-700">
                <input v-model="form.orderer.acceptPromo" type="checkbox" class="accent-brand-primary" />
                願意收到商品特惠通知
              </label>
            </div>
          </section>

          <section class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-gray-50 pb-4">
              <div>
                <h2 class="text-xl font-black text-gray-800">收件人明細</h2>
              </div>
              <div class="flex items-center gap-2">
                <label class="flex items-center gap-2">
                  <input v-model="sameAsOrderer" type="checkbox" class="accent-brand-primary" @change="onSameAsOrderer" />
                  <span class="text-sm font-bold text-gray-700">同購買人</span>
                </label>
                <button type="button" class="rounded-xl bg-brand-primary px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-brand-dark" @click="openSavedAddressPicker">
                  選擇常用地址
                </button>
              </div>
            </div>

            <div class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center">
                <label class="mb-0 text-sm font-bold text-gray-700">中文全名</label>
                <input v-model="form.receiver.name" type="text" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" :disabled="sameAsOrderer" @input="syncReceiverIfSameAsOrderer" />
              </div>
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center">
                <label class="mb-0 text-sm font-bold text-gray-700">室內電話</label>
                <input v-model="form.receiver.landline" type="tel" class="form-input" placeholder="02-1234-5678" />
              </div>
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center">
                <label class="mb-0 text-sm font-bold text-gray-700">行動電話</label>
                <input v-model="form.receiver.phone" type="tel" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" :disabled="sameAsOrderer" @input="syncReceiverIfSameAsOrderer" />
              </div>

              <div v-if="!requiresStoreSelection" class="space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div class="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-4">
                    <label class="mb-0 text-sm font-bold text-gray-700">縣市</label>
                    <select v-model="form.receiver.city" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" @change="onReceiverCityChange">
                      <option value="">請選擇縣市</option>
                      <option v-for="city in receiverCityOptions" :key="city" :value="city">
                        {{ city }}
                      </option>
                    </select>
                  </div>
                  <div class="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-4">
                    <label class="mb-0 text-sm font-bold text-gray-700">區域</label>
                    <select v-model="form.receiver.district" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" :disabled="!form.receiver.city" @change="syncReceiverZipCode">
                      <option value="">請選擇區域</option>
                      <option v-for="district in receiverDistrictOptions" :key="district" :value="district">
                        {{ district }}
                      </option>
                    </select>
                  </div>
                  <div class="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-4">
                    <span class="text-sm font-bold text-gray-700">郵遞區號</span>
                    <input v-model="form.receiver.zipCode" type="text" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="請輸入郵遞區號" />
                  </div>
                </div>
                <div>
                  <input v-model="form.receiver.detail" type="text" class="form-input" :class="{ 'border-red-500': currentStep === 1 && step1HasErrors }" placeholder="請輸入街道、門牌、樓層" />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-start">
                <label class="mb-0 text-sm font-bold text-gray-700 sm:pt-3">希望配送日期</label>
                <div class="space-y-2">
                  <input v-model="form.receiver.desiredDeliveryDate" type="date" class="form-input" />
                  <div v-if="deliveryDateNotices.length > 0" class="rounded-2xl border border-gray-100 bg-brand-surface/30 p-3 text-xs leading-5 text-gray-500">
                    <ul class="space-y-1.5">
                      <li v-for="(notice, idx) in deliveryDateNotices" :key="`delivery-date-notice-${idx}`" class="flex gap-2">
                        <span class="mt-0.5 flex-shrink-0">※</span>
                        <span v-html="notice" />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-start">
                <label class="mb-0 pt-3 text-sm font-bold text-gray-700">我的其他要求</label>
                <textarea
                  v-model="form.receiver.otherRequests"
                  class="form-input min-h-[120px]"
                  placeholder="例如：請協助放管理室、希望週末配送、包裝請加強防撞"
                ></textarea>
              </div>
            </div>
          </section>

          <section class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 class="text-xl font-black text-gray-800 border-b border-gray-50 pb-4">電話聯絡</h2>

            <div class="space-y-4">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center">
                <p class="text-sm font-bold text-gray-700">產品缺貨時</p>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label
                    v-for="option in stockContactOptions"
                    :key="option.value"
                    class="flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all"
                    :class="form.stockContactPreference === option.value ? 'border-brand-primary bg-brand-surface' : 'border-gray-100 bg-white text-gray-700'"
                  >
                    <input v-model="form.stockContactPreference" type="radio" :value="option.value" class="accent-brand-primary" />
                    <span class="text-sm font-black text-gray-700">{{ option.label }}</span>
                  </label>
                </div>
              </div>

              <div class="rounded-2xl border border-brand-primary/10 bg-brand-surface/30 p-4 text-sm font-bold leading-6 text-gray-500">
                產品缺貨時可能會影響購物金權益，但不影響免運費權益。
              </div>

              <p class="text-sm font-bold leading-7 text-gray-500">
                請確認訂購人明細中的
                <span class="text-brand-primary">手機號碼</span>
                與
                <span class="text-brand-primary">聯絡地址</span>
                填寫正確，以利出貨前聯繫。
              </p>
            </div>
          </section>
        </template>

        <template v-else-if="currentStep === 2">
          <section class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 class="text-xl font-black text-gray-800 border-b border-gray-50 pb-4">付款方式</h2>
            <div v-if="payableTotal > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label v-for="opt in filteredPaymentOptions" :key="opt.value" class="flex items-center gap-3 border rounded-2xl p-4 cursor-pointer" :class="form.paymentMethod === opt.value ? 'border-brand-primary bg-brand-surface' : 'border-gray-100'">
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
            <div v-else class="bg-brand-surface border border-brand-primary/10 p-6 rounded-2xl shadow-sm">
              <h3 class="text-lg font-black text-brand-primary mb-2">本筆訂單無需付款</h3>
              <p class="text-sm text-gray-500">已使用換購點數、OP 點數與購物金完成全額折抵。</p>
            </div>
            <p v-if="currentStep === 2 && step2HasErrors" class="text-sm font-bold text-red-500">請先選擇付款方式，或確認折抵金額沒有超過上限。</p>
          </section>

          <section class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 class="text-xl font-black text-gray-800 border-b border-gray-50 pb-4">發票種類</h2>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                v-for="type in invoiceTypeOptions"
                :key="type.value"
                class="flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all"
                :class="form.invoice.type === type.value ? 'border-brand-primary bg-brand-surface' : 'border-gray-100'"
              >
                <input v-model="form.invoice.type" type="radio" :value="type.value" class="accent-brand-primary" />
                <span class="text-sm font-black text-gray-700">{{ type.label }}</span>
              </label>
            </div>

            <div class="rounded-2xl border border-brand-primary/10 bg-brand-surface/30 p-4 text-xs font-bold leading-6 text-gray-500">
              <p>響應發票無紙化，106年財政部無實體電子發票另有專屬獎百萬元15組，2000元一萬組，歡迎多加利用。</p>
              <p>生鮮直送區商品二聯發票一律開立電子發票。</p>
              <p v-if="requiresStoreSelection">使用超商取貨一律開立電子發票。</p>
            </div>

            <div v-if="form.invoice.type === 'personal'" class="space-y-5">
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="carrier in availableInvoiceCarrierOptions"
                  :key="carrier.value"
                  type="button"
                  class="rounded-xl border px-4 py-2.5 text-sm font-black transition-all"
                  :class="form.invoice.carrier === carrier.value ? 'border-brand-primary bg-brand-primary text-white shadow-sm' : 'border-brand-primary/30 bg-white text-brand-primary hover:bg-brand-surface'"
                  @click="form.invoice.carrier = carrier.value"
                >
                  {{ carrier.label }}
                </button>
              </div>

              <div v-if="form.invoice.carrier === 'mobile'" class="grid gap-4 sm:grid-cols-2">
                <input v-model="form.invoice.mobileBarcode" type="text" class="form-input" placeholder="請輸入手機條碼載具" />
                <input v-model="form.invoice.mobileBarcodeConfirm" type="text" class="form-input" placeholder="請再輸入一次供確認" />
              </div>

              <div v-else-if="form.invoice.carrier === 'donation'" class="space-y-4">
                <input v-model="form.invoice.donationCode" type="text" class="form-input" placeholder="請輸入愛心碼" />
                <div class="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs font-bold leading-6 text-gray-500">
                  <p>若您有指定捐贈單位請在此填入愛心碼 (若未填寫預設為 財團法人肝病防治學術基金會)</p>
                  <p>統一生機邀請您捐贈發票給「台灣環境資訊協會」(愛心碼17930)，為環保盡一份心力</p>
                </div>
              </div>

              <div v-else-if="form.invoice.carrier === 'citizen'" class="grid gap-4 sm:grid-cols-2">
                <input v-model="form.invoice.citizenCertificate" type="text" class="form-input" placeholder="請輸入自然人憑證" />
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <input v-model="form.invoice.companyTitle" type="text" class="form-input" placeholder="公司抬頭" />
                <input v-model="form.invoice.companyTaxId" type="text" class="form-input" placeholder="統一編號" />
              </div>
              <p class="text-xs font-bold text-red-500">未選擇公司戶發票填寫無效。</p>
            </div>

            <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <input v-model="form.invoice.agreeReturnInvoiceHandling" type="checkbox" class="mt-1 accent-brand-primary" />
              <span class="text-sm font-bold leading-6 text-gray-600">
                我同意辦理退貨時，由統一生機購物網代為處理發票及銷貨退回證明單，以加速退貨退款作業。
              </span>
            </label>
          </section>

          <section class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 class="text-xl font-black text-gray-800 border-b border-gray-50 pb-4">折抵設定</h2>

            <div class="rounded-2xl border border-gray-100 p-4">
              <h3 class="text-sm font-black text-gray-800">折價券 / 折扣碼</h3>
              <div class="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <label class="form-label">折價券</label>
                  <select v-model.number="selectedCouponId" class="form-input">
                    <option :value="null">不使用折價券</option>
                    <option v-for="coupon in selectableCoupons" :key="coupon.id" :value="coupon.id">
                      {{ coupon.title }} - 折抵 ${{ coupon.amount }}
                    </option>
                  </select>
                  <p v-if="selectedCoupon" class="mt-2 text-xs text-gray-400">
                    {{ selectedCoupon.scope }}｜{{ selectedCoupon.expiryDate }} 到期
                  </p>
                </div>
                <div>
                  <label class="form-label">折扣碼</label>
                  <input v-model="couponCode" type="text" class="form-input" placeholder="輸入折扣碼" />
                  <p v-if="couponCodeMessage" class="mt-2 text-xs font-bold" :class="couponCodeCanApply ? 'text-brand-primary' : 'text-red-500'">
                    {{ couponCodeMessage }}
                  </p>
                </div>
              </div>
              <div class="mt-4 rounded-2xl bg-gray-50 p-4">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p class="text-sm font-bold text-gray-500">
                    目前使用：{{ couponSummary === '未使用' ? '目前未使用折價券或折扣碼' : couponSummary }}
                  </p>
                  <p class="text-sm font-black text-brand-primary">折抵金額：-${{ couponDiscount.toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-4 rounded-2xl border border-gray-100 p-4">
              <h3 class="text-sm font-black text-gray-800">帳戶折抵</h3>

              <div v-if="totalRequiredOpPoints > 0" class="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p class="text-sm font-black text-gray-800">OP 換購商品所需點數</p>
                  <p class="mt-1 text-xs text-gray-400">這是購買 OP 換購商品需消耗的點數，不是付款金額折抵。</p>
                </div>
                <div class="mt-4 space-y-3">
                  <div
                    v-for="item in opExchangeItems"
                    :key="`op-${item.product.id}`"
                    class="flex flex-col gap-1 text-xs font-semibold text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <span>{{ item.product.name }} x{{ item.quantity }}</span>
                    <span class="font-black text-brand-accent">{{ lineOpPoints(item).toLocaleString() }} 點</span>
                  </div>
                </div>
                <div class="mt-4 border-t border-gray-100 pt-4">
                  <div class="flex items-center justify-between gap-4">
                    <span class="text-sm font-black text-gray-700">本次合計</span>
                    <span class="text-base font-black text-brand-accent">{{ totalRequiredOpPoints.toLocaleString() }} 點</span>
                  </div>
                </div>
              </div>

              <div class="grid gap-4 lg:grid-cols-2">
                <div class="rounded-2xl border border-gray-100 p-4">
                  <div>
                    <p class="text-sm font-black text-gray-800">OP 點數折抵</p>
                    <p class="mt-1 text-xs text-gray-400">可用點數：{{ pointBalance.toLocaleString() }} 點</p>
                    <p class="mt-1 text-xs text-gray-400">可折抵上限：{{ maxRedeemablePoints.toLocaleString() }} 點</p>
                  </div>
                  <div class="mt-4">
                    <input v-model.number="pointsToRedeem" type="number" min="0" :max="maxRedeemablePoints" class="form-input" placeholder="輸入本次使用點數" />
                    <p class="mt-2 text-xs text-gray-400">折抵 NT.{{ appliedPointDiscount.toLocaleString() }}</p>
                  </div>
                  <p v-if="pointError" class="mt-2 text-xs font-bold text-red-500">{{ pointError }}</p>
                </div>

                <div class="rounded-2xl border border-gray-100 p-4">
                  <div>
                    <p class="text-sm font-black text-gray-800">購物金折抵</p>
                    <p class="mt-1 text-xs text-gray-400">可用購物金餘額：${{ creditBalance.toLocaleString() }}</p>
                    <p class="mt-1 text-xs text-red-500">最近到期日：{{ creditExpiry }}</p>
                  </div>
                  <div class="mt-4">
                    <input v-model.number="creditsToRedeem" type="number" min="0" :max="maxCreditRedeemable" class="form-input" placeholder="輸入本次使用購物金" />
                    <p class="mt-2 text-xs text-gray-400">折抵 NT.{{ appliedCreditDiscount.toLocaleString() }}</p>
                  </div>
                  <p v-if="creditError" class="mt-2 text-xs font-bold text-red-500">{{ creditError }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-brand-primary/10 bg-brand-surface/30 p-4">
              <h3 class="text-sm font-black text-gray-800">折抵結果</h3>
              <div class="mt-4 space-y-3 font-bold">
                <div class="flex justify-between text-sm text-gray-500"><span>商品小計</span><span>${{ totalPrice.toLocaleString() }}</span></div>
                <div v-if="totalRequiredOpPoints > 0" class="flex justify-between text-sm text-brand-accent"><span>OP 換購</span><span>{{ totalRequiredOpPoints.toLocaleString() }} 點</span></div>
                <div class="flex justify-between text-sm text-gray-500"><span>運費</span><span>{{ shippingFeeLabel }}</span></div>
                <div
                  v-for="row in automaticDiscountRows"
                  :key="`discount-result-${row.label}`"
                  class="flex justify-between text-sm text-brand-primary"
                >
                  <span>{{ row.label }}</span>
                  <span>-${{ row.amount.toLocaleString() }}</span>
                </div>
                <div
                  v-for="row in memberDiscountRows"
                  :key="`member-result-${row.label}`"
                  class="flex justify-between text-sm text-brand-primary"
                >
                  <span>{{ row.label }}</span>
                  <span>-${{ row.amount.toLocaleString() }}</span>
                </div>
                <div v-if="couponDiscount > 0" class="flex justify-between text-sm text-brand-primary"><span>折價券 / 折扣碼折抵</span><span>-${{ couponDiscount.toLocaleString() }}</span></div>
                <div v-if="appliedPointDiscount > 0" class="flex justify-between text-sm text-brand-primary"><span>OP 點數折抵</span><span>-${{ appliedPointDiscount.toLocaleString() }}</span></div>
                <div v-if="appliedCreditDiscount > 0" class="flex justify-between text-sm text-brand-primary"><span>購物金折抵</span><span>-${{ appliedCreditDiscount.toLocaleString() }}</span></div>
                <div class="flex items-baseline justify-between border-t border-brand-primary/10 pt-4">
                  <span class="text-sm font-black text-gray-800">實際付款金額</span>
                  <span class="text-2xl font-black text-brand-primary"><span class="mr-1 text-sm">$</span>{{ payableTotal.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </section>
        </template>

        <template v-else>
          <section class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 class="text-xl font-black text-gray-800 border-b border-gray-50 pb-4">完成訂單</h2>

            <div class="space-y-6">
              <div class="rounded-2xl border border-gray-100 p-4">
                <p class="text-sm font-black text-gray-800 mb-4">訂購商品</p>
                <div class="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  <div v-for="item in checkoutItems" :key="item.product.id" class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-gray-50 rounded-xl flex-shrink-0 p-2">
                      <img :src="item.product.image" class="w-full h-full object-contain" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-black text-gray-800 truncate">{{ item.product.name }}</p>
                      <p class="text-[10px] text-gray-400">數量 x{{ item.quantity }} · 單價 ${{ itemLineTotal(item).toLocaleString() }}</p>
                      <div v-if="comboItemDetails(item).length" class="mt-1 grid gap-0.5 text-[10px] leading-4 text-gray-500">
                        <p
                          v-for="detail in comboItemDetails(item)"
                          :key="detail"
                          class="truncate"
                        >
                          {{ detail }}
                        </p>
                      </div>
                      <GiftPromotionNote
                        v-if="item.product.promotionMessage || giftProgressText(item)"
                        class="mt-2"
                        compact
                        :message="item.product.promotionMessage"
                        :progress-text="giftProgressText(item)"
                      />
                      <div v-if="lineOpPoints(item) > 0" class="text-xs leading-5">
                        <p class="font-bold text-brand-accent">OP 換購：{{ (item.product.requiredOpPoints || 0).toLocaleString() }} 點 / 件</p>
                        <p class="font-semibold text-gray-400">本項共 {{ lineOpPoints(item).toLocaleString() }} 點</p>
                      </div>
                    </div>
                    <p class="text-sm font-black text-gray-700">${{ itemLineTotal(item).toLocaleString() }}</p>
                  </div>
                </div>
                <div v-if="checkoutGiftSummaryTexts.length > 0" class="mt-4 rounded-2xl border border-brand-primary/10 bg-brand-surface/30 p-3">
                  <p class="text-xs font-black text-gray-800 mb-2">本次贈品</p>
                  <div v-for="gift in giftSummaries" :key="`${gift.sourceProductId}-${gift.giftProductId}`" class="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2 text-xs text-gray-600">
                    <span class="inline-flex shrink-0 items-center rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-black leading-none text-brand-primary">贈品</span>
                    <span class="min-w-0 flex-1 truncate text-xs font-semibold text-gray-700">{{ gift.giftName }}</span>
                    <span class="font-black text-brand-primary">x{{ gift.giftQuantity }}</span>
                  </div>
                  <div v-for="gift in ambientGiftItemsForCheckout" :key="`confirm-ambient-gift-${gift.id}`" class="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2 text-xs text-gray-600">
                    <span class="inline-flex shrink-0 items-center rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-black leading-none text-brand-primary">贈品</span>
                    <span class="min-w-0 flex-1 truncate text-xs font-semibold text-gray-700">{{ gift.name }}</span>
                    <span class="font-black text-brand-primary">x{{ gift.quantity }}</span>
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
                  <p class="text-sm text-gray-600">預計獲得購物金：${{ creditRewardTotal.toLocaleString() }}</p>
                </div>
              </div>

              <div v-if="isStorePickupDelivery && pickupPromotionRows.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="rounded-2xl border border-brand-primary/10 bg-brand-surface/30 p-4">
                  <p class="text-sm font-black text-gray-800">超商取貨專屬優惠</p>
                  <div class="mt-3 space-y-3">
                    <div
                      v-for="row in pickupPromotionRows"
                      :key="`pickup-promo-${row.label}`"
                      class="rounded-xl bg-white px-3 py-3"
                    >
                      <div class="flex items-center justify-between gap-4 text-sm font-bold" :class="row.reached ? 'text-brand-primary' : 'text-gray-500'">
                        <span>{{ row.label }}</span>
                        <span>{{ row.status }}</span>
                      </div>
                      <p class="mt-1 text-xs leading-5 text-gray-400">{{ row.description }}</p>
                    </div>
                  </div>
                </div>
                <div class="rounded-2xl border border-brand-accent/10 bg-white p-4">
                  <p class="text-sm font-black text-gray-800">滿額加贈 OP 點</p>
                  <div class="mt-3 space-y-3">
                    <div
                      v-for="row in opRewardRows"
                      :key="`pickup-op-${row.label}`"
                      class="rounded-xl bg-brand-accent/5 px-3 py-3"
                    >
                      <div class="flex items-center justify-between gap-4 text-sm font-bold" :class="row.reached ? 'text-brand-accent' : 'text-gray-500'">
                        <span>{{ row.label }}</span>
                        <span>{{ row.status }}</span>
                      </div>
                      <p class="mt-1 text-xs leading-5 text-gray-400">達成後可獲得 {{ row.points.toLocaleString() }} 點。</p>
                    </div>
                  </div>
                  <div v-if="opRewardTotal > 0" class="mt-3 flex items-center justify-between rounded-xl bg-brand-accent/10 px-3 py-2 text-sm font-black text-brand-accent">
                    <span>本次可獲得 OP 點</span>
                    <span>{{ opRewardTotal.toLocaleString() }} 點</span>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <div class="flex justify-between text-sm font-bold text-gray-500"><span>商品小計</span><span>${{ totalPrice.toLocaleString() }}</span></div>
                <div v-if="totalRequiredOpPoints > 0" class="flex justify-between text-sm font-bold text-brand-accent"><span>OP 換購</span><span>{{ totalRequiredOpPoints.toLocaleString() }} 點</span></div>
                <div class="flex justify-between text-sm font-bold text-gray-500"><span>運費</span><span>{{ shippingFeeLabel }}</span></div>
                <div
                  v-for="row in automaticDiscountRows"
                  :key="`confirm-auto-${row.label}`"
                  class="flex justify-between text-sm font-bold text-gray-500"
                >
                  <span>{{ row.label }}</span>
                  <span>-${{ row.amount.toLocaleString() }}</span>
                </div>
                <div
                  v-for="row in memberDiscountRows"
                  :key="`confirm-member-${row.label}`"
                  class="flex justify-between text-sm font-bold text-gray-500"
                >
                  <span>{{ row.label }}</span>
                  <span>-${{ row.amount.toLocaleString() }}</span>
                </div>
                <div v-if="couponDiscount > 0" class="flex justify-between text-sm font-bold text-gray-500"><span>折價券 / 折扣碼折抵</span><span>-${{ couponDiscount.toLocaleString() }}</span></div>
                <div v-if="appliedPointDiscount > 0" class="flex justify-between text-sm font-bold text-gray-500"><span>OP 點數折抵</span><span>-${{ appliedPointDiscount.toLocaleString() }}</span></div>
                <div v-if="appliedCreditDiscount > 0" class="flex justify-between text-sm font-bold text-gray-500"><span>購物金折抵</span><span>-${{ appliedCreditDiscount.toLocaleString() }}</span></div>
                <div class="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                  <span class="text-sm font-black text-gray-800">實際付款金額</span>
                  <span class="text-3xl font-black text-brand-primary"><span class="mr-1 text-sm">$</span>{{ payableTotal.toLocaleString() }}</span>
                </div>
                <div v-if="creditRewardRows.length" class="rounded-2xl bg-white px-4 py-3">
                  <div class="mb-2 flex justify-between text-sm font-black text-brand-primary">
                    <span>本次訂單可獲得購物金</span>
                    <span>+${{ creditRewardTotal.toLocaleString() }}</span>
                  </div>
                  <div
                    v-for="row in creditRewardRows"
                    :key="`confirm-credit-${row.label}`"
                    class="flex justify-between text-xs font-bold text-gray-500"
                  >
                    <span>{{ row.label }}</span>
                    <span>+${{ row.amount.toLocaleString() }}</span>
                  </div>
                </div>
                <div v-if="memberBenefitRows.length" class="rounded-2xl bg-white px-4 py-3">
                  <div class="mb-2 text-sm font-black text-gray-800">會員與次數優惠</div>
                  <div
                    v-for="row in memberBenefitRows"
                    :key="`confirm-benefit-${row.label}`"
                    class="flex justify-between text-xs font-bold"
                    :class="row.reached ? 'text-brand-primary' : 'text-gray-500'"
                  >
                    <span>{{ row.label }}</span>
                    <span>{{ row.status }}</span>
                  </div>
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

        <div class="sticky bottom-0 z-30 -mx-4 flex items-center justify-between gap-3 border-t border-gray-100 bg-white/95 px-4 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:static lg:mx-0 lg:border-gray-50 lg:bg-transparent lg:px-0 lg:pt-8 lg:shadow-none">
          <button v-if="currentStep > 1" @click="currentStep--" class="rounded-xl px-3 py-3 text-sm font-black tracking-widest text-gray-400 hover:text-brand-primary">← 上一步</button>
          <div v-else />
          <div class="min-w-0 text-right lg:hidden">
            <p class="text-[10px] font-black tracking-[0.18em] text-gray-300">應付金額</p>
            <p class="text-xl font-black text-brand-primary"><span class="text-xs">$</span>{{ payableTotal.toLocaleString() }}</p>
          </div>
          <button
            v-if="currentStep < 3"
            @click="nextStep"
            :disabled="(currentStep === 1 && !canProceedStep1) || (currentStep === 2 && !canProceedStep2)"
            class="rounded-xl bg-brand-primary px-6 py-4 text-sm font-black tracking-[0.16em] text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40 sm:px-12"
          >
            下一步
          </button>
          <button v-else @click="submitOrder" :disabled="!canSubmitOrder" class="rounded-xl bg-brand-accent px-6 py-4 text-sm font-black tracking-[0.16em] text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40 sm:px-12">確認送出訂單</button>
        </div>
      </div>

      <aside class="hidden lg:block sticky top-32 space-y-6">
        <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 class="text-lg font-black text-gray-800 mb-8 border-b border-gray-50 pb-4">訂單摘要</h3>
          <div class="space-y-6 mb-8 overflow-y-auto pr-2 custom-scrollbar" :class="showAllSummaryItems ? 'max-h-[520px]' : 'max-h-[300px]'">
            <div v-for="row in visibleSummaryRows" :key="row.key" class="flex gap-4" :class="row.isGift ? 'rounded-2xl border border-brand-primary/10 bg-brand-surface/30 p-3' : ''">
              <div class="flex w-16 h-16 flex-shrink-0 items-center justify-center rounded-xl p-2" :class="row.isGift ? 'bg-white shadow-sm' : 'bg-gray-50'">
                <span v-if="row.isEmoji" class="text-2xl">{{ row.image }}</span>
                <img v-else :src="row.image" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="mb-1 flex items-center gap-2">
                  <span v-if="row.isGift" class="rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-black text-brand-primary">贈品</span>
                  <p class="truncate text-sm font-black text-gray-800">{{ row.name }}</p>
                </div>
                <p v-if="row.unit" class="text-xs font-bold text-gray-400">{{ row.unit }}</p>
                <div class="mt-1 flex justify-between items-center">
                  <p class="text-sm font-bold text-gray-500">x{{ row.quantity }}</p>
                  <p class="text-sm font-black text-gray-700">{{ row.amountText }}</p>
                </div>
                <GiftPromotionNote
                  v-if="row.promotionMessage || row.giftProgressText"
                  class="mt-2"
                  compact
                  :message="row.promotionMessage"
                  :progress-text="row.giftProgressText"
                />
                <div v-if="row.opPoints > 0" class="mt-1 text-xs leading-5">
                  <p class="font-bold text-brand-accent">OP 換購：{{ row.unitOpPoints.toLocaleString() }} 點 / 件</p>
                  <p class="font-semibold text-gray-400">本項共 {{ row.opPoints.toLocaleString() }} 點</p>
                </div>
              </div>
            </div>
          </div>
          <button
            v-if="summaryRows.length > summaryRowPreviewLimit"
            type="button"
            class="-mt-4 mb-6 w-full rounded-xl bg-brand-surface px-4 py-2.5 text-sm font-black text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
            @click="showAllSummaryItems = !showAllSummaryItems"
          >
            {{ showAllSummaryItems ? '收合商品明細' : `查看全部 ${summaryRows.length} 項商品` }}
          </button>
          <div class="space-y-3 pt-6 border-t border-gray-50 font-bold">
            <div class="flex justify-between text-sm text-gray-500"><span>商品小計</span><span>${{ totalPrice.toLocaleString() }}</span></div>
            <div v-if="totalRequiredOpPoints > 0" class="mb-1 flex justify-between text-sm text-brand-accent"><span>OP 換購</span><span>{{ totalRequiredOpPoints.toLocaleString() }} 點</span></div>
            <div class="flex justify-between text-sm text-gray-500"><span>運費</span><span>{{ shippingFeeLabel }}</span></div>
            <div
              v-for="row in automaticDiscountRows"
              :key="`side-auto-${row.label}`"
              class="flex justify-between text-sm text-brand-primary"
            >
              <span>{{ row.label }}</span>
              <span>- ${{ row.amount.toLocaleString() }}</span>
            </div>
            <div
              v-for="row in memberDiscountRows"
              :key="`side-member-${row.label}`"
              class="flex justify-between text-sm text-brand-primary"
            >
              <span>{{ row.label }}</span>
              <span>- ${{ row.amount.toLocaleString() }}</span>
            </div>
            <div v-if="couponDiscount > 0" class="flex justify-between text-sm text-brand-primary"><span>折價券 / 折扣碼折抵</span><span>- ${{ couponDiscount.toLocaleString() }}</span></div>
            <div v-if="appliedPointDiscount > 0" class="flex justify-between text-sm text-brand-primary"><span>OP 點數折抵</span><span>- ${{ appliedPointDiscount.toLocaleString() }}</span></div>
            <div v-if="appliedCreditDiscount > 0" class="flex justify-between text-sm text-brand-primary"><span>購物金折抵</span><span>- ${{ appliedCreditDiscount.toLocaleString() }}</span></div>
            <div v-if="creditRewardTotal > 0" class="flex justify-between text-sm text-brand-primary"><span>預計獲得購物金</span><span>+ ${{ creditRewardTotal.toLocaleString() }}</span></div>
            <div v-if="isStorePickupDelivery && opRewardRows.length" class="flex justify-between text-sm text-brand-accent"><span>本次可獲得 OP 點</span><span>+ {{ opRewardTotal.toLocaleString() }} 點</span></div>
            <div class="flex justify-between items-baseline pt-4 border-t border-gray-100">
              <span class="text-sm font-black text-gray-800">實際付款金額</span>
              <span class="text-3xl font-black text-brand-primary"><span class="mr-1 text-sm">$</span>{{ payableTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <div class="lg:hidden mt-8">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button class="w-full px-5 py-4 transition-colors hover:bg-brand-surface/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20" @click="showMobileSummary = !showMobileSummary">
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0 text-left">
              <p class="text-xs font-black text-gray-300 uppercase tracking-widest">訂單摘要</p>
              <p class="mt-1 text-sm font-bold text-gray-700">{{ zoneLabel }}商品明細，共 {{ summaryRows.length }} 項</p>
              <p class="mt-2 inline-flex items-center rounded-full bg-brand-surface px-3 py-1 text-xs font-black text-brand-primary">
                {{ showMobileSummary ? '收合商品明細' : '查看商品明細' }}
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-3">
              <div class="text-right">
                <p class="text-[10px] font-black tracking-[0.18em] text-gray-300">實際付款金額</p>
                <p class="text-lg font-black text-brand-primary"><span class="text-xs">$</span>{{ payableTotal.toLocaleString() }}</p>
              </div>
              <span class="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/15 bg-white text-brand-primary shadow-sm transition-transform" :class="{ 'rotate-180': showMobileSummary }">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </button>
        <div v-if="showMobileSummary" class="px-5 pb-5 border-t border-gray-50">
          <div class="space-y-4 pt-4">
            <div v-for="row in visibleMobileSummaryRows" :key="`mobile-${row.key}`" class="flex gap-3" :class="row.isGift ? 'rounded-2xl border border-brand-primary/10 bg-brand-surface/30 p-3' : ''">
              <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl p-2" :class="row.isGift ? 'bg-white shadow-sm' : 'bg-gray-50'">
                <span v-if="row.isEmoji" class="text-2xl">{{ row.image }}</span>
                <img v-else :src="row.image" class="h-full w-full object-contain" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="mb-1 flex items-center gap-2">
                  <span v-if="row.isGift" class="rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-black text-brand-primary">贈品</span>
                  <p class="truncate text-sm font-black text-gray-800">{{ row.name }}</p>
                </div>
                <p v-if="row.unit" class="text-xs font-bold text-gray-400">{{ row.unit }}</p>
                <div class="mt-1 flex items-center justify-between text-sm font-bold text-gray-500">
                  <span>x{{ row.quantity }}</span>
                  <span>{{ row.amountText }}</span>
                </div>
                <GiftPromotionNote
                  v-if="row.promotionMessage || row.giftProgressText"
                  class="mt-2"
                  compact
                  :message="row.promotionMessage"
                  :progress-text="row.giftProgressText"
                />
                <div v-if="row.opPoints > 0" class="mt-1 text-xs leading-5">
                  <p class="font-bold text-brand-accent">OP 換購：{{ row.unitOpPoints.toLocaleString() }} 點 / 件</p>
                  <p class="font-semibold text-gray-400">本項共 {{ row.opPoints.toLocaleString() }} 點</p>
                </div>
              </div>
            </div>
            <button
              v-if="summaryRows.length > summaryRowPreviewLimit"
              type="button"
              class="w-full rounded-xl bg-brand-surface px-4 py-2.5 text-sm font-black text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
              @click="showAllMobileSummaryItems = !showAllMobileSummaryItems"
            >
              {{ showAllMobileSummaryItems ? '收合商品明細' : `查看全部 ${summaryRows.length} 項商品` }}
            </button>
          </div>
          <div class="space-y-3 pt-4 font-bold">
            <div class="flex justify-between text-sm text-gray-500"><span>商品小計</span><span>${{ totalPrice.toLocaleString() }}</span></div>
            <div v-if="totalRequiredOpPoints > 0" class="mb-1 flex justify-between text-sm text-brand-accent"><span>OP 換購</span><span>{{ totalRequiredOpPoints.toLocaleString() }} 點</span></div>
            <div class="flex justify-between text-sm text-gray-500"><span>運費</span><span>{{ shippingFeeLabel }}</span></div>
            <div
              v-for="row in automaticDiscountRows"
              :key="`mobile-auto-${row.label}`"
              class="flex justify-between text-sm text-brand-primary"
            >
              <span>{{ row.label }}</span>
              <span>- ${{ row.amount.toLocaleString() }}</span>
            </div>
            <div
              v-for="row in memberDiscountRows"
              :key="`mobile-member-${row.label}`"
              class="flex justify-between text-sm text-brand-primary"
            >
              <span>{{ row.label }}</span>
              <span>- ${{ row.amount.toLocaleString() }}</span>
            </div>
            <div v-if="couponDiscount > 0" class="flex justify-between text-sm text-brand-primary"><span>折價券 / 折扣碼折抵</span><span>- ${{ couponDiscount.toLocaleString() }}</span></div>
            <div v-if="appliedPointDiscount > 0" class="flex justify-between text-sm text-brand-primary"><span>OP 點數折抵</span><span>- ${{ appliedPointDiscount.toLocaleString() }}</span></div>
            <div v-if="appliedCreditDiscount > 0" class="flex justify-between text-sm text-brand-primary"><span>購物金折抵</span><span>- ${{ appliedCreditDiscount.toLocaleString() }}</span></div>
            <div v-if="creditRewardTotal > 0" class="flex justify-between text-sm text-brand-primary"><span>預計獲得購物金</span><span>+ ${{ creditRewardTotal.toLocaleString() }}</span></div>
            <div v-if="isStorePickupDelivery && opRewardRows.length" class="flex justify-between text-sm text-brand-accent"><span>本次可獲得 OP 點</span><span>+ {{ opRewardTotal.toLocaleString() }} 點</span></div>
            <div class="flex justify-between items-baseline pt-4 border-t border-gray-100">
              <span class="text-sm font-black text-gray-800">實際付款金額</span>
              <span class="text-2xl font-black text-brand-primary"><span class="mr-1 text-sm">$</span>{{ payableTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div
        v-if="showSavedAddresses"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        @click.self="closeSavedAddressPicker"
      >
        <div class="w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
          <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
            <div>
              <h3 class="text-lg font-black text-gray-800">選擇常用地址</h3>
              <p class="mt-1 text-xs font-bold text-gray-400">選定後按確認才會帶入收件人資料</p>
            </div>
            <button type="button" class="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700" @click="closeSavedAddressPicker">
              <span class="text-lg leading-none">✕</span>
            </button>
          </div>

          <div class="max-h-[60vh] overflow-y-auto px-5 py-4 sm:px-6">
            <div class="space-y-3">
              <button
                v-for="address in savedAddresses"
                :key="`saved-${address.id}`"
                type="button"
                class="w-full rounded-2xl border p-4 text-left transition-all"
                :class="selectedSavedAddressDraftId === address.id ? 'border-brand-primary bg-brand-surface shadow-sm' : 'border-gray-200 hover:border-brand-primary/40'"
                @click="selectedSavedAddressDraftId = address.id"
              >
                <div class="mb-1 flex items-center gap-2">
                  <span class="text-sm font-black text-gray-800">{{ address.name }}</span>
                  <span class="text-xs font-bold text-gray-400">{{ address.phone }}</span>
                  <span v-if="address.isDefault" class="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-black text-white">預設</span>
                </div>
                <p class="text-sm text-gray-500">{{ address.zipCode }} {{ address.city }}{{ address.district }}{{ address.detail }}</p>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
            <button type="button" class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-black text-gray-500 hover:bg-gray-50" @click="closeSavedAddressPicker">
              取消
            </button>
            <button type="button" class="rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-black text-white hover:bg-brand-dark" @click="confirmSavedAddress">
              確認
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CartItem, TempZone, TEMP_ZONE_LABEL } from '@/types'
import { mockAddresses, SavedAddress } from '@/mock/addresses'
import { getCartGiftSummaries, getGiftProgressText } from '@/utils/promotions'
import GiftPromotionNote from '@/components/promotion/GiftPromotionNote.vue'

type CheckoutDeliveryMethod = 'home' | 'cvs-pickup' | 'cvs-cod'

const ZONE_DELIVERY_RULES: Record<TempZone, Record<CheckoutDeliveryMethod, { fee: number; freeAt: number }>> = {
  ambient: {
    home: { fee: 120, freeAt: 1200 },
    'cvs-pickup': { fee: 60, freeAt: 599 },
    'cvs-cod': { fee: 60, freeAt: 599 },
  },
  chilled: {
    home: { fee: 100, freeAt: 1500 },
    'cvs-pickup': { fee: 100, freeAt: 1500 },
    'cvs-cod': { fee: 100, freeAt: 1500 },
  },
  frozen: {
    home: { fee: 120, freeAt: 800 },
    'cvs-pickup': { fee: 100, freeAt: 800 },
    'cvs-cod': { fee: 100, freeAt: 800 },
  },
  fresh: {
    home: { fee: 120, freeAt: 800 },
    'cvs-pickup': { fee: 120, freeAt: 800 },
    'cvs-cod': { fee: 120, freeAt: 800 },
  },
}

const RECEIVER_CITIES: Record<string, string[]> = {
  '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  '新北市': ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區'],
  '桃園市': ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龍潭區', '龜山區', '大園區', '觀音區', '新屋區'],
  '台中市': ['中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區'],
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

interface CouponCodeOffer {
  type: 'amount' | 'free-shipping' | 'gift' | 'percent'
  label: string
  minTotal: number
  amount?: number
  percent?: number
  gift?: AmbientGiftItem
}

interface InvoiceOption {
  value: string
  label: string
}

interface StockContactOption {
  value: string
  label: string
}

interface AmbientGiftItem {
  id: string
  name: string
  image: string
  unit: string
  quantity: number
}

interface SummaryRow {
  key: string
  name: string
  image: string
  quantity: number
  amountText: string
  isGift: boolean
  isEmoji: boolean
  unit: string
  promotionMessage: string
  giftProgressText: string
  opPoints: number
  unitOpPoints: number
}

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

const AMBIENT_GIFT_TIERS: Array<{ threshold: number; items: AmbientGiftItem[] }> = [
  { threshold: 1500, items: AMBIENT_GIFT_ITEMS },
  {
    threshold: 2000,
    items: [
      {
        id: 'organic-oat-drink',
        name: '有機燕麥飲',
        image: '🥛',
        unit: '250ml/瓶',
        quantity: 2,
      },
    ],
  },
]

const AUTO_AMOUNT_OFFERS = [
  { threshold: 1800, label: '滿 $1,800 現折 $50', amount: 50 },
]

const AUTO_PERCENT_OFFERS = [
  { threshold: 1800, label: '滿 $1,800 享 95 折', percent: 95 },
]

const STORE_PICKUP_PROMOTIONS = [
  {
    threshold: 1200,
    label: '滿 $1,200 可加價購',
    description: '超商取貨滿額可加購指定商品。',
  },
  {
    threshold: 1500,
    label: '滿 $1,500 送購物金 $100',
    description: '超商取貨滿額可獲得購物金回饋。',
  },
  {
    threshold: 1800,
    label: '滿 $1,800 送贈品',
    description: '超商取貨滿額可獲得指定贈品。',
  },
]

const STORE_PICKUP_OP_REWARD_TIERS = [
  { threshold: 1500, label: '滿 $1,500 加贈 10 點', points: 10 },
  { threshold: 2000, label: '滿 $2,000 加贈 30 點', points: 30 },
]

export default Vue.extend({
  name: 'CheckoutView',
  components: { GiftPromotionNote },
  data() {
    const icashPayImage = require('../../images/icash Pay.png')

    return {
      currentStep: 1,
      sameAsOrderer: false,
      showSavedAddresses: false,
      selectedSavedAddressDraftId: 1,
      showMobileSummary: false,
      showAllSummaryItems: false,
      showAllMobileSummaryItems: false,
      selectedAddressId: 1,
      pointsToRedeem: 0,
      creditsToRedeem: 0,
      selectedCouponId: null as number | null,
      couponCode: '',
      summaryRowPreviewLimit: 4,
      steps: ['配送資料', '付款方式', '完成訂單'],
      form: {
        orderer: { name: '', phone: '', address: '', email: '', gender: 'male', acceptPromo: false },
        receiver: {
          name: '',
          phone: '',
          landline: '',
          zipCode: '',
          city: '',
          district: '',
          detail: '',
          desiredDeliveryDate: '',
          otherRequests: '',
          gender: 'male',
        },
        note: '',
        agreeToTerms: false,
        deliveryMethod: 'home',
        paymentMethod: 'credit',
        stockContactPreference: 'call',
        invoice: {
          type: 'personal',
          carrier: 'member',
          mobileBarcode: '',
          mobileBarcodeConfirm: '',
          donationCode: '',
          citizenCertificate: '',
          companyTitle: '',
          companyTaxId: '',
          agreeReturnInvoiceHandling: false,
        },
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
      stockContactOptions: [
        { value: 'call', label: '客服電話聯絡通知' },
        { value: 'remove', label: '直接刪除無需通知' },
      ] as StockContactOption[],
      invoiceTypeOptions: [
        { value: 'personal', label: '個人電子發票' },
        { value: 'company', label: '公司戶發票' },
      ] as InvoiceOption[],
      invoiceCarrierOptions: [
        { value: 'member', label: '會員載具' },
        { value: 'mobile', label: '手機條碼' },
        { value: 'donation', label: '捐贈發票' },
        { value: 'citizen', label: '自然人憑證' },
        { value: 'paper', label: '紙本發票' },
      ] as InvoiceOption[],
      availableCoupons: [
        { id: 1, title: '新會員專屬禮金', amount: 100, minTotal: 1000, scope: '全館商品', expiryDate: '2026-04-29' },
        { id: 2, title: '端午佳節慶祝券', amount: 50, minTotal: 500, scope: '冷凍/冷藏商品', expiryDate: '2026-05-13' },
        { id: 3, title: '綠色生活節', amount: 200, minTotal: 1500, scope: '有機蔬菜、在地水果', expiryDate: '2026-05-28' },
        { id: 4, title: '會員首購禮', amount: 80, minTotal: 0, scope: '全館商品', expiryDate: '2026-06-12' },
      ] as CheckoutCouponOption[],
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
      } as Record<string, CouponCodeOffer>
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
    ambientGiftItemsForCheckout(): AmbientGiftItem[] {
      if (this.currentZone !== 'ambient') return []
      if (this.checkoutItems.length === 0 || this.totalPrice < 1500) return []
      return [
        ...AMBIENT_GIFT_TIERS
        .filter((tier) => this.totalPrice >= tier.threshold)
          .flatMap((tier) => tier.items),
        ...this.couponCodeGiftItems,
      ]
    },
    checkoutGiftSummaryTexts(): string[] {
      return [
        ...this.giftSummaries.map((gift) => `${gift.giftName} x${gift.giftQuantity}`),
        ...this.ambientGiftItemsForCheckout.map((gift) => `${gift.name} x${gift.quantity}`),
      ]
    },
    summaryRows(): SummaryRow[] {
      const rows: SummaryRow[] = []

      this.checkoutItems.forEach((item) => {
        rows.push({
          key: `product-${item.product.id}`,
          name: item.product.name,
          image: item.product.image,
          quantity: item.quantity,
          amountText: `$${this.itemLineTotal(item).toLocaleString()}`,
          isGift: false,
          isEmoji: false,
          unit: '',
          promotionMessage: item.product.promotionMessage || '',
          giftProgressText: this.giftProgressText(item),
          opPoints: this.lineOpPoints(item),
          unitOpPoints: item.product.requiredOpPoints || 0,
        })

        const gift = this.giftSummaryForItem(item)
        if (gift) {
          rows.push({
            key: `gift-${item.product.id}`,
            name: gift.giftName,
            image: item.product.image,
            quantity: gift.giftQuantity,
            amountText: '$0',
            isGift: true,
            isEmoji: false,
            unit: '',
            promotionMessage: '',
            giftProgressText: '',
            opPoints: 0,
            unitOpPoints: 0,
          })
        }
      })

      this.ambientGiftItemsForCheckout.forEach((gift) => {
        rows.push({
          key: `ambient-gift-${gift.id}`,
          name: gift.name,
          image: gift.image,
          quantity: gift.quantity,
          amountText: '$0',
          isGift: true,
          isEmoji: true,
          unit: gift.unit,
          promotionMessage: '',
          giftProgressText: '',
          opPoints: 0,
          unitOpPoints: 0,
        })
      })

      return rows
    },
    visibleSummaryRows(): SummaryRow[] {
      return this.showAllSummaryItems ? this.summaryRows : this.summaryRows.slice(0, this.summaryRowPreviewLimit)
    },
    visibleMobileSummaryRows(): SummaryRow[] {
      return this.showAllMobileSummaryItems ? this.summaryRows : this.summaryRows.slice(0, this.summaryRowPreviewLimit)
    },
    totalPrice(): number {
      return this.checkoutItems.reduce((sum, item) => sum + this.itemLineTotal(item), 0)
    },
    shippingFee(): number {
      if (this.totalPrice === 0) return 0
      if (this.hasCouponCodeFreeShipping) return 0
      const rule = this.currentDeliveryRule()
      return this.totalPrice >= rule.freeAt ? 0 : rule.fee
    },
    shippingFeeLabel(): string {
      if (this.shippingFee === 0) return this.hasCouponCodeFreeShipping ? '優惠碼免運' : '免運'
      return `$${this.shippingFee.toLocaleString()}`
    },
    selectedAddress(): SavedAddress | undefined {
      return this.savedAddresses.find((address) => address.id === this.selectedAddressId)
    },
    otherAddresses(): SavedAddress[] {
      return this.savedAddresses.filter((address) => address.id !== this.selectedAddressId)
    },
    receiverCityOptions(): string[] {
      return Object.keys(RECEIVER_CITIES)
    },
    receiverDistrictOptions(): string[] {
      return this.form.receiver.city ? RECEIVER_CITIES[this.form.receiver.city] || [] : []
    },
    receiverAreaOptions(): { city: string; district: string; zipCode: string }[] {
      const seen = new Set<string>()
      return this.savedAddresses
        .map((address) => {
          return { city: address.city, district: address.district, zipCode: address.zipCode || '' }
        })
        .filter((item) => {
          const key = `${item.city}-${item.district}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
    },
    availableDeliveryOptions(): { value: string; icon: string; label: string; desc: string }[] {
      return this.deliveryOptions
    },
    requiresStoreSelection(): boolean {
      return this.form.deliveryMethod === 'cvs-pickup' || this.form.deliveryMethod === 'cvs-cod'
    },
    isStorePickupDelivery(): boolean {
      return this.requiresStoreSelection
    },
    show711PickupNotice(): boolean {
      return this.isStorePickupDelivery
    },
    showFrozenDelayNotice(): boolean {
      return this.currentZone === 'frozen' && this.isStorePickupDelivery
    },
    deliveryNotices(): string[] {
      const notices: string[] = []
      if (this.show711PickupNotice) {
        notices.push('當商品出貨後，送達指定門市若未被領取或被拒收，會員資料中將會產生 7-ELEVEN 門市未取件記錄。未取件記錄達 <span class="font-semibold">3 次以上（含 3 次）</span>，未來將無法再使用 <span class="font-semibold">7-ELEVEN 取貨</span>。')
      }
      if (this.showFrozenDelayNotice) {
        notices.push('因物流人車調度影響，（冷凍商品）超商取貨台中區域門市，配送時間預計將會延遲 3-4 天，如有急件需求，建議改以宅配寄送。')
      }
      return notices
    },
    deliveryDateNotices(): string[] {
      const notices = [
        '訂單只保留 <span class="font-semibold">7 天</span>，訂單完成後七天內需配送完成。',
        '此僅為希望配送日期，目前為貨運繁盛期，到貨時間以貨運為準，出貨後 <span class="font-semibold">1-3 天</span> 到貨。',
        '無法指定日期，無法指定配送時段，無法保證隔日送達。',
      ]
      if (this.requiresStoreSelection) {
        notices.push('超商取貨訂單成立後，約 <span class="font-semibold">3-5 天（工作天）</span> 商品配送到達超商門市時，我們將以「簡訊」通知您前往取貨。')
      }
      return notices
    },
    availableInvoiceCarrierOptions(): InvoiceOption[] {
      if (this.requiresStoreSelection) {
        return this.invoiceCarrierOptions.filter((item) => item.value !== 'paper')
      }
      return this.invoiceCarrierOptions
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
      const offer = this.couponCodeOffer
      if (!offer || !this.couponCodeCanApply) return 0
      if (offer.type === 'percent' && offer.percent) return Math.round(this.totalPrice * (1 - offer.percent / 100))
      if (offer.type === 'amount') return offer.amount || 0
      return 0
    },
    couponCodeOffer(): CouponCodeOffer | null {
      const code = this.couponCode.trim().toUpperCase()
      return this.couponCodeOffers[code] || null
    },
    couponCodeCanApply(): boolean {
      return Boolean(this.couponCodeOffer && this.totalPrice >= this.couponCodeOffer.minTotal)
    },
    couponCodeMessage(): string {
      const code = this.couponCode.trim().toUpperCase()
      if (!code) return ''
      const offer = this.couponCodeOffer
      if (!offer) return '查無可用優惠碼，請重新輸入。'
      if (!this.couponCodeCanApply) {
        const remaining = offer.minTotal - this.totalPrice
        return `此優惠碼${offer.label}，還差 $${remaining.toLocaleString()}。`
      }
      return `已套用：${offer.label}。`
    },
    hasCouponCodeFreeShipping(): boolean {
      return this.couponCodeCanApply && this.couponCodeOffer?.type === 'free-shipping'
    },
    couponCodeGiftItems(): AmbientGiftItem[] {
      if (this.couponCodeCanApply && this.couponCodeOffer?.type === 'gift' && this.couponCodeOffer.gift) {
        return [this.couponCodeOffer.gift]
      }
      return []
    },
    maxRedeemablePoints(): number {
      return Math.max(0, Math.min(this.pointBalance - this.totalRequiredOpPoints, this.totalPrice))
    },
    appliedPointDiscount(): number {
      return Math.max(0, Math.min(Number(this.pointsToRedeem) || 0, this.maxRedeemablePoints))
    },
    pointError(): string {
      if ((Number(this.pointsToRedeem) || 0) > this.maxRedeemablePoints) return '折抵點數已超過可使用上限'
      if (this.pointBalance < this.totalRequiredOpPoints + this.appliedPointDiscount) return '帳號點數不足'
      return ''
    },
    maxCreditRedeemable(): number {
      return Math.max(0, Math.min(this.creditBalance, this.totalPrice - this.appliedPointDiscount - this.couponDiscount - this.automaticDiscount))
    },
    automaticDiscountRows(): Array<{ label: string; amount: number }> {
      if (this.currentZone !== 'ambient') return []
      const percentRows = AUTO_PERCENT_OFFERS
        .filter((offer) => this.totalPrice >= offer.threshold)
        .map((offer) => ({
          label: offer.label,
          amount: Math.round(this.totalPrice * (1 - offer.percent / 100)),
        }))
      const amountRows = AUTO_AMOUNT_OFFERS
        .filter((offer) => this.totalPrice >= offer.threshold)
        .map((offer) => ({ label: offer.label, amount: offer.amount }))
      return [...percentRows, ...amountRows]
    },
    automaticDiscount(): number {
      return this.automaticDiscountRows.reduce((sum, row) => sum + row.amount, 0)
    },
    memberDiscountRows(): Array<{ label: string; amount: number }> {
      if (this.totalPrice <= 0) return []
      return [
        {
          label: 'VIP 首筆訂單 9 折',
          amount: Math.round(this.totalPrice * 0.1),
        },
      ]
    },
    memberDiscount(): number {
      return this.memberDiscountRows.reduce((sum, row) => sum + row.amount, 0)
    },
    memberBenefitRows(): Array<{ label: string; status: string; reached: boolean }> {
      if (this.totalPrice <= 0) return []
      return [
        { label: '生日購物金 $200', status: '可領取', reached: true },
        { label: '消費一次禮', status: '本次達成', reached: true },
        { label: '第 3 筆消費贈品', status: '本次達成', reached: true },
        { label: '第 5 筆購物金 $100', status: '尚差 2 筆', reached: false },
      ]
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
    creditRewardRows(): Array<{ label: string; amount: number }> {
      const rows: Array<{ label: string; amount: number }> = []
      if (this.totalPrice > 0) rows.push({ label: '首購送購物金', amount: 150 })
      if (this.totalPrice >= 1800) rows.push({ label: '滿 $1,800 送購物金', amount: 100 })
      if (this.checkoutItems.some((item) => item.product.id.startsWith('bundle-'))) rows.push({ label: '套餐加碼購物金', amount: 80 })
      return rows
    },
    creditRewardTotal(): number {
      return this.creditRewardRows.reduce((sum, row) => sum + row.amount, 0)
    },
    pickupPromotionRows(): Array<{ label: string; description: string; status: string; reached: boolean }> {
      if (!this.isStorePickupDelivery) return []
      return STORE_PICKUP_PROMOTIONS.map((offer) => {
        const remaining = Math.max(0, offer.threshold - this.totalPrice)
        return {
          label: offer.label,
          description: offer.description,
          status: remaining === 0 ? '已達成' : `尚差 $${remaining.toLocaleString()}`,
          reached: remaining === 0,
        }
      })
    },
    opRewardRows(): Array<{ label: string; points: number; status: string; reached: boolean }> {
      if (!this.isStorePickupDelivery) return []
      return STORE_PICKUP_OP_REWARD_TIERS.map((tier) => {
        const remaining = Math.max(0, tier.threshold - this.totalPrice)
        return {
          label: tier.label,
          points: tier.points,
          status: remaining === 0 ? '已達成' : `尚差 $${remaining.toLocaleString()}`,
          reached: remaining === 0,
        }
      })
    },
    opRewardTotal(): number {
      return this.opRewardRows.filter((row) => row.reached).reduce((sum, row) => sum + row.points, 0)
    },
    creditError(): string {
      if ((Number(this.creditsToRedeem) || 0) > this.maxCreditRedeemable) return '購物金折抵已超過可使用上限'
      return ''
    },
    payableTotal(): number {
      return Math.max(0, this.totalPrice + this.shippingFee - this.automaticDiscount - this.memberDiscount - this.couponDiscount - this.appliedPointDiscount - this.appliedCreditDiscount)
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
      if (!this.form.orderer.name.trim() || !this.form.orderer.phone.trim() || !this.form.orderer.address.trim() || !this.form.orderer.email.trim()) return false
      if (!this.form.receiver.name.trim() || !this.form.receiver.phone.trim()) return false
      if (this.requiresStoreSelection) return !!this.selectedStore
      return !!this.form.receiver.city.trim() && !!this.form.receiver.district.trim() && !!this.form.receiver.zipCode.trim() && !!this.form.receiver.detail.trim()
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
    giftSummaryForItem(item: CartItem) {
      return this.giftSummaries.find((gift) => gift.sourceProductId === item.product.id) || null
    },
    comboItemDetails(item: CartItem): string[] {
      const comboItems = (item.product as any).comboItems
      if (!Array.isArray(comboItems)) return []
      return comboItems.map((detail: string) => `• ${detail}`)
    },
    normalizedDeliveryMethod(): CheckoutDeliveryMethod {
      const deliveryMethod = this.$route.query.deliveryMethod
      const value = Array.isArray(deliveryMethod) ? deliveryMethod[0] : deliveryMethod

      if (value === 'store-pickup') return 'cvs-pickup'
      if (value === 'cvs-pickup' || value === 'cvs-cod' || value === 'home') return value
      return 'home'
    },
    currentDeliveryRule(): { fee: number; freeAt: number } {
      const method = this.form.deliveryMethod as CheckoutDeliveryMethod
      return ZONE_DELIVERY_RULES[this.currentZone][method] || ZONE_DELIVERY_RULES[this.currentZone].home
    },
    syncPaymentMethodForDelivery() {
      const allowed = this.filteredPaymentOptions.map((item) => item.value)
      if (allowed.includes(this.form.paymentMethod)) return
      this.form.paymentMethod = allowed[0] || ''
    },
    syncInvoiceCarrierForDelivery() {
      if (this.availableInvoiceCarrierOptions.some((item) => item.value === this.form.invoice.carrier)) return
      this.form.invoice.carrier = 'member'
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
    onReceiverCityChange() {
      this.form.receiver.district = ''
      this.syncReceiverZipCode()
    },
    syncReceiverZipCode() {
      const area = this.receiverAreaOptions.find((item) => item.city === this.form.receiver.city && item.district === this.form.receiver.district)
      this.form.receiver.zipCode = area?.zipCode || ''
    },
    openSavedAddressPicker() {
      this.selectedSavedAddressDraftId = this.selectedAddressId
      this.showSavedAddresses = true
    },
    closeSavedAddressPicker() {
      this.showSavedAddresses = false
    },
    applySavedAddress(addressId: number) {
      const address = this.savedAddresses.find((item) => item.id === addressId)
      if (!address) return
      this.selectedAddressId = addressId
      this.form.receiver.name = address.name
      this.form.receiver.phone = address.phone
      this.form.receiver.city = address.city
      this.form.receiver.district = address.district
      this.form.receiver.zipCode = address.zipCode || ''
      this.form.receiver.detail = address.detail
      this.sameAsOrderer = false
    },
    confirmSavedAddress() {
      this.applySavedAddress(this.selectedSavedAddressDraftId)
      this.closeSavedAddressPicker()
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
          desiredDeliveryDate: this.form.receiver.desiredDeliveryDate,
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
    if (this.checkoutItems.length === 0) {
      this.$router.replace('/cart').catch(() => {})
      return
    }
    this.form.deliveryMethod = this.normalizedDeliveryMethod()
    if (this.savedAddresses.length > 0) {
      const defaultAddress = this.savedAddresses.find((address) => address.isDefault) || this.savedAddresses[0]
      this.applySavedAddress(defaultAddress.id)
    }
    this.restoreCouponDraft()
    this.syncPaymentMethodForDelivery()
    this.syncInvoiceCarrierForDelivery()
  },
  watch: {
    'form.deliveryMethod'() {
      this.syncPaymentMethodForDelivery()
      this.syncInvoiceCarrierForDelivery()
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
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter,
.modal-fade-leave-to { opacity: 0; }
</style>
