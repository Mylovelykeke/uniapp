<template>
	<view class="content">
		<!-- 输入框 -->
		<view class="editor__price">
			<text class="editor__text">交易金额</text>
			<view class="editor__input" @click="onInput">
				<text style="margin-right: 2px;">￥</text>
				<view style="overflow-x: auto;">
					<!-- <text>100</text> -->
					<input type="number" :value="value" @focus="onfoucs" @input="onfoucs" @blur="onfoucs" selection-start="0">
				</view>
			</view>
		</view>
		<!--  -->
		<view class="editor__title">
			<text :class="{active:type == 0}" @click="selectType(0)">支出</text>
			<text :class="{active:type == 1}" @click="selectType(1)">收入</text>
		</view>
		<!-- iconfont -->
		<view class="editor__icon">
			<view class="editor__icon--radio" v-for="(val,index) in icons" :key="index" @click="selectIcon(val.name)">
				<!-- <uni-icons  custom-prefix="iconfont"  :type="val.name" size="30" :color="val.name == icon ? '#ff7245':'#5b5b5b'"></uni-icons> -->
				<text class="t-icon" :class="val.name"></text>
				<view>{{val.title}}</view>
			</view>
		</view>

		<!-- 备注 -->
		<view class="editor__remark">

		</view>
		<uni-popup ref="popup" type="bottom">
			<!-- 键盘 -->
			<InputNumber @change="onInputNumer" />
		</uni-popup>
		<!-- 		<uni-transition mode-class="slide-bottom" :show="show">
			<view style="position: fixed; z-index: 999;">
			<InputNumber />
			</view>
		</uni-transition> -->
	</view>
</template>

<script>
	import InputNumber from '../../components/InputNumber.vue'
	export default {
		components: {
			InputNumber
		},
		data() {
			return {
				icon: '',
				value: '',
				type: 0,
				show: false,
				icons: [{
						name: 't-icon-canyinzhekou',
						title: '餐饮'
					},
					{
						name: 't-icon-didichuhang',
						title: '出行'
					},
					{
						name: 't-icon-hongbao',
						title: '红包'
					},
					{
						name: 't-icon-fangdai',
						title: '房租房贷'
					},
					{
						name: 't-icon-yule',
						title: '休闲娱乐'
					},
					{
						name: 't-icon-yiliaoxiang',
						title: '医疗保健'
					},
					{
						name: 't-icon-jiaofei',
						title: '充值缴费'
					},
					{
						name: 't-icon--jiaoyu',
						title: '文体教育'
					},
					{
						name: 't-icon-yifu',
						title: '服饰'
					},
					{
						name: 't-icon-huazhuangpin-kouhongchuncai-cosmetics',
						title: '化妆品'
					},
					{
						name: 't-icon-yanjiemao',
						title: '眼睫毛'
					},
					{
						name: 't-icon-meitong',
						title: '美瞳'
					},
					{
						name: 't-icon-a-cuxiaozhekou',
						title: '餐饮'
					},
					{
						name: 't-icon-a-cuxiaozhekou',
						title: '餐饮'
					},
					{
						name: 't-icon-a-biaozhubiaoji',
						title: '其他'
					},
				]
			};
		},
		methods: {
			onInputNumer(value) {
				this.value += value
			},
			onfoucs() {
				uni.hideKeyboard()
			},
			selectIcon(name) {
				this.icon = name
			},
			selectType(type) {
				this.type = type
			},
			onInput() {
				uni.hideKeyboard()
				this.$refs.popup.open('bottom')
			}
		}
	}
</script>

<style lang="scss">
	$bgcolor:#fff;

	.content {
		padding: 0;

		.editor__price {
			padding: 20rpx 32rpx;
			margin-bottom: 10px;
			background-color: $bgcolor;

			.editor__text {
				line-height: 2;
			}

			.editor__input {
				font-family: Arial, Helvetica, sans-serif;
				display: flex;
				font-size: 80rpx;
				font-weight: 600;
				line-height: 1.8;

				input {
					height: 100%;
					font-size: 80rpx;
				}
			}
		}

		.editor__title {
			background-color: $bgcolor;
			padding: 10rpx 32rpx;
			margin-bottom: 2px;

			text {
				display: inline-block;
				width: 100rpx;
				text-align: center;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 20px;
				background-color: #efefef;
				margin-right: 6px;
				font-size: 14px;
				color: #5f5f5f;

				&.active {
					background-color: #fbeaea;
					color: #ff7245;
				}
			}
		}

		.editor__icon {
			background-color: $bgcolor;
			padding: 32rpx 0;

			.editor__icon--radio {
				display: inline-block;
				font-size: 12px;
				padding: 10px 0;
				width: 20%;
				text-align: center;
			}
		}
	}
</style>
