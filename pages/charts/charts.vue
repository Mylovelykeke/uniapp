<template>
	<view>
		<CustomTitle>
			<template v-slot:left>
				<uni-icons type="left" size="20" @click="goback()"></uni-icons>
			</template>
		</CustomTitle>
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
			activeColor="#ea6163"></uni-segmented-control>
		<view class="content">
			<!-- tab 切换显示 -->
			<view v-if="current === 0">
				<view class="chart_switch">
					<picker mode="date" fields="month" :value="month" start="2010-01-01" :end="endDate"
						@change="bindMonthChange">
						<view class="uni-input">
							<text>{{month}}</text>
							<uni-icons type="bottom" size="14" color="#666"></uni-icons>
						</view>
					</picker>
					<view>
						<uni-data-checkbox v-model="value" mode="tag" :multiple="false" :localdata="range">
						</uni-data-checkbox>
					</view>
				</view>
				<view class="tab" v-if="value === 0">
					<OutChart :date="month" />
				</view>
				<view class="tab" v-if="value === 1">
					<InChart :date="month" />
				</view>
			</view>
			<view v-else-if="current === 1">
				<view class="chart_switch">
					<picker mode="date" fields="year" :value="year" start="2010-01-01" :end="endDate"
						@change="bindYearChange">
						<view class="uni-input">
							<text>{{year}}</text>
							<uni-icons type="bottom" size="14" color="#666"></uni-icons>
						</view>
					</picker>
					<view>
						<uni-data-checkbox v-model="value" mode="tag" :multiple="false" :localdata="range">
						</uni-data-checkbox>
					</view>
				</view>
				<view class="tab" v-if="value === 0">
					<YearOutChart :date="year"/>
				</view>
				<view class="tab" v-if="value === 1">
					<YearInChart :date="year"/>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import CustomTitle from '@/components/CustomTitle.vue'
	import OutChart from '@/components/OutChart.vue'
	import InChart from '@/components/InChart.vue'
	import YearOutChart from '@/components/yearOutChart.vue'
	import YearInChart from '@/components/yearInChart.vue'
	import moment from '@/utils/moment.js'
	export default {
		components: {
			CustomTitle,
			OutChart,
			InChart,
			YearOutChart,
			YearInChart
		},
		data() {
			return {
				value: 0,
				current: 0,
				month: '',
				year:'',
				endDate: moment().format('YYYY-MM-DD'),
				items: ['月账单', '年账单'],
				range: [{
						value: 0,
						text: '支出',
					},
					{
						value: 1,
						text: '收入',
					},
				]
			}
		},
		onLoad(options) {
			if (options.type) {
				this.value = Number(options.type)
			}
		},
		created() {
			this.month = moment().format('YYYY-MM')
			this.year = moment().format('YYYY')
		},
		methods: {
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex
					this.value = 0
				}
			},
			goback() {
				uni.navigateBack()
			},

			bindMonthChange: function(e) {
				this.month = e.detail.value
			},
			bindYearChange: function(e) {
				this.year = e.detail.value
			},
		},
	}
</script>
<style lang="scss" scoped>
	.content {
		padding-top: 10px;

		.chart_switch {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.uni-input{
				text{
					margin-right: 6px;
				}
			}
		}
	}
</style>
