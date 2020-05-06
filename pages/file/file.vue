<template>
	<view class="file">
		<view v-if='role=="manage"'>
			<view class='cut'></view>
			<view class='title_block'>
				<view class='title_icon'>
					<image src='title_file'></image>
				</view>
				<text>文件管理</text>
			</view>

			<view class='cut'></view>

			<view v-for='(item,index) in file_list_prepare' :key='index'>

				<view :id='index' style='display:flex;' hover-class='choose_block' @click='btn_preview' @longpress='showActionSheet2'>
					<view class='type_block'>
						<image src='item.Dstatus_icon'></image>
					</view>
					<view class='file_info'>
						<view class='file_name'>{{item.Dname}} ({{item.Dstatus}})</view>
						<view class='file_time'>{{item.Dtime}}</view>
						<view class='file_download' :id='index' @click='btn_manage'>
							<image v-if='item.download=="true"' src='can_download'></image>
							<image v-if='item.download=="false"' src='cannot_download'></image>
						</view>
						<view class='file_more'>
							<view class='dot'></view>
						</view>
					</view>
				</view>

			</view>
			<button type="primary" @click="upfile">上传文件</button>
			<view class='tip'>Tip：长按文件执行操作</view>

		</view>

		<view v-if='role=="append"'>

			<view class='cut'></view>

			<view class='title_block'>
				<view class='title_icon'>
					<image src='title_file'></image>
				</view>
				<text>文件管理</text>
			</view>

			<view class='cut'></view>

			<view v-for='(item,index) in file_list_prepare' :key='index'>

				<view style='display:flex;' :id='index' @click='btn_preview' @longpress='showActionSheet1'>
					<view class='type_block'>
						<image src='item.Dstatus_icon'></image>
					</view>
					<view class='file_info'>
						<view class='file_name'>{{item.Dname}} ({{item.Dstatus}})</view>
						<view class='file_time'>{{item.Dtime}}</view>
						<view class='file_collect'>
							<image src='file_collect'></image>
						</view>
						<view class='file_more'>
							<view class='dot'></view>
						</view>
					</view>
				</view>

			</view>

			<view class='tip'>Tip：长按文件执行操作</view>
		</view>

		<view v-if='role=="collect"'>

			<view class='cut'></view>

			<view class='title_block'>
				<view class='title_icon'>
					<image src='title_file'></image>
				</view>
				<text>文件管理</text>
			</view>

			<view class='cut'></view>

			<view v-for='(item,index) in file_list_prepare' :key='index'>

				<view style='display:flex;' :id='index' @click='btn_preview' @longpress='showActionSheet3'>
					<view class='type_block'>
						<image src='item.Dstatus_icon'></image>
					</view>
					<view class='file_info'>
						<view class='file_name'>{{item.Dname}} ({{item.Dstatus}})</view>
						<view class='file_time'>{{item.Dtime}}</view>
						<view class='file_collect'>
							<image src='file_collect'></image>
						</view>
						<view class='file_more'>
							<view class='dot'></view>
						</view>
					</view>
				</view>

			</view>

			<view class='tip'>Tip：长按文件执行操作</view>
		</view>
		<!-- <min-action-sheet ref="as"></min-action-sheet> -->
	</view>
</template>

<script>
	let that;
	import {
		getNewTokenServe
	} from '../../utils/api.js'
	import minActionSheet from '@/components/min-action-sheet/min-action-sheet'
	export default {
		components: {
			minActionSheet
		},
		data() {
			return {
				// 保存上传文件的列表
				tempFilePaths: '',
				id: '', //会议ID
				index: '',
				type: 'list', //默认为选择页面
				role: 'attend',
				file_list_prepare: [],
				file_list_download: [{
					name: '学习资料',
					type: 'ppt',
					time: '2018-01-12'
				}, {
					name: '学习资料',
					type: 'ppt',
					time: '2018-01-12'
				}, {
					name: '学习资料',
					type: 'ppt',
					time: '2018-01-12'
				}, {
					name: '学习资料',
					type: 'ppt',
					time: '2018-01-12'
				}]
			};
		},
		onLoad(options) {
			console.log(options);
			that = this
			if (options.role == 'append') {
				that.id = options.m_id;
				that.role = options.role;
				that.$http.get(that.baseurl + 'meetingapi/v1/file', {
					params: {
						role: 'append',
						mid: options.m_id
					}
				}).then(res => {
					if (res.data.msg == 'ok') {
						that.file_list_prepare = res.data.data
						console.log(that.file_list_prepare);
					}
				}).catch()

			} else if (options.role == 'manage') {
				that.id = options.m_id;
				that.role = options.role;
				that.$http.get(that.baseurl + 'meetingapi/v1/file', {
					params: {
						role: 'manage',
						mid: options.m_id
					}
				}).then(res => {
					if (res.data.msg == 'ok') {
						that.file_list_prepare = res.data.data
						console.log(that.file_list_prepare);
					}
				}).catch()

			} else if (options.role == 'collect') {

				wx.request({
					url: 'https://www.viaviai.com/thz/sever/collect.php',
					data: {
						'type': 'get_file',
						'openid': app.globalData.openid
					},
					header: {},
					method: 'GET',
					dataType: 'json',
					responseType: 'text',
					success: function(res) {
						that.setData({
							file_list_prepare: res.data,
							role: options.role
						});
					},
					fail: function(res) {},
					complete: function(res) {},
				})

			}
		},
		methods: {
			// 上传文件
			upfile() {

				console.log('upfile');
				wx.chooseMessageFile({
					count: 1,
					type: 'file',
					success(res) {
						console.log(res);
						// 将文件信息付给tempFilePaths
						that.tempFilePaths = res.tempFiles
						console.log(that.tempFilePaths);
						// 这里取统一的name,方便服务器取到,因为这里的name传到服务器时键的形式
						// 这里直接把全部信息传给服务器,filePath传到服务器是值得形式
						that.$http.upload(that.baseurl + 'meetingapi/v1/file/', {
							name: 'filename',
							filePath: that.tempFilePaths[0].path,
							formData: {
								fname: that.tempFilePaths[0].name,
								mid: that.id
							}
						}, ).then(res => {
							let data = JSON.parse(res.data)
							if (data.msg == 'ok') {
								that.file_list_prepare.push(data.data)
								console.log(that.file_list_prepare);
							}
						}).catch();

					}
				})
			},
			// showActionSheet1() {
			// 	this.$refs.as.handleShow({
			// 		slot:'文件操作',
			// 		actions: [{
			// 				name: '查看文件',
			// 				icon: 'iconfont active',
			// 				color: '#007aff'
			// 			},
			// 			{
			// 				name: '收藏文件',
			// 				image: 'http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
			// 			},
			// 			{
			// 				name: '下载文件',
			// 				icon: 'iconfont active',
			// 				color: '#007aff',
			// 				image: 'http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
			// 			}
			// 		],
			// 		success: (res) => {
			// 			switch (res.id) {
			// 				// -1代表取消按钮
			// 				case -1:
			// 					console.log(res)
			// 					break
			// 				case 0:
			// 					console.log(res)
			// 					break
			// 				case 1:
			// 					console.log(res)
			// 					break
			// 				case 2:
			// 					console.log(res)
			// 					break
			// 			}
			// 		}
			// 	})
			// },
			showActionSheet1(e) {
				let file_index = e.currentTarget.id
				let file_id = that.file_list_prepare[file_index].id
				console.log(file_index);
				uni.showActionSheet({
					itemList: ['预览文件', '收藏文件', '下载文件'],
					success: function(res) {
						console.log(res);
						if (res.tapIndex == "0") {
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							console.log('预览文件');
							uni.downloadFile({
								url: that.baseurl + 'meetingapi/v1/file/?file_id=' + file_id + '&mid=' + that.id + '&role=download',
								header: {
									token: getNewTokenServe()
								},
								success: (res) => {
									uni.showToast({
										title: '打开成功',
										duration: 2500
									})
									console.log(res);
									var filePath = res.tempFilePath;
									//新页面打开文档
									uni.openDocument({
										filePath: filePath,
										success: function(res) {
											console.log('打开文档成功');
										}
									});
								},
								complete:(res)=>{
									uni.hideLoading()
								}
							})
						} else if (res.tapIndex == '2') {
							uni.showLoading({
								title: '下载中',
								mask: true
							})
							console.log('下载文件');
							uni.downloadFile({
								url: that.baseurl + 'meetingapi/v1/file/?file_id=' + file_id + '&mid=' + that.id + '&role=download',
								header: {
									token: getNewTokenServe()
								},
								success: (res) => {
									uni.showToast({
										title: '下载成功',
										duration: 2500
									})
									console.log(res);
									var filePath = res.tempFilePath;
									// 新页面打开文档
									// uni.openDocument({
									//   filePath: filePath,
									//   success: function (res) {
									//     console.log('打开文档成功');
									//   }
									// });
									// 永久保存
									uni.saveFile({
										tempFilePath: filePath,
										success(res) {
											console.log(res);
											uni.getSavedFileList({
												success: function(res) {
													console.log(res.fileList);
												}
											});
										},
										fail(err) {
											console.log('文件过大');
										}
									})
						
								},
								complete:(res)=>{
									uni.hideLoading()
								}
							});
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			showActionSheet2(e) {
				let file_index = e.currentTarget.id
				let file_id = that.file_list_prepare[file_index].id
				console.log(file_id);
				uni.showActionSheet({
					itemList: ['预览文件', '隐藏文件', '收藏文件', '下载文件'],
					success: function(res) {
						console.log(res);
						if (res.tapIndex == "0") {
							uni.showLoading({
								title: '加载中',
								mask: true
							})
							console.log('预览文件');
							uni.downloadFile({
								url: that.baseurl + 'meetingapi/v1/file/?file_id=' + file_id + '&mid=' + that.id + '&role=download',
								header: {
									token: getNewTokenServe()
								},
								success: (res) => {
									uni.showToast({
										title: '打开成功',
										duration: 2500
									})
									console.log(res);
									var filePath = res.tempFilePath;
									//新页面打开文档
									uni.openDocument({
										filePath: filePath,
										success: function(res) {
											console.log('打开文档成功');
										}
									});
								},
							})
						} else if (res.tapIndex == '3') {
							uni.showLoading({
								title: '下载中',
								mask: true
							})
							console.log('下载文件');
							uni.downloadFile({
								url: that.baseurl + 'meetingapi/v1/file/?file_id=' + file_id + '&mid=' + that.id + '&role=download',
								header: {
									token: getNewTokenServe()
								},
								success: (res) => {
									uni.showToast({
										title: '下载成功',
										duration: 2500
									})
									console.log(res);
									var filePath = res.tempFilePath;
									// 新页面打开文档
									// uni.openDocument({
									//   filePath: filePath,
									//   success: function (res) {
									//     console.log('打开文档成功');
									//   }
									// });
									// 永久保存
									uni.saveFile({
										tempFilePath: filePath,
										success(res) {
											console.log(res);
											uni.getSavedFileList({
												success: function(res) {
													console.log(res.fileList);
												}
											});
										},
										fail(err) {
											console.log('文件过大');
										}
									})

								}
							});
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.title_block {
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		background: #ffffff;
	}

	.cut {
		width: 100%;
		height: 30rpx;
		background: #efeff4;
	}

	.title_icon {
		margin-left: 5%;
		height: 100rpx;
		width: 80rpx;
		background: #1d93ec;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.title_icon image {
		width: 55rpx;
		height: 55rpx;
	}

	.title_block text {
		height: 100rpx;
		margin-left: 3%;
		font-size: 36rpx;
		display: flex;
		align-items: center;
	}

	.type_block {
		width: 20%;
		height: 140rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #ffffff;
		border-bottom: 2rpx solid #ffffff;
	}

	.type_block image {
		width: 80rpx;
		height: 80rpx;
	}

	.file_download {
		width: 50rpx;
		height: 140rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 70rpx;
	}

	.file_download image {
		width: 50rpx;
		height: 50rpx;
	}

	.file_collect {
		width: 50rpx;
		height: 140rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 70rpx;
	}

	.file_collect image {
		width: 28rpx;
		height: 28rpx;
	}

	.file_more {
		width: 50rpx;
		height: 140rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 20rpx;
	}

	.dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 100%;
		background: #DCDCDC;
	}

	.file_info {
		width: 80%;
		height: 140rpx;
		border-bottom-style: solid;
		border-bottom-width: 2rpx;
		border-bottom-color: #E6E6E6;
		display: flex;
		flex-wrap: wrap;
		position: relative;
		background: #ffffff;
	}

	.file_name {
		width: 75%;
		height: 50rpx;
		color: #333333;
		position: absolute;
		top: 30rpx;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file_time {
		width: 60%;
		height: 30rpx;
		font-size: 24rpx;
		color: #888888;
		position: absolute;
		bottom: 30rpx;
		display: flex;
		align-items: center;
	}

	.tip {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #A0A0A0;
		background: #ffffff;
		font-size: 26rpx;
		border-top: 40rpx solid #ffffff;
	}

	.choice_container {
		width: 100%;
		height: 114rpx;
		background: #ffffff;
		border-top-color: #F0F0F0;
		border-top-style: solid;
		border-top-width: 1rpx;
		position: absolute;
		bottom: 0rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.prepare_text {
		font-size: 35rpx;
		width: 180rpx;
		color: #888888;
		padding-bottom: 10rpx;
		display: flex;
		justify-content: center;
	}

	.prepare_text_choose {
		width: 180rpx;
		font-size: 35rpx;
		color: #0066b9;
		padding-bottom: 10rpx;
		display: flex;
		justify-content: center;
		border-bottom-color: #0066b9;
		border-bottom-style: solid;
		border-bottom-width: 6rpx;
	}

	.finish_text {
		width: 180rpx;
		font-size: 35rpx;
		color: #888888;
		padding-bottom: 10rpx;
		display: flex;
		justify-content: center;
	}

	.finish_text_choose {
		width: 180rpx;
		font-size: 35rpx;
		color: #0066b9;
		padding-bottom: 10rpx;
		display: flex;
		justify-content: center;
		border-bottom-color: #0066b9;
		border-bottom-style: solid;
		border-bottom-width: 6rpx;
	}

	.choose_block {
		background: #A0A0A0;
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
