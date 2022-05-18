import {
	openComDB,
	executeSQL,
	selectSql,
	options
} from './sqlite/sqlite.js'
import {
	openSqlite as openAccountBookSqlite
} from './accountBook.js'
import {
	toSuccessJSON,
	toFailJSON
} from './returnCode.js'

function openSqlite() {
	return new Promise(async (resolve, reject) => {
		try {
			let boolean = plus.sqlite.isOpenDatabase(options);
			if (!boolean) {
				await openComDB()
			}
			let sql =
				"create table if not exists user([id] INTEGER PRIMARY KEY, [ALLMONEY] BIGINT(20),[CREATEDATE] TimeStamp NOT NULL DEFAULT (datetime('now','localtime')))"
			await executeSQL(options.name, sql)
			let insertSql =
				`insert into user('ALLMONEY') select 0 where not exists (SELECT * FROM user where id = 1);`
			let result = await executeSQL(options.name, insertSql)
			resolve(toSuccessJSON(result))
		} catch (e) {
			console.log(err, '////////')
			reject(toFailJSON(result))
		}
	})

}

export function UserInfo(id) {
	return new Promise((resolve, reject) => {
		openSqlite().then(async res => {
			let data = await openAccountBookSqlite()
			let result = await selectSql(options.name, 'select * from user where id=1')
			resolve(toSuccessJSON(result))
		}).catch(e => {
			reject(toFailJSON(result))
		})
	})
}

export function getNotesList(beginTime, endTime) {
	return new Promise(async (resolve, reject) => {
		try {
			await openSqlite()
			let sql =
				`select * from notesList where UPDATEDATE>='${endTime}' and UPDATEDATE<='${beginTime}' order by UPDATEDATE desc`
			let result = await selectSql(options.name, sql)
			resolve(toSuccessJSON(result))
		} catch (e) {
			reject(toFailJSON(result))
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
