<template>
	<view>
		<CustomTitle>
			<template v-slot:right>
				<uni-icons @click="uploadFile" customPrefix="iconfont" type="icon--daoru" size="26" style="margin-right: 20rpx;"
					color="rgb(71 68 68)"></uni-icons>
				<uni-icons customPrefix="iconfont" type="icon-shezhi" size="24" color="#000"
					style="margin-right: 20rpx;"></uni-icons>
			</template>
		</CustomTitle>
	</view>
</template>
<script>
	import CustomTitle from '@/components/CustomTitle.vue'
	export default {
		components: {
			CustomTitle
		},
		data() {
			return {}
		},
		methods:{
			uploadFile(){
				uni.navigateTo({
					url:"/pages/uploadFile/uploadFile"
				})
			}
		}
	}
</script>
<style>

</style>
