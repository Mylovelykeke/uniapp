export const toSuccessJSON = (data)=>{
	return {
		status:200,
		data
	}
}


export const toFailJSON = (err)=>{
	console.log(err,'====>')
	return {
		status:500,
		data:err
	}
}