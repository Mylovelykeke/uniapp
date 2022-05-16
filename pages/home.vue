<template>
	<view class="content">
		<view style="padding: 0 32rpx;">
			<!-- <view class="space"> -->
			<text style="font-size: 50rpx;line-height: 2.5;">Hi，王二麻子</text>
			<!-- </view> -->
			<view class="year" @click="toLink">
				<view>
					<text>账户总览</text>
				</view>
				<view class="flex text--title">
					<text>总资产</text>
					<!-- <text>收支</text> -->
				</view>
				<view class="flex text--large">
					<view>
						<text class="unit">¥</text>
						<text>{{userInfo.ALLMONEY}}</text>
					</view>
					<view class="year-btn">
						<text>卡包管理</text>
					</view>
				</view>
			</view>
			<view class="space"></view>
			<view class="current" @tap="toMonthInfo">
				<view class="flex current--month">
					<view class="">
						<text
							style="font-size: 80rpx;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{month}}</text>
						<text>月</text>
					</view>
					<!-- 	<view class="">
						分析
					</view> -->
				</view>
				<view class="flex text--title">
					<text>支出</text>
					<text>收入</text>
				</view>
				<view class="flex text--large">
					<view>
						<text class="unit">¥</text>
						<text>{{expend}}</text>
					</view>
					<view>
						<text class="unit">¥</text>
						<text>{{income}}</text>
					</view>
				</view>
				<view style="margin-top: 10px;">
					<text>设置预算</text>
					<uni-icons type="forward" size="16"></uni-icons>
				</view>
				<view style="margin-top: 20px;">
					<progress :percent="percent" stroke-width="8" activeColor="rgba(255, 97, 97, 1)" />
				</view>
			</view>
			<view class="space">
				<text>收支明细</text>
			</view>
		</view>
		<template v-if="Object.keys(timeObj).length">
			<view class="next" v-for="(list,key) in timeObj" :key="key">
				<view class="next__title">
					<text class="next__history">{{handDays(key)}}</text>
					<text class="next__more">{{handlePrice(list)}}</text>
				</view>
				<!-- <view class="line"></view> -->
				<!-- 	<view class="next__item" v-for="(val,index) in list" :key="val.id">
					<view class="next__item--left">
						<uni-icons customPrefix="t-icon" :type="handleIcons(val.ICONTYPE).name" size="30"></uni-icons>
					</view>
					<view class="next__item--right">
						<view class="next__right--text">
							<text style="font-size: 32rpx;">{{handleIcons(val.ICONTYPE).title}}</text>
							<text style="color: rgba(138, 138, 138, 1);">{{val.REMARK}}</text>
						</view>
						<text>￥{{val.PRICE}}</text>
					</view>
				</view> -->
				<uni-swipe-action>
					<uni-swipe-action-item :right-options="options" v-for="(val,index) in list" :key="val.id"
						style="border-top: 1px solid #eee;" @click="onClickRemove(val)">
						<view class="next__item" @click="onClickDetail(val)">
							<view class="next__item--fix">
								<uni-icons customPrefix="t-icon" :type="handleIcons(val.ICONTYPE).name" size="30">
								</uni-icons>
							</view>
							<view class="next__item--left"></view>
							<view class="next__item--right">
								<view class="next__right--text">
									<text style="font-size: 32rpx;">{{handleIcons(val.ICONTYPE).title}}</text>
									<text style="color: rgba(138, 138, 138, 1);">{{val.REMARK}}</text>
								</view>
								<text>{{val.INCOREXP == 0?'-':''}}￥{{val.PRICE}}</text>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</template>
		<view style="min-height: 200px;background-color: #fff;" v-else>

		</view>
		<uni-fab ref="fab" :pattern="pattern" :horizontal="horizontal" :vertical="vertical" @fabClick="onClickEditor" />

	</view>
</template>

<script>
	import {
		getNotesList,
		deleteNote
	} from '../api/editor.js'
	import {
		icons
	} from '../utils/config.js'
	import {
		UserInfo
	} from '../api/user.js'
	import moment from '../utils/moment.js'
	export default {
		data() {
			return {
				income: 0, //收入
				expend: 0, //支出
				horizontal: 'right',
				vertical: 'bottom',
				pattern: {
					backgroundColor: '#fff',
					buttonColor: '#fbfbfb',
					iconColor: '#ff7245'
				},
				options: [{
					text: '删除',
					style: {
						backgroundColor: 'rgba(255, 97, 97, 1)'
					}
				}],
				timeObj: [],
				userInfo: {}
			}
		},
		computed: {
			percent(){
				if(this.userInfo.BUDGET){
					return 100
				}else{
					return(this.expend /( 2000 || this.userInfo.BUDGET ))*100
				}
			},
			month() {
				let m = new Date().getMonth() + 1
				return m
			}
		},
		onShow() {
			this.getUserInfo().then(async res => {
				if (Array.isArray(res)) {
					this.userInfo = res[0]
				}
				await this.getList()
				await this.getMonthList()
			})
		},
		methods: {
			toLink(){
			plus.ad.showContentPage({adpid: 1111111112}, (res) => {
								this.loading = false;
							}, (err) => {
								this.loading = false;
								console.log(err);
							});
			},
			handlePrice(list = []) {
				let total = 0
				list.forEach(item => {
					// 支出
					if (item.INCOREXP === 0) {
						total -= Number(item.PRICE)
					} else {
						// 收入
						total += Number(item.PRICE)
					}
				})
				return Math.round(total * 100) / 100
			},
			handDays(key) {
				let current = moment().format('YYYY-MM-DD')
				let lastDay = moment().subtract(1, 'day').format('YYYY-MM-DD')
				if (current === key) {
					return '今天'
				} else if (lastDay === key) {
					return '昨天'
				} else {
					return key
				}
			},
			handleIcons(type) {
				let res = icons.find(item => item.id === type)
				return res
			},

			async getUserInfo() {
				try {
					let result = await UserInfo()
					return result
				} catch (e) {
					console.log(e)
				}
			},

			async getMonthList() {
				try {
					let startTime = moment().startOf("month").valueOf('x')
					let endTime = moment().endOf('month').valueOf('x')
					let result = await getNotesList(endTime, startTime)
					let income = 0
					let expend = 0
					result.forEach(data => {
						if (data.INCOREXP == 0) {
							expend += data.PRICE
						} else {
							income += data.PRICE
						}
					})
					this.income = Math.round(income * 100) / 100
					this.expend = Math.round(expend * 100) / 100
				} catch (e) {
					console.log(e, '///')
				}
			},

			async getList() {
				try {
					let endTime = moment().endOf('day').valueOf('x')
					let startTime = moment(endTime).subtract(12, 'months').valueOf('x')
					let result = await getNotesList(endTime, startTime)
					console.log(result,'==========')
					let timeObj = {}
					result.forEach(item => {
						let date = moment(item.UPDATEDATE).format('YYYY-MM-DD')
						if (timeObj[date]) {
							timeObj[date].push(item)
						} else {
							timeObj[date] = []
							timeObj[date].push(item)
						}
					})
					this.timeObj = timeObj
				} catch (e) {
					console.log(e, '///')
				}
			},

			toMonthInfo() {
				uni.navigateTo({
					url: '/pages/charts/charts'
				})
			},
			onClickEditor() {
				uni.navigateTo({
					url: "/pages/editor/editor"
				})
			},
			async onClickRemove(value) {
				try {
					let result = await deleteNote(value.id)
					await this.getMonthList()
					await this.getList()
				} catch (e) {
					console.log(e)
				}
			},
			onClickDetail(val) {
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + val.id
				})
			}
		}

	}
</script>

<style lang="scss">
	.content {
		padding: 0;

		@mixin card--padding {
			padding: 40rpx 30rpx;
			box-sizing: border-box;
		}

		.flex {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.unit {
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			font-size: 50rpx;
			font-weight: normal;
		}

		.text--title {
			font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
			color: #fba6a6;
			line-height: 80rpx;
			height: 80rpx;
		}

		.text--large {
			font-weight: bold;
			font-size: 40rpx;
		}

		.space {
			height: 80rpx;

			text {
				font-size: 36rpx;
				font-weight: bold;
				line-height: 80rpx;
			}
		}

		.year {
			background: linear-gradient(30deg, #ff3535 40%, #ff6161 90%);
			box-shadow: 0 35px 10px -25px #e79595;
			line-height: 2;
			border-radius: 17px;
			color: white;
			@include card--padding;

			.year-btn {
				border-radius: 40px;
				padding: 8rpx 32rpx;
				background: linear-gradient(180deg, rgba(255, 240, 240, 1.0) 0%, #ffd8d8 100%);
				color:rgba(227, 43, 43, 1.0);
				font-size: 36rpx;
				font-weight: normal;
				&:active{
					opacity: .7;
				}
			}
		}

		.current,
		.next {

			// backdrop-filter: blur(150px); 
			// box-shadow: 0px 4px 16px rgba(239, 245, 255, 1);
			.line {
				margin: 0 auto;
				border-top: 1px dashed rgba(204, 204, 204, 1);
				mix-blend-mode: normal;
			}
		}

		.next {
			background-color: #fff;

			.next__title {
				display: flex;
				padding: 20rpx 32rpx;
				justify-content: space-between;
				background-color: rgba(240, 242, 245, 1);

				.next__history {
					color: rgba(138, 138, 138, 1);
				}

				.next__more {
					// width: 66px;
					// height: 28px;
					// font-size: 14px;
					color: rgba(96, 96, 96, 1);
					// border: 1px solid rgba(232, 232, 232, 1);
					// text-align: center;
					// line-height: 28px;
					// border-radius: 14px;
				}

			}

			.next__item {
				padding: 0 32rpx;
				position: relative;
				display: flex;
				align-items: center;
				line-height: 1.5;
				height: 60px;
				border-bottom: #ccc;
				overflow: hidden;
				// &:nth-child(3n+1) {
				// 	background-color: rgba(230, 245, 255, 1);
				// 	border: 1px solid rgba(172, 205, 227, 1);
				// }

				// &:nth-child(3n+2) {
				// 	background-color: rgba(241, 230, 212, 1);
				// 	border: 1px solid rgba(229, 200, 150, 1);
				// }

				// &:nth-child(3n+3) {
				// 	background-color: rgba(255, 236, 230, 1);
				// 	border: 1px solid rgba(243, 203, 191, 1);
				// }
				.next__item--fix {
					position: absolute;
					left: 32rpx;
					top: -15px;
					margin-top: 30px;
				}

				.next__item--left {
					width: 40px;
				}

				.next__item--right {
					flex: 0 1 auto;
					width: calc(100% - 40px);
					display: flex;
					justify-content: space-between;
					white-space: nowrap;

					.next__right--text {
						font-size: 28rpx;
						overflow: hidden;
						text-overflow: ellipsis;

						text {
							display: block;
						}
					}
				}
			}
		}

		.current {
			position: relative;
			background-color: #fff;
			border-radius: 12px;
			box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.06);
			@include card--padding;

			.text--title {
				color: #a2a2a2;
				font-size: 14px;
				padding-top: 40rpx;
			}

			.unit {
				font-size: 34rpx;
			}

			.text--large {
				font-size: 32rpx;
			}

			.current--month {
				position: absolute;
				width: 100%;
				top: 0;
				left: 0;
				padding: 0 30rpx;
				box-sizing: border-box;
			}
		}
	}
</style>
