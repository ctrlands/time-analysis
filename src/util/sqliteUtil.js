/**
 * @description: 创建数据库
 * @param dbname:string 数据库名
 * @return:
 */
export function openDB (dbname) {
  return new Promise((resolve, reject) => {
    window.sqlitePlugin.openDatabase({
      name: dbname + '.db',
      location: 'default',
      androidDatabaseProvider: 'system'
    },
    // 回调函数，可传
    function callBack (db) {
      db.transaction(
        function (tx) {
          // console.log('创建数据库成功')
          resolve(db)
        },
        function (err) {
          // console.log('Open database ERROR: ' + JSON.stringify(err))
          reject(err)
        }
      )
    })
  })
}

/**
 * @description: 数据库操作
 * @param {type} db 数据库对象 sql sql语句, liker 'CREATE TABLE IF NOT EXISTS tabletest (id integer primary key, title text, desc text)'
 * @param obj: [表字段1的值, 表字段2的值, ......]
 * @return:
 */
export function executeSql (db, obj = [], sql) {
  return new Promise((resolve, reject) => {
    db.transaction(function (transaction) {
      transaction.executeSql(sql, obj, function (tx, result) {
        // console.log('executeSql successfully')
        resolve()
      },
      function (err) {
        // console.log("Error occurred while executeSql.");
        reject(err)
      })
    }, function (_err) {
      // db.close()
    }, function () {
      // db.close()
    })
  })
}

/**
 * @description: sql多语句处理
 * @param {type}
 * @return:
 */
export function sqlBatch (db, batchs = []) {
  return new Promise((resolve, reject) => {
    db.sqlBatch(batchs, function () {
      // console.log('Populated database OK')
      // db.close()
      resolve()
    }, function (error) {
      // console.log('SQL batch ERROR: ' + error.message)
      // db.close()
      reject(error)
    })
  })
}

/**
 * @description: sql查询
 * @param {type} db 数据库 osql 查询语句
 * @return:
 */
export function sqlQuery (db, osql) {
  return new Promise((resolve, reject) => {
    db.transaction(function (transaction) {
      transaction.executeSql(osql, [], function (tx, results) {
        // eslint-disable-next-line prefer-const
        let _result = []
        // eslint-disable-next-line prefer-const
        let _len = results.rows.length
        for (let x = 0; x < _len; x++) {
          _result.push(results.rows.item(x))
        }
        resolve(_result)
      }, function (_err) {
        reject(_err)
      })
    }, function (_err) {
      // db.close()
    }, function () {
      // db.close()
    })
  })
}

/**
 * @description: table表添加列(sqlite不支持添加多列)
 * @param {obj} db: 数据库对象
 * @param {string} tbname: 表名
 * @param {string} column: 需要添加的列名及类型
 * input: extraTableColumn(db, 'tableName', 'disabled varchar(1)')
 * result: ALTER TABLE tableName ADD COLUMN disabled varchar(1)
 * @return:
 */
export function extraTableColumn (db, tbname, column) {
  const _sql = `ALTER TABLE ${tbname} ADD COLUMN ${column}`
  return new Promise((resolve, reject) => {
    executeSql(db, [], _sql).then(
      data => {
        // console.log("insert column success")
        resolve()
      },
      err => {
        reject(err)
      }
    )
  })
}
