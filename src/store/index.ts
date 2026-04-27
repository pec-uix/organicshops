import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import auth from './modules/auth'
import products from './modules/products'
import ui from './modules/ui'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    cart,
    auth,
    products,
    ui,
    user,
  },
})
