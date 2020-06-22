import Vue from 'vue'
import Vuex from 'vuex'
// import module
import moduleA from './modules/moduleA'
import _database from './modules/database'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    moduleA,
    _database
  }
})
