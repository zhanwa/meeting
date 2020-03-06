<template>
	<view class="create_meeting">
		<view class="m-title flex-r">
			<label for="title">会议标题:</label><input type="text" placeholder="会议标题" v-model="t_value" />
		</view>
		<view class="dec flex-r">
			<label>会议简介</label>
			<input type="text" placeholder="会议简介" v-model="d_value" />
		</view>
		<view class="serect flex-r">
			<label>会议秘钥</label>
			<input type="text" placeholder="会议秘钥" v-model="s_value" />
		</view>
		<view class="date flex-r">
			<label>会议日期</label>
			<picker mode="date" :value="date" start="2020-03-02" end="2020-06-19" @change="bindDateChange">
				<view>{{date}}</view>
			</picker>
		</view>
		<view class="time flex-r">
			<label>会议时间</label>
			<picker mode="time" :value="time" @change="bindTimeChange">
				<view>{{time}}</view>
			</picker>
		</view>
		<view class="location flex-r">
			<label>会议地点</label>
			<input type="text" placeholder="会议地点" v-model="l_value"/>
		</view>
		<view class="label flex-r">
			<label>会议标签</label>
			<picker mode="selector" :value="index" :range="label" @change="bindPickerChange">
				<view>{{label[index]}}</view>
			</picker>
		</view>
		<button type="primary" class="submit" @click="submit">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				// 标题
				t_value:'',
				// 秘钥
				s_value:'',
				// 位置
				l_value:'',
				// 描述
				d_value:'',
				index: 0,
				label: ['wo', 'shi', 'nidie'],
				date: currentDate,
				time: '12:01'
			}
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target)
				this.index = e.target.value
			},
			bindDateChange: function(e) {
				console.log(e.target);
				this.date = e.target.value
			},
			bindTimeChange: function(e) {
				console.log(e.target);
				this.time = e.target.value
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
				let date = this.date+" "+this.time
				if(!this.t_value || !this.s_value){
					console.log('不能为空');
					return
				}
				this.$http.post("meetingapi/v1/setmeeting/", {
					u_id:uni.getStorageSync("SUID"),
					title:this.t_value,
					dec:this.d_value,
					serect:this.s_value,
					location:this.l_value,
					date:date,
					label:this.label[this.index]
				}).then(res => {
					console.log(typeof res.data);
				}).catch(err => {
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="less">

</style>
