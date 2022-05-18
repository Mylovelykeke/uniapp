<template>
	<view class="">
		<CustomTitle />
		<web-view src="/hybrid/html/index.html" @message="onMessage"></web-view>
	</view>
</template>

<script>
	import CustomTitle from '../../components/CustomTitle.vue'
	import moment from '../../utils/moment.js'
	import {
		editorToAdd
	} from '../../api/editor.js'
	var wv;
	export default {
		components: {
			CustomTitle
		},
		computed: {},
		data() {
			return {

			};
		},
		onReady() {
			// #ifdef APP-PLUS
			var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			wv = currentWebview.children()[0]
			wv.setStyle({
				top: uni.getSystemInfoSync().statusBarHeight + 44
			})
			// #endif
		},
		methods: {
			onMessage(e) {
				let data = e.detail.data[0].excel
				for (let i in data) {
					if (data[i].length && data[i][0].hasOwnProperty('微信支付账单明细')) {
						this.setWxExcel(data[i])
					}
				}
			},
			async setWxExcel(list) {
				let newList = list.splice(14)
				let arr = []
				newList.forEach(async item => {
					try {
						let incOrExp = item['__EMPTY_3'] == '支出' ? 0 : 1
						let time = item['微信支付账单明细']
						let price = Number(item['__EMPTY_4'].slice(1))
						let updateDate = moment(time).valueOf('x')
						let remark =
							`交易对方：${item['__EMPTY_1']};\n商品：${item['__EMPTY_2']};\n收支：${item['__EMPTY_3']};\n 支付方式：${item['__EMPTY_5']};\n 金额：${item['__EMPTY_4']}; `
						let params = {
							iconType: '',
							notesType: 0,
							price,
							remark,
							incOrExp,
							updateDate
						}
						let result = await editorToAdd(params)
					} catch (e) {
						console.log(e, '?')
						// plus.nativeUI.alert('上传报错')
					}
				})
				// let result = await Promise.all(arr)
				// 	console.log(result,'result')
			}
		}
	}
</script>

<style lang="scss">
	.webview {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
