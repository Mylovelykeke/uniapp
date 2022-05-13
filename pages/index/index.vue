<template>
	<view class="content">
		<view class="calendar">
			<text>{{title}}</text>
		</view>
		<view class="bill">
			<view class="bill_card">
				<view class="bill_title bill_flex">
					<view class="bill_month">
						<text class="bill_month_num">5</text>
						<text>月</text>
					</view>
					<!-- <text>分析</text> -->
				</view>
				<view class="bill_main bill_flex">
					<view>
						<text>支出100￥</text>
					</view>
					<view class="">
						<text>收入100￥</text>
					</view>
				</view>
				<view class="bill_progress bill_flex">
					<text>预算</text>
					<text>1000</text>
				</view>
			</view>
			<view class="bill_expenses">
				
			</view>
			<InputNumber />
		</view>
	</view>
</template>

<script>
	import InputNumber from '../../components/InputNumber.vue'
	export default {
		components:{
			InputNumber
		},
		data() {
			return {
				title: 'Hello woel2d'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		background-color: #f1f1f1;

	}

	.bill {
		display: flex;
		flex-direction: column;
		margin: 10px 30rpx;
		border-radius: 5px;
		background-color: white;
		// box-shadow: 0rpx 0px 20rpx 10rpx #ccc;

		.bill_card {
			height: 250rpx;
			padding: 10rpx 20rpx;
			border-bottom: 1px solid #ccc;

			.bill_flex {
				display: flex;
				justify-content: space-between;
				flex-direction: row;
			}

			.bill_title {
				position: relative;
				line-height: 48px;

				.bill_month {
					.bill_month_num {
						font-size: 80rpx;
					}
				}
			}
		}



		.bill_expenses {
			height: 1000px;
		}
	}
</style>
