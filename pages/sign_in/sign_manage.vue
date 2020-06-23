<template>
	<view class="sign_manage">
		<view v-if='WIFI_setting==false'>
			<!-- 签到功能设置模块 -->
			<view class='cut'></view>
			<view class='function_block'>
				<view class='title_block'>
					<view class='title_icon'>
						<image src='function'></image>
					</view>
					<text>签到方式</text>
				</view>

				<view class='sign_block'>
					<text>二维码签到</text>
					<view class='sign_in' @click='btn_QR'>
						<image v-if='QR_sign=="true"' src='open'></image>
						<image v-if='QR_sign=="false"' src='close'></image>
					</view>
				</view>

				<view class='sign_block' style='border-bottom-width: 0;'>
					<text>个人信息签到</text>
					<view class='sign_in' @click='btn_personage'>
						<image v-if='personage_sign=="true"' src='../../static/qiandao.png'></image>
						<image v-if='personage_sign=="false"' src='../../static/qiandao.png'></image>
					</view>
				</view>

			</view>

			<!-- 详细信息模块 -->
			<view class='cut'></view>
			<view class='function_block'>
				<view class='title_block'>
					<view class='title_icon'>
						<image src='function'></image>
					</view>
					<text>更多设置</text>
				</view>

				<view class='sign_more_block' @click='sign_qr(m_id)'>
					<view class='sign_icon'>
						<image src='QR_icon'></image>
					</view>
					<text>获取签到二维码</text>
				</view>

				<view class='sign_more_block' @click='more_personage'>
					<view class='sign_icon'>
						<image src='personage_icon'></image>
					</view>
					<text style='border-bottom-width: 0;'>个人信息签到</text>
				</view>
			</view>

			<!-- 签到墙状态 -->
			<view class='cut'></view>
			<view class='function_block'>
				<view class='title_block'>
					<view class='title_icon'>
						<image src='function'></image>
					</view>
					<text>签到墙</text>
				</view>
				<view class='sign_block' style='border-bottom-width: 0;'>
					<text>签到墙状态</text>
					<view class='sign_in' @click='btn_wall'>
						<image v-if='sign_wall=="true"' src='open'></image>
						<image v-if='sign_wall=="false"' src='close'></image>
					</view>
				</view>
			</view>
		</view>


		<!-- WIFI签到信息设置模块 -->
		<view v-if='WIFI_setting==true'>

			<view class='cut'></view>
			<view style='background: #ffffff;'>

				<view class='title_block'>
					<view class='title_icon'>
						<image src='title_wifi'></image>
					</view>
					<text>WIFI 信息设置</text>
				</view>
				<view class='info_block'>
					<text>WIFI名称</text>
					<input placeholder='请输入WIFI名称' placeholder-class='placeholder' bindinput='SSID'></input>
					<text style='margin-bottom:30rpx;'>WIFI密码</text>
					<input style='margin-bottom:30rpx;' placeholder='默认WIFI无密码' placeholder-class='placeholder' bindinput='WIFI_password'></input>
				</view>

			</view>

			<view style='background: #ffffff;'>
				<view class='title_block' style='margin-top: 30rpx;'>
					<view class='title_icon'>
						<image src='title_wifi'></image>
					</view>
					<text>WIFI 严格度设置</text>
				</view>
				<view class='choose_block'>

					<view class='choose_block_text'><text>严格度</text></view>
					<view class='choice_block'>
						<view class="label-2" @click='btn_mild'>
							<view class="label-2__icon">
								<view class="label-2__icon-checked" style="opacity:severe ? 0: 1"></view>
							</view>
							<view class="label-2__text"><text>轻度</text></view>
						</view>

						<view class="label-2" @click='btn_severe'>
							<view class="label-2__icon">
								<view class="label-2__icon-checked" style="opacity:severe ? 1: 0"></view>
							</view>
							<view class="label-2__text"><text>重度</text></view>
						</view>

					</view>

				</view>

				<view class='tip_block'><text>轻度：只要签到时WIFI名称一致即可完成签到（一般用于不在现场设置）</text></view>
				<view class='tip_block'><text>重度：必须为同一WIFI（同一路由器发出信号）才可完成签到（适用于在现场设置，选择重度时路由器会自动保存为当前链接WIFI的路由器）</text></view>
			</view>

			<view class='cut'></view>
			<view class='submit' @click='submit'>
				<text>保 存</text>
			</view>

		</view>
	</view>
</template>

<script>
	import uQRCode from '../../js_sdk/Sansnn-uQRCode/uqrcode.js'
	export default {
		data() {
			return {
				// 是否显示生成二维码标志
				mark: false,
				 personage_sign: "false", //个人信息签到
				WIFI_sign: "false",
				WIFI_setting: false, //是否进入WIFI设置页面
				severe: false, //WIFI严格度默认为轻度
				SSID: '', //WIFI-SSID（WIFI名称）
				BSSID: '', //WIFI-ID
				WIFI_password: '', //WIFI-password
				sign_wall: "false" //签到墙状态
			}
		},
		props: {
			m_id: {
				type: String
			}
		},
		methods: {
			change(e) {
				if (e.detail.value) {
					this.mark = true
				} else {
					this.mark = false
				}
			},
			// 跳转到签到二维码页面
			sign_qr(m_id){
				uni.navigateTo({
					url:'../qr_code/qr_code?type=sign_in&mid='+m_id
				})
			},
			btn_wall() {
				var that = this;
				if (that.sign_wall == 'false') {
					that.sign_wall = 'true';
				} else {
					that.sign_wall = 'false';
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.function_block {
		width: 100%;
		background: #ffffff;
	}

	.remark {
		margin-left: 50rpx;
		width: 20rpx;
		height: 20rpx;
		background: #1d93ec;
	}

	.cut {
		width: 100%;
		height: 40rpx;
		background: #efeff4;
	}

	.title_block {
		width: 100%;
		margin-bottom: 10rpx;
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
		background: #1d93ec;
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

	.sign_block {
		width: 100%;
		height: 100rpx;
		font-size: 30rpx;
		color: #333333;
		display: flex;
		align-items: center;
		border-bottom-style: solid;
		border-bottom-color: #DEDEDE;
		border-bottom-width: 2rpx;
	}

	.sign_block text {
		width: 30%;
		margin-left: 15%;
		height: 80rpx;
		display: flex;
		align-items: center;
	}

	.sign_in {
		width: 40%;
		margin-left: 10%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.sign_in image {
		width: 80rpx;
		height: 80rpx;
	}

	.sign_more_block {
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

	.sign_more_block image {
		width: 55rpx;
		height: 55rpx;
	}

	.sign_more_block text {
		width: 85%;
		height: 100rpx;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		border-bottom-color: #DCDCDC;
		border-bottom-style: solid;
		border-bottom-width: 2rpx;
	}

	.info_block {
		width: 100%;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.info_block text {
		height: 100rpx;
		width: 20%;
		padding-top: 40rpx;
		margin-left: 10%;
		margin-right: 20rpx;
		font-size: 32rpx;
		color: #333333;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.info_block input {
		height: 90rpx;
		width: 370rpx;
		padding: 40rpx 30rpx 0rpx 30rpx;
		font-size: 32rpx;
		color: #333333;
		border-bottom-style: solid;
		border-bottom-width: 1rpx;
		border-bottom-color: #DCDCDC;
		display: flex;
		justify-content: center;
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

	.label-2 {
		width: 40%;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.label-2__icon {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		margin-left: 20rpx;
		width: 16px;
		height: 16px;
		border-color: #828282;
		border-style: solid;
		border-width: 2rpx;
		border-radius: 50%;

	}

	.label-2__icon-checked {
		position: absolute;
		left: 3px;
		top: 3px;
		width: 10px;
		height: 10px;
		background: #DCDCDC;
		border-radius: 50%;
	}

	.label-2__text text {
		width: 100rpx;
		font-size: 30rpx;
		color: #828282;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.choose_block {
		width: 100%;
		display: flex;

	}

	.choose_block_text {
		height: 100rpx;
		width: 20%;
		margin-left: 10%;
		font-size: 32rpx;
		color: #333333;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.choose_block_text text {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.choice_block {
		width: 60%;
		margin-right: 5%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tip_block {
		width: 74%;
		background: #ffffff;
		margin: 0% 13% 0% 13%;
		border-bottom-color: #ffffff;
		border-bottom-width: 20rpx;
		border-bottom-style: solid;
		font-size: 26rpx;
		color: #A0A0A0;
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
