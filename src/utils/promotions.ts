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
    productId: 'p101',
    triggerQty: 1,
    giftQty: 1,
    giftProductId: 'p101',
    giftName: '原味綜合堅果隨手包',
    label: '堅果買一送一',
  },
  {
    productId: 'op202',
    triggerQty: 4,
    giftQty: 1,
    giftProductId: 'op202',
    giftName: '智利鮭魚輪切',
    label: '鮭魚買四送一',
  },
  {
    productId: 'p105',
    triggerQty: 4,
    giftQty: 1,
    giftProductId: 'p105',
    giftName: '有機鮮採花椰菜',
    label: '花椰菜買四送一',
  },
  {
    productId: 'p106',
    triggerQty: 2,
    giftQty: 1,
    giftProductId: 'p106',
    giftName: '杏桃乾',
    label: '杏桃乾買二送一',
  },
  {
    productId: 'op201',
    triggerQty: 2,
    giftQty: 2,
    giftProductId: 'op201',
    giftName: '有機枸杞原汁',
    label: '枸杞原汁買二送二',
  },
  {
    productId: 'p102',
    triggerQty: 1,
    giftQty: 1,
    giftProductId: 'p101',
    giftName: '原味綜合堅果隨手包',
    label: '銀耳露買 A 送 B',
  },
]

export function getGiftPromotion(productId: string): GiftPromotionConfig | null {
  const directMatch = GIFT_PROMOTIONS.find((promotion) => promotion.productId === productId)
  if (directMatch) return directMatch

  const baseProductId = productId.split('-')[0]
  return GIFT_PROMOTIONS.find((promotion) => promotion.productId === baseProductId) || null
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
