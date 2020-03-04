<script>
	export default {
		// 这些是应用的生命周期函数
		// 当app初始化完成时触发
		onLaunch: function() {
			console.log('App Launch')
		},
		// 当app启动或有后台进入前台时启动
		onShow: function() {
			console.log('App Show')
		},
		// 当app有前台进入后台启动
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
.flex-r{
	display: flex;
}
.flex-c{
	display: flex;
	flex-direction: column;
}
</style>
