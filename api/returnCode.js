export const toSuccessJSON = (data)=>{
	return {
		status:200,
		data
	}
}


export const toFailJSON = (err)=>{
	uni.report('sql操作',err)
	return {
		status:500,
		data:err
	}
}