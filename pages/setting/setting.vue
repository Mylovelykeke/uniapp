<template>
	<view>
		<CustomTitle>
			<template v-slot:left>
				<uni-icons type="left" size="20" @click="goback()"></uni-icons>
			</template>
		</CustomTitle>
		<view class="content">
			<view class="card">
				<view class="card_item">
					<text>版本信息</text>
					<uni-icons type="right" size="20"></uni-icons>
				</view>
				<view class="card_item">
					<text>隐私政策</text>
					<uni-icons type="right" size="20"></uni-icons>
				</view>
				<view class="card_item">
					<text>用户条款</text>
					<uni-icons type="right" size="20"></uni-icons>
				</view>
			</view>
			<view class="card">
				<view class="card_item">
					<text>意见反馈</text>
					<uni-icons type="right" size="20"></uni-icons>
				</view>
				<view class="card_item">
					<text>联系我们</text>
					<uni-icons type="right" size="20"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomTitle from '@/components/CustomTitle.vue'
	export default {
		components: {
			CustomTitle
		},
		data() {
			return {

			};
		},
		methods: {
			goback() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		background-color: #fff;
		border-radius: 8px;
		margin-bottom: 10px;
	}

	.card_item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 120rpx;
		padding: 0 32rpx;

		&:active {
			background-color: #d9d9d9;
			transition: .3s all ease;
		}
	}
</style>
