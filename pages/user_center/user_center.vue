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
		<view class="scan" @click="scanf()">
			<text>扫一扫</text>
		</view>
		<view class="future-meeting">
			<text>即将开始的会议</text>
		</view>
		<view class="my-meeting">
			<navigator url="../my_meeting/my_meeting?type=create">我创建的会议</navigator>
		</view>
		<view class="appen-meeting">
			<navigator url="../my_meeting/my_meeting?type=append">我参加的会议</navigator>
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
				openid: '',
				scoket: ''

			}
		},
		methods: {
			scanf() {
				uni.scanCode({
					success(res) {
						let data = {
							token:uni.getStorageSync('STOKEN'),
							u_id: uni.getStorageSync('SUID'),
							flag: res.result
						}
						_self.scoket = uni.connectSocket({
							url: _self.basewsurl + 'userapi/wslogin/wx/',
							success(data) {
								console.log("websocket连接成功");
							},
						});
						_self.scoket.onOpen((res) => {
							console.log("WebSocket连接正常打开中...！");
							_self.scoket.send({
								data: JSON.stringify(data),
								async success() {
									console.log("消息发送成功");
								},
							});
						})
						_self.scoket.onClose(function(){
							console.log('连接关闭');
						})
					}
				})
			},
			
		},
		onLoad() {
			_self = this
			console.log('我是主页');
		}
	}
</script>

<style lang="less">

</style>
