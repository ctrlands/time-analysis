import * as types from './mutations-type'

export default {
  changeParamOneVal ({ commit }, params) {
    commit(types.SET_PARAMONE, params.paramOne)
    commit(types.SET_PARAMTWO, params.paramTwo)
  }
}
