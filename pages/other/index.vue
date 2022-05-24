<template>
	<view class="content">
		<CustomTitle>
			<template v-slot:right>
				<uni-icons @click="uploadFile" customPrefix="iconfont" type="icon--daoru" size="22"
					style="margin-right: 20rpx;" color="#515151"></uni-icons>
				<uni-icons @click="toSetting" customPrefix="iconfont" type="icon-shezhi" size="22" color="#515151"
					style="margin-right: 20rpx;"></uni-icons>
			</template>
		</CustomTitle>
		<view class="card">
			<view class="card_item" v-for="(item,index) in list" :key="item.id">
				<image class="card_bg"
					src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-08a53f38-d459-49bc-a347-4ba62f188085/c35ff3b4-39ba-4783-815a-1105fac030fe.jpg"
					mode="scaleToFill"></image>
				<view class="card_content">
					<text class="title">{{item.ACCOUNTNAME}}</text>
					<!-- <view class="desc">
						<text>月支出:</text>
						<text>-300</text>
					</view>
					<view class="desc">
						<text>月收入</text>
						<text>300</text>
					</view> -->
				</view>
			</view>
			<view class="card_item add">
				<view class="card_item__icons">
					<uni-icons type="plusempty" size="30"></uni-icons>
				</view>
			</view>
		<!-- 	<view class="card_item">
				<image class="card_bg"
					src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-08a53f38-d459-49bc-a347-4ba62f188085/30fbd22d-82d9-4f9c-9e07-b48245990411.png"
					mode="scaleToFill"></image>
				<view class="card_content">
					<text class="title">日常账本</text>
					<view class="desc">
						<text>月支出:</text>
						<text>-300</text>
					</view>
					<view class="desc">
						<text>月收入</text>
						<text>300</text>
					</view>
				</view>
			</view> -->
		</view>
	</view>
</template>
<script>
	import CustomTitle from '@/components/CustomTitle.vue'
	import {
		accountBookList
	} from '@/api/accountBook.js'
	export default {
		components: {
			CustomTitle
		},
		data() {
			return {
				list: []
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			async getList() {
				try {
					let result = await accountBookList()
					if (result.status == 200) {
						this.list = result.data
					}
				} catch (e) {
					console.log(e)
				}
			},
			uploadFile() {
				uni.navigateTo({
					url: "/pages/uploadFile/uploadFile"
				})
			},
			toSetting(){
				uni.navigateTo({
					url:"/pages/setting/setting"
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.card_item {
		position: relative;
		height: 150px;
		border-radius: 12px;
		background-color: #fff;
		overflow: hidden;
		box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.06);
		margin-bottom: 32rpx;
		.card_item__icons{
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 150px;
		}
		.card_bg {
			width: 100%;
			height: 100%;
			opacity: .8;
			// filter: blur(4px)
		}

		.card_content {
			padding: 32rpx;
			position: absolute;
			bottom: 0;
			line-height: 1.8;
			display: flex;
			flex-direction: column;
			color: white;

			.title {
				font-weight: bold;
				font-size: 40rpx;

			}

			.desc {
				font-size: 28rpx;
			}
		}
	}
</style>
