<template>
	<view class="content">
		<!-- <view class="space"> -->
		<text style="font-size: 50rpx;line-height: 2.5;">Hi，王二麻子</text>
		<!-- </view> -->
		<view class="year">
			<view>
				<text>账户总览</text>
			</view>
			<view class="flex text--title">
				<text>总资产</text>
				<text>收支</text>
			</view>
			<view class="flex text--large">
				<view>
					<text class="unit">¥</text>
					<text>5000</text>
				</view>
				<view>
					<text>-500</text>
				</view>
			</view>
		</view>
		<view class="space"></view>
		<view class="current" @tap="toMonthInfo">
			<view class="flex current--month">
				<view class="">
					<text
						style="font-size: 80rpx;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">5</text>
					<text>月</text>
				</view>
				<view class="">
					分析
				</view>
			</view>
			<view class="flex text--title">
				<text>支出</text>
				<text>收入</text>
			</view>
			<view class="flex text--large">
				<view>
					<text class="unit">¥</text>
					<text>5000</text>
				</view>
				<view>
					<text class="unit">¥</text>
					<text>500</text>
				</view>
			</view>
			<view style="margin-top: 10px;">
				<text>设置预算</text>
			</view>
			<view style="margin-top: 20px;">
				<progress percent="10" stroke-width="8" activeColor="rgba(255, 97, 97, 1)" />
			</view>
		</view>
		<view class="space">
			<text>收支明细</text>
		</view>
		<view class="next">
			<view class="next__title">
				<text class="next__history">今天</text>
				<text class="next__more">-500</text>
			</view>
			<!-- <view class="line"></view> -->
			<view class="next__item" v-for="v in 10" :key="v">
				<view class="next__item--left">
					<uni-icons :type="type[v % 3]" size="30" :color="colors[v%3]"></uni-icons>
				</view>
				<view class="next__item--right">
					<view class="next__right--text">
						<text style="font-size: 32rpx;">出行是啥</text>
						<text style="color: rgba(138, 138, 138, 1);">地铁上</text>
					</view>
					<text>-￥500</text>
				</view>
			</view>
		</view>
		<uni-fab ref="fab" :pattern="pattern" :horizontal="horizontal" :vertical="vertical" @fabClick="onClickEditor"/>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				horizontal: 'right',
				vertical: 'bottom',
				pattern: {
					backgroundColor: '#fff',
					buttonColor: '#fbfbfb',
					iconColor: '#ff7245'
				},
				colors: ["#ff7245", "#6dc12c", "#309eff"],
				type: ["vip-filled", 'medal-filled', 'icon-biaozhangbiaoyang']
			}
		},
		created() {


		},
		methods: {
			toMonthInfo() {
				uni.navigateTo({
					url: '/pages/detail/detail'
				})
			},
			onClickEditor(){
				uni.navigateTo({
					url:"/pages/editor/editor"
				})
			}
		}

	}
</script>

<style lang="scss">
	.content {
		padding-top: 0;

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
			background: linear-gradient(135deg, rgba(255, 97, 97, 1) 0%, rgba(227, 43, 43, 1.0) 100%);
			box-shadow: 0 35px 10px -25px #e7b8b8;
			line-height: 2;
			border-radius: 17px;
			color: white;
			@include card--padding;
		}

		.current,
		.next {
			// backdrop-filter: blur(150px); 
			border-radius: 12px;
			// box-shadow: 0px 4px 16px rgba(239, 245, 255, 1);

			.line {
				margin: 0 auto;
				border-top: 1px dashed rgba(204, 204, 204, 1);
				mix-blend-mode: normal;
			}
		}

		.next {
			.next__title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 10px 0;

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
				display: flex;
				align-items: center;
				padding: 10rpx 32rpx;
				margin-bottom: 10px;
				border-radius: 17px;
				background-color: #fff;
				box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.06);

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

				.next__item--left {
					width: 40px;
					height: 60px;
					line-height: 60px;
				}

				.next__item--right {
					flex: 0 1 auto;
					width: calc(100% - 40px);
					display: flex;
					justify-content: space-between;

					.next__right--text {
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
