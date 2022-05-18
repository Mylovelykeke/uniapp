<template>
	<view>
		<CustomTitle />
		<view class="content-pad">
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
						<text class="year_money">{{userInfo.ALLMONEY}}</text>
					</view>
					<view class="year-btn">
						<view class="year_bg1"></view>
						<view class="year_bg2"></view>
						<image src="../static/image/wallet.png" class="year-image" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="current">
				<view class="flex current--month">
					<view class="">
						<text
							style="font-size: 80rpx;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{month}}</text>
						<text>月</text>
					</view>
					<view class="" @tap="toMonthInfo">
						分析
					</view>
				</view>
				<view @click="setCurrentPrice">
					<text v-if="accountBookInfo.BUDGET" class="text--title">预算额度: &nbsp;￥{{accountBookInfo.BUDGET}}&nbsp;</text>
					<text v-else class="text--title">设置预算</text>
					<uni-icons type="forward" size="14"></uni-icons>
				</view>
				<view style="margin-top: 10px;">
					<progress show-info :percent="percent" stroke-width="8" active="true" duration="5"
						activeColor="#ff4e4f" />
				</view>
			</view>
			<view class="incOrExp flex">
				<view class="incOrExp_out">
					<view>
						<view class="incOrExp_icon">
							<uni-icons type="pulldown" size="20" color="#fff"></uni-icons>
						</view>
						<text class="text-mg">支出</text>
					</view>
					<view>
						<text>¥</text>
						<text class="text-mg">{{expend}}</text>
					</view>
				</view>
				<view class="incOrExp_inc">
					<view>
						<view class="incOrExp_icon">
							<uni-icons type="pulldown" size="20" color="#fff"></uni-icons>
						</view>
						<text class="text-mg">收入</text>
					</view>
					<view>
						<text>¥</text>
						<text class="text-mg">{{income}}</text>
					</view>
				</view>
			</view>
			<view class="space">
				<text>收支明细</text>
			</view>
		</view>
		<template v-if="Object.keys(timeObj).length">
			<view class="next" v-for="(list,key) in timeObj" :key="key">
				<view class="next__title">
					<text>{{handDays(key)}}</text>
					<text class="out">{{handlePrice(list)}}</text>
				</view>
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
									<view style="color: rgba(138, 138, 138, 1);">{{val.REMARK}}</view>
								</view>
								<text>{{val.INCOREXP == 0?'-':''}}￥{{val.PRICE}}</text>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</template>
		<view style="height: 300px;background-color: #fff;" v-else></view>
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
	import {
		accountBookList
	} from '../api/accountBook.js'
	
	import CustomTitle from '../components/CustomTitle.vue'
	import moment from '../utils/moment.js'
	export default {
		components: {
			CustomTitle
		},
		data() {
			return {
				income: 0, //收入
				expend: 0, //支出
				horizontal: 'right',
				vertical: 'bottom',
				pattern: {
					backgroundColor: '#fff',
					buttonColor: '#fbfbfb',
					iconColor: '#ff4e4f'
				},
				options: [{
					text: '删除',
					style: {
						backgroundColor: 'rgba(255, 97, 97, 1)'
					}
				}],
				timeObj: [],
				userInfo: {},
				accountBookInfo:{}
			}
		},
		computed: {
			percent() {
				let BUDGET = this.accountBookInfo.BUDGET
				if (!BUDGET) {
					return 100
				} else {
					return Math.round((this.expend / BUDGET) * 100)
				}
			},
			month() {
				let m = new Date().getMonth() + 1
				return m
			}
		},
		onShow() {
			this.getUserInfo()
			accountBookList().then(res => {
				this.accountBookInfo = res.data[0] 
				this.getList()
				this.getMonthList()
			})
		},
		methods: {
			toLink() {

			},
			setCurrentPrice() {
				uni.navigateTo({
					url: `/pages/budget/budget?budgetId=${this.accountBookInfo.id}&budget=${this.accountBookInfo.BUDGET}`
				})
			},

			handlePrice(list = []) {
				let total = 0
				list.forEach(item => {
					// 支出
					if (item.INCOREXP === 0) {
						total -= Number(item.PRICE)
					} else {
						// 收入
						// total += Number(item.PRICE)
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
					if(result.status == 200){
						if (Array.isArray(result.data)) {
							this.userInfo = result.data[0]
						}
					}
				} catch (e) {
					console.log(e, '=========>')
				}
			},

			async getMonthList() {
				try {
					let startTime = moment().startOf("month").valueOf('x')
					let endTime = moment().endOf('month').valueOf('x')
					let result = await getNotesList(endTime, startTime)
					if (result.status == 200) {
						let income = 0
						let expend = 0
						result.data.forEach(data => {
							if (data.INCOREXP == 0) {
								expend += data.PRICE
							} else {
								income += data.PRICE
							}
						})
						this.income = Math.round(income * 100) / 100
						this.expend = Math.round(expend * 100) / 100
					}
				} catch (e) {
					console.log(e, '///')
				}
			},

			async getList() {
				try {
					let endTime = moment().endOf('day').valueOf('x')
					let startTime = moment(endTime).subtract(30, 'day').valueOf('x')
					let result = await getNotesList(endTime, startTime)
					if (result.status == 200) {
						let timeObj = {}
						result.data.forEach(item => {
							let date = moment(item.UPDATEDATE).format('YYYY-MM-DD')
							if (timeObj[date]) {
								timeObj[date].push(item)
							} else {
								timeObj[date] = []
								timeObj[date].push(item)
							}
						})
						this.timeObj = timeObj
					}
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
	@mixin card--padding {
		padding: 40rpx 30rpx;
		box-sizing: border-box;
	}

	.out {
		color: #ff4e4f
	}

	.inc {
		color: #46be60;
	}

	.content-pad {
		padding: 10rpx 32rpx;
	}

	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.unit {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 40rpx;
		font-weight: bold;
		// text-shadow: 2px 0px 1px #db8679;
		color: #2e0f0f;
	}

	.text--title {
		color: #d93737;
		line-height: 80rpx;
		height: 80rpx;
	}

	.text--large {
		font-weight: bold;
		font-size: 40rpx;
	}

	.space {
		height: 80rpx;
		font-size: 36rpx;
		line-height: 80rpx;
	}

	.year {
		position: relative;
		background: rgba(255, 224, 226, 1);
		// box-shadow: 0 35px 10px -25px #e79595;
		line-height: 2;
		border-radius: 17px;
		overflow: hidden;
		@include card--padding;

		.year_money {
			margin-left: 5px;
			@extend .unit
		}

		.year-btn {
			.year-image {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 150px;
			}

			.year_bg1 {
				position: absolute;
				width: 237px;
				height: 178px;
				right: -100px;
				top: -18px;
				background-color: #ffc0c3;
				border-radius: 49px;
				/* -webkit-filter: blur(10px); */
				/* filter: blur(10px); */
				-webkit-transform: rotate(30deg);
				transform: rotate(327deg);
			}
		}
	}

	.incOrExp,
	.current {
		margin-top: 30rpx;
	}

	.current {
		position: relative;
		background-color: #fff;
		border-radius: 12px;
		border: 1px solid rgba(243, 243, 243, 1);
		// box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.06);
		padding: 20rpx 30rpx 40rpx;
		box-sizing: border-box;

		.text--title {
			color: #363636;
			font-size: 28rpx;
			// padding-top: 40rpx;
		}
	}

	.incOrExp {
		padding: 8rpx 0rpx;

		.incOrExp_icon {
			display: inline-block;
			width: 24px;
			height: 24px;
			text-align: center;
			border-radius: 50%;
			line-height: 24px;
		}

		.incOrExp_out,
		.incOrExp_inc {
			font-size: 28rpx;
			line-height: 2;
			width: 45%;
			box-sizing: border-box;
			padding: 20rpx 32rpx;
			background: rgba(255, 255, 255, 1);
			border: 1px solid rgba(243, 243, 243, 1);
			border-radius: 12px;

			.text-mg {
				margin-left: 4px;
			}
		}

		.incOrExp_out {
			.incOrExp_icon {
				transform: rotate(45deg);
				background-color: #ff4e4f; //#46be60
			}
		}

		.incOrExp_inc {
			.incOrExp_icon {
				transform: rotate(-135deg);
				background-color: #46be60; //#46be60
			}
		}
	}


	.next {
		background-color: #fff;

		.next__title {
			display: flex;
			padding: 20rpx 32rpx;
			justify-content: space-between;
			background-color: rgba(245, 245, 245, 1.0);
		}

		.next__item {
			position: relative;
			display: flex;
			align-items: center;
			padding: 0 32rpx;
			line-height: 1.5;
			height: 60px;
			font-size: 28rpx;
			overflow: hidden;

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
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					text {
						display: block;
					}
				}
			}
		}
	}
</style>
