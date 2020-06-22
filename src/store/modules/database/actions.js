import * as types from './mutations-type'
import { openDB } from '@/util/sqliteUtil'

export default {
  openDatabase ({ commit }, params) {
    openDB().then(result => {
      commit(types.OPEN_DATABASE, result)
    })
  }
}
