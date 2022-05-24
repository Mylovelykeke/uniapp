<script>
	import {
		openComDB,
		closeDB,
		options
	} from './api/sqlite/sqlite.js'
	export default {
		onLaunch: function() {
			console.log('app lauch')
		},
		onShow: async function() {
			// #ifdef APP-PLUS
			try {
				let boolean = plus.sqlite.isOpenDatabase(options);
				if (!boolean) {
					await openComDB()
				}
			} catch {}
			// #endif
		},
		onHide: function() {
			// #ifdef APP-PLUS
			try {
				closeDB()
			} catch {}
			// #endif
			console.log('App Hide')
		}
	}
</script>

<style lang="scss" >
	@import "@/static/font/iconfont.css";
	@import "@/static/font/iconfont-weapp-icon.css";

	/*每个页面公共css */
	@font-face {
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}

	page {
		background: $uni-bg-color-grey;
	}
	.content {
		padding: 32rpx;
		box-sizing: border-box;
	}
</style>
