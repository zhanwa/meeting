<template>
	<view class="append-meeting">
		<viwe class="append">参与会议</viwe>
		<uni-grid :column="3" borderColor="#06931c" @change='change' class="grid">
			<uni-grid-item :index='1' style="text-align: center;">
				<image src="../../static/Homehomepagemenu.png" mode=""></image>
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
				<text class="text">文件</text>
			</uni-grid-item>
			<uni-grid-item :index='6'>
				<text class="text">待开发</text>
			</uni-grid-item>
		</uni-grid>
		<zy-grid :col="col" :gridList="gridList"></zy-grid>
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import zyGrid from '@/components/zy-grid/zy-grid.vue'
	export default {
		components: {
			uniGrid,
			uniGridItem,
			zyGrid
		},
		data() {
			return {
				m_id : '',
				// 用户角色
				role:'',
				col:3,
				gridList:[{
					imgUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
					name:'签到',
					tips:'1'
				},{
					imgUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
					name:'choujaing',
					tips:'1'
				},{
					imgUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
					name:'签到',
					tips:'1'
				},
				{
					imgUrl:'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
					name:'签到',
					tips:'1'
				}]
			}
		},
		methods: {
			change(e) {
				console.log(e.detail.index);
				if (e.detail.index == 3) {
					uni.navigateTo({
						url: '../chat/chat?m_id=' + this.m_id+'&role='+this.role
					})
				} else if (e.detail.index == 4) {
					if(this.role == 'manage'){
						uni.navigateTo({
							url: '../lottery/lottery?m_id=' + this.m_id+'&role='+this.role
						})
					}else{
						uni.navigateTo({
							url: '../lottery_append/lottery_append?m_id=' + this.m_id+'&role='+this.role
						})
					}
				} else if(e.detail.index==1){
					uni.navigateTo({
						url: '../sign_in/sign_in?m_id=' + this.m_id+'&role='+this.role
						
					});
				} else if(e.detail.index == 2){
					if(this.role == 'manage'){
						uni.navigateTo({
							url: '../vote_manage/vote_manage?m_id=' + this.m_id+'&role='+this.role
						})
					}else{
						uni.navigateTo({
							url: '../vote_attend/vote_attend?m_id=' + this.m_id+'&role='+this.role+'&type=vote'
						})
					}
					
				}else if(e.detail.index == 5){
					uni.navigateTo({
						url: '../file/file?m_id=' + this.m_id+'&role='+this.role
					})
				}
			}
		},
		beforeDestroy() {
			this.$Socket.nsend(JSON.stringify({type:'out_meeting',mid:this.m_id}))
		},
		onLoad(option) {
			console.log(option.m_id,option.role);
			this.m_id = option.m_id;
			this.role = option.role;
		}
	}
</script>

<style lang="less" scoped>
</style>
