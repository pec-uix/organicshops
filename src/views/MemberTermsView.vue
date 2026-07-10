<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <section class="relative overflow-hidden bg-[#F0F4F1]">
      <img
        :src="termsBannerImage"
        alt="會員服務條款"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <h1 class="text-3xl font-black leading-tight tracking-[0.16em] text-brand-dark lg:text-5xl">會員服務條款</h1>
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
          會員服務條款
        </span>
      </nav>

      <section class="mx-auto max-w-4xl py-2">
        <div class="mb-8 pt-4 text-center">
          <h2 class="text-3xl font-black leading-tight text-gray-800">會員服務條款</h2>
          <p class="mt-2 text-base font-semibold text-gray-400">修訂日期：2026/1/14</p>
        </div>

        <div class="px-0 py-2">
        <div class="rounded-2xl bg-brand-surface px-5 py-5 text-sm leading-7 text-gray-600">
          <p>
            本統一生機購物網服務條款（以下簡稱「服務條款」）適用於統一生機開發股份有限公司（以下簡稱「統一生機」或「本公司」）
            所建置之統一生機購物網網站（以下簡稱「本平台」）。
          </p>
          <p class="mt-3">
            在您開始使用本平台前，您必須閱讀並同意接受本服務條款、本平台之隱私權聲明及本平台所有條款與政策，以保障您的權益。
            如您不同意本服務條款、本平台之隱私權聲明或本平台所有條款與政策任一部分時，請勿使用或存取本平台。
          </p>
        </div>

        <div class="mt-8 space-y-10 text-sm leading-8 text-gray-600">
          <section>
            <h2 class="text-xl font-black text-gray-800">會員帳戶</h2>
            <ol class="mt-4 space-y-4 list-decimal pl-5">
              <li>
                您應於使用統一生機購物網站進行購物等活動時，提供您本人正確、最新的資料，且無利用偽造或變造之資料作為重複註冊登錄等情事，
                並維護及即時更新您個人資料之正確性，以獲取最佳之服務。如有需要，本平台將請您提供補充資訊。若您提供的會員資料有任何變更，
                請您即時通知本平台客服中心以進行資料更新，以免無法獲得活動訊息、行銷資訊或接受相關會員服務等。若因您提供的資料錯誤、
                過期或其他非可歸責本公司的原因，致無法接收本公司送達的訊息，仍視為本公司已完成該通知的送達。
              </li>
              <li>
                若您未滿18歲，請務必取得您的法定代理人之許可，且確認您的法定代理人已閱讀並同意本服務條款、本平台之隱私權聲明或本平台所有條款與政策之內容後，再使用本平台。
              </li>
              <li>
                您須自行負責管理您的會員帳戶。請不要向任何第三方提供您的帳號或密碼，或允許任何第三方使用您的會員帳戶，您如果發現或懷疑有第三人使用您的會員帳戶，
                應立即通知本平台客服中心。透過您的會員帳戶所進行之任何行為，在您未能為前述之通知或提出合理事證以證明不可歸責於您之前，都應由您自行負責。
              </li>
              <li>
                您應僅基於合法目的使用本平台，並遵守本服務條款及所有適用法律。本公司可能會因應法規要求、因您有或可合理懷疑您有下列情形之一者而終止、暫停或刪除您的會員資格：
                <ul class="mt-3 space-y-2 list-[lower-alpha] pl-5">
                  <li>違反本服務條款、本平台之隱私權聲明或本平台所有條款與政策任一部分；</li>
                  <li>有詐欺、騷擾、誹謗、威脅、侮辱等非法行為；</li>
                  <li>提交虛假或偽冒之身分認證資料；</li>
                  <li>任何有害於其他使用者、第三方、本平台或本公司的行為，包括但不限於虛偽交易、洗單、濫用平台機制或濫用優惠券等。</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 class="text-xl font-black text-gray-800">個人資料保護與隱私權聲明</h2>
            <p class="mt-4">
              本公司於本平台將根據隱私權聲明所述方式收集、使用、揭露及處理您的個人資料，請參考本平台之隱私權聲明以了解相關細節。
            </p>
          </section>

          <section>
            <h2 class="text-xl font-black text-gray-800">平台之使用</h2>
            <ol class="mt-4 space-y-4 list-decimal pl-5">
              <li>
                您不得以任何非法、有違法之虞、違反一般商業誠信、牴觸本條款與其他適用條款或詐欺性目的使用本平台。為遵守應適用之法律及法規、
                或當本公司認為存在或有合理懷疑您或任何人有違法、影響市場或正常交易之虞、濫用本平台機制、非基於一般消費目的之交易、
                以不正當手段競爭與牟利等目的（合稱「違法或不當使用」），本公司有權得就本平台之供應進行相關限制、要求您執行特定程序
                （例如身分驗證等）、取消該筆交易、移除相關內容或採取其他必要措施。
              </li>
              <li>
                如本公司認為您在使用本平台時，疑似有下列任一情形時，本公司得不經通知立即限制您會員帳戶之使用、移除相關內容、取消特定交易或採取其他必要措施：
                <ul class="mt-3 space-y-2 list-[lower-alpha] pl-5">
                  <li>上傳、提供或使用詐欺、騷擾、誹謗、威脅、侮辱、粗俗、淫穢、憎恨、種族歧視、非法、侵害他人權利、侵害他人智慧財產權或您無權使用的內容；</li>
                  <li>冒用他人之會員帳戶或冒充為他人；</li>
                  <li>註冊或使用多個會員帳戶；</li>
                  <li>傳輸或散佈可能破壞、竄改、刪除或未經授權蒐集個人資料與數據的電腦病毒或惡意程式碼；</li>
                  <li>其他可能導致本平台或系統受到干擾而影響本平台正常營運或系統安全可靠運作之不當行為。</li>
                </ul>
              </li>
              <li>
                若您違反本服務條款，您必須向本公司返還因該違約行為而產生之所有利潤，並賠償本公司因此遭受之任何損害或損失。
                你同意於此情形下，您將無權對本公司採取之任何措施，包括但不限於停用您的會員帳戶、移除相關內容、停止提供本平台或取消任何交易提出異議。
              </li>
              <li>
                您同意於下列情形，本公司得不經事前通知，於一定期間內停止本平台服務之全部或一部，且不得因前述之停止向本公司請求損害賠償：
                <ul class="mt-3 space-y-2 list-[lower-alpha] pl-5">
                  <li>為進行本公司伺服器、軟硬體之檢查、修理、修補、改良升級等而停止。</li>
                  <li>因電腦、通訊迴路、電信業者機房線路等發生事故、故障而停止。</li>
                  <li>因其他不可抗力事故或非可歸責於本公司之事由所導致之停止。</li>
                </ul>
                <p class="mt-3">
                  除前述各款所列情形以外，為保護本平台使用者或其他第三人之利益等原因，本公司得於合理期間前公告後暫時停止提供本平台服務之全部或一部。
                  使用者因本服務停止衍生任何直接或間接之損失時，本公司不負任何賠償責任。
                </p>
              </li>
            </ol>
          </section>

          <section>
            <h2 class="text-xl font-black text-gray-800">智慧財產權</h2>
            <ol class="mt-4 space-y-4 list-decimal pl-5">
              <li>
                本平台所使用之軟體或程式、平台上所有內容，包括但不限於著作、圖片、檔案、資訊、資料、架構、畫面的安排、網頁設計，
                均由本公司或其他權利人依法擁有其智慧財產權，包括但不限於商標權、專利權、著作權、營業秘密與專有技術等。
                本公司授予您個人得依據本公司指定之一切條款、政策及條件使用本平台之非專屬且可撤回的權利。
                您不得將前述授權移轉或再授權，亦不得將前述授權用於本平台正常用途以外之其他目的。
              </li>
              <li>
                您聲明並保證，您對於您於本平台提供之文字、音訊、照片、影片等所有內容，皆擁有必要的權利及許可，並對該等內容負完全之責。
              </li>
              <li>
                若您發現您的智慧財產權有遭侵害之情事，請您與本平台客服中心聯絡，並提供所遭侵權之情形、聯絡方式及擁有合法智慧財產權之聲明予本平台。
              </li>
            </ol>
          </section>

          <section>
            <h2 class="text-xl font-black text-gray-800">平台服務</h2>
            <ol class="mt-4 space-y-4 list-decimal pl-5">
              <li>商品交易頁面呈現之商品名稱、價格、內容、規格、型號及其他相關資訊，為契約之一部分。</li>
              <li>本公司對消費者下單內容，於訂立契約前，提供商品之種類、數量、價格及其他重要事項之確認機制，並應於契約成立後，確實履行契約。</li>
              <li>本公司於必要時，得就特定商品訂定消費者每次訂購之數量上限。消費者逾越本公司訂定之數量上限進行下單時，本公司僅依該數量上限出貨。</li>
              <li>您若於使用本平台訂購產品後倘惡意退換貨、取消訂單、或有違反統一生機之會員規範及相關使用規則之行為，本平台將視情況採取拒絕交易或永久取消會員帳戶資格。</li>
              <li>
                若您訂購之產品屬於以下情形：（1）預購類商品（2）商品頁顯示無庫存（3）須向供應商調貨，因商品交易特性之故，倘商品缺絕、
                或廠商因故無法順利供貨之情況下，您同意本公司得視情況取消或修改交易（訂單）內容、或延遲交貨時間，並選擇以最適方式告知。
                詳細商品說明請見各商品頁標示之內容。
              </li>
            </ol>
          </section>

          <section>
            <h2 class="text-xl font-black text-gray-800">責任聲明</h2>
            <ol class="mt-4 space-y-4 list-decimal pl-5">
              <li>本平台以「現狀」及「現有」為基礎提供，並確保系統具符合一般可合理期待之安全性。於適用法律容許的最大限度內，本公司對本平台上任何由本公司所提供之資訊或內容，不作任何明示或默示之聲明或保證，包括但不限於對準確性、適銷性、針對特定用途的適用性和無侵權性的任何聲明與保證。</li>
              <li>於法令允許之範圍內，本公司對您因使用本平台而產生之任何損害或損失，包括但不限於間接、附帶性、特殊、懲罰性及衍生性損失，不承擔責任。</li>
              <li>本服務條款並未限制或排除任何因本公司之過失所導致之個人身體損傷或任何其他本公司依法不得限制或排除之責任。</li>
            </ol>
          </section>

          <section>
            <h2 class="text-xl font-black text-gray-800">賠償</h2>
            <ol class="mt-4 space-y-4 list-decimal pl-5">
              <li>若本公司、本公司關係企業、或本公司及其關係企業之各自經理人、董事、員工、代表人或代理人，因您使用本平台或您違反本服務條款而面臨或產生任何第三方請求、損失、損害、和解程序、成本、費用、行政罰責或其他責任，您應為其抗辯、向其提供賠償，使其不因此受任何損害。</li>
            </ol>
          </section>

          <section>
            <h2 class="text-xl font-black text-gray-800">一般規定</h2>
            <ol class="mt-4 space-y-4 list-decimal pl-5">
              <li>本公司得變更本服務條款及本平台適用之其他條款或政策，本公司將於本平台公告變更後之條款與政策。若您於公告變更後繼續使用本平台，您將被視為同意接受修訂後之條款與政策內容。</li>
              <li>您同意本公司與您之間得以電子方式為意思表示方法，雙方交換之電子文件效力與實體書面文件相同。</li>
              <li>您不得轉讓、再授權或轉移此處授予您的任何權利，或複委任任何義務。</li>
              <li>本服務條款之任何個別條款若因故無效，其他條款效力並不因此受到任何影響。</li>
            </ol>
          </section>

          <section>
            <h2 class="text-xl font-black text-gray-800">特別授權事項</h2>
            <p class="mt-4">
              因使用本服務所提供之網路交易或活動，可能須透過宅配或貨運業者始能完成貨品（或贈品等）之配送或取回，因此，您同意並授權本公司得視該次網路交易或活動之需求及目的，
              將由您所提供且為配送所必要之個人資料（如收件人姓名、配送地址、連絡電話等），提供予宅配或貨運業者，以利完成該次貨品（或贈品等）之配送、取回。
              其餘有關您個人資料使用或處理之規定，煩請參閱「隱私權聲明」。
            </p>
            <p class="mt-4 rounded-2xl bg-gray-50 px-4 py-4 text-sm text-gray-500">
              註：統一生機合作之貨運行如下所示：統一速達（黑貓宅急便）、新竹貨運、統一超商。
            </p>
          </section>

          <section>
            <h2 class="text-xl font-black text-gray-800">準據法及管轄權</h2>
            <p class="mt-4">
              本平台及本服務條款之效力及解釋，以中華民國法律為準據法。除應適用法律另有規定外，基於本平台所生或與其有關之所有爭議與歧見，
              均應以台灣台北地方法院為第一審管轄法院。
            </p>
          </section>

          <section>
            <h2 class="text-xl font-black text-gray-800">本公司聯絡資訊</h2>
            <div class="mt-4 overflow-hidden rounded-2xl border border-gray-100">
              <div class="grid divide-y divide-gray-100 text-sm md:grid-cols-[12rem_minmax(0,1fr)] md:divide-y-0 md:divide-x">
                <div class="bg-gray-50 px-4 py-4 font-bold text-gray-700">公司名稱</div>
                <div class="px-4 py-4">統一生機開發股份有限公司</div>
                <div class="bg-gray-50 px-4 py-4 font-bold text-gray-700">統一編號</div>
                <div class="px-4 py-4">16781797</div>
                <div class="bg-gray-50 px-4 py-4 font-bold text-gray-700">客服專線</div>
                <div class="px-4 py-4">
                  <span class="block">0800-777-000（服務時間：週一~週五 AM8:00~PM18:00；</span>
                  <span class="block">國定例假日 AM8:30~PM17:30；周六及週日休假）</span>
                </div>
                <div class="bg-gray-50 px-4 py-4 font-bold text-gray-700">聯絡信箱</div>
                <div class="px-4 py-4 break-all">
                  <a href="https://www.organicshops.cc/service.aspx" target="_blank" rel="noopener noreferrer" class="text-brand-primary hover:underline">
                    https://www.organicshops.cc/service.aspx
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MemberTermsView',
  data() {
    return {
      termsBannerImage: require('../../images/背景圖.png'),
    }
  },
})
</script>
