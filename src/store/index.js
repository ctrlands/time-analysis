import Vue from 'vue'
import Vuex from 'vuex'
// import module
import moduleA from './modules/moduleA'
import Database from './modules/database'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    moduleA,
    Database
  }
})
