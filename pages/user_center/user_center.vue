<template>
	<view class="user-center">
		<view class="head_container">
			<view class='head_image'>
				<image class='head_image_item' :src='background'></image>
			</view>

			<view class="userinfo">
				<image class="userinfo-avatar" :src="userInfo.useravator"></image>
				<view class="userinfo-nickname">
					<text>{{userInfo.username}}</text>
				</view>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow" v-for="(item,index) in pageInfo" :key=index>
				<navigator class="content" hover-class="none" :url=item.path>
					<text class="cuIcon-discoverfill text-blue"></text>
					<text class="text-grey"> {{item.name}}</text>
				</navigator>
				<view class="action" v-if="item.name == '我创建的会议' && userInfo.Mmeeting_update != '0'">
					<view class="cu-tag round bg-green lg">{{userInfo.Mmeeting_update}}</view>
				</view>
			</view>
			

		</view>
		<button type="primary" @click="scanf()">扫一扫</button>
	</view>
</template>

<script>
	let _self
	export default {
		data() {
			return {
				seection_key: '',
				openid: '',
				// websocket
				scoket: '',
				// 背景图片
				background: '../../static/img_25814_0_0.png',
				// 用户信息
				userInfo: {
					username: '',
					useravator: '',
					Mmeeting_update:''
				},
				// 页面信息
				pageInfo: [{
						name: '修改个人资料',
						path: '../user_message/user_message'
					},{
						name: '创建会议',
						path: '../create_meeting/create_meeting'
					},
					{
						name: '我的收藏',
						path: '../create_meeting/create_meeting'
					}, {
						name: '我创建的会议',
						path: '../my_meeting/my_meeting?type=create'
					}, {
						name: '我参加的会议',
						path: '../my_meeting/my_meeting?type=append'
					},
					{
						name: '我的奖品',
						path: '../my_award/my_award'
					},
					{
						name: '反馈与建议',
						path: '../feedback/feedback'
					}
				]
			}
		},
		methods: {
			// 扫码签到
			scanf() {
				uni.scanCode({
					success(res) {
						let data = {
							token: uni.getStorageSync('STOKEN'),
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
						_self.scoket.onClose(function() {
							console.log('连接关闭');
						})
					}
				})
			},

		},
		onShow() {
			_self = this
			this.userInfo.useravator = uni.getStorageSync('SFACE');
			this.userInfo.username = uni.getStorageSync('SNAME');
			this.userInfo.Mmeeting_update = uni.getStorageSync('Mmeeting_update');
			console.log(this.userInfo);
			console.log('我是主页');
		}
	}
</script>

<style lang="less">
	.head_image {
		width: 100%;
		height: 500rpx;
	}

	.head_image_item {
		width: 100%;
		height: 100%
	}

	.userinfo {
		display: flex;
	}

	.userinfo-avatar {
		border-radius: 100%;
		width: 190rpx;
		height: 190rpx;
		position: absolute;
		top: 128rpx;
		right: 10rpx;
		border-width: 10rpx;
		border-color: #ffffff;
		border-style: solid;
	}

	.userinfo-nickname {
		color: white;
		position: absolute;
		top: 150rpx;
		left: 10%;
		font-size: 55rpx;
		display: flex;
		align-items: center;
	}
</style>
