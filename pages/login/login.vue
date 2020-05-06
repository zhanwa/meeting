<template>
	<view class="container">
		<view class='content'>
			<view>申请获取以下权限</view>
			<text>获得你的公开信息(昵称，头像等)</text>
		</view>
		<button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">微信登录</button>
	</view>
</template>

<script>
	let _self, pageOptions
	export default {
		data() {
			return {
				seection_key: '',
				openid: ''

			}
		},
		methods: {
			// 获取用户信息
			getUserInfo(res) {
				console.log(res)
				let info = res.mp.detail.userInfo;
				//userInfo {"nickName":"深海","gender":1,...avatarUrl":"https://7tdPvkPaJlkaLFFbLAffGVApluZdanLkDVplNlAhq1EJA/132"}
				// 与服务器交互将数据提交到服务端数据库
				uni.request({
					url: _self.baseurl + 'userapi/v1/login/',
					method: 'POST',
					header: {
						'content-type': "application/json"
					},
					data: {
						openid: _self.openid,
						name: info.nickName,
						face: info.avatarUrl,
					},
					success: res => {
						console.log(res);
						res = res.data;
						// 登录成功 记录会员信息到本地
						if (res.status == 'ok') {
							uni.showToast({
								title: "登录成功"
							});
							uni.setStorageSync('SUID', res.data.u_id + '');
							// uni.setStorageSync('SRAND', res.data.u_random + '');
							uni.setStorageSync('SNAME', res.data.username + '');
							uni.setStorageSync('SFACE', this.baseurl + res.data.image + '');
							uni.setStorageSync('STOKEN', res.data.token + '');
							console.log("成功")
							// 跳转
							uni.switchTab({
								url: '../home_page/home_page'
							});
						} else {
							uni.showToast({
								title: res.data
							});
						}
					},
					fail: (e) => {
						console.log(JSON.stringify(e));
					}
				});

			},
		},

		onLoad(option) {
			// 将option放到全局调用
			pageOptions = option
			_self = this;
			// 判断有无用户会议更新,有就改变缓存,无就增加缓存
			let Mmeeting_updata = uni.getStorageSync('Mmeeting_update')
			if(!Mmeeting_updata){
				uni.setStorageSync(
					'Mmeeting_update','0'
				)
			};
			// 获取code换取openid
			uni.login({
				success(res) {
					uni.request({
						url: _self.baseurl + 'userapi/v1/login/',
						method: 'GET',
						data: {
							code: res.code
						},
						header: {
							'content-type': 'application/json' //自定义请求头信息
						},
						success: (res) => {
							_self.seection_key = res.data.session_key;
							_self.openid = res.data.openid;

						}
					});
				}
			})
		}
	}
</script>

<style lang="less">
	.container {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		flex-direction: column;
		background-image: url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583236459890&di=2658235caad51169f728fd1aa194a542&imgtype=0&src=http%3A%2F%2Fbig5.wallcoo.com%2Fanimal%2Ffly_and_freedom%2Fimages%2F0Vol_096_DY164.jpg);
		background-repeat: no-repeat;
		background-size: cover;

		.content {
			width: 60%;
			margin: 10px auto;
			text-align: center;

			text {
				display: block;
				color: #9d9d9d;
				margin-top: 40rpx;
			}
		}

		button {
			width: 60%;
		}
	}
</style>
