import { Module } from 'vuex'

interface UiState {
  cartDrawerOpen: boolean
  mobileMenuOpen: boolean
  pdfViewerUrl: string | null
  pdfViewerTitle: string
}

const uiModule: Module<UiState, any> = {
  namespaced: true,

  state: (): UiState => ({
    cartDrawerOpen: false,
    mobileMenuOpen: false,
    pdfViewerUrl: null,
    pdfViewerTitle: '',
  }),

  mutations: {
    SET_CART_DRAWER(state: UiState, open: boolean) {
      state.cartDrawerOpen = open
    },
    SET_MOBILE_MENU(state: UiState, open: boolean) {
      state.mobileMenuOpen = open
    },
    SET_PDF_VIEWER(state: UiState, payload: { url: string | null; title: string }) {
      state.pdfViewerUrl = payload.url
      state.pdfViewerTitle = payload.title
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
    openPdfViewer({ commit }, payload: { url: string; title: string }) {
      commit('SET_PDF_VIEWER', payload)
      document.body.style.overflow = 'hidden'
    },
    closePdfViewer({ commit }) {
      commit('SET_PDF_VIEWER', { url: null, title: '' })
      document.body.style.overflow = ''
    },
  },

  getters: {
    cartDrawerOpen: (state) => state.cartDrawerOpen,
    mobileMenuOpen: (state) => state.mobileMenuOpen,
    pdfViewerUrl: (state) => state.pdfViewerUrl,
    pdfViewerTitle: (state) => state.pdfViewerTitle,
  },
}

export default uiModule
