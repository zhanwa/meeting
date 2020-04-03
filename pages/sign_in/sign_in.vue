<template>
	<view class="sign_in">
		<view class="sign" style="margin-bottom: 20px;">
			签到方式
		</view>
		<view class="sign_style">
			二维码签到
			<switch @change="change" />
		</view>
		<button type="primary" v-if="mark" @click="make">生成二维码</button>
		<canvas v-if="mark" canvas-id="qrcode" style="width: 215px;height: 215px;" />
		<button type="primary" class="scansode" @click="scancode">扫码签到</button>
	</view>
</template>

<script>
	import uQRCode from '../../js_sdk/Sansnn-uQRCode/uqrcode.js'
	export default {
		data() {
			return {
				// 是否显示生成二维码标志
				mark: false,
				m_id: ''
			};
		},
		methods: {
			change(e) {
				if (e.detail.value) {
					this.mark = true
				} else {
					this.mark = false
				}
			},
			make() {
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: this.m_id,
					size: 215,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.defaults.correctLevel,
					success: res => {
						console.log(res)
					}
				})
			},
			scancode() {
				let _self = this
				uni.scanCode({
					success(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						_self.$http.post('meetingapi/v1/sign/', {
							u_id: uni.getStorageSync('SUID'),
							m_id: res.result
						}).then(res => {
							console.log(res);
							if (res.data.msg == 200) {
								uni.showToast({
									title: "签到成功"
								});
							}
						}).catch(res => {

						})

					}
				})
			}
		},
		onLoad(option) {
			this.m_id = option.m_id
		}
	}
</script>

<style lang="less">

</style>
