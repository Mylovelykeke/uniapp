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
	// 价格 类型 备注 日期 账本    
	let sql =
		"create table if not exists notesList([id] INTEGER PRIMARY KEY,[PRICE] BIGINT(20),[ICONTYPE] INT(11),[REMARK] CHAR(110),[NOTESTYPE] INT(11),[INCOREXP] INT(6),[UPDATEDATE] TimeStamp, [CREATEDATE] TimeStamp NOT NULL DEFAULT (datetime('now','localtime')))"
	return executeSQL(options.name, sql)
}

export async function editorToAdd(data) {
	try {
		await creattable()
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
	} catch (e) {
		console.log(e)
	}
}

export function getNotesList(beginTime, endTime) {
	return new Promise(async (resolve, reject) => {
		try {
			await creattable()
			//  and UPDATEDATE<='${beginTime}'
			let sql =
				`select * from notesList where UPDATEDATE>='${endTime}' order by UPDATEDATE desc`
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
			let insertSql = `select * from notesList where id=${id}`
			let result = await selectSql(options.name, insertSql)
			resolve(result)
		} catch (e) {
			reject(e)
		}
	})
}
