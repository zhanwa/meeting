<template>
	<view class="my-meeting">
		<uni-card title="Dcloud" note="true">
		    默认内容
		    <template v-slot:footer>
		        <view class="footer-box flex-r">
		            <view>喜欢</view>
		            <view>评论</view>
		            <view>分享</view>
		        </view>
		    </template>
		</uni-card>
	</view>
</template>

<script>
	import uniCard from '../../components/uni-card/uni-card.vue'
	export default {
		components: {uniCard},
		data() {
			return {
				 
			};
		}
	}
</script>

<style lang="less">
.footer-box{
	justify-content: space-between;
}
</style>
