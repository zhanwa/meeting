<template>
	<view class="my-meeting">

		<view class="forcard" v-for="item in m_list" :key="item.m_id">
			<uni-card :title=item.m_title note="true" :is-shadow="true">
				<text>{{item.m_content}}</text>
				<text>{{item.m_place}}</text>
				<text>{{item.b_time}}</text>
				<uni-tag :text=item.mlabel> </uni-tag>
				<template v-slot:footer>
					<view class="footer-box flex-r">
						<view v-if="type == 'create'">开始</view>
						<view v-if="type == 'append'">进入</view>
						<view>分享</view>
						<view style="background-color: red;" @click="delete_meeting(item.m_id)">删除</view>
					</view>
				</template>

			</uni-card>
		</view>

	</view>
</template>

<script>
	import uniCard from '../../components/uni-card/uni-card.vue'
	import uniTag from "../../components/uni-tag/uni-tag.vue"
	export default {
		components: {
			uniCard,
			uniTag
		},
		data() {
			return {
				type:'',
				// 会议状态
				extra: '',
				// 会议数据
				m_list: []
			};
		},
		methods: {
			delete_meeting(m_id) {
				let _self = this
				uni.showModal({
					title: '提示',
					content: '是否确认删除会议',
					success: function(res) {
						if (res.confirm) {
							let index = _self.m_list.findIndex(item =>
								item.m_id === m_id
							)
							_self.m_list.splice(index, 1)
						} else if (res.cancel) {}
					}
				});
			}
		},
		onLoad(option) {
			this.type = option.type
			let u_id = uni.getStorageSync("SUID")
			if (this.type == 'create') {
				this.$http.get('meetingapi/v1/setmeeting/', {
					params: {
						opt : "create",
						u_id: u_id
					}
				}).then(res => {
					this.m_list = res.data.data.reverse()
				}).catch(err => {
					console.log(err);
				})
			}
			else if(this.type == 'append'){
				this.$http.get('meetingapi/v1/setmeeting/', {
					params: {
						opt : "append",
						u_id: u_id
					}
				}).then(res => {
					this.m_list = res.data.data.reverse()
				}).catch(err => {
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="less">
	.footer-box {
		justify-content: space-between;
	}
</style>
