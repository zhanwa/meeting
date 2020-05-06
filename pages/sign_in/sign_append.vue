<template>
	<view class="sign_in">
		<view style='background:#ffffff;'>
			<view v-if='choose==false' class='function_block'>

				<view class='cut'></view>
				<view class='title_block'>
					<view class='title_icon'>
						<image src='function'></image>
					</view>
					<text>签到方式</text>
				</view>

				<view v-if='sign_in=="false"'>

					<view class='cut' style='background:#fff;  height:10rpx;'></view>
					<view v-if='QR==true' class='sign_block' @click='scancode'>
						<view class='sign_icon'>
							<image src='scan_code_icon'></image>
						</view>
						<text>二维码签到</text>
					</view>

					<view v-if='personage==true' class='sign_block' @click='btn_personage'>
						<view class='sign_icon'>
							<image src='personage_icon'></image>
						</view>
						<text>个人信息签到</text>
					</view>

					<view v-if='WIFI=="true"' class='sign_block' @click='btn_WIFI'>
						<view class='sign_icon'>
							<image src='wifi_icon'></image>
						</view>
						<text>WIFI签到</text>
					</view>

				</view>

				<view v-if='sign_in=="true"'>
					<text>您已经完成签到</text>
				</view>

			</view>

			<view v-if='choose==true' class='function_block'>
				<view class='cut'></view>
				<view class='title_block'>
					<view class='title_icon'>
						<image src='title_signin'></image>
					</view>
					<text>签 到</text>
				</view>

				<view v-if='type=="QR"'></view>

				<view v-if='type=="personage"' class='info_block'>

					<view class='info_item'>
						<text>姓 名</text>
						<input placeholder='请输入姓名' placeholder-class='placeholder' bindinput='name'></input>
					</view>
					<view class='info_item' style='border-bottom-width:0;'>
						<text>电 话</text>
						<input placeholder='请输入电话号码' placeholder-class='placeholder' type='number' maxlength='11' bindinput='telephone'></input>
					</view>
				</view>

				<view v-if='type=="WIFI"'></view>

				<view class='cut'></view>
				<view class='submit' @click='submit'>
					<text>签 到</text>
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				choose: false,
				type: '',
				name: '',
				telephone: '',
				QR: true,
				personage: true,
				WIFI: false,
				sign_in: "false",
				// 用户头像
				avator:uni.getStorageSync('SFACE')
			}
		},
		methods: {
			scancode() {
				let _self = this
				uni.scanCode({
					// 只允许调用相机扫码
					onlyFromCamera: true,
					success(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						_self.$http.post('meetingapi/v1/sign/', {
							u_id: uni.getStorageSync('SUID'),
							m_id: res.result
						}).then(res => {
							console.log(res);
							if (res.data.data == 'success') {
								that.$Socket.nsend(JSON.stringify({type:'sign',avator:that.avator}))
								uni.showToast({
									title: "签到成功"
								});
							} else if (res.data.data == 'completed') {
								uni.showToast({
									title: '请勿重复签到'
								})
							} else {
								uni.showToast({
									title: '你没参加该会议'
								})
							}
						}).catch(res => {

						})

					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
.function_block {
  width: 100%;
}

.cut {
  height: 40rpx;
  width: 100%;
  background: #efeff4;
}

.sign_block {
  width: 100%;
  height: 100rpx;
  font-size: 32rpx;
  color: #333333;
  display: flex;
  align-items: center;
}

.sign_icon {
  width: 15%;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign_block image {
  width: 55rpx;
  height: 55rpx;
}

.sign_block text {
  width: 85%;
  height: 100rpx;
  font-size: 32rpx;  
  display: flex;
  align-items: center;
  border-bottom-color: #efeff4;
  border-bottom-style: solid;
  border-bottom-width: 2rpx;
}

.title_block {
  width: 100%;
  border-bottom: 10rpx solid #ffffff;
  height: 90rpx;
  display: flex;
  align-items: center;
  background: #ffffff;
}

.title_icon {
  margin-left: 5%;
  height: 90rpx;
  width: 70rpx;
  border-radius: 0 0 8rpx 8rpx;
  background: #0066b9;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.title_icon image {
  margin-bottom: 10rpx;
  width: 50rpx;
  height: 50rpx;
}

.title_block text {
  height: 90rpx;
  margin-left: 3%;
  font-size: 36rpx;
  display: flex;
  align-items: center;
}

.info_block {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.info_item {
  height: 100rpx;
  width: 100%;
  border-bottom: 2rpx solid #DCDCDC;
  display: flex;
}

.info_item text {
  height: 90rpx;
  width: 10%;
  margin-left: 10%;
  font-size: 32rpx;
  color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info_item input {
  height: 90rpx;
  width: 70%;
  margin-left: 10%;
  font-size: 32rpx;
  color: #333333;
  display: flex;
  align-items: center;
}

.placeholder {
  font-size: 32rpx;
  color: #DCDCDC;
}

.submit {
  width: 100%;
  height: 100rpx;
  color: #333333;
  font-size: 36rpx;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn_note {
  position: fixed;
  background: #1d93ec;
  top: 900rpx;
  right: 30rpx;
  width: 90rpx;
  height: 90rpx;
  border-radius: 100%;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn_note image {
  height: 55rpx;
  width: 55rpx;
}

.btn_photo {
  position: fixed;
  background: #1d93ec;
  top: 1020rpx;
  right: 30rpx;
  width: 90rpx;
  height: 90rpx;
  border-radius: 100%;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn_photo image {
  height: 55rpx;
  width: 55rpx;
}
</style>
