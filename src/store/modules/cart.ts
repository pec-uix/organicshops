import { Module, ActionContext } from 'vuex'
import { CartState, CartItem, Product, TempZone } from '@/types'

const ZONE_RULES: Record<TempZone, { fee: number; freeAt: number }> = {
  ambient: { fee: 60,  freeAt: 1200 },
  chilled: { fee: 100, freeAt: 800 },
  frozen:  { fee: 150, freeAt: 800 },
  fresh:   { fee: 120, freeAt: 800 },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function findItem(state: CartState, productId: string): CartItem | undefined {
  return state.items.find(i => i.product.id === productId)
}

// ─── Module ───────────────────────────────────────────────────────────────────
const cartModule: Module<CartState, any> = {
  namespaced: true,

  state: (): CartState => ({
    items: [],
  }),

  getters: {
    totalCount(state: CartState): number {
      return state.items.reduce((sum, i) => sum + i.quantity, 0)
    },

    // 總現金金額
    totalPrice(state: CartState): number {
      return state.items.reduce((sum, i) => {
        // 若為 OP 換購品，memberPrice 即為加購價，否則使用一般價格邏輯
        const price = i.product.memberPrice ?? i.product.originalPrice ?? i.product.price
        return sum + price * i.quantity
      }, 0)
    },

    // 總所需 OP 點數 (自動加總所有換購品所需點數)
    totalRequiredOpPoints(state: CartState): number {
      return state.items.reduce((sum, i) => {
        return sum + (i.product.requiredOpPoints || 0) * i.quantity
      }, 0)
    },

    ambientSubtotal(state: CartState): number {
      return state.items
        .filter(i => i.product.tempZone === 'ambient')
        .reduce((sum, i) => {
          const price = i.product.memberPrice ?? i.product.originalPrice ?? i.product.price
          return sum + price * i.quantity
        }, 0)
    },

    itemsByZone(state: CartState): Record<TempZone, CartItem[]> {
      const zones: Record<TempZone, CartItem[]> = {
        ambient: [], chilled: [], frozen: [], fresh: [],
      }
      state.items.forEach(item => { zones[item.product.tempZone].push(item) })
      return zones
    },

    shippingFee(state: CartState): number {
      if (state.items.length === 0) return 0

      return (Object.keys(ZONE_RULES) as TempZone[]).reduce((fee, zone) => {
        const subtotal = state.items
          .filter((item) => item.product.tempZone === zone)
          .reduce((sum, item) => {
            const price = item.product.memberPrice ?? item.product.originalPrice ?? item.product.price
            return sum + price * item.quantity
          }, 0)

        if (subtotal === 0) return fee
        if (subtotal >= ZONE_RULES[zone].freeAt) return fee
        return fee + ZONE_RULES[zone].fee
      }, 0)
    },
  },

  mutations: {
    ADD_ITEM(state: CartState, product: Product) {
      // 如果商品帶有規格數量，直接使用，否則預設 +1
      const qtyToAdd = (product as any).quantity || 1
      const existing = findItem(state, product.id)
      if (existing) {
        existing.quantity += qtyToAdd
      } else {
        state.items.push({ product, quantity: qtyToAdd })
      }
    },
    REMOVE_ITEM(state: CartState, productId: string) {
      state.items = state.items.filter(i => i.product.id !== productId)
    },
    SET_QUANTITY(state: CartState, { productId, quantity }: { productId: string; quantity: number }) {
      const item = findItem(state, productId)
      if (item) item.quantity = quantity
    },
    CLEAR_CART(state: CartState) { state.items = [] },
  },

  actions: {
    addItem({ commit }: ActionContext<CartState, any>, product: Product) { commit('ADD_ITEM', product) },
    removeItem({ commit }: ActionContext<CartState, any>, productId: string) { commit('REMOVE_ITEM', productId) },
    setQuantity({ commit }: ActionContext<CartState, any>, payload: { productId: string; quantity: number }) {
      if (payload.quantity <= 0) commit('REMOVE_ITEM', payload.productId)
      else commit('SET_QUANTITY', payload)
    },
    clearCart({ commit }: ActionContext<CartState, any>) { commit('CLEAR_CART') },
  },
}

export default cartModule
