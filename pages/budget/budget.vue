<template>
	<view class="content" @click="onClose">
		<CustomTitle>
			<template v-slot:left>
				<uni-icons type="left" size="20" @click="goback()"></uni-icons>
			</template>
		</CustomTitle>
		<!-- 输入框 -->
		<view class="editor__price">
			<text class="editor__text">设置预算</text>
			<view class="editor__input" @click.stop="onInput">
				<text class="editor__unit">￥</text>
				<view class="editor__number">
					<view class="price-tip" v-if="unit">{{unit}}</view>
					<text selectable :class="{'line':focus}">{{price}}</text>
				</view>
				<!-- 默认显示 -->
				<text class="editor_default" v-if="price === ''">0.00</text>
			</view>
		</view>

		<!-- 账本选中 -->
		<view class="editor__footer">
			<view class="editor_btn" :class="{disabled:disabled}" @click="save(false)">确定添加</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<!-- 键盘 -->
			<InputNumber @change="onInputNumer" @confirm="onClose" />
		</uni-popup>
	</view>
</template>

<script>
	import {
		editAccountBook
	} from '../../api/accountBook.js'
	import InputNumber from '../../components/InputNumber.vue'
	import CustomTitle from '@/components/CustomTitle.vue'
	export default {
		components: {
			InputNumber,
			CustomTitle
		},
		computed: {
			disabled() {
				if (Number(this.price)) {
					return false
				} else {
					return true
				}
			},
			unit() {
				let name = ''
				let value = this.price
				switch (true) {
					case value >= 100 && value < 1000:
						name = "百"
						break;
					case value >= 1000 && value < 10000:
						name = "千"
						break;
					case value >= 10000 && value < 100000:
						name = "万"
						break;
					case value >= 100000 && value < 1000000:
						name = "十万"
						break;
					case value >= 1000000 && value < 10000000:
						name = "百万"
						break;
					case value >= 10000000 && value < 100000000:
						name = "千万"
						break;
					case value >= 100000000:
						name = "亿"
						break;
					default:
						name = ""
						break;
				}
				return name
			},
		},
		data() {
			return {
				budgetId: '',
				price: '', //价格
				focus: false,
			};
		},
		onLoad(options) {
			this.budgetId = options.budgetId
			this.price = Number(options.budget) ? options.budget + '' : ''
		},
		mounted() {
			// this.onInput()
		},
		methods: {
			async save() {
				try {
					if (!Number(this.price)) {
						return
					}
					uni.vibrateShort()
					let params = {
						price: this.price,
						budgetId: this.budgetId
					}
					let result = await editAccountBook(params)
					if(result.status == 200){
						uni.navigateBack()
					}
				} catch (e) {

				}
			},
			onInputNumer(value) {
				if (value === "delete") {
					this.onRemove()
					return
				}
				let regex = /^(([1-9]\d{0,8})|0)(\.\d{0,2})?$/
				let newValue = this.price + value
				if (newValue === ".") {
					this.price = "0."
					return
				}
				if (regex.test(newValue)) {
					this.price = newValue
				}
			},

			onRemove() {
				let val = this.price
				if (val !== 'string') {
					val = String(val)
				}
				this.price = val.slice(0, -1)
			},
			onInput() {
				this.focus = true
				this.$refs.popup.open('bottom')
			},
			onClose() {
				this.focus = false
				this.$refs.popup.close('bottom')
			},
			goback() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	$bgcolor:#fff;

	.content {
		padding: 0;
		padding-bottom: 62px;

		.editor__price {
			padding: 20rpx 32rpx;
			margin-bottom: 10px;
			background-color: $bgcolor;

			.editor__input {
				font-family: Arial, Helvetica, sans-serif;
				position: relative;
				display: flex;
				align-items: center;
				font-size: 80rpx;
				font-weight: 600;
				line-height: 1.8;

				.editor__unit {
					width: 40px;
				}

				.editor__number {
					flex: 0 1 auto;
					width: calc(100% - 40px);
					overflow-x: auto;

					.price-tip {
						position: absolute;
						background-color: #919191;
						color: white;
						font-size: 10px;
						padding: 0px 4px;

						&::before {
							content: '';
							position: absolute;
							bottom: -6px;
							left: 5px;
							border: 3px solid transparent;
							border-top: 3px solid #919191;
						}
					}

					@keyframes myCuror {
						from {
							opacity: 1;
						}

						to {
							opacity: 0;
						}
					}

					text {
						position: relative;
						padding-right: 2px;
						white-space: nowrap;

						&.line::after {
							content: '';
							position: absolute;
							top: 50%;
							width: 2px;
							height: 48px;
							transform: translateY(-50%);
							background-color: red;
							animation: myCuror 1s ease infinite;

						}
					}
				}

				.editor_default {
					position: absolute;
					left: 40px;
					width: 200px;
					color: #5f5f5f;
				}
			}
		}

		.editor__footer {
			position: fixed;
			bottom: 0;
			width: 100%;
			padding: 20rpx 32rpx;
			display: flex;
			justify-content: flex-end;
			box-sizing: border-box;
			background-color: #fff;
			border-top: 1px solid #f7f7f7;

			.editor__footer_text {
				display: flex;
				align-items: center;
				color: #ff7245;
				font-size: 14px;
				margin-right: 20px;
			}

			.editor_btn {
				text-align: center;
				line-height: 40px;
				border-radius: 20px;
				width: 120px;
				height: 40px;
				color: #fff;
				background-color: rgba(227, 71, 71, 1.0);

				&:active {
					opacity: 0.6;
				}

				&.disabled {
					opacity: 0.6;
				}
			}
		}
	}
</style>
