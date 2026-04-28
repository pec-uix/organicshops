import { Product } from '@/types'

const WISHLIST_STORAGE_KEY = 'organicshops:wishlist'

function canUseStorage() {
  return typeof window !== 'undefined' && !!window.localStorage
}

export function getWishlist(): Product[] {
  if (!canUseStorage()) return []

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveWishlist(items: Product[]) {
  if (!canUseStorage()) return
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
}

export function isWishlisted(productId: string) {
  return getWishlist().some((item) => item.id === productId)
}

export function addToWishlist(product: Product) {
  const items = getWishlist()
  if (items.some((item) => item.id === product.id)) return items

  const next = [...items, product]
  saveWishlist(next)
  return next
}

export function removeFromWishlist(productId: string) {
  const next = getWishlist().filter((item) => item.id !== productId)
  saveWishlist(next)
  return next
}
