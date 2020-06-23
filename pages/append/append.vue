<template>
	<view class="append-meeting">
		<view class="cu-item" style="text-align: center; font-size: 60rpx;">
			会议功能
		</view>
		<uni-grid :column="2" borderColor="#06931c" @change='change' class="grid">
			<uni-grid-item :index='1' style="text-align: center;">
				<image src="../../static/icon_uwd04cnvuf/qiandao.png" mode=""></image>
				<text class="text">签到</text>
			</uni-grid-item>
			<uni-grid-item :index='2'>
				<image src="../../static/icon_uwd04cnvuf/toupiao.png" mode=""></image>
				<text class="text">投票</text>
			</uni-grid-item>
			<uni-grid-item :index='3'>
				<image src="../../static/icon_uwd04cnvuf/liaotian.png" mode=""></image>
				<text class="text">弹幕</text>
			</uni-grid-item>
			<uni-grid-item :index='4'>
				<image src="../../static/icon_uwd04cnvuf/choujiang.png" mode=""></image>
				<text class="text">抽奖</text>
			</uni-grid-item>
			<uni-grid-item :index='5'>
				<image src="../../static/icon_uwd04cnvuf/wenjian.png" mode=""></image>
				<text class="text">文件</text>
			</uni-grid-item>
			<uni-grid-item :index='6'>
				<image src="../../static/icon_uwd04cnvuf/gonggao.png" mode=""></image>
				<text class="text">公告</text>
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
				m_id: '',
				// 用户角色
				role: '',
				col: 3,
				m_obj: {}, //会议详情
			}
		},
		methods: {
			change(e) {
				console.log(e.detail.index);
				if (e.detail.index == 3) {
					uni.navigateTo({
						url: '../chat/chat?m_id=' + this.m_id + '&role=' + this.role+'&type=danmu'
					})
				} else if (e.detail.index == 4) {
					if (this.role == 'manage') {
						uni.navigateTo({
							url: '../lottery/lottery?m_id=' + this.m_id + '&role=' + this.role
						})
					} else {
						uni.navigateTo({
							url: '../lottery_append/lottery_append?m_id=' + this.m_id + '&role=' + this.role
						})
					}
				} else if (e.detail.index == 1) {
					uni.navigateTo({
						url: '../sign_in/sign_in?m_id=' + this.m_id + '&role=' + this.role

					});
				} else if (e.detail.index == 2) {
					if (this.role == 'manage') {
						uni.navigateTo({
							url: '../vote_manage/vote_manage?m_id=' + this.m_id + '&role=' + this.role
						})
					} else {
						uni.navigateTo({
							url: '../vote_attend/vote_attend?m_id=' + this.m_id + '&role=' + this.role + '&type=vote'
						})
					}

				} else if (e.detail.index == 5) {
					uni.navigateTo({
						url: '../file/file?m_id=' + this.m_id + '&role=' + this.role
					})
				}else if (e.detail.index == 6) {
					if (this.role == 'manage') {
						uni.navigateTo({
							url: '../announce/announce?m_id=' + this.m_id + '&role=' + this.role
						})
					} else {
						uni.navigateTo({
							url: '../announce/announce?m_id=' + this.m_id + '&role=' + this.role
						})
					}

				}
			}
		},
		beforeDestroy() {
			this.$Socket.nsend(JSON.stringify({
				type: 'out_meeting',
				mid: this.m_id
			}))
		},
		onLoad(option) {
			console.log(option.m_id, option.role);
			this.m_id = option.m_id;
			this.role = option.role;
			this.$http.get('meetingapi/v1/getmeeting/', {
				params: {
					type: 'getmeetingdetail',
					mid: option.m_id
				}
			}).then(res => {

				if (res.data.msg == 'ok') {
					this.m_obj = res.data.data
					console.log(this.m_obj);
				}
			}).catch(err => {
				console.log(err);
			})
		}
	}
</script>

<style lang="less" scoped>
</style>
