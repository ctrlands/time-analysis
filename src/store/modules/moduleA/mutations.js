import * as types from './mutations-type'

export default {
  [types.SET_PARAMONE] (state, data) {
    state.paramOne = data
  },
  [types.SET_PARAMTWO] (state, data) {
    state.paramTwo = data
  }
}
