import { openDB, executeSQL, selectSql, options } from './sqlite/sqlite.js'
import { toSuccessJSON, toFailJSON } from './returnCode.js'

export function openSqlite() {
  return new Promise(async (resolve, reject) => {
    try {
      let sql =
        "create table if not exists notes(id integer primary key,created_id int,budget decimal(20,2),account_name varchar(20),is_default boolean not null default(false),created_date timestamp not null default(datetime('now','localtime')))"
      await executeSQL(options.name, sql)
      let insertSql = `insert into notes('created_id','budget','account_name','is_default') select 1,0,'总账本',true  where not exists (select * from notes where id = 1);`
      let result = await executeSQL(options.name, insertSql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      reject(toFailJSON(result))
    }
  })
}

export function accountBook() {
  return new Promise((resolve, reject) => {
    openSqlite()
      .then(async (res) => {
        let result = await selectSql(
          options.name,
          'select * from notes where is_default=1'
        )
        resolve(toSuccessJSON(result))
      })
      .catch((e) => {
        reject(toFailJSON(result))
      })
  })
}

export function accountBookList() {
  return new Promise((resolve, reject) => {
    openSqlite()
      .then(async (res) => {
        let sql = `select * from notes`
        let result = await selectSql(options.name, sql)
        resolve(toSuccessJSON(result))
      })
      .catch((e) => {
        reject(toFailJSON(result))
      })
  })
}

export function editAccountBook(data) {
  return new Promise(async (resolve, reject) => {
    try {
      let { price, budgetId } = data
      await openSqlite()
      let insertSql = `update notes set budget= ${price} where id=${budgetId}`
      let result = await executeSQL(options.name, insertSql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      reject(toFailJSON(e))
    }
  })
}

export function deleteNote(id) {
  return new Promise(async (resolve, reject) => {
    try {
      await openSqlite()
      let insertSql = `delete from notesList where id=${id}`
      let result = await executeSQL(options.name, insertSql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      reject(toFailJSON(result))
    }
  })
}

export function fetchDetail(id) {
  return new Promise(async (resolve, reject) => {
    try {
      await openSqlite()
      let insertSql = `select * from user where id=${id}`
      let result = await selectSql(options.name, insertSql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      reject(toFailJSON(result))
    }
  })
}
