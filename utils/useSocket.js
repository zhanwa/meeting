import Vue from 'vue'
import store from "../store/index.js"; //引入vuex，路径换成自己的    重要
import socket from "./socket.js"; //引入socket.js，路径换成自己的 重要
const Socket =new socket({
    url: 'ws://192.168.2.104:8000/userapi/wss/', //连接地址 必填
	maxInterValCount: 5, // 断线重连次数
	interValTime: 2000,
    onOpen(res) {
        console.log('连接成功')
		// this.nsend(JSON.stringify('nihao'));
    },
    onClose(err) {
        console.log('关闭了连接')
    },
    onReload(res) {
        console.log('重载：' + res)
    },
    onMsg(msg) {
        console.log(msg)
		store.commit('setSocketState',msg.data)
    }
})
Vue.prototype.$Socket = Socket;    //连接成功挂在到原型上