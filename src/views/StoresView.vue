<template>
  <div class="min-h-screen bg-brand-bg pb-24">
    <section class="relative overflow-hidden bg-[#F0F4F1]">
      <img
        :src="storeBannerImage"
        alt="特約店"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <h1 class="text-3xl font-black leading-tight tracking-[0.16em] text-brand-dark lg:text-5xl">特約店</h1>
        <p class="mt-5 max-w-2xl text-sm font-bold leading-[1.6] text-[#374151] lg:text-base">
          尋找離您最近的統一生機特約店，查看各地據點與聯絡資訊。
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
          特約店
        </span>
      </nav>

      <div class="sticky top-[88px] z-30 mt-8 border-b border-gray-200 bg-brand-bg/95 pt-3 shadow-[0_8px_18px_rgba(255,255,255,0.88)] backdrop-blur">
        <div class="mx-auto flex max-w-[1200px] gap-3 overflow-x-auto pb-4">
          <button
            v-for="tab in cityTabs"
            :key="tab.key"
            type="button"
            @click="selectCity(tab.key)"
            :class="[
              'shrink-0 rounded-full border px-5 py-3 text-sm font-black transition-all',
              isTabActive(tab.key)
                ? 'border-brand-primary bg-brand-primary text-white shadow-sm'
                : 'border-gray-200 bg-white text-gray-500 hover:border-brand-primary/40 hover:text-brand-primary'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="mx-auto mt-6 max-w-[1200px]">
        <div>
          <section
            v-for="section in storeSections"
            :key="section.city"
            :id="`store-city-${section.city}`"
            class="mt-8 scroll-mt-6"
          >
            <div class="mb-4 flex items-center gap-3">
              <h3 class="border-l-4 border-brand-primary pl-3 text-xl font-black leading-none text-gray-800">
                {{ section.city }}
              </h3>
            </div>

            <div class="space-y-5">
              <div
                v-for="district in section.districts"
                :key="`${section.city}-${district.name}`"
              >
                <article
                  v-for="store in district.stores"
                  :key="store.name"
                  class="group mb-4 grid gap-5 rounded border border-[#E5E7EB] bg-white p-4 transition-all hover:border-brand-primary/50 hover:shadow-sm lg:grid-cols-[220px_minmax(320px,1fr)_300px] lg:items-stretch"
                >
                  <div class="flex min-h-[148px] flex-col items-center justify-center rounded bg-brand-dark px-4 py-5 text-center text-white lg:min-h-full">
                    <p class="text-2xl font-black leading-tight tracking-[0.12em]">{{ storeSignTitle(store) }}</p>
                    <span class="my-3 h-px w-16 bg-white/70"></span>
                    <p class="text-base font-black tracking-[0.28em] text-white/90">特約店</p>
                  </div>

                  <div class="flex min-w-0 flex-col">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <h4 class="truncate text-lg font-black leading-snug text-[#1F2937] group-hover:text-brand-primary">
                          {{ store.name }}
                        </h4>
                      </div>
                    </div>

                    <dl class="mt-4 space-y-2 text-sm text-[#4B5563]">
                      <div class="flex items-start gap-2.5">
                        <dt class="mt-0.5 text-gray-500">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21s7-4.4 7-11a7 7 0 10-14 0c0 6.6 7 11 7 11z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.5 10.5l1.6 1.6 3.4-4" />
                          </svg>
                        </dt>
                        <dd class="leading-[1.5]">{{ store.address }}</dd>
                      </div>
                      <div class="flex items-start gap-2.5">
                        <dt class="mt-0.5 text-gray-500">
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.5 5.5c0 8.3 6.7 15 15 15h1.25a1.75 1.75 0 001.75-1.75v-2.1a1.25 1.25 0 00-.92-1.2l-3.5-.95a1.25 1.25 0 00-1.26.38l-.9.98a11.2 11.2 0 01-4.78-4.78l.98-.9a1.25 1.25 0 00.38-1.26l-.95-3.5a1.25 1.25 0 00-1.2-.92h-2.1A1.75 1.75 0 003.5 5.5z" />
                          </svg>
                        </dt>
                        <dd class="leading-[1.5]">{{ store.phone }}</dd>
                      </div>
                    </dl>
                  </div>

                  <div class="min-h-[180px] overflow-hidden rounded bg-[#F7F8F4] lg:min-h-[170px]">
                    <iframe
                      :src="mapSrc(store)"
                      :title="`${store.name}地圖`"
                      class="h-full min-h-[180px] w-full border-0 lg:min-h-[170px]"
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type StoreItem = {
  city: string
  name: string
  address: string
  phone: string
}

type DistrictSection = {
  name: string
  stores: StoreItem[]
}

type StoreSection = {
  city: string
  stores: StoreItem[]
  districts: DistrictSection[]
}

export default Vue.extend({
  name: 'StoresView',
  data() {
    return {
      storeBannerImage: require('../../images/背景圖.png'),
      selectedCity: 'all',
      focusedCity: '',
      cityOrder: ['台北市', '新北市', '桃園市', '台中市', '彰化縣', '台南市', '高雄市', '花蓮縣'],
      stores: [
        { city: '台北市', name: '大安特約店', address: '台北市大安區復興南路2段371號', phone: '02-2736-2029' },
        { city: '新北市', name: '板橋特約店', address: '新北市板橋區莒光路165巷18號', phone: '02-2251-6183' },
        { city: '新北市', name: '三重特約店', address: '新北市三重區福德南路11號', phone: '02-2977-8166' },
        { city: '桃園市', name: '內壢特約店', address: '桃園市中壢區富村街110號', phone: '03-285-0310' },
        { city: '桃園市', name: '龍潭特約店', address: '桃園市龍潭區中正路268號', phone: '03-470-0239' },
        { city: '桃園市', name: '國際特約店', address: '桃園市桃園區國際路一段1125號1樓', phone: '03-360-7861' },
        { city: '桃園市', name: '埔心特約店', address: '桃園市楊梅區光華里新興街140號', phone: '03-482-2936' },
        { city: '桃園市', name: '大溪特約店', address: '桃園市大溪區中正路11號1樓', phone: '03-387-9122' },
        { city: '桃園市', name: '大竹特約店', address: '桃園市蘆竹區大竹路573號', phone: '03-323-7611' },
        { city: '台中市', name: '公館特約店', address: '台中市西區公館路160號', phone: '04-237-18701' },
        { city: '彰化縣', name: '鹿港特約店', address: '彰化縣鹿港鎮菜園路160號', phone: '04-776-2827' },
        { city: '台南市', name: '崇善特約店', address: '台南市東區崇善路362號', phone: '06-260-7161' },
        { city: '高雄市', name: '高雄河南特約店', address: '高雄市前金區河南二路115號', phone: '07-281-9008' },
        { city: '高雄市', name: '高雄旗艦特約店', address: '高雄市三民區黃興路15號', phone: '07-381-7583' },
        { city: '高雄市', name: '楠梓特約店', address: '高雄市楠梓區德民路994號', phone: '07-364-9215' },
        { city: '高雄市', name: '小港特約店', address: '高雄市小港區康莊路148號', phone: '07-807-1954' },
        { city: '高雄市', name: '大社特約店', address: '高雄市大社區神農村金龍路19號', phone: '07-358-2002' },
        { city: '高雄市', name: '岡山特約店', address: '高雄市岡山區校前路19號', phone: '07-622-8716' },
        { city: '花蓮縣', name: '花蓮林森特約店', address: '花蓮縣花蓮市林森路365號', phone: '03-831-0160' }
      ] as StoreItem[]
    }
  },
  computed: {
    totalStores(): number {
      return this.stores.length
    },
    cityTabs(): Array<{ key: string; label: string; count: number }> {
      const cityCounts = this.cityOrder.map(city => ({
        key: city,
        label: city,
        count: this.stores.filter(store => store.city === city).length
      }))

      return [
        { key: 'all', label: '全部', count: this.stores.length },
        ...cityCounts.filter(tab => tab.count > 0)
      ]
    },
    filteredStores(): StoreItem[] {
      if (this.selectedCity === 'all') return this.stores
      return this.stores.filter(store => store.city === this.selectedCity)
    },
    storeSections(): StoreSection[] {
      return this.cityOrder
        .map(city => {
          const stores = this.filteredStores.filter(store => store.city === city)
          return {
            city,
            stores,
            districts: this.groupStoresByDistrict(stores)
          }
        })
        .filter(section => section.stores.length > 0)
    }
  },
  methods: {
    selectCity(city: string) {
      if (city === 'all') {
        this.selectedCity = 'all'
        this.focusedCity = ''
        this.$nextTick(() => {
          document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
        return
      }

      if (this.selectedCity === 'all') {
        this.focusedCity = city
        this.$nextTick(() => this.scrollStoreListToCity(city))
        return
      }

      this.filterCity(city)
    },
    filterCity(city: string) {
      this.selectedCity = city
      this.focusedCity = city
      this.$nextTick(() => {
        document.getElementById(`store-city-${city}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    isTabActive(city: string): boolean {
      if (city === 'all') return this.selectedCity === 'all' && !this.focusedCity
      return this.selectedCity === city || (this.selectedCity === 'all' && this.focusedCity === city)
    },
    scrollStoreListToCity(city: string) {
      const target = document.getElementById(`store-city-${city}`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    groupStoresByDistrict(stores: StoreItem[]): DistrictSection[] {
      const districts: DistrictSection[] = []

      stores.forEach(store => {
        const districtName = this.districtFromAddress(store.address)
        let district = districts.find(item => item.name === districtName)
        if (!district) {
          district = { name: districtName, stores: [] }
          districts.push(district)
        }
        district.stores.push(store)
      })

      return districts
    },
    districtFromAddress(address: string): string {
      const city = this.cityOrder.find(item => address.startsWith(item))
      const addressWithoutCity = city ? address.slice(city.length) : address
      const match = addressWithoutCity.match(/([\u4e00-\u9fa5]{1,4}(?:區|鎮|鄉|市))/)
      return match ? match[1] : '其他區域'
    },
    storeSignTitle(store: StoreItem): string {
      return store.name.replace('特約店', '').replace(/^高雄/, '')
    },
    mapSrc(store: StoreItem): string {
      const query = encodeURIComponent(`統一生機 ${store.name} ${store.address}`)
      return `https://maps.google.com/maps?q=${query}&output=embed`
    }
  }
})
</script>
