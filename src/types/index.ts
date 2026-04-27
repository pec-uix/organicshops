// ─── Temperature Zone ───────────────────────────────────────────────────────
export type TempZone = 'ambient' | 'chilled' | 'frozen' | 'fresh'

export const TEMP_ZONE_LABEL: Record<TempZone, string> = {
  ambient: '常溫',
  chilled: '冷藏',
  frozen:  '冷凍',
  fresh:   '產地直送',
}

// ─── Category ────────────────────────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  icon: string
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  description: string
  price: number        // NTD（定價）
  originalPrice?: number
  memberPrice?: number // 會員價
  requiredOpPoints?: number
  unit: string
  categoryId: string
  tempZone: TempZone
  image: string        // emoji or URL placeholder
  inStock: boolean
  isOrganic: boolean
  origin: string
  tags: string[]
  salesCount?: number         // 銷售量（排序用）
  conveniencePickup?: boolean // 可超商取貨
  // ── 詳情頁擴充 ──
  stockStatus?: 'in-stock' | 'sold-out' | 'restocking' | 'preorder'
  promotionLabel?: string     // 限時標籤，如「限時優惠至 05/31」
  promotionMessage?: string   // 促銷說明，如「購買第 2 件 10 元」
  features?: string[]         // 產品特色（Tab）
  introduction?: string       // 產品介紹（Tab）
  specs?: string              // 成分規格（Tab，純文字多行）
}

// ─── Add-on Purchase（加價購）────────────────────────────────────────────────
export interface AddOnItem {
  id: string
  name: string
  image: string
  originalPrice: number
  addOnPrice: number
  unit: string
  unlockAt: number   // 購物車總額達此金額才解鎖
  tempZone: TempZone
}

// ─── Coupon（優惠券）─────────────────────────────────────────────────────────
export type CouponType = 'percent' | 'fixed'

export interface Coupon {
  code: string
  type: CouponType
  value: number      // percent: 折數(0~100)  fixed: 折抵金額
  minTotal: number   // 最低消費門檻
  label: string
}

// ─── Promotion Tier（滿額階梯）───────────────────────────────────────────────
export interface PromotionTier {
  minTotal: number
  discountPercent: number  // e.g. 85 → 85折
  label: string
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
}

// ─── User / Auth ─────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface AuthState {
  user: User | null
  isLoggedIn: boolean
}
