<template>
	<view>
		<view class="chart_title">
			<text class="chart_title_tip">共支出{{ notesCount }}笔，合计</text>
			<text class="chart_title_money">
				￥{{ priceTotal }}
			</text>
		</view>
		<text class="expenses">支出对比</text>
		<view class="charts-box">
			<qiun-data-charts :animation="false" type="line" :opts="opts" :chartData="chartData" />
		</view>
		<text class="expenses">支出分类</text>
		<view class="charts-box">
			<qiun-data-charts :animation="false" type="ring" :opts="ringOpts" :chartData="ringData" />
		</view>
		<text class="expenses">支出排行榜</text>
		<view class="card-list">
			<view class="card-item" v-for="(item, index) in computedList" :key="index">
				<uni-icons customPrefix="t-icon" color="#ff9799" :type="handleIcons(item.ICONTYPE).name" size="30">
				</uni-icons>
				<view class="card-item-info">
					<view class="card-item-text">
						<text>{{ item.name }}</text>
						<text>{{ item.price }}
							<text class="text--sm">({{ item.num }}笔)</text>
						</text>
					</view>
					<view class="card-item-pro">
						<progress :percent="item.value" show-info :color="ringOpts.color[index]" />
					</view>
				</view>
			</view>
			<view class="card-item-footer" v-if="list.length>3" @click="showMore">
				<text>展开全部</text>
				<uni-icons color="#999" :type="visible?'top':'bottom'" size="16"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		notesAnalyse,
		notesMonths
	} from '@/api/editor.js'
	import {
		icons_normal,
		icons_line
	} from '@/utils/config.js'
	import moment from '@/utils/moment.js'
	export default {
		name: "out",
		props: {
			date: {
				type: String,
				default: null
			}
		},
		watch: {
			date: {
				handler(newval, oldval) {
					if (newval) {
						this.getMonthData()
						this.getServerData()
					}
				},
				immediate: true
			}
		},
		computed: {
			computedList() {
				if (this.visible) {
					return this.list
				} else {
					return this.list.slice(0, 3)
				}
			}
		},
		data() {
			return {
				priceTotal: 0, // 订单总价格
				notesCount: 0, // 订单总数
				list: [],
				visible: false,
				chartData: {
					categories: [],
					series: [{
						name: '支出'
					}],
				},
				opts: {
					dataLabel: false,
					color: ['#ea6163'],
					padding: [10, 15, 0, 15],
					// enableScroll:true,
					legend: {
						show: false,
					},
					xAxis: {
						disableGrid: true,
						// itemCount: 8,
						labelCount: 8,
						scrollShow: false,
						scrollAlign: 'right',
					},
					yAxis: {
						disabled: true,
						disableGrid: true,
					},
					extra: {
						type: 'curve',
						tooltip: {
							showBox: true,
							bgColor: '#0787ff',
							bgOpacity: 1,
							gridType: 'dash',
							gridColor: '#0787ff',
						},
						column: {
							type: 'group',
							width: 18,
							activeBgColor: '#000000',
							activeBgOpacity: 0.08,
						},
					},
				},
				ringData: {
					series: [],
				},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['ring'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				ringOpts: {
					rotate: false,
					rotateLock: false,
					color: [
						'#ea6163',
						'#1890FF',
						'#91CB74',
						'#FAC858',
						'#EE6666',
						'#73C0DE',
						'#3CA272',
						'#FC8452',
						'#9A60B4',
						'#ea7ccc',
						'#95c137',
						'#31adff',
						'#ffcb70',
						'#c10003',
						'#634d00',
						'#ac92ff',
						'#016657',
						'#309eff',
					],
					padding: [0, 0, 0, 0],
					dataLabel: true,
					legend: {
						show: false,
						position: 'left',
					},
					series: {
						show: false,
					},
					title: {
						name: '',
					},
					subtitle: {
						name: '',
					},
					extra: {
						tooltip: {
							show: false,
						},
						ring: {
							border: false,
							ringWidth: 50,
							activeOpacity: 0.5,
							borderWidth: 0,
							borderColor: '#FFFFFF',
						},
					},
				},
			};
		},
		methods: {
			showMore() {
				this.visible = !this.visible
			},
			handleIcons(type) {
				let icons = [...icons_normal, ...icons_line]
				let res = icons.find((item) => item.id === type)
				return res
			},
			async getMonthData() {
				try {
					let time = moment(this.date).format()
					let beginTime = moment(time).startOf('month').valueOf('x')
					let endTime = moment(time).endOf('month').valueOf('x')
					let parmas = {
						INCOREXP: 0,
						beginTime,
						endTime,
					}
					let result = await notesMonths(parmas)
					if (result.status === 200) {
						let days = []
						let daysSeriesData = []
						let num = moment().daysInMonth() // 31
						for (let i = 1; i <= num; i++) {
							let day = `${moment().month() + 1}-${i < 10 ? '0' + i : i + ''}`
							daysSeriesData.push(0)
							days.push(day)
						}
						result.data.forEach((item) => {
							let index = item.monthDay.split('-')[2] * 1 - 1
							daysSeriesData[index] = Math.round(item.dayTotal * 100) / 100
						})
						this.chartData.categories = days
						this.chartData.series[0].data = daysSeriesData
					}
				} catch (e) {
					console.log(e, '.')
				}
			},
			async getServerData() {
				try {
					let time = moment(this.date).format()
					let beginTime = moment(time).startOf('month').valueOf('x')
					let endTime = moment(time).endOf('month').valueOf('x')
					let parmas = {
						INCOREXP: 0,
						beginTime,
						endTime,
					}
					let result = await notesAnalyse(parmas)
					if (result.status == 200) {
						this.priceTotal = Math.round(result.data.priceTotal * 100) / 100
						this.notesCount = result.data.notesCount
						this.list = result.data.list.map((data) => {
							data.price = Math.round(data.price * 100) / 100
							data.value = Number(
								((data.price / result.data.priceTotal) * 100).toFixed(2)
							)
							data.name = this.handleIcons(data.ICONTYPE).title
							data.labelText = data.name
							return data
						})
						this.initChart()
					}
				} catch (e) {
					console.log(e)
				}
			},
			initChart() {
				let res = {
					series: [{
						data: this.list,
					}, ],
				}
				this.ringData = JSON.parse(JSON.stringify(res))
			},
		}
	}
</script>

<style lang="scss" scoped>
	.chart_title {
		display: flex;
		flex-direction: column;
		padding: 20rpx 0rpx;

		.chart_title_tip {
			color: $uni-color-subtitle;
			font-size: $uni-font-size-base;
			line-height: 2;
		}

		.chart_title_money {
			font-size: $uni-font-size-subtitle;
		}
	}

	.charts-box {
		height: 200px;
		background: $uni-bg-color;
		padding: 10px;
		margin-bottom: 10px;
		border-radius: 12px;
	}

	.expenses {
		display: flex;
		letter-spacing: 0.2px;
		font-size: 16px;
		line-height: 28px;
		margin: 10px 0;
	}

	.card-list {
		background: $uni-bg-color;
		min-height: 200px;
		border-radius: 12px;
		padding: 10px 16px;

		.card-item {
			display: flex;
			padding: 4px 0;
			align-items: center;
			line-height: 30px;
			justify-content: space-between;

			.card-item-left {
				line-height: 48rpx;
				text-align: center;
			}

			.card-item-info {
				flex: 0 1 auto;
				width: calc(100% - 44px);

				.card-item-text {
					display: flex;
					justify-content: space-between;
					font-size: $uni-font-size-base;

					.text--sm {
						color: $uni-text-color-grey;
						font-size: $uni-font-size-base;
					}
				}
			}
		}

		.card-item-footer {
			text-align: center;
			line-height: 2;
			color: $uni-text-color-grey;
		}
	}
</style>
