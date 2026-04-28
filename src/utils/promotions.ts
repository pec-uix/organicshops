import { CartItem, Product } from '@/types'

export interface GiftPromotionConfig {
  productId: string
  triggerQty: number
  giftQty: number
  giftProductId: string
  giftName: string
  label: string
}

export interface PromotionGiftSummary {
  sourceProductId: string
  sourceProductName: string
  giftProductId: string
  giftName: string
  giftQuantity: number
  label: string
}

const GIFT_PROMOTIONS: GiftPromotionConfig[] = [
  {
    productId: 'p105',
    triggerQty: 4,
    giftQty: 1,
    giftProductId: 'p105',
    giftName: '有機鮮採花椰菜',
    label: '花椰菜買四送一',
  },
]

export function getGiftPromotion(productId: string): GiftPromotionConfig | null {
  return GIFT_PROMOTIONS.find((promotion) => promotion.productId === productId) || null
}

export function getGiftQuantity(productId: string, quantity: number): number {
  const promotion = getGiftPromotion(productId)
  if (!promotion || quantity < promotion.triggerQty) return 0
  return Math.floor(quantity / promotion.triggerQty) * promotion.giftQty
}

export function getGiftProgressText(product: Product, quantity: number): string {
  const promotion = getGiftPromotion(product.id)
  if (!promotion) return ''

  const giftQuantity = getGiftQuantity(product.id, quantity)
  if (giftQuantity > 0) {
    return `已符合贈品：${promotion.giftName} x${giftQuantity}`
  }

  const remaining = promotion.triggerQty - (quantity % promotion.triggerQty || promotion.triggerQty)
  return `再買 ${remaining} 件，即贈 ${promotion.giftName} x${promotion.giftQty}`
}

export function getCartGiftSummaries(items: CartItem[]): PromotionGiftSummary[] {
  return items
    .map((item) => {
      const promotion = getGiftPromotion(item.product.id)
      if (!promotion) return null

      const giftQuantity = getGiftQuantity(item.product.id, item.quantity)
      if (giftQuantity <= 0) return null

      return {
        sourceProductId: item.product.id,
        sourceProductName: item.product.name,
        giftProductId: promotion.giftProductId,
        giftName: promotion.giftName,
        giftQuantity,
        label: promotion.label,
      } as PromotionGiftSummary
    })
    .filter((item): item is PromotionGiftSummary => Boolean(item))
}
