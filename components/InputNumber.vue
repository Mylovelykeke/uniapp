<template>
	<view class="keyboard" @click.stop>
		<view class="keyboard_title" @click="confirm()">
			<text>完成</text>
		</view>
		<view class="btn" v-for="v in arr" :key="v">
			<view class="btn_key" :class="{focus:v === 'delete'}" @click.stop="onKeyCode(v)">
				<text v-if="v === 'delete'" class="iconfont icon-delete"></text>
				<text v-else>{{v}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "InputNumber",
		data() {
			return {
				arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', '0', 'delete']
			};
		},
		methods: {
			onKeyCode(value) {
				this.$emit('change', value)
				if (uni.getSystemInfoSync().platform == "android") {
					uni.vibrateShort({
						success: function() {}
					});
				}
			},
			confirm() {
				this.$emit('confirm')
			}
		}
	}
</script>

<style lang="scss">
	.keyboard {
		background-color: #f7f7f7;
		padding-bottom: 10rpx;

		.keyboard_title {
			padding: 20rpx 32rpx;
			display: flex;
			justify-content: flex-end;

			text {
				color: #4b4d50;
			}
		}

		.btn {
			display: inline-block;
			box-sizing: border-box;
			width: 33.3%;
			padding: 0px 1px 2px 1px;

			.btn_key {
				background-color: #fff;
				border-radius: 5px;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				font-size: 24px;

				.iconfont {
					font-size: 28px;
				}

				&.focus {
					background-color: #cbcdcf;
				}

				&:active {
					background-color: #efeff0;
				}
			}


		}
	}
</style>
