<template>
	<view class="websockets">
		<input type="text" placeholder="请输入" v-model="value" />
		<button type="primary" @tap="clickRequest">点击发送请求</button>
		<button type="primary" @tap="leave">离开页面</button>
		<view class="view flex-r" v-for="(item,index) in sereve_rep" :key=index>
			<image :src=item.face mode="" style="width: 70rpx; height: 70rpx;"></image>
			<view class="name" v-show="item.face">
				{{item.naem}}:
			</view>
			<view class="content" v-show="item.naem">
				{{item.msg}}
			</view>
		</view>
	</view>
</template>

<script>
	let _self
	export default {
		onLoad(option) {
			this.m_id = option.m_id;
			_self = this;
			// 进入这个页面的时候创建websocket连接【整个页面随时使用】
			this.connectSocketInit();
		},
		data() {
			return {
				m_id:'',
				u_id:uni.getStorageSync('SUID'),
				face: uni.getStorageSync('SFACE'),
				name: uni.getStorageSync('SNAME'),
				value: '',
				socketTask: null,
				// 确保websocket是打开状态
				is_open_socket: false,
				sereve_rep : []
			}
		},
		// 关闭websocket【必须在实例销毁之前关闭,否则会是underfined错误】
		beforeDestroy() {
			this.closeSocket();
		},
		methods: {
			// 进入这个页面的时候创建websocket连接【整个页面随时使用】
			connectSocketInit() {
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				this.socketTask = uni.connectSocket({
					// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
					url: this.basewsurl + 'meetingapi/chat/'+this.m_id+'/'+this.u_id,
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
						this.sereve_rep = this.sereve_rep.concat(JSON.parse(res.data))
						console.log(this.sereve_rep);
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
				let send_data = {
					msg: this.value,
					face: this.face,
					naem: this.name
				};
				if (this.is_open_socket) {
					// websocket的服务器的原理是:发送一次消息,同时返回一组数据【否则服务器会进去死循环崩溃】			
					// data只接受str和arrybuff(二进制数组),故传递时需要转为json字符串传输
					this.socketTask.send({
						data: JSON.stringify(send_data),
						async success() {
							_self.value = '',
							console.log(_self.value);
							console.log("消息发送成功");
						},
					});
				}
			},
			leave() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>

</style>
