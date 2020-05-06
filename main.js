import Vue from 'vue'
import App from './App'
import http from '@/utils/luch-request/base_request.js' // 全局挂载引入，配置相关在该base-request.js文件里修改
Vue.prototype.baseurl = "http://192.168.2.104:8000/"
Vue.prototype.basewsurl = "ws://192.168.2.104:8000/"
// Vue.prototype.baseurl = "http://free.shenzhuo.vip:13104/"
// Vue.prototype.basewsurl = "ws://free.shenzhuo.vip:13104/"
Vue.prototype.$http = http

import './utils/useSocket.js';     //路径换成自己的
import store from "./store/index.js"; //路径换成自己的
Vue.prototype.$store = store;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
