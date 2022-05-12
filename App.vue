<script>
	export default {
		onLaunch: function() {
			uni.hideTabBar()
			// console.log('App Launch');
			// //app启动时打开启动广告页
			// var w = plus.webview.open(
			// 	'hybrid/html/advertise/advertise.html',
			// 	'本地地址',
			// 	{ top: 0, bottom: 0, zindex: 999 },
			// 	'fade-in',
			// 	500
			// );
			// //设置定时器，4s后关闭启动广告页
			// setTimeout(function() {
			// 	plus.webview.close(w);
			// }, 4000);
		},
		onLoad:function() {
			uni.hideTabBar()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "@/static/font/iconfont.css";
	/*每个页面公共css */
	@font-face {
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}

	page {
		background: rgba(240, 242, 245, 1);
	}

	.content {
		padding: 32rpx;
		box-sizing: border-box;
	}
</style>
