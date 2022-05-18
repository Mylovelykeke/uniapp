<script>
	import {
		closeDB
	} from './api/sqlite/sqlite.js'
	export default {
		onLaunch:function() {
		},
		onShow: function() {
			console.log('App Show')
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

<style>
	@import "@/static/font/iconfont.css";
	@import "@/static/font/iconfont-weapp-icon.css";

	/*每个页面公共css */
	@font-face {
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}

	page {
		background: rgba(245, 245, 245, 1.0);
	}

	.content {
		padding: 32rpx;
		box-sizing: border-box;
	}
</style>
