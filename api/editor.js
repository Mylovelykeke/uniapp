import {
	openComDB,
	executeSQL,
	selectSql,
	options
} from './sqlite/sqlite.js'
import {
	toSuccessJSON,
	toFailJSON
} from './returnCode.js'

function openSqlite() {
	return new Promise(async (resolve, reject) => {
		try {
			// let boolean = await plus.sqlite.isOpenDatabase(options);
			// if (!boolean) {
			// 	await openComDB()
			// }
			// 价格 类型 备注 日期 账本    
			let sql =
				"create table if not exists notesList([id] INTEGER PRIMARY KEY,[PRICE] BIGINT(20),[ICONTYPE] INT(11),[REMARK] CHAR(110),[NOTESTYPE] INT(11),[INCOREXP] INT(6),[UPDATEDATE] TimeStamp, [CREATEDATE] TimeStamp NOT NULL DEFAULT (datetime('now','localtime')))"
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
			let {
				price,
				iconType,
				remark,
				notesType,
				incOrExp,
				updateDate
			} = data
			if (iconType == '') {
				iconType = 15
			}
			let insertSql =
				`insert into notesList (PRICE,ICONTYPE,REMARK,NOTESTYPE,INCOREXP,UPDATEDATE) values(${price},${iconType},'${remark}',${notesType},${incOrExp},${updateDate})`

			let result = await executeSQL(options.name, insertSql)
			resolve(toSuccessJSON(result))
		} catch (e) {
			reject(toFailJSON(e))
		}
	})

}

export function getNotesList(params) {
	let {
		endTime,
		beginTime,
		page,
		limit
	} = params
	let offset = (page - 1) * limit
	return new Promise(async (resolve, reject) => {
		try {
			await openSqlite()
			let sql =
				`select * from notesList order by UPDATEDATE desc LIMIT ${limit} OFFSET ${offset}`
			let result1 = await selectSql(options.name, sql)
			let result2 = await selectSql(options.name, 'select count(*) as total from notesList')
			let data = {
				list: result1,
				total: result2[0].total
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
			let sql =
				`select sum(PRICE) as outPrice from notesList where UPDATEDATE>='${beginTime}' and UPDATEDATE<='${endTime}' and INCOREXP=0`
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
			let sql =
				`select a.outPrice,b.incPrice from (select sum(PRICE) as outPrice from notesList where UPDATEDATE>='${beginTime}' and UPDATEDATE<='${endTime}' and INCOREXP=0) a 
left join (select sum(PRICE) as incPrice from notesList where UPDATEDATE>='${beginTime}' and UPDATEDATE<='${endTime}' and INCOREXP=1) b on 1=1`
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
			let insertSql = `delete from notesList where id=${id}`
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
			let insertSql = `select * from notesList where id=${id}`
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
			let {
				INCOREXP,
				beginTime,
				endTime
			} = params
			await openSqlite()
			let sq1 =
				`select id, ICONTYPE, count(*) as num,sum(PRICE) as price from notesList where INCOREXP=${INCOREXP} and UPDATEDATE>='${beginTime}' and UPDATEDATE<='${endTime}' group by ICONTYPE order by price desc`
			let result1 = await selectSql(options.name, sq1)
			let sq2 =
				`select sum(PRICE) as priceTotal,count(*) as notesCount from notesList where INCOREXP=${INCOREXP} and UPDATEDATE>='${beginTime}' and UPDATEDATE<='${endTime}'`
			let result2 = await selectSql(options.name, sq2)
			let data = {
				...result2[0],
				list: result1
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
			let {
				INCOREXP,
				beginTime,
				endTime
			} = params
			await openSqlite()
			let sql =
				`select  strftime('%Y-%m-%d',datetime(UPDATEDATE / 1000, 'unixepoch', 'localtime')) as monthDay, sum(PRICE) as dayTotal from notesList where INCOREXP=${INCOREXP} and UPDATEDATE>='${beginTime}' and UPDATEDATE<='${endTime}' group by monthDay`
			let result = await selectSql(options.name, sql)
			resolve(toSuccessJSON(result))
		} catch (e) {
			console.log(e)
			reject(toFailJSON(e))
		}
	})
}

export function notesYear(params) {
	return new Promise(async (resolve, reject) => {
		try {
			let {
				INCOREXP,
				beginTime,
				endTime
			} = params
			await openSqlite()
			let sql =
				`select  strftime('%Y-%m',datetime(UPDATEDATE / 1000, 'unixepoch', 'localtime')) as month, sum(PRICE) as monthTotal from notesList where INCOREXP=${INCOREXP} and UPDATEDATE>='${beginTime}' and UPDATEDATE<='${endTime}' group by month`
			let result = await selectSql(options.name, sql)
			resolve(toSuccessJSON(result))
		} catch (e) {
			console.log(e)
			reject(toFailJSON(e))
		}
	})
}
