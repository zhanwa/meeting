<template>
	<view class="append-meeting">
		<viwe class="append">参与会议</viwe>
		<uni-grid :column="3" borderColor="#888888" @change='change' class="grid">
			<uni-grid-item :index='1'>
				<text class="text">签到</text>
			</uni-grid-item>
			<uni-grid-item :index='2'>
				<text class="text">投票</text>
			</uni-grid-item>
			<uni-grid-item :index='3'>
				<text class="text">弹幕</text>
			</uni-grid-item>
			<uni-grid-item :index='4'>
				<text class="text">抽奖</text>
			</uni-grid-item>
			<uni-grid-item :index='5'>
				<text class="text">待开发</text>
			</uni-grid-item>
			<uni-grid-item :index='6'>
				<text class="text">待开发</text>
			</uni-grid-item>
		</uni-grid>

	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	export default {
		components: {
			uniGrid,
			uniGridItem
		},
		data() {
			return {
				m_id : ''
			}
		},
		methods: {
			change(e) {
				console.log(e.detail.index);
				if (e.detail.index == 3) {
					uni.navigateTo({
						url: '../chat/chat?m_id=' + this.m_id
					})
				} else if (e.detail.index == 4) {
					uni.navigateTo({
						url: '../lottery/lottery?m_id=' + this.m_id
					})
				} else if(e.detail.index==1){
					uni.navigateTo({
						url: '../sign_in/sign_in?m_id=' + this.m_id,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
			}
		},
		onLoad(option) {
			console.log(option.m_id);
			this.m_id = option.m_id
		}
	}
</script>

<style lang="less" scoped>
</style>
