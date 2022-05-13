<template>
	<view class="keyboard">
		<view class="keyboard_title">
			<text>完成</text>
		</view>
		<view class="btn" v-for="v in arr" :key="v">
			<view class="btn_key" :class="{focus:v === 'delete'}" @click="onKeyCode(v)">
				<uni-icons v-if="v === 'delete'" type="trash" size="30"></uni-icons>
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
		methods:{
			onKeyCode(value){
				this.$emit('change',value)
			}
		}
	}
</script>

<style lang="scss">
	.keyboard {
		background-color: #e0e0e0;
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
			padding: 2px;

			.btn_key {
				background-color: #fff;
				border-radius: 5px;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
				font-size: 20px;
				overflow: hidden;
				&.focus {
					background-color: #acaeb0;
				}
			}

			
		}
	}
</style>
