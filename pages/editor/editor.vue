<template>
	<view class="content" @click="onClose">
		<CustomTitle>
			<template v-slot:left>
				<uni-icons type="left" size="20" @click="goback()"></uni-icons>
			</template>
		</CustomTitle>
		<!-- 输入框 -->
		<view class="editor__price">
			<text class="editor__text">交易金额</text>
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
		<!--  -->
		<view class="editor__title">
			<text :class="{active:incOrExp == 0}" @click="selectType(0)">支出</text>
			<text :class="{active:incOrExp == 1}" @click="selectType(1)">收入</text>
		</view>
		<!-- iconfont -->
		<swiper :indicator-dots="true" indicator-active-color="#a3a3a3" style="height: 260px;background-color: #fff;">
			<swiper-item>
				<view class="editor__icon">
					<view class="editor__icon--radio" v-for="(val,index) in iconsObject.icon" :key="index"
						@click="selectIcon(val.id)" :class="{active:val.id == iconType}">
						<!-- <uni-icons  custom-prefix="iconfont"  :type="val.name" size="30" :color="val.name == icon ? '#ff7245':'#5b5b5b'"></uni-icons> -->
						<text class="t-icon" :class="[{'active':val.id == iconType},val.name]"></text>
						<view>{{val.title}}</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="editor__icon">
					<view class="editor__icon--radio" v-for="(val,index) in iconsObject.lineIcon" :key="index"
						@click="selectIcon(val.id)" :class="{active:val.id == iconType}">
						<!-- <uni-icons  custom-prefix="iconfont"  :type="val.name" size="30" :color="val.name == icon ? '#ff7245':'#5b5b5b'"></uni-icons> -->
						<text class="iconfont" style="font-size: 33px;color: #ff9799;" :class="[{'active':val.id == iconType},val.name]"></text>
						<view>{{val.title}}</view>
					</view>
				</view>
			</swiper-item>
		</swiper>

		<!-- 备注 -->
		<view class="editor__remark">
			<text class="editor__text">备注</text>
			<textarea v-model="remark" placeholder="写点什么..." cols="30" rows="10"></textarea>
			<view v-for="(val,index) in tempFilePaths" :key="index" class="editor__remark_extra">
				<view @click="previewImage(index)">
					<uni-icons type="images" size="20"></uni-icons>
					<text>&nbsp;&nbsp;附件{{index + 1}}</text>
				</view>
				<uni-icons type="close" size="24" @click="removeImage(index)"></uni-icons>
			</view>
		</view>
		<!-- 时间选中 -->
		<view>
			<uni-datetime-picker return-type="timestamp" v-model="time" type="date" :end="endTime" :border="false" />
		</view>

		<!-- 账本选中 -->
		<view class="editor__footer">
			<view class="editor__footer_text" @click="selectImage">
				<uni-icons type="images" size="24" color="#ff4e4f"></uni-icons>
				<text>图片</text>
			</view>
			<view class="editor__footer_text" style="color: #000;" @click="save(true)">
				<text>再记一笔</text>
			</view>
			<view class="editor_btn" :class="{disabled:disabled}" @click="save(false)">确定添加</view>
		</view>
		<uni-popup ref="popup" type="bottom" :maskShow="false">
			<!-- 键盘 -->
			<InputNumber @change="onInputNumer" @confirm="onClose" />
		</uni-popup>
	</view>
</template>

<script>
	import InputNumber from '../../components/InputNumber.vue'
	import {
		editorToAdd,
		getNotesList
	} from '../../api/editor.js'
	import {
		icons_normal,
		icons_line
	} from '../../utils/config.js'
	import moment from '../../utils/moment.js'
	import CustomTitle from '@/components/CustomTitle.vue'
	export default {
		components: {
			InputNumber,
			CustomTitle
		},
		computed: {
			endTime() {
				return moment().valueOf('x')
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
			disabled() {
				if (Number(this.price)) {
					return false
				} else {
					return true
				}
			}
		},
		data() {
			return {
				iconType: '', //图标
				price: '', //价格
				incOrExp: 0, //支出或收入
				remark: '',
				notesType: 0,
				time: new Date().getTime(),
				focus: false,
				iconsObject: {
					icon:icons_normal,
					lineIcon:icons_line
				},
				tempFilePaths: []

			};
		},
		mounted() {

			// uniCloud.database()
		},
		methods: {
			save(flag) {
				if (!Number(this.price)) {
					return
				}
				if (uni.getSystemInfoSync().platform == "android") {
					uni.vibrateShort()
				}
				let timestamp = this.time
				if (!this.time) {
					timestamp = new Date().getTime()
				}
				let params = {
					price: this.price,
					iconType: this.iconType,
					remark: this.remark,
					notesType: this.notesType,
					incOrExp: this.incOrExp,
					updateDate: timestamp
				}
				editorToAdd(params).then(res => {
					// 再记一笔
					if (flag) {
						uni.showToast({
							title: '再记一笔！',
							icon: 'none',
							duration: 2000
						});
						Object.assign(this.$data, this.$options.data())
					} else {
						uni.navigateBack()
					}
				}).catch((e) => {
					console.log(e, '=============>')
				})
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
			selectIcon(name) {
				this.iconType = name
			},
			selectType(type) {
				this.incOrExp = type
			},
			onInput() {
				this.focus = true
				this.$refs.popup.open('bottom')
			},
			onClose() {
				this.focus = false
				this.$refs.popup.close('bottom')
			},
			// 获取上传状态
			selectImage() {
				let that = this;
				let count = 3 - this.tempFilePaths.length
				if (!count) {
					return
				}
				uni.chooseImage({
					count,
					sizeType: ['compressed'],
					success(res) {
						that.tempFilePaths.push(...res.tempFilePaths)
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			removeImage(index) {
				this.tempFilePaths.splice(index, 1)
			},
			previewImage(idx) {
				uni.previewImage({
					current: idx,
					urls: this.tempFilePaths
				});
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

		.editor__text {
			line-height: 2;
			color: #3f3f3f;
		}

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

		.editor__title {
			background-color: $bgcolor;
			padding: 10rpx 32rpx;
			margin-bottom: 1px;

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
					color: #ff7245 !important;
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
				border-radius: 5px;
				text-align: center;

				&.active {
					background-color: #fbeaea;
					color: #ff7245;
				}
			}
		}

		.editor__remark {
			background-color: #fff;
			margin: 1px 0;
			padding: 20rpx 32rpx;
			box-sizing: border-box;

			textarea {
				width: 100%;
				height: 100px;
			}

			.editor__remark_extra {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				align-items: center;
				line-height: 1.8;
			}
		}

		.select_file {
			// width: 40px;
			// height: 40px;
			background-color: #fff;
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
