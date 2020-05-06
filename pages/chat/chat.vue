<template>
	<view class="my_chat">
		<scroll-view class="cu-chat" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :style="{'height':screen_height}">
	<!-- 	<view class="cu-chat"> -->
			<view class="cu-item" v-for="(item,index) in barrage" :key=index :class="{'self':item.type=='me'}" :id="index">
				<view class="cu-avatar radius" :style="{backgroundImage:`url(${item.face})`}" v-if="item.type == 'otherbarrage'"></view>
				<view class="main">
					<view class="content bg-green shadow">
						<text>{{item.msg}}</text>
					</view>
				</view>
				<!-- 绑定样式用对象 "{backgroundImage:'url('+item.face+')'}"-->
				<view class="cu-avatar radius" :style="{backgroundImage:`url(${item.face})`}" v-if="item.type == 'me'"></view>
			</view>
			<!-- <view class="cu-item">
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
				<view class="main">
					<view class="content shadow">
						<text>喵喵喵！喵喵喵！</text>
					</view>
				</view>
			</view> -->
		<!-- </view> -->
		</scroll-view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" v-model="value" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow" @click="clickRequest">发送</button>
		</view>

	</view>
</template>

<script>
	let _self
	export default {
		onLoad(option) {
			this.m_id = option.m_id;
			_self = this;
			uni.getSystemInfo({
				success(res) {
					_self.screen_height = (res.windowHeight - 55)+'px'

				}
			})
			// 进入这个页面的时候创建websocket连接【整个页面随时使用】
			this.connectSocketInit();
		},
		data() {
			return {
				scrollAnimation: false,
				scrollTop: 0,
				// 屏幕高度
				screen_height: '',
				// 限制发送频率
				b_on: "1",
				InputBottom: 0,
				m_id: '',
				u_id: uni.getStorageSync('SUID'),
				face: uni.getStorageSync('SFACE'),
				name: uni.getStorageSync('SNAME'),
				value: '',
				socketTask: null,
				// 确保websocket是打开状态
				is_open_socket: false,
				barrage: [],
				// mybarrage:[]
			}
		},
		// 关闭websocket【必须在实例销毁之前关闭,否则会是underfined错误】
		beforeDestroy() {
			this.closeSocket();
		},

		onReachBottom() {

		},
		methods: {
			// 输入框聚焦
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			// 输入框失去焦点
			InputBlur(e) {
				this.InputBottom = 0
			},
			// 进入这个页面的时候创建websocket连接【整个页面随时使用】
			connectSocketInit() {
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				this.socketTask = uni.connectSocket({
					// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
					url: this.basewsurl + 'meetingapi/chat/wx/' + this.m_id + '/' + this.u_id,
					success(data) {
						console.log("websocket连接成功");
					},
				});

				// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
				this.socketTask.onOpen((res) => {
					console.log("WebSocket连接正常打开中...！");
					this.is_open_socket = true;
					// 注：只有连接正常打开中 ，才能正常成功发送消息
					// this.socketTask.send({
					// 	data: JSON.stringify({send:'连接成功'}),
					// 	async success() {
					// 		console.log("消息发送成功");
					// 	},
					// });
					// 注：只有连接正常打开中 ，才能正常收到消息
					this.socketTask.onMessage((res) => {
						console.log("收到服务器内容：" + res.data);
						let msgdata = JSON.parse(res.data)
						this.barrage = this.barrage.concat(msgdata)
						console.log(this.barrage);

						// let resp = JSON.parse(res.data)
						// if(resp.type == 'me'){
						// 	this.mybarrage=this.mybarrage.concat(resp)
						// 	console.log('我发的'+this.mybarrage);
						// }else if(resp.type == 'otherbarrage'){
						// 	this.otherbarrage = this.otherbarrage.concat(resp)
						// 	console.log('其他人发的'+this.otherbarrage);
						// }
					});
				})
				// 这里仅是事件监听【如果socket关闭了会执行】
				this.socketTask.onClose(() => {
					console.log("已经被关闭了")
				})
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				this.socketTask.close({
					success(res) {
						this.is_open_socket = false;
						console.log("关闭成功", res)
					},
					fail(err) {
						console.log("关闭失败", err)
					}
				})
			},
			clickRequest() {
				console.log(this.value);
				if (this.value.trim()) {
					if (this.b_on == "1") {
						this.b_on = "0";
						setTimeout(() => {
							_self.b_on = "1";
							console.log('我是定时器');
						}, 3000)
						let send_data = {
							// 标志是否我发的
							type: 'me',
							msg: this.value,
							face: this.face,
							naem: this.name
						};
						this.value = '';
						console.log('在发送前以清空');
						if (this.is_open_socket) {
							// websocket的服务器的原理是:发送一次消息,同时返回一组数据【否则服务器会进去死循环崩溃】			
							// data只接受str和arrybuff(二进制数组),故传递时需要转为json字符串传输
							this.socketTask.send({
								data: JSON.stringify(send_data),
								// async返回一个promise对象,单用他时且没用返回值时,该函数会立即执行,不会阻塞后面的函数
								async success() {
									_self.value = '';
									console.log('发送后清空');
									console.log(_self.value);
									console.log("消息发送成功");
								},
							});
						}

					} else {
						uni.showToast({
							title: '发送太快了',
							duration: 2000
						});
					}

				} else {
					this.value = '';
					uni.showToast({
						title: '输入不能为空',
						duration: 2000
					});
				}

			},
			scrollToBottom() {
				let that = this;
				let query = uni.createSelectorQuery();
				query.select('.cu-chat').fields({
					size:true,
					scrollOffset:true
				},data=>{
					console.log(data);
					that.scrollTop = data.scrollHeight
					console.log(data.scrollTop);
				}).exec();

			}

		},
		// 监听事件
		watch:{
			// 监听指点滚动变化 可有两个参数,第一个为新值,第二个为旧值
			barrage(value){
				this.$nextTick(function(){
					this.scrollToBottom()
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		padding-bottom: 100upx;
	}

	.cu-chat {
		position: relative;
		margin-bottom: 110rpx;
	}

	.cu-chat .cu-item {
		display: flex;
		padding: 30upx 30upx 20upx;
		position: relative;
	}
</style>
