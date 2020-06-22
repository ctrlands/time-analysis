import * as types from './mutations-type'

export default {
  [types.OPEN_DATABASE] (state, data) {
    state.database = data
  }
}
