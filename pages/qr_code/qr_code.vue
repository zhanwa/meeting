<template>
	<view class="code">
		<!-- 个人二维码 -->
		<view v-if='type=="personage"' class='container'>
			<view class='qr_code'>
				<canvas  canvas-id="qrcode" style="width: 200px;height: 200px;" />
				<view class='info_block'>
					<image class="userinfo-avatar" :src="myname.avator"></image>
					<view class="userinfo-nickname"> <text>{{myname.name}}</text></view>
				</view>
			</view>
		</view>
		<!-- 签到二维码 -->
		<view v-if='type=="sign_in"' class='container'>
			<view class='qr_code'>
				<canvas  canvas-id="qrcode" style="width: 200px;height: 200px;" />
				<view class='info_block' style='height:90rpx;justify-content: center;'>
					<view class="userinfo-nickname"><text>theme</text></view>
				</view>
			</view>
		</view>
		<!-- 会议二维码 -->
		<view v-if='type=="meeting_code"' class='container'>
			<view class='qr_code'>
				<canvas  canvas-id="qrcode" style="width: 200px;height: 200px;" />
				<view class='info_block' style='height:90rpx;justify-content: center;'>
					<view class="userinfo-nickname"><text>theme</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uQRCode from '../../js_sdk/Sansnn-uQRCode/uqrcode.js'
	export default {
		data() {
			return {
				// 判断是那种类型的二维码页面
				type: '',
				// 会议id
				mid:'',
				// 会议标识符
				flag:'',
				myname:''
			};
		},
		methods: {
			make(e) {
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: e,
					size: 200,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.defaults.correctLevel,
					success: res => {
						console.log(res)
					}
				})
			}
		},
		onLoad(option) {
			this.type = option.type;
			this.mid = option.mid;
			console.log(option);
			// 如果是会议,接受到会议标识符
			if(this.type == 'meeting_code'){
				this.flag = option.flag
				console.log(this.type,option.flag,typeof option.flag);
				this.make(option.flag)
			}else if(this.type == 'sign_in'){
				this.make(option.mid)
			}else if(this.type == 'personage'){
				this.myname = JSON.parse( option.name)
				this.make(option.uid)
			}
			
		}
	}
</script>

<style lang="less" scoped>
	/* pages/qr_code/qr_code.wxss */
	.container {
		width: 100%;
		height: 80%;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.qr_code {
		width: 600rpx;
		height: 800rpx;
		background: #fff;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		border-radius: 12rpx;
	}

	.info_block {
		width: 600rpx;
		height: 150rpx;
		background: #1d93ec;
		opacity: 0.9;
		display: flex;
		align-items: center;
		position: relative;
	}

	.userinfo-avatar {
		width: 110rpx;
		height: 110rpx;
		border-radius: 100%;
		position: absolute;
		left: 40rpx;
		border-width: 8rpx;
		border-style: solid;
		border-color: #fff;
	}

	.userinfo-nickname {
		position: absolute;
		left: 220rpx;
		font-size: 40rpx;
		color: #fff;
		display: flex;
		align-items: center;
	}
</style>
