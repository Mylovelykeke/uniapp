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

export function openSqlite() {
	return new Promise(async (resolve, reject) => {
		try {
			let boolean = plus.sqlite.isOpenDatabase(options);
			if (!boolean) {
				await openComDB()
			}
			// ID 账本类型 资产 预算  月份  默认 创建时间 
			let sql =
				"create table if not exists account_book([id] INTEGER PRIMARY KEY, [CREATEDID] BIGINT(20),[BUDGET] BIGINT(20),[ACCOUNTNAME] CHAR,[DEFAULT] BOOLEAN NOT NULL DEFAULT (false),[CREATEDATE] TimeStamp NOT NULL DEFAULT (datetime('now','localtime')))"
			await executeSQL(options.name, sql)
			// let insertSql =`if not exists(select * from user where id=1) insert into user('ALLMONEY') values(0)`
			let insertSql =`insert into account_book('CREATEDID','BUDGET','ACCOUNTNAME','DEFAULT') select 1,0,'总账本',true  where not exists (SELECT * FROM account_book where id = 1);`
			let result = await executeSQL(options.name, insertSql)
			resolve(toSuccessJSON(result))
		} catch (e) {
			reject(toFailJSON(result))
		}
	})

}

export function accountBookList(id) {
	return new Promise((resolve, reject) => {
		openSqlite().then(async res => {
			let result = await selectSql(options.name, 'select * from account_book where "DEFAULT"=1')
			resolve(toSuccessJSON(result))
		}).catch(e => {
			reject(toFailJSON(result))
		})
	})
}

export function editAccountBook(data) {
	return new Promise(async (resolve, reject) => {
		try {
			let { price, budgetId } = data
			await openSqlite()
			let insertSql =
				`update account_book  set [BUDGET]= ${price} where [id]=${budgetId}`
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
