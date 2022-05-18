const options = {
	name: 'notes',
	path: '_doc/notes.db'
}

function openComDB() {
	return new Promise((resolve, reject) => {
		plus.sqlite.openDatabase({
			...options,
			success: function(e) {
				// plus.nativeUI.alert('打开数据库成功');  
				resolve(e)
			},
			fail: function(e) {
				// plus.nativeUI.alert("打开数据库失败");  
				reject(e)
			}
		})
	})
}

function executeSQL(name, sql) {
	return new Promise((resolve, reject) => {
		plus.sqlite.executeSql({
			name: name,
			sql: sql,
			success: function(e) {
				resolve(e)
			},
			fail: function(e) {
				console.log(e),'=>>>>>>>>>'
				reject(e)
			}
		})
	})
}

function selectSql(name, sql) {
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: sql,
			success: function(e) {
				resolve(e)
			},
			fail: function(e) {
				console.log(e)
				reject(e)
			}
		})
	})
}

function closeDB() {
	return new Promise((resolve, reject) => {
		plus.sqlite.closeDatabase({
			name:options.name,
			success:function(e){
				resolve(e)
			},
			fail:function(err){
				reject(err)
			}
		})
	})
}

export {
	openComDB,
	executeSQL,
	selectSql,
	closeDB,
	options
}
