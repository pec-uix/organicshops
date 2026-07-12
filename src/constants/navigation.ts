export interface MainNavItem {
  key: 'shop' | 'campaign' | 'safety' | 'stores' | 'about' | 'account'
  label: string
  to: string
  hasMenu: boolean
}

export interface MegaMenuLink {
  label: string
  to?: string
  href?: string
  pdfUrl?: string
  children?: MegaMenuLink[]
}

export interface MegaMenuGroup {
  title: string
  categoryId?: string
  items: MegaMenuLink[]
}

export interface MegaMenuConfig {
  title: string
  desc: string
  layout: 'split' | 'full'
  groups: MegaMenuGroup[]
  cards?: MegaMenuLink[]
}

function categoryPath(...segments: string[]): string {
  const safeSegments = segments.map((segment) => encodeURIComponent(segment))
  return `/category/${safeSegments.join('/')}`
}

function eventPath(group: string, item?: string): string {
  const params = new URLSearchParams({ group })
  if (item) params.set('item', item)
  return `/event/SUMMER2026?${params.toString()}`
}

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  { key: 'shop', label: '生機商城', to: '/products', hasMenu: true },
  { key: 'campaign', label: '活動專區', to: '/events', hasMenu: true },
  { key: 'safety', label: '安心購', to: '/inspections', hasMenu: true },
  { key: 'stores', label: '特約店', to: '/stores', hasMenu: false },
  { key: 'about', label: '認識統一生機', to: '/about', hasMenu: true },
]

export const MEGA_MENUS: Record<string, MegaMenuConfig> = {
  shop: {
    title: '生機商城',
    desc: '生機商城層級預留：目前三層，未來可擴充四層。',
    layout: 'split',
    groups: [
      { title: '生鮮直送', items: [
        { label: '新鮮蔬果', to: categoryPath('生鮮直送', '新鮮蔬果'), children: [
          { label: '新鮮水果', to: categoryPath('生鮮直送', '新鮮蔬果', '新鮮水果') },
          { label: '蔬果套餐', to: categoryPath('生鮮直送', '新鮮蔬果', '蛋品根莖蔬果套餐') },
        ]},
        { label: '有機糕點', to: categoryPath('生鮮直送', '有機糕點'), children: [
          { label: '優選蛋糕', to: categoryPath('生鮮直送', '有機糕點', '優選蛋糕') },
        ]},
      ]},
      { title: '冷凍食材', items: [
        { label: '海鮮肉品', to: categoryPath('冷凍食材', '海鮮肉品'), children: [
          { label: '安心水產', to: categoryPath('冷凍食材', '海鮮肉品', '安心水產') },
          { label: '安心肉品', to: categoryPath('冷凍食材', '海鮮肉品', '安心肉品') },
        ]},
        { label: '即食調理', to: categoryPath('冷凍食材', '即食調理'), children: [
          { label: '即食調理', to: categoryPath('冷凍食材', '即食調理', '即食調理') },
          { label: '快速料理', to: categoryPath('冷凍食材', '即食調理', '快速料理') },
        ]},
        { label: '蔬食早餐', to: categoryPath('冷凍食材', '蔬食早餐'), children: [
          { label: '蔬食', to: categoryPath('冷凍食材', '蔬食早餐', '蔬食') },
          { label: '營養早餐', to: categoryPath('冷凍食材', '蔬食早餐', '營養早餐') },
        ]},
      ]},
      { title: '堅果果乾', items: [
        { label: '堅果點心', to: categoryPath('堅果果乾', '堅果點心'), children: [
          { label: '堅果', to: categoryPath('堅果果乾', '堅果點心', '堅果') },
          { label: '果乾', to: categoryPath('堅果果乾', '堅果點心', '果乾') },
        ]},
      ]},
      { title: '主食雜糧', items: [
        { label: '米麵雜糧', to: categoryPath('主食雜糧', '米麵雜糧'), children: [
          { label: '白米', to: categoryPath('主食雜糧', '米麵雜糧', '米') },
          { label: '麵條', to: categoryPath('主食雜糧', '米麵雜糧', '麵條') },
          { label: '雜糧', to: categoryPath('主食雜糧', '米麵雜糧', '雜糧') },
          { label: '豆類', to: categoryPath('主食雜糧', '米麵雜糧', '豆類') },
        ]},
      ]},
      { title: '健康飲品', categoryId: '即飲沖泡', items: [
        { label: '即飲', to: categoryPath('即飲沖泡', '即飲'), children: [] },
        { label: '沖泡', to: categoryPath('即飲沖泡', '沖泡'), children: [] },
      ]},
      { title: '廚房料理', categoryId: '廚房料理品', items: [
        { label: '油品調味', to: categoryPath('廚房料理品', '油品調味'), children: [
          { label: '油品', to: categoryPath('廚房料理品', '油品調味', '油品') },
          { label: '調味品', to: categoryPath('廚房料理品', '油品調味', '調味品') },
        ]},
        { label: '乾貨廚具', to: categoryPath('廚房料理品', '乾貨廚具'), children: [
          { label: '乾貨', to: categoryPath('廚房料理品', '乾貨廚具', '乾貨') },
          { label: '鍋具用品', to: categoryPath('廚房料理品', '乾貨廚具', '鍋具用品') },
        ]},
      ]},
      { title: '銀髮專區', items: [
        { label: '銀髮餐食', to: categoryPath('銀髮專區', '銀髮餐食'), children: [
          { label: '方便早餐', to: categoryPath('銀髮專區', '銀髮餐食', '方便早餐') },
          { label: '晚餐食材', to: categoryPath('銀髮專區', '銀髮餐食', '晚餐食材') },
          { label: '滋補湯品', to: categoryPath('銀髮專區', '銀髮餐食', '滋補湯品') },
        ]},
        { label: '保健補養', to: categoryPath('銀髮專區', '保健補養'), children: [
          { label: '休閒點心', to: categoryPath('銀髮專區', '保健補養', '休閒點心') },
          { label: '喝的保養', to: categoryPath('銀髮專區', '保健補養', '喝的保養') },
          { label: '保健食品', to: categoryPath('銀髮專區', '保健補養', '保健食品') },
        ]},
      ]},
      { title: '生活日用', items: [
        { label: '個人清潔', to: categoryPath('生活日用', '個人清潔'), children: [] },
        { label: '居家用品', to: categoryPath('生活日用', '居家用品'), children: [] },
      ]},
    ],
  },
  campaign: {
    title: '活動專區',
    desc: '活動專區與特惠內容，保留彈性擴充。',
    layout: 'split',
    groups: [
      { title: '快閃與特惠', items: [
        { label: '限時優惠快閃區', to: eventPath('flash', 'flash-limited'), children: [] },
        { label: '任選多件組', to: eventPath('flash', 'flash-bundle'), children: [] },
        { label: '會員日優惠', to: eventPath('flash', 'flash-member'), children: [] },
        { label: '買1送1必買區', to: eventPath('flash', 'flash-oneplusone'), children: [] },
        { label: '多件組優惠', to: eventPath('flash', 'flash-multi'), children: [] },
        { label: '惜福區', to: eventPath('flash', 'flash-surplus'), children: [] },
        { label: '盛夏能量季', to: eventPath('flash', 'flash-summer'), children: [] },
        { label: '中元普渡拜好拜滿', to: eventPath('flash', 'flash-ghost'), children: [] },
      ]},
      { title: '主題企劃', items: [
        { label: 'OP 點數加價購', to: '/event/op-exchange', children: [] },
        { label: '地中海飲食推薦', to: eventPath('theme', 'theme-mediterranean'), children: [] },
        { label: '隔夜燕麥片專區', to: eventPath('theme', 'theme-oats'), children: [] },
        { label: '健康伴手禮', to: eventPath('theme', 'theme-gift'), children: [] },
      ]},
    ],
  },
  safety: {
    title: '安心購',
    desc: '檢驗報告、購物須知與安心內容入口。',
    layout: 'split',
    groups: [
      {
        title: '安心資訊',
        items: [
          { label: '檢驗報告', to: '/inspections', children: [] },
          { label: '購物須知', to: '/shopping-guide', children: [] },
          { label: '健康誌', pdfUrl: '/health-journal.pdf', children: [] },
          { label: '禮盒型錄', pdfUrl: '/gift-catalog.pdf', children: [] },
        ],
      },
    ],
  },
  about: {
    title: '認識統一生機',
    desc: '品牌故事、服務與客服資訊入口。',
    layout: 'split',
    groups: [
      {
        title: '服務與品牌',
        items: [
          { label: '關於我們', to: '/about', children: [] },
          { label: '最新消息', to: '/news', children: [] },
          { label: '常見問題', to: '/faq', children: [] },
          { label: '聯絡客服', to: '/contact', children: [] },
          { label: '有機店超市訂貨區', href: 'https://s1.myqr.com.tw/newshop/172', children: [] },
        ],
      },
    ],
  },
}
