<template>
	<view>
		<view class="cu-timeline" v-for="(item,index) in aList" :key=index>
			<view class="cu-time">系统</view>
			<view class="cu-item cur cuIcon-noticefill">
				<view class="content bg-green shadow-blur">
					<text>{{item.Atime}}</text>{{item.Acontent}}
				</view>
			</view>
		</view>
		<button type="primary" size="default" style="position: absolute; bottom: 0;" v-if="role == 'manage'">发表公告</button>
	</view>
</template>

<script>
	let that
	export default {
		data() {
			return {
				role: '',
				mid: '',
				aList:[] //公告列表
			}
		},
		methods: {

		},
		onLoad(option) {
			that = this
			console.log(option);
			this.mid = option.m_id
			this.role = option.role
			this.$http
				.get('meetingapi/v1/announce', {
					params: {
						mid: option.m_id
					}
				})
				.then(res => {
					if (res.data.msg === 'ok') {
						that.aList = res.data.data.reverse()
						console.log(that.aList)
					}
				})
		}
	}
</script>

<style lang="less">

</style>
