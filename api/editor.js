import { openDB, executeSQL, selectSql, options } from './sqlite/sqlite.js'
import { toSuccessJSON, toFailJSON } from './returnCode.js'

function openSqlite() {
  return new Promise(async (resolve, reject) => {
    try {
      // let boolean = await plus.sqlite.isOpenDatabase(options);
      // if (!boolean) {
      // 	await openDB()
      // }
      // 价格 类型 备注 日期 账本
      let sql =
        "create table if not exists note_detail(id integer primary key,price decimal(20,2),icon_type int,remark char(110),notes_type int,incOrExp int,update_date timestamp,create_date timestamp not null default(datetime('now','localtime')))"
      let result = await executeSQL(options.name, sql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      console.log(e)
      reject(toFailJSON(e))
    }
  })
}

export function editorToAdd(data) {
  return new Promise(async (resolve, reject) => {
    try {
      // await openSqlite()
      let { price, iconType, remark, notesType, incOrExp, updateDate } = data
      if (iconType == '') {
        iconType = 15
      }
      let insertSql = `insert into note_detail(price,icon_type,remark,notes_type,incOrExp,update_date) values(${price},${iconType},'${remark}',${notesType},${incOrExp},${updateDate})`

      let result = await executeSQL(options.name, insertSql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      reject(toFailJSON(e))
    }
  })
}

export function getNotesList(params) {
  let { endTime, beginTime, page, limit } = params
  let offset = (page - 1) * limit
  return new Promise(async (resolve, reject) => {
    try {
      await openSqlite()
      let sql = `select * from note_detail order by update_date desc limit ${limit} offset ${offset}`
      let result1 = await selectSql(options.name, sql)
      let result2 = await selectSql(
        options.name,
        'select count(*) as total from note_detail'
      )
      let data = {
        list: result1,
        total: result2[0].total,
      }
      resolve(toSuccessJSON(data))
    } catch (e) {
      reject(toFailJSON(e))
    }
  })
}

export function notePrice(beginTime, endTime) {
  return new Promise(async (resolve, reject) => {
    try {
      await openSqlite()
      let sql = `select sum(price) as outPrice from note_detail where update_date>='${beginTime}' and update_date<='${endTime}' and incOrExp=0`
      let result = await selectSql(options.name, sql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      reject(toFailJSON(e))
    }
  })
}

export function monthTotal(beginTime, endTime) {
  return new Promise(async (resolve, reject) => {
    try {
      await openSqlite()
      let sql = `select a.outPrice,b.incPrice from (select sum(price) as outPrice from note_detail where update_date>='${beginTime}' and update_date<='${endTime}' and incOrExp=0) a 
left join (select sum(price) as incPrice from note_detail where update_date>='${beginTime}' and update_date<='${endTime}' and incOrexp=1) b on 1=1`
      let result = await selectSql(options.name, sql)
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
      let insertSql = `delete from note_detail where id=${id}`
      let result = await executeSQL(options.name, insertSql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      reject(toFailJSON(e))
    }
  })
}

export function fetchDetail(id) {
  return new Promise(async (resolve, reject) => {
    try {
      await openSqlite()
      let insertSql = `select * from note_detail where id=${id}`
      let result = await selectSql(options.name, insertSql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      reject(toFailJSON(e))
    }
  })
}

export function notesAnalyse(params) {
  return new Promise(async (resolve, reject) => {
    try {
      let { incOrExp, beginTime, endTime } = params
      await openSqlite()
      let sq1 = `select id, icon_type, count(*) as num,sum(price) as price from note_detail where incOrExp=${incOrExp} and update_date>='${beginTime}' and update_date<='${endTime}' group by incOrExp order by price desc`
      let result1 = await selectSql(options.name, sq1)
      let sq2 = `select sum(price) as priceTotal,count(*) as notesCount from note_detail where incOrExp=${incOrExp} and update_date>='${beginTime}' and update_date<='${endTime}'`
      let result2 = await selectSql(options.name, sq2)
      let data = {
        ...result2[0],
        list: result1,
      }
      resolve(toSuccessJSON(data))
    } catch (e) {
      console.log(e)
      reject(toFailJSON(e))
    }
  })
}

export function notesMonths(params) {
  return new Promise(async (resolve, reject) => {
    try {
      let { incOrExp, beginTime, endTime } = params
      await openSqlite()
      let sql = `select  strftime('%Y-%m-%d',datetime(update_date / 1000, 'unixepoch', 'localtime')) as monthDay, sum(price) as dayTotal from note_detail where incOrExp=${incOrExp} and update_date>='${beginTime}' and update_date<='${endTime}' group by monthDay`
      let result = await selectSql(options.name, sql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      reject(toFailJSON(e))
    }
  })
}

export function notesYear(params) {
  return new Promise(async (resolve, reject) => {
    try {
      let { incOrExp, beginTime, endTime } = params
      await openSqlite()
      let sql = `select  strftime('%Y-%m',datetime(update_date / 1000, 'unixepoch', 'localtime')) as month, sum(price) as monthTotal from note_detail where incOrExp=${incOrExp} and update_date>='${beginTime}' and update_date<='${endTime}' group by month`
      let result = await selectSql(options.name, sql)
      resolve(toSuccessJSON(result))
    } catch (e) {
      console.log(e)
      reject(toFailJSON(e))
    }
  })
}
