<template>
	<view class="content">
		<!-- <view class="card">
			<view class="card__shadow">

			</view>
		</view> -->
		<view class="charts-box">
			<qiun-data-charts type="column" :opts="opts1" :chartData="chartData1" />
		</view>
		<view class="charts-box">
			<qiun-data-charts type="ring" :opts="opts2" :chartData="chartData2" />
		</view>
		<text class="expenses">收支明细</text>
		<view class="card-list">

		</view>
	</view>

</template>
<script>
	export default {
		data() {
			return {
				chartData1: {
					categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
					series: [{
						name: "目标值",
						data: [35, 36, 31, 33, 0, 34]
					}]
				},
				opts1: {
					color: ["#3366ff"],
					padding: [15, 15, 0, 5],
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						disabled: true,
						disableGrid: true
					},
					extra: {
						tooltip: {
							showBox: false
						},
						column: {
							type: "group",
							linearType:"custom",
							customColor:["#1939b7"],
							width: 25,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						}
					}
				},
				chartData2: {},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['ring'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts2: {
					rotate: false,
					rotateLock: false,
					color: ["#ff7245", "#6dc12c", "#309eff"],
					padding: [0, 0, 0, 0],
					dataLabel: true,
					legend: {
						show: true,
						position: "bottom",
						lineHeight: 25
					},
					series: {
						show: false
					},
					title: {
						name: "",
					},
					subtitle: {
						name: "",
					},
					extra: {
						tooltip: {
							show: false
						},
						ring: {
							border: false,
							ringWidth: 40,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							borderWidth: 0,
							borderColor: "#FFFFFF"
						}
					}
				}
			};
		},
		onReady() {
			this.getServerData();
		},
		methods: {
			getServerData() {
				//模拟从服务器获取数据时的延时
				setTimeout(() => {
					//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
					let res = {
						series: [{
							data: [{
								"name": "一班",
								"value": 50
							}, {
								name: "二班",
								value: 10
							}, {
								name: "二班",
								value: 30
							}]
						}]
					};
					this.chartData2 = JSON.parse(JSON.stringify(res));
				}, 500);
			},
		}
	}
</script>
<style lang="scss" scoped>
	.content {

		.card {
			position: relative;
			height: 200px;
			background: rgba(255, 92, 101, 1);
			box-shadow: 0 30px 10px -20px #ccc;
			border-radius: 30px;
		}

		.charts-box {
			height: 220px;
			background: white;
			border-radius: 12px;
			padding: 10px;
			margin-bottom: 10px;
		}

		.expenses {
			display: flex;
			letter-spacing: 0.2px;
			font-size: 16px;
			line-height: 28px;
			margin: 10px 0;
		}

		.card-list {
			height: 150rpx;
			background: white;
			border-radius: 12px;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			padding: 16px 16px 16px 16px;
		}
	}
</style>
