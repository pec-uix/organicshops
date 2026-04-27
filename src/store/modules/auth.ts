import { Module, ActionContext } from 'vuex'
import { AuthState, User } from '@/types'

const authModule: Module<AuthState, any> = {
  namespaced: true,

  state: (): AuthState => ({
    user: null,
    isLoggedIn: false,
  }),

  getters: {
    currentUser: (state: AuthState): User | null => state.user,
    isLoggedIn:  (state: AuthState): boolean => state.isLoggedIn,
  },

  mutations: {
    SET_USER(state: AuthState, user: User) {
      state.user = user
      state.isLoggedIn = true
    },
    LOGOUT(state: AuthState) {
      state.user = null
      state.isLoggedIn = false
    },
  },

  actions: {
    // Mock login – replace with real API call later
    login({ commit }: ActionContext<AuthState, any>, credentials: { email: string; password: string }) {
      const mockUser: User = {
        id:    'u001',
        name:  '有機生活會員',
        email: credentials.email,
      }
      commit('SET_USER', mockUser)
    },

    logout({ commit }: ActionContext<AuthState, any>) {
      commit('LOGOUT')
    },
  },
}

export default authModule
