import { Module } from 'vuex'

interface UserWalletState {
  pointBalance: number
  creditBalance: number
  creditExpiry: string
  expiringCreditAmount: number
}

const userModule: Module<UserWalletState, any> = {
  namespaced: true,

  state: (): UserWalletState => ({
    pointBalance: 1250,
    creditBalance: 900,
    creditExpiry: '2026-04-30',
    expiringCreditAmount: 500,
  }),

  getters: {
    pointBalance: (state: UserWalletState): number => state.pointBalance,
    creditBalance: (state: UserWalletState): number => state.creditBalance,
    creditExpiry: (state: UserWalletState): string => state.creditExpiry,
    expiringCreditAmount: (state: UserWalletState): number => state.expiringCreditAmount,
  },
}

export default userModule
