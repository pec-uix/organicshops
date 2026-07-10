<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <section class="relative overflow-hidden bg-[#F0F4F1]">
      <img
        :src="faqBannerImage"
        alt="常見問題"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <h1 class="text-3xl font-black leading-tight tracking-widest text-brand-dark lg:text-5xl">常見問題</h1>
        <p class="mt-5 max-w-2xl text-sm font-bold leading-[1.6] text-[#374151] lg:text-base">
          解答您的購物疑惑，讓體驗更順暢
        </p>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
      <nav class="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-gray-100 pb-8 text-sm text-gray-500">
        <router-link to="/" class="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-primary" aria-label="返回首頁">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11.5L12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-5.5h5V20" />
          </svg>
          <span>首頁</span>
        </router-link>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-800">
          <span>›</span>
          常見問題
        </span>
      </nav>

      <nav class="sticky top-[104px] z-30 mx-auto mb-12 max-w-6xl overflow-x-auto border-b border-gray-100 bg-brand-bg/95 backdrop-blur" aria-label="常見問題分類">
        <div class="flex min-w-max justify-center gap-2 py-3">
          <button
            v-for="section in faqSections"
            :key="section.id"
            type="button"
            class="border-b-2 px-5 py-3 text-base font-black tracking-widest transition-colors"
            :class="activeSectionId === section.id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-[#4B5563] hover:border-brand-primary hover:text-brand-primary'"
            @click="scrollToSection(section.id)"
          >
            {{ section.title }}
          </button>
        </div>
      </nav>

      <div class="mx-auto max-w-6xl">
        <section v-for="section in faqSections" :id="section.id" :key="section.title" class="mt-12 scroll-mt-36 first:mt-0">
          <div class="mb-5 flex items-center">
            <h2 class="border-l-4 border-brand-primary pl-4 text-3xl font-black tracking-widest text-[#111827] lg:text-4xl">
              {{ section.title }}
            </h2>
          </div>
          <div class="overflow-hidden rounded-md border border-gray-200 bg-white">
            <div 
              v-for="(item, idx) in section.items" 
              :key="idx"
              class="border-b border-gray-100 last:border-b-0"
            >
              <button 
                @click="toggle(section.title + idx)"
                class="group flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-[#F9FAFB] lg:px-6"
                :class="isOpen(section.title + idx) ? 'text-[#719E37]' : 'text-[#374151] hover:text-[#719E37]'"
              >
                <span class="text-sm font-bold leading-6 text-current lg:text-base">{{ item.q }}</span>
                <svg 
                  class="h-5 w-5 flex-shrink-0 text-current transition-all group-hover:translate-y-0.5" 
                  :class="{ 'rotate-180': isOpen(section.title + idx) }"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-show="isOpen(section.title + idx)" class="px-5 pb-5 lg:px-6">
                <p class="whitespace-pre-line border-t border-gray-100 pt-4 text-sm font-medium leading-7 text-[#4B5563]">
                  {{ item.a }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section class="mx-auto mt-16 max-w-6xl rounded-md border border-gray-200 bg-white p-8 text-center">
        <h2 class="text-2xl font-black text-brand-dark">告訴我們您需要什麼協助</h2>
        <p class="mt-3 text-sm font-medium leading-7 text-gray-500">找不到適合的答案時，歡迎聯繫客服，我們會協助您確認。</p>
        <router-link to="/contact" class="mt-6 inline-flex rounded-lg bg-brand-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
          聯絡我們
        </router-link>
      </section>
    </main>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'FaqView',
  data() {
    return {
      faqBannerImage: require('../../images/背景圖.png'),
      activeSectionId: 'category_1',
      openedItems: [] as string[],
      faqSections: [
        {
          id: 'category_1',
          title: '訂購問題',
          items: [
            { q: '網站商品頁上的價格是免運費的價格嗎？', a: '常溫宅配：單筆訂單金額未滿 1200 元，需加收 120 元運費。\n常溫超取：單筆訂單金額未滿 599 元，需加收 60 元運費。\n冷凍宅配：單筆訂單金額未滿 800 元，需加收 120 元運費。\n冷凍超取：單筆訂單金額未滿 800 元，需加收 100 元運費。\n常溫商品及冷凍商品因溫層不同，運費需分開計算。所有運費之計算係以未扣抵購物金之前訂單金額計算。金門、澎湖等離島地區均無配送服務。' },
            { q: '我沒有會員帳號如何訂購？忘了會員帳號或密碼該如何？', a: '沒有會員帳號第一次訂購，請先註冊成為會員，加入後系統會發送一封會員密碼確認函。查詢會員帳號或密碼，請於聯絡客服畫面輸入連絡方式及問題後寄出，將由專人處理回覆。' },
            { q: '怎麼處理退貨？', a: '統一生機開發股份有限公司提供全站購物享有 7 天鑑賞期，鑑賞期為收到商品 7 天內。若要辦理退貨，請務必在收到商品後 7 日內寄回統一生機，所退回之商品連同發票必須是全新狀態與完整包裝。\n提醒您，鑑賞期非試用期。若您收到商品經檢視後有任何不合意之處，請勿拆開使用，並立即依照退貨規定辦理退貨。' },
            { q: '商品瑕疵、破損怎麼辦？', a: '就貨品之包裝、運送及送達過程中所生之危險，及貨品有缺頁、污損、錯誤或其他瑕疵等，請您在到貨 7 日內，自簽收日起算，立刻通知客服中心 0800-777-000。服務時段為週一至週五 AM 8:00 - PM 18:00，國定例假日 AM 8:30 - PM 17:30，週六及週日休假。' },
            { q: '如何取消訂單？訂單數量有誤如何更改？', a: '可於 30 分鐘內於歷史訂單自行取消訂單。若需要修改訂單內容，請聯絡客服中心 0800-777-000。' },
            { q: '可以寄送海外或離島嗎？', a: '商品的寄送僅限台灣本島，海外人士訂購請提供台灣寄送地址。金門、澎湖等離島地區均無配送服務，造成不便敬請見諒。' },
            { q: '今天訂購商品可以明天到貨嗎？', a: '常溫、冷凍商品：週一至週五 AM 11:00 前下單並與客服確認完成之訂單，最快可於隔天到貨。實際到貨時間仍需依商品備貨與物流配送狀況而定。' },
            { q: '著作權聲明', a: '刊載於本網站上有關各商品之文字、圖檔及商標，其著作權屬於統一生機開發股份有限公司版權所有。' }
          ]
        },
        {
          id: 'category_2',
          title: '購物金問題',
          items: [
            { q: '我該如何得到購物金？', a: '凡加入統一生機會員並消費者，訂單出貨後可獲得滿額購物金。\n常溫、冷凍商品依訂單分開計算。購物金贈送以當筆消費最終實際支付金額為計算基準。大宗採購專案以及特別註明之商品、活動不列入滿額購物金活動。' },
            { q: '購物金使用須知', a: '購物金生效限完成出貨後次日起消費折抵，抵用期限至次兩個月底止，逾期無效，限會員本人使用。\n購物金使用需以 50 元為單位。常溫、冷凍商品以單筆訂單分開使用計算。' },
            { q: '我該如何知道購物金餘額？', a: '購物金餘額與抵用期限列於出貨傳票上，也可登入購物網查詢剩餘購物金，另可致電客服中心 0800-777-000 查詢。' },
            { q: '購物金金額如何計算？', a: '購物金需視常溫品、冷凍品之實際結帳付款金額分開計算。如訂單使用前次剩餘之購物金折抵，則消費滿額之購物金贈送以折抵後之最終金額計算。購物金獲得以單筆訂單實際結帳付款金額為計算基準，恕不累積計算。' },
            { q: '統一生機宅配會員分級優惠辦法', a: '統一生機宅配會員分級優惠依會員資格、消費紀錄與活動辦法提供不同優惠內容，實際規則請以網站公告與會員中心顯示為準。' }
          ]
        },
        {
          id: 'category_3',
          title: 'OPENPOINT點數',
          items: [
            { q: 'OPENPOINT 點數如何回饋？', a: '統一生機會員請於統一生機購物網先連結綁定一組 uniopen 會員，並於購物網消費以進行累積點數、折抵點數。若未連結成功，訂單成立後恕無法再補發。\n消費點數回饋 0.33%，點數以購物網下單訂單金額扣除購物金、OPENPOINT 點數及其他折扣後的付款金額計算。' },
            { q: 'OPENPOINT 點數何時發送？', a: '消費點數回饋將於出貨 14 天後確認無退貨後發送。會員日及其他指定行銷加碼活動贈送點數時間依活動公告為準。' },
            { q: 'OPENPOINT 點數效期如何計算？', a: 'OPENPOINT 點數效期自給點日起至隔年 12 月 31 日止。指定行銷活動贈送點數效期依活動公告為準，逾期未使用將自動失效。' },
            { q: 'OPENPOINT 點數如何使用？', a: '於購物車「OPENPOINT 點數折抵」輸入欲折抵的金額，即可直接進行訂單金額扣抵，1 點 OPENPOINT = 1 元。若訂單成立後取消或退貨，點數將依 OPENPOINT 作業返還。' }
          ]
        },
        {
          id: 'category_4',
          title: '付款問題',
          items: [
            { q: '請問付款方式有哪些？', a: '共有貨到付款、信用卡線上刷卡、傳真刷卡、7-11 取貨付款等四種付款方式，目前暫無提供 ATM 付款，敬請見諒。' }
          ]
        },
        {
          id: 'category_7',
          title: '安全與發票問題',
          items: [
            { q: '網站消費資料安全嗎？', a: '本購物網站使用 TWCA SSL 伺服器數位憑證之安全加密等級，保障您消費的相關資料及購物資訊之安全。' },
            { q: '帳號密碼被冒用怎麼辦？', a: '若您的會員帳號密碼遭到冒用，請撥打客服專線 0800-777-000 或經由客服信箱聯絡本公司，公司將依照您的請求處理您的帳號。' },
            { q: '統一生機使用電子發票嗎？', a: '根據財政部令「電子發票實施作業要點」，於統一生機購物網消費開立之統一發票資訊將於 48 小時內上傳至整合服務平台留存，消費者可利用財政部電子發票整合服務平台查詢消費紀錄。' },
            { q: '發票載具可以歸戶嗎？', a: '可將各項載具登錄至自然人憑證或手機條碼統一管理。歸戶作業由財政部電子發票整合服務平台處理。' },
            { q: '紙本發票如何處理？', a: '若需紙本發票或發票中獎相關處理，將依消費者使用發票載具類型及載具歸戶狀態有所不同，請依網站公告與財政部電子發票整合服務平台資訊為準。' }
          ]
        }
      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateActiveSection, { passive: true })
    this.updateActiveSection()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.updateActiveSection)
  },
  methods: {
    scrollToSection(id: string) {
      this.activeSectionId = id
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    updateActiveSection() {
      const offset = 160
      let current = this.faqSections[0]?.id || ''
      this.faqSections.forEach((section: { id: string }) => {
        const el = document.getElementById(section.id)
        if (el && el.getBoundingClientRect().top <= offset) {
          current = section.id
        }
      })
      this.activeSectionId = current
    },
    toggle(id: string) {
      const idx = this.openedItems.indexOf(id)
      if (idx > -1) this.openedItems.splice(idx, 1)
      else this.openedItems.push(id)
    },
    isOpen(id: string) {
      return this.openedItems.includes(id)
    }
  }
})
</script>
