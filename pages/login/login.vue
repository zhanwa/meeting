<template>
	<view class="container">
		<view class="login" v-if="type == 'login'">
			<view class="login-form">
				<view class="titles" style="width: 100px; margin: 0 auto; text-align: center;font-size: 22px;">
					登录
				</view>
				<view class="form-input">
					<input type="text" value="" placeholder="用户名" v-model="username" />
				</view>
				<view class="form-input">
					<input type="password" value="" placeholder="密码" v-model="password" />
				</view>
				<view class="b flex-r">
					<button type="primary" form-type="submit" @click="ulogin">登录</button>
					<button type="primary" form-type="submit" @click="toregister">注册</button>
				</view>
			</view>
			<button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">微信登录</button>
		</view>
		<view class="register" v-if="type == 'register'">
			<view class="login-form">
				<view class="titles" style="width: 100px; margin: 0 auto; text-align: center;font-size: 22px;">
					注册
				</view>
				<view class="form-input">
					<input type="text" value="" placeholder="用户名" v-model="username" />
				</view>
				<view class="form-input">
					<input type="password" value="" placeholder="密码应大于6位数" v-model="password" />
				</view>
				<view class="b flex-r">
					<button type="primary" form-type="submit" @click="register">注册</button>
					<button type="primary" form-type="submit" @click="tologin">返回</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let _self, pageOptions
	export default {
		data() {
			return {
				seection_key: '',
				openid: '',
				type: 'login',
				value: '',
				username: '', //用户名
				password: '' //密码

			}
		},
		methods: {
			tologin() {
				this.type = 'login'
			},
			// 去注册用户页面
			toregister() {
				this.type = 'register'
			},
			// 注册
			register() {
				console.log(this.username);
				if (this.username.trim() && this.password.trim().length >= 6) {
					console.log('yes');
					uni.request({
						url: _self.baseurl + 'userapi/v1/login/',
						method: 'POST',
						header: {
							'content-type': "application/json"
						},
						data: {
							type: 'register',
							username: _self.username,
							passw: _self.password,
						},
						success: res => {
							res = res.data;
							// 登录成功 记录会员信息到本地
							if (res.status == 'ok') {
								uni.showToast({
									title: "注册成功"
								});
								this.type = 'login'
							} else {
								uni.showToast({
									title: res.data
								});
							}
						},
					})
				} else {
					uni.showToast({
						title: '输入格式错误'
					})
				}
			},
			// 登录
			ulogin() {
				uni.request({
					url: _self.baseurl + 'userapi/v1/login/',
					method: 'POST',
					header: {
						'content-type': "application/json"
					},
					data: {
						type: 'login',
						username: _self.username,
						passw: _self.password,
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
						type: 'wxlogin',
						openid: _self.openid,
						name: info.nickName,
						face: info.avatarUrl,
					},
					success: res => {
						console.log(res);
						res = res.data;
						// 登录成功 记录会员信息到本地
						if (res.status == 'ok') {
							_self.$Socket.nsend(JSON.stringify({type:'login',uid: res.data.u_id}))
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
			if (!Mmeeting_updata) {
				uni.setStorageSync(
					'Mmeeting_update', '0'
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

		.login-form {
			margin: 75px 10px 100px 10px;
			height: 245px;
			background: #007AFF;
			border-radius: 10px;
			background-color: #EEEEEE;
			box-shadow: 0 2px 10px #9B9B9B;
			padding: 20px;
		}

		.form-input input {
			background: #ffffff;
			border-radius: 5px;
			height: 40px;
			margin: 20px 0;
			padding: 0 10px;
		}

		.b {
			justify-content: space-evenly;
			padding-bottom: 30rpx;
		}

		button {
			margin: 10rpx 0;
		}
	}
</style>
