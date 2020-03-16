// 获取新的token
const getNewTokenServe = () => {
	return uni.getStorageSync("STOKEN")
}

// WebSocket连接
// 进入这个页面的时候创建websocket连接【整个页面随时使用】
const connectSocketInit = function(SocketTask,u_id) {
	// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
	SocketTask = uni.connectSocket({
		// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
		url: this.basewsurl + 'meetingapi/chat/' + u_id,
		success(data) {
			console.log("websocket连接成功");
		},
	});

	// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
	SocketTask.onOpen((res) => {
		console.log("WebSocket连接正常打开中...！");
		// this.is_open_socket = true;
		// 注：只有连接正常打开中 ，才能正常成功发送消息
		// this.socketTask.send({
		// 	data: JSON.stringify({send:'连接成功'}),
		// 	async success() {
		// 		console.log("消息发送成功");
		// 	},
		// });
		// 注：只有连接正常打开中 ，才能正常收到消息
		SocketTask.onMessage((res) => {
			console.log("收到服务器内容：" + res.data);
			this.sereve_rep = this.sereve_rep.concat(JSON.parse(res.data))
			console.log(this.sereve_rep);
		});
	})
	// 这里仅是事件监听【如果socket关闭了会执行】
	SocketTask.onClose(() => {
		console.log("已经被关闭了")
	})
}

export {
	getNewTokenServe,
	connectSocketInit
}
