import { Module } from 'vuex'

interface UiState {
  cartDrawerOpen: boolean
  mobileMenuOpen: boolean
}

const uiModule: Module<UiState, any> = {
  namespaced: true,

  state: (): UiState => ({
    cartDrawerOpen: false,
    mobileMenuOpen: false,
  }),

  mutations: {
    SET_CART_DRAWER(state: UiState, open: boolean) {
      state.cartDrawerOpen = open
    },
    SET_MOBILE_MENU(state: UiState, open: boolean) {
      state.mobileMenuOpen = open
    },
  },

  actions: {
    openCartDrawer({ commit }) {
      commit('SET_CART_DRAWER', true)
    },
    closeCartDrawer({ commit }) {
      commit('SET_CART_DRAWER', false)
    },
    openMobileMenu({ commit }) {
      commit('SET_MOBILE_MENU', true)
    },
    closeMobileMenu({ commit }) {
      commit('SET_MOBILE_MENU', false)
    },
    toggleMobileMenu({ commit, state }) {
      commit('SET_MOBILE_MENU', !state.mobileMenuOpen)
    },
  },

  getters: {
    cartDrawerOpen: (state) => state.cartDrawerOpen,
    mobileMenuOpen: (state) => state.mobileMenuOpen,
  },
}

export default uiModule
