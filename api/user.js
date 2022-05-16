import {
	openComDB,
	executeSQL,
	selectSql,
	options
} from './sqlite/sqlite.js'

async function creattable() {
	let boolean = plus.sqlite.isOpenDatabase(options);
	if (!boolean) {
		await openComDB()
	}
	// ID 账本类型 资产 预算  月份  默认 创建时间 
	let sql =
		"create table if not exists user([id] INTEGER PRIMARY KEY,[NOTESNAME] CHAR(110), [ALLMONEY] BIGINT(20),[BUDGET] BIGINT(20),[MONTHDATE] TimeStamp,[DEFAULT] INT,[CREATEDATE] TimeStamp NOT NULL DEFAULT (datetime('now','localtime')))"
	await executeSQL(options.name, sql)

	let result = await selectSql(options.name, `SELECT * FROM user`)
	if (result.length === 0) {
		let date = new Date().getTime()
		let insertSql =
			`insert into user('NOTESNAME','ALLMONEY','BUDGET','MONTHDATE','DEFAULT') values('默认',0,0,${date},1)`
		await executeSQL(options.name, insertSql)
	}
	return result
}

export function UserInfo(id) {
	return new Promise(async(resolve, reject) => {
		try {
			await creattable()
			let result = await selectSql(options.name, 'select * from user where "DEFAULT"=1')
			resolve(result)
		} catch (e) {
			reject(e)
		}
	})
}

export function getNotesList(beginTime, endTime) {
	return new Promise(async (resolve, reject) => {
		try {
			await creattable()
			let sql =
				`select * from notesList where UPDATEDATE>='${endTime}' and UPDATEDATE<='${beginTime}' order by UPDATEDATE desc`
			let result = await selectSql(options.name, sql)
			resolve(result)
		} catch (e) {
			reject(e)
		}
	})

}

export function deleteNote(id) {
	return new Promise(async (resolve, reject) => {
		try {
			await creattable()
			let insertSql = `delete from notesList where id=${id}`
			let result = await executeSQL(options.name, insertSql)
			resolve(result)
		} catch (e) {
			reject(e)
		}
	})

}


export function fetchDetail(id) {
	return new Promise(async (resolve, reject) => {
		try {
			await creattable()
			let insertSql = `select * from user where id=${id}`
			let result = await selectSql(options.name, insertSql)
			resolve(result)
		} catch (e) {
			reject(e)
		}
	})
}
