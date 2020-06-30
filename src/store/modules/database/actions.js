import * as types from './mutations-type'
import { openDB } from '@/util/sqliteUtil'

export default {
  openDatabase ({ commit }, dbname) {
    return new Promise((resolve, reject) => {
      openDB(dbname).then(result => {
        commit(types.OPEN_DATABASE, result)
        resolve()
      }, _err => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject()
      })
    })
  }
}
