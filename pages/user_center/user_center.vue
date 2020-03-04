<template>
	<view class="user-center">

		<view class="login" @click="gettoken()">
			点击获取token
		</view>
		<view class="create_meeting">
			<navigator url="../create_meeting/create_meeting">创建会议</navigator>
		</view>
		<view class="my-code">
			<text>我的二维码</text>
		</view>
		<view class="scan">
			<text>扫一扫</text>
		</view>
		<view class="future-meeting">
			<text>即将开始的会议</text>
		</view>
		<view class="my-meeting">
			<text>我创建的会议</text>
		</view>
		<view class="appen-meeting">
			<text>我参加的会议</text>
		</view>
		<view class="my-collection">
			<text>我的收藏</text>
		</view>
		<view class="my-prize">
			<text>我的奖品</text>
		</view>
		<view class="callforme">
			<text>联系我们</text>
		</view>
		<view class="feedback">
			<text>建议与问题反馈</text>
		</view>
	</view>
</template>

<script>
	let _self
	export default {
		data() {
			return {
				seection_key: '',
				openid: ''

			}
		},
		methods: {
			// gettoken() {
			// 	this.$http.get('usersapi/v1/login/').then(res => {
			// 		console.log(res.data);
			// 	}).catch(err => {
			// 		console.log(err);
			// 	})
			// }
		},
		onLoad() {
			console.log('我是主页');
		}
	}
</script>

<style lang="less">

</style>
