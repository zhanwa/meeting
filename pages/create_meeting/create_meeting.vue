<template>
	<view class="create_meeting">
		<view class="cu-form-group">
			<view class="title">会议标题</view>
			<input placeholder="请输入会议标题" name="input" @input='chang_title' :value="t_value"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">会议类型</view>
			<picker @change="PickerChange" :range="picker">
				<view class="picker">
					{{type>-1?picker[type]:m_detail.gcontent?m_detail.gcontent:'会议类型'}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">人数限制</view>
			<input placeholder="不能超过200人" type="number" @input='chang_limit' :value="limit"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">会议秘钥</view>
			<input placeholder="请输入参加秘钥" name="input" @input='chang_secret' :value="s_value"></input>
		</view>

		<view class="cu-form-group" @tap="showModal" data-target="ChooseModal">
			<view class="title">会议标签</view>
			<view class="cu-capsule radius" v-for="(item,index) in label" :key='index'>
				<view class="cu-tag line-blue">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="modalName=='ChooseModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white">
					<view class="action text-blue" @tap="hideModal">取消</view>
					<view class="action text-green" @tap="hideModal">确定</view>
				</view>
				<view class="grid col-3 padding-sm">
					<view v-for="(item,index) in checkbox" class="padding-xs" :key="index">
						<button class="cu-btn orange lg block" :class="item.checked?'bg-blue':'line-orange'" @tap="ChooseCheckbox"
						 :data-value="item.value"> {{item.name}}
						</button>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-form-group">
			<view class="title">会议地点</view>
			<input placeholder="请输入会议地点" name="input" @input='chang_location' :value="l_value"></input>
			<text class='cuIcon-locationfill text-orange' @click="location"></text>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">开始日期选择</view>
			<picker mode="date" :value="start_data" start="2020-03-01" end="2066-09-01" @change="startDateChange">
				<view class="picker">
					{{start_date}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">开始时间选择</view>
			<picker mode="time" :value="start_time" start="07:01" end="23:01" @change="startTimeChange">
				<view class="picker">
					{{start_time}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">结束日期选择</view>
			<picker mode="date" :value="stop_date" start="2020-03-01" end="2066-09-01" @change="stopDateChange">
				<view class="picker">
					{{stop_date}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">结束时间选择</view>
			<picker mode="time" :value="stop_time" start="07:01" end="23:01" @change="stopTimeChange">
				<view class="picker">
					{{stop_time}}
				</view>
			</picker>
		</view>

		<view class="cu-form-group align-start margin-top">
			<view class="title">会议简介</view>
			<textarea :value='d_value' maxlength="-1" @input="textareaBInput" placeholder="请输入会议简介"></textarea>
		</view>
		<button v-if="chang_flag == 'put'" type="primary" class="submit" @click="chang_meeting">修改会议</button>
		<button v-else type="primary" class="submit" @click="submit">创建会议</button>
		
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				// 开始日期
				start_date: currentDate,
				// 开始时间
				start_time: '12:01',
				// 结束日期
				stop_date: currentDate,
				// 结束时间
				stop_time: '12:01',
				// 标题
				t_value: '',
				// 秘钥
				s_value: '',
				// 位置
				l_value: '',
				// 描述
				d_value: '',
				// 人数限制
				limit: '',
				// 会议类型
				picker: ['现场会议', '视频会议'],
				type: -1,
				// 会议类型
				style: '',
				// 会议标签模态框显示标志
				modalName: '',
				// 选中标签列表,
				// 选中3个,禁止再选标志
				// 会议选中的标签,最多三个
				label: [],
				// 会议可选择的标签
				checkbox: [{
					value: 0,
					name: '普通会议',
					checked: false

				}, {
					value: 1,
					name: '视频会议',
					checked: false

				}, {
					value: 2,
					name: '公司会议',
					checked: false

				}, {
					value: 3,
					name: '讲座',
					checked: false
				}, {
					value: 4,
					name: '宣讲会',
					checked: false
				}, {
					value: 5,
					name: '培训会议',
					checked: false
				}],
				// 修改会议时传过来的mid
				mid: '',
				// 会议详细数据
				m_detail: [],
				// 修改会议标志
				chang_flag:'',
				// 会议数量加一标志
				Mmeeting_update:0

			}
		},
		methods: {
			// 标题改变
			chang_title(e) {
				this.t_value = e.detail.value
				console.log(e);
			},
			// 人数限制改变
			chang_limit(e) {
				this.limit = e.detail.value
			},
			// 会议秘钥改变
			chang_secret(e) {
				this.s_value = e.detail.value
			},
			// 位置改变
			chang_location(e) {
				this.l_value = e.detail.value
			},
			// 有点bug,以后再说
			ChooseCheckbox(e) {
				let items = this.checkbox;
				let values = e.currentTarget.dataset.value;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].value == values) {
						items[i].checked = !items[i].checked;
						if (items[i].checked == true) {
							this.label.push(items[i])
							// 重组数组覆盖
							this.label.forEach((el, index) => {
								if (index >= 3) {
									this.label[0].checked = false;
									this.label.splice(0, 1);
								}
							})
						} else if (items[i].checked == false) {
							let dindex = this.label.findIndex(value => value == items[i].name)
							this.label.splice(dindex, 1)
						}
						break
					}
				}

			},
			// 会议标签赋值
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			// 会议类型选择
			PickerChange(e) {
				this.type = e.detail.value
				this.style = this.picker[this.type]
				console.log(this.style);
			},
			// 关闭会议标签模态框
			hideModal(e) {
				this.modalName = null
			},
			// 调起地图定位按钮
			location() {
				uni.chooseLocation({
					success(res) {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					}
				});
			},
			// 会议简介
			textareaBInput(e) {
				this.d_value = e.detail.value
			},
			// 开始日期改变
			startDateChange(e) {
				console.log(e.target);
				this.start_date = e.target.value
			},
			// 开始时间改变
			startTimeChange(e) {
				console.log(e.target);
				this.start_time = e.target.value
			},
			// 结束日期改变
			stopDateChange(e) {
				console.log(e.target);
				this.stop_date = e.target.value
			},
			// 结束时间改变
			stopTimeChange(e) {
				console.log(e.target);
				this.stop_time = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			submit() {
				let that = this
				console.log(this.t_value, this.d_value, this.s_value, this.start_date, this.style);
				let date = this.date + " " + this.time
				if (!this.t_value || !this.s_value) {
					uni.showToast({
						title:'标题不能为空'
					})
					return
				}
				this.$http.post("meetingapi/v1/setmeeting/", {
					u_id: uni.getStorageSync("SUID"),
					title: this.t_value,
					dec: this.d_value,
					serect: this.s_value,
					location: this.l_value,
					date: date,
					label: this.label,
					type: this.style,
					limit: this.limit,
					start_date: this.start_date,
					start_time: this.start_time,
					stop_date: this.stop_date,
					stop_time: this.stop_time
				}).then(res => {
					let mid = res.data.data.m_id
					console.log(mid);
					console.log(res.data.msg);
					if (res.data.msg == 'ok') {
						// *号和parseInt等一样可将字符串转为数字
						let up_num = that.Mmeeting_update + 1;
						uni.setStorageSync('Mmeeting_update',up_num+'')
						uni.redirectTo({
							url: '../meeting_detail/meeting_detail?mid=' + mid + '&type=manage',
							success() {
								uni.showToast({
									title: '创建成功'
								})
							}
						})
					}
				}).catch(err => {
					console.log(err);
				})
			},
			// 修改会议
			chang_meeting(){
				let that = this;
				this.$http.put("meetingapi/v1/setmeeting/", {
					mid:this.mid,
					title: this.t_value,
					dec: this.d_value,
					serect: this.s_value,
					location: this.l_value,
					label: this.label,
					type: this.style,
					limit: this.limit,
					start_date: this.start_date,
					start_time: this.start_time,
					stop_date: this.stop_date,
					stop_time: this.stop_time
				}).then(res => {
					console.log(res);
					if (res.data.msg == 'ok') {
						uni.redirectTo({
							url: '../meeting_detail/meeting_detail?mid=' + that.mid + '&type=manage',
							success() {
								uni.showToast({
									title: '修改成功'
								})
							}
						})
					}
				}).catch(err => {
					console.log(err);
				})
			}
		},
		
		onLoad(options) {
			let that = this
			uni.getStorage({
			    key: 'Mmeeting_update',
			    success: function (res) {
					that.Mmeeting_update = parseInt(res.data)
					console.log(that.Mmeeting_update);
			    }
			});
			if (options.type == 'put') {
				uni.setNavigationBarTitle({
					title: '修改会议'
				});
				this.chang_flag = options.type
				this.mid = options.mid;
				// 获取会议信息填充表格以便修改
				this.$http.get('meetingapi/v1/getmeeting', {
					params: {
						type: 'getmeetingdetail',
						mid: options.mid
					}
				}).then(res => {

					this.m_detail = res.data.data
					this.t_value = this.m_detail.m_title;
					this.s_value = this.m_detail.vcontent;
					this.l_value = this.m_detail.m_place;
					this.d_value = this.m_detail. m_content;
					this.limit = this.m_detail.limits;
					this.style = this.m_detail.gcontent;
					
					this.start_date = this.m_detail.e_time;
					this.start_time = this.m_detail.c_time;
					this.stop_date = this.m_detail.s_time;
					this.stop_time = this.m_detail.b_time;
					this.label = JSON.parse(this.m_detail.mlabel)
				}).catch()
			}
		}
	}
</script>

<style lang="less">

</style>
