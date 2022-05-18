<template>
	<view>
		<view class="content">
			<CustomTitle>
				<template v-slot:left>
					<uni-icons type="left" size="20" @click="goback()"></uni-icons>
				</template>
			</CustomTitle>
			<view class="detail_card">
				<view class="detail_radio">
					<text class="t-icon" :class="iconName"></text>
					<text class="detail_title">{{title}}</text>
				</view>
				<view class="detail_unit">
					<text>-</text>
					<text>{{detail.PRICE}}</text>
				</view>
				<view class="balance">
					<!-- <text>余额:8000</text> -->
				</view>
				<view class="list">
					<view class="item">
						<text class="text--default">类别</text>
						<text v-if="detail">{{detail.INCOREXP ==0?'支出':'收入' }}</text>
					</view>
					<view class="item">
						<text class="text--default">账本</text>
						<text>{{detail.NOTESTYPE == 0?'默认账本':''}}</text>
					</view>
					<view class="item">
						<text class="text--default">创建时间</text>
						<!-- <text>{{detail.CREATEDATE}}</text> -->
					</view>
				</view>
				<view class="remark">
					<text class="text--default">备注</text>
					<view style="line-height: 1.5;padding-top: 10rpx;">
						<text>{{detail.REMARK}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		fetchDetail
	} from '../../api/editor.js'
	import {
		icons
	} from '../../utils/config.js'
	import CustomTitle from '@/components/CustomTitle.vue'
	export default {
		components: {
			CustomTitle
		},
		data() {
			return {
				detail: {
					"id": null,
					"PRICE": null,
					"ICONTYPE": null,
					"REMARK": "",
					"NOTESTYPE": null,
					"INCOREXP": null,
					"UPDATEDATE": null,
					"CREATEDATE": null
				}

			};
		},
		computed: {
			iconName() {
				let d = this.detail.ICONTYPE
				if (d) {
					let res = icons.find(item => item.id == d)
					return res.name
				}
				return ''
			},
			title() {
				let d = this.detail.ICONTYPE
				if (d) {
					let res = icons.find(item => item.id == d)
					return res.title
				}
				return ''
			}
		},

		methods: {
			async getDetail(id) {
				try {
					let res = await fetchDetail(id)
					if (res.status == 200) {
						this.detail = res.data[0]
					}
				} catch (e) {
					console.log(e)
				}
			}
		},

		onLoad(options) {
			this.getDetail(options.id)
		},
		
		goback() {
			uni.navigateBack()
		}
	}
</script>

<style lang="scss" scoped>
	.text--default {
		color: #636363;
	}

	.detail_card {
		margin-top: 20px;
		padding-top: 70px;
		position: relative;
		min-height: 300px;
		border-radius: 12px;
		background-color: #fff;

		.balance {
			line-height: 2;
			text-align: center;
			font-size: 14px;
			color: #969696;
		}

		.detail_radio {
			position: absolute;
			top: -20px;
			left: 50%;
			width: 50px;
			height: 50px;
			transform: translateX(-50%);
			text-align: center;

			.t-icon {
				width: 50px;
				height: 50px;
			}

			.detail_title {
				line-height: 1.8;
				white-space: nowrap;
			}

		}

		.detail_unit {
			text-align: center;
			font-size: 50rpx;
			font-weight: bold;
		}

		.list {
			padding: 0px 32rpx;

			.item {
				display: flex;
				justify-content: space-between;
				line-height: 2;
				color: #000;
			}
		}

		.remark {
			padding: 20rpx 32rpx;
		}
	}
</style>
