<template>
	<view class="user_message">
		<cmd-transition name="fade-up">
			<view>
				<cmd-cel-item title="头像" slot-right arrow @click='chang_avatar'>
					<cmd-avatar :src="userInfo.image" @tap.stop="previewimg(userInfo.image)"></cmd-avatar>
				</cmd-cel-item>
				<cmd-cel-item title="昵称" :addon="userInfo.username" arrow @click='change_name("0")'></cmd-cel-item>
				<cmd-cel-item title="个性签名" :addon="userInfo.sign" arrow @click='change_sign("1")'></cmd-cel-item>
				<cmd-cel-item title="性别" :addon="userInfo.sex" arrow @click='change_sex("2")'></cmd-cel-item>
				<cmd-cel-item title="Email" :addon="userInfo.email" arrow></cmd-cel-item>
				<cmd-cel-item title="二维码名片" arrow @click='toMycode'></cmd-cel-item>
				<cmd-cel-item title="联系方式" :addon="userInfo.label2" arrow></cmd-cel-item>
				<cmd-cel-item title="我的地址" :addon="userInfo.address" arrow></cmd-cel-item>
				<button class="btn-logout" @click="back_login">退出登录</button>
			</view>
		</cmd-transition>
		<prompt :visible.sync="promptVisible" :title="title" :placeholder="placeholder" @confirm="clickPromptConfirm"
		 mainColor="#00fd00">
		</prompt>
	</view>
</template>

<script>
	import cmdPageBody from "@/components/cmd-page-body/cmd-page-body.vue"
	import cmdTransition from "@/components/cmd-transition/cmd-transition.vue"
	import cmdCelItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	import cmdAvatar from "@/components/cmd-avatar/cmd-avatar.vue"
	import Prompt from '@/components/zz-prompt/index.vue'
	let _self;
	export default {
		components: {
			cmdPageBody,
			cmdTransition,
			cmdCelItem,
			cmdAvatar,
			Prompt
		},

		data() {
			return {
				// 用户信息
				userInfo: {},
				// 用户id
				uid: uni.getStorageSync('SUID'),
				// 要修改处id
				c_id: '',
				// 控制弹框输入框显示
				promptVisible: false,
				// 弹出标题
				title: '',
				// 弹框占位名称
				placeholder: ''
			};
		},

		mounted() {},
		onLoad() {
			_self = this
			let uid = uni.getStorageSync("SUID")
			this.$http.get('userapi/v1/usermessage/', {
				params: {
					uid: uid
				}
			}).then(res => {
				if (res.data.msg == 'ok') {
					this.userInfo = res.data.data
					this.userInfo.image = this.baseurl + this.userInfo.image
				}
				console.log(this.userInfo);
			}).catch()
		},

		methods: {
			// 前往我的二维码页面
			toMycode(){
				uni.navigateTo({
					url:'../qr_code/qr_code?type=personage&uid='+this.uid +'&name='+JSON.stringify({name:this.userInfo.username,avator:this.userInfo.image}) 
				})
			},
			//点击弹出输入框确定
			clickPromptConfirm(val) {
				this.promptVisible = false
				if (this.c_id == '0') {

					_self.$http.post(_self.baseurl + 'userapi/v1/usermessage/', {
						type: 'name',
						newname: val,
						uid: _self.uid
					}).then(res => {
						let data = res.data
						if (data.msg == 'ok') {
							_self.userInfo.username = val
							uni.showToast({
								
								title: '昵称修改成功'
							})
						}
					}).catch();
				} else if (this.c_id == '1') {

					_self.$http.post(_self.baseurl + 'userapi/v1/usermessage/', {
						type: 'sign',
						newsign: val,
						uid: _self.uid
					}).then(res => {
						let data = res.data
						if (data.msg == 'ok') {
							_self.userInfo.sign = val
							uni.showToast({
								title: '签名修改成功'
							})
						}
					}).catch();
				}
				console.log(this.userInfo);
			},
			// 退出登录
			back_login() {
				uni.reLaunch({
					url: '../login/login'
				})
			},
			// 修改头像
			chang_avatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log(res);
						let tempFilePaths = res.tempFilePaths[0];
						_self.$http.upload(_self.baseurl + 'userapi/v1/usermessage/', {
							name: 'avator',
							filePath: tempFilePaths,
							formData: {
								type: 'avatar',
								uid: _self.uid
							}
						}, ).then(res => {
							let data = JSON.parse(res.data)
							if (data.msg == 'ok') {
								_self.userInfo.image = _self.baseurl + data.data
								uni.setStorageSync('SFACE', _self.baseurl + data.data)
							}
						}).catch();
					}
				});
			},
			// 点击头像放大
			previewimg(image) {
				var imgArr = [];
				imgArr.push(image);
				//预览图片
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0]
				});

			},
			// 修改昵称
			change_name(c_id) {
				console.log(c_id);
				this.c_id = c_id
				this.title = '请输入新昵称'
				this.placeholder = '请输入新昵称'
				this.promptVisible = true
			},
			// 修改签名
			change_sign(c_id) {
				this.c_id = c_id
				this.title = '请输入新签名'
				this.placeholder = '请输入新签名'
				this.promptVisible = true
			}
		}
	}
</script>

<style>
	.btn-logout {
		margin-top: 100upx;
		width: 80%;
		border-radius: 50upx;
		font-size: 16px;
		color: #fff;
		background: linear-gradient(to right, #365fff, #36bbff);
	}

	.btn-logout-hover {
		background: linear-gradient(to right, #365fdd, #36bbfa);
	}
</style>
