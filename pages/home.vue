<template>
	<view id="content">
		<CustomTitle>
			<template v-slot:right>
				<uni-icons customPrefix="iconfont" type="icon-sousuo1" size="22" style="margin-right: 20rpx;"
					color="#515151"></uni-icons>
				<uni-icons @click="showCalendar" customPrefix="iconfont" type="icon-yonghuzhongxinicon09" size="22"
					color="#515151" style="margin-right: 20rpx;"></uni-icons>
			</template>
		</CustomTitle>
		<view class="content-pad">
			<view class="year" @click="toLink">
				<view>
					<text>账户总览</text>
				</view>
				<view class="flex text--title">
					<text>总资产</text>
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
				<view class="flex">
					<view class="">
						<text
							style="font-size: 80rpx;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{month}}</text>
						<text>月</text>
					</view>
				</view>
				<view @click="setCurrentPrice">
					<text v-if="accountBookInfo.BUDGET" class="text--title">预算额度: ￥{{accountBookInfo.BUDGET}}</text>
					<text v-else class="text--title">设置预算</text>
					<uni-icons type="forward" size="14"></uni-icons>
				</view>
				<view style="margin-top: 10px;">
					<progress show-info :percent="percent" stroke-width="8" active="true" duration="5"
						activeColor="#ff4e4f" />
				</view>
			</view>
			<view class="incOrExp flex">
				<view class="incOrExp_out" @tap="toMonthInfo(0)">
					<view>
						<view class="incOrExp_icon">
							<uni-icons type="pulldown" size="20" color="#fff"></uni-icons>
						</view>
						<text class="text-mg">本月支出</text>
					</view>
					<view>
						<text>¥</text>
						<text class="text-mg">{{outPrice}}</text>
					</view>
				</view>
				<view class="incOrExp_inc" @tap="toMonthInfo(1)">
					<view>
						<view class="incOrExp_icon">
							<uni-icons type="pulldown" size="20" color="#fff"></uni-icons>
						</view>
						<text class="text-mg">本月收入</text>
					</view>
					<view>
						<text>¥</text>
						<text class="text-mg">{{incPrice}}</text>
					</view>
				</view>
			</view>
			<view class="space">
				<text>收支明细</text>
			</view>
		</view>
		<template v-if="notesList.length">
			<view class="next" v-for="(val,index) in notesList" :key="val.date">
				<view class="next__title">
					<text>{{handDays(val.date)}}</text>
					<text class="out" v-if="val.total">{{'-'+val.total}}</text>
				</view>
				<uni-swipe-action>
					<uni-swipe-action-item :right-options="options" v-for="(val,index) in val.list" :key="val.id"
						style="border-top: 1px solid #eee;" @click="onClickRemove(val)">
						<view class="next__item" @click="onClickDetail(val)">
							<view class="next__item--fix">
								<uni-icons customPrefix="t-icon iconfont" color="#ff9799"
									:type="handleIcons(val.ICONTYPE).name" size="30">
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
			<uni-load-more :status="status"></uni-load-more>
		</template>
		<view style="height: 300px;background-color: #fff;" v-else></view>
		<uni-fab ref="fab" :pattern="pattern" :horizontal="horizontal" :vertical="vertical" @fabClick="onClickEditor" />
		<uni-popup ref="popup" type="top">
			<view class="calendar-space"></view>
			<uni-calendar startDate="2010-01-01" :endDate="endDate" :insert="true" :selected="selected"
				@monthSwitch="monthSwitch" />
		</uni-popup>
	</view>
</template>

<script>
	import {
		getNotesList,
		deleteNote,
		monthTotal,
		notePrice,
		notesMonths
	} from '../api/editor.js'
	import {
		icons_normal,
		icons_line
	} from '../utils/config.js'
	import {
		UserInfo
	} from '../api/user.js'
	import {
		accountBook
	} from '../api/accountBook.js'

	import CustomTitle from '../components/CustomTitle.vue'
	import moment from '../utils/moment.js'
	export default {
		components: {
			CustomTitle
		},
		data() {
			return {
				status: 'more',
				incPrice: 0, //收入
				outPrice: 0, //支出
				selected: [],
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
				notesList: [],
				userInfo: {},
				accountBookInfo: {},
				form: {
					page: 1,
					limit: 20,
				},
				listTotal: 0
			}
		},
		computed: {
			percent() {
				let BUDGET = this.accountBookInfo.BUDGET
				if (!BUDGET) {
					return 100
				} else {
					return ((this.outPrice / BUDGET) * 100).toFixed(2)
				}
			},
			month() {
				let m = new Date().getMonth() + 1
				return m
			},
			endDate() {
				return moment().format('YYYY-MM-DD')
			}
		},
		onShow() {
			// #ifdef APP-PLUS
			this.getUserInfo()
			accountBook().then(res => {
				this.accountBookInfo = res.data[0]
				this.form.page = 1
				this.getList()
				this.getMonthTotal()
			}).catch(e => {
				console.log(e)
			})
			// #endif
		},

		onReachBottom() {
			this.loadMore()
		},
		methods: {
			toLink() {

			},

			loadMore() {
				if (this.notesList.length >= this.listTotal) {
					return
				}
				this.form.page++
				this.getList()
			},

			setCurrentPrice() {
				uni.navigateTo({
					url: `/pages/budget/budget?budgetId=${this.accountBookInfo.id}&budget=${this.accountBookInfo.BUDGET}`
				})
			},

			async handlePrice(time) {
				let price = 0
				let startTime = moment(time).startOf("day").valueOf('x')
				let endTime = moment(time).endOf('day').valueOf('x')
				try {
					let result = await notePrice(startTime, endTime)
					if (result.status == 200) {
						price = Math.round((result.data[0].outPrice || 0) * 100) / 100
					}
					return price
				} catch (e) {
					console.log(e)
				}
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
				let icons = [...icons_normal, ...icons_line]
				let res = icons.find(item => item.id === type)
				return res
			},

			async getUserInfo() {
				try {
					let result = await UserInfo()
					if (result.status == 200) {
						if (Array.isArray(result.data)) {
							this.userInfo = result.data[0]
						}
					}
				} catch (e) {
					console.log(e, '=========>')
				}
			},

			async getMonthTotal() {
				try {
					let startTime = moment().startOf("month").valueOf('x')
					let endTime = moment().endOf('month').valueOf('x')
					let result = await monthTotal(startTime, endTime)
					if (result.status == 200) {
						let data = result.data[0]
						let outPrice = Math.round((data.outPrice || 0) * 100) / 100
						let incPrice = Math.round((data.incPrice || 0) * 100) / 100
						this.incPrice = incPrice
						this.outPrice = outPrice
					}
				} catch (e) {
					console.log(e, '///')
				}
			},

			async getList() {
				try {
					this.status = 'loading'
					let form = this.form
					let notesList = this.notesList
					if (form.page == 1) {
						notesList = []
					}
					let result = await getNotesList(form)
					if (result.status == 200) {
						let arr = result.data.list
						arr.forEach(async item => {
							let date = moment(item.UPDATEDATE).format('YYYY-MM-DD')
							let index = notesList.findIndex(res => res.date === date)
							if (index >= 0) {
								notesList[index].list.push(item)
							} else {
								let res = {
									date,
									list: [item],
									total: 0
								}
								notesList.push(res)
								try {
									res.total = await this.handlePrice(date)
								} catch (e) {
									console.log(e)
								}
							}
						})
						this.listTotal = result.data.total
						this.notesList = notesList
						if (this.listTotal <= (form.page * form.limit + form.limit)) {
							this.status = 'noMore'
						} else {
							this.status = 'more'
						}
					}
				} catch (e) {
					console.log(e, '///')
				}
			},

			toMonthInfo(type) {
				uni.navigateTo({
					url: '/pages/charts/charts?type=' + type
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
					await this.getMonthTotal()
					this.form.page = 1
					await this.getList()
				} catch (e) {
					console.log(e)
				}
			},
			onClickDetail(val) {
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + val.id
				})
			},
			showCalendar() {
				this.monthSwitch()
				this.$refs.popup.open('top')
			},
			monthSwitch(e) {
				let time = moment().format();
				if (e) {
					let T = `${e.year}-${e.month < 10 ? '0' + e.month:e.month}`
					time = moment(T).format()

				}
				let beginTime = moment(time).startOf("month").valueOf('x')
				let endTime = moment(time).endOf('month').valueOf('x')
				let parmas = {
					INCOREXP: 0,
					beginTime,
					endTime
				}
				this.getMonthData(parmas)
			},

			async getMonthData(params) {
				try {
					let result = await notesMonths(params)
					if (result.status == 200) {
						this.selected = result.data.map(data => {
							data.date = data.monthDay
							data.info = '-' + data.dayTotal
							return data
						})
					}
				} catch (e) {
					console.log(e)
				}
			}
		}

	}
</script>

<style lang="scss">
	@mixin card--padding {
		padding: 40rpx 30rpx;
		box-sizing: border-box;
	}CC

	.out {
		color: $uni-color-error
	}

	.inc {
		color: $uni-color-success;
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
		color: $uni-text-color;
	}

	.text--title {
		color: $uni-color-error;
		line-height: 80rpx;
		height: 80rpx;
	}

	.text--large {
		font-weight: bold;
		font-size: 40rpx;
	}

	.space {
		height: 60rpx;
		font-size: $uni-font-size-lg;
		line-height: 60rpx;
	}

	.year {
		position: relative;
		background: $uni-card-color;
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
				background-color: $uni-card-color-grey;
				border-radius: 49px;
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
		background-color: $uni-bg-color;
		border-radius: 12px;
		border: 1px solid $uni-border-color;
		padding: 20rpx 30rpx 40rpx;
		box-sizing: border-box;
		.text--title {
			color: $uni-text-color;
			font-size: $uni-font-size-base;
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
			font-size: $uni-font-size-base;
			line-height: 2;
			width: 45%;
			box-sizing: border-box;
			padding: 20rpx 32rpx;
			background: $uni-bg-color;
			border: 1px solid $uni-border-color;
			border-radius: 12px;

			.text-mg {
				margin-left: 4px;
			}
		}

		.incOrExp_out {
			.incOrExp_icon {
				transform: rotate(45deg);
				background-color: $uni-color-error;
			}
		}

		.incOrExp_inc {
			.incOrExp_icon {
				transform: rotate(-135deg);
				background-color: $uni-color-success; 
			}
		}
	}


	.next {
		background-color: $uni-bg-color;

		.next__title {
			display: flex;
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			padding: 10rpx 32rpx 20rpx;
			justify-content: space-between;
			background-color: $uni-bg-color-grey;
			.out{
				color: $uni-text-color-error;
			}
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

	.calendar-space {
		background-color: $uni-bg-color;
		height: var(--status-bar-height);
	}
</style>
