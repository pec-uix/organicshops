import { Module, ActionContext } from 'vuex'
import { AuthState, User } from '@/types'

const authModule: Module<AuthState, any> = {
  namespaced: true,

  state: (): AuthState => ({
    user: {
      id: 'u001',
      name: '皮克敏',
      email: 'demo@organicshops.com',
      memberRoleLabel: '生機員工',
      memberTierLabel: 'VIP',
      memberStatusLabel: '已綁定',
      memberLevel: 'vip',
      memberBadges: ['VIP'],
    },
    isLoggedIn: true,
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
      const normalizedEmail = credentials.email.trim().toLowerCase()
      const demoUsers: Record<string, User> = {
        'vip@organicshops.com': {
          id: 'u001',
          name: '皮克敏',
          email: normalizedEmail,
          memberRoleLabel: '生機員工',
          memberTierLabel: 'VIP',
          memberStatusLabel: '已綁定',
          memberLevel: 'vip',
          memberBadges: ['VIP'],
        },
        'member@organicshops.com': {
          id: 'u002',
          name: '林宜蓁',
          email: normalizedEmail,
          memberRoleLabel: '一般會員',
          memberTierLabel: '一般會員',
          memberStatusLabel: '未綁定',
          memberLevel: 'normal',
          memberBadges: [],
        },
      }

      const mockUser: User = demoUsers[normalizedEmail] || demoUsers['vip@organicshops.com']
      commit('SET_USER', mockUser)
    },

    logout({ commit }: ActionContext<AuthState, any>) {
      commit('LOGOUT')
    },
  },
}

export default authModule
