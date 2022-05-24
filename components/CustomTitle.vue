<template>
	<view class="">
		<view class="custom_Bar">
			<view class="custom_default" :style="{'background':bgColor}"></view>
			<uni-nav-bar :backgroundColor="bgColor" :title="title" rightWidth="140rpx">
				<template v-slot:left>
					<slot name="left"></slot>
				</template>
				<template v-slot:right>
					<slot name="right"></slot>
				</template>
			</uni-nav-bar>
		</view>
		<view>
			<view class="custom_default"></view>
			<view style="height: 44px;"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				default: "生活笔记"
			},
			rightIcon: {
				default: ""
			},
			bgColor: {
				default: "rgba(245, 245, 245, 1.0)"
			}
		},
		data() {
			return {
				customBar: 0,
			};
		}
	}
</script>

<style lang="scss" scoped>
	.custom_Bar {
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
		z-index: 1;
	}
	
	.custom_default {
		height: var(--status-bar-height);
	}
</style>
