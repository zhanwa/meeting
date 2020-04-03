import Request from './request'
import {getNewTokenServe} from '../api.js'
const http = new Request()
http.setConfig((config) => { /* 设置全局配置 */
	// config.baseUrl = 'http://127.0.0.1:8000/' /* 根域名不同 */
	config.baseUrl = 'http://192.168.2.104:8000/'
	config.header = {
		...config.header
	}
	return config
})


http.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
	// config.header = {
	// 	// 'content-type': 'application/json',
	// 	token: getNewTokenServe()
	// }
	config.header['token'] = getNewTokenServe()
	if(config.method === 'UPLOAD'){
		config.header['content-type']='multipart'
	}

	// if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
	// 	cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
	// }

	return config
})
export default http
