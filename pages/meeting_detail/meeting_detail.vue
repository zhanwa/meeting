<template>
	<view>
		<view class="title">
			{{m_obj.m_title}}
		</view>
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#4cd964"></uni-segmented-control>
		<view class="content">
			<view v-show="current === 0">
				<view class="dec flex-r">
					<label>会议简介:</label>
					<text>{{m_obj.m_content}}</text>
				</view>
				<view class="date flex-r">
					<label>会议时间:</label>
					<text>{{m_obj.b_time}}</text>
				</view>
				<view class="local flex-r">
					<label>会议地点:</label>
					<text>{{m_obj.m_place}}</text>
				</view>
				<view class="local flex-r">
					<label>会议状态:</label>
					<text>未开始</text>
				</view>
				<view class="serect flex-r">
					<label>会议秘钥:</label>
					<input type="text" placeholder="会议秘钥" v-model="s_value" />
				</view>
				<button type="primary" @click="apply()" v-if="m_obj.mcreator_id == u_id">管理会议</button>
				<button type="primary" @click="apply()" :disabled="sign" v-else>加入会议</button>
			</view>
			<view v-show="current === 1">
				选项卡2的内容
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				// 报名成功标志
				sign: false,
				items: ['详情', '报名人员'],
				current: 0,
				// 会议信息
				m_obj: {},
				m_id: '',
				u_id: uni.getStorageSync('SUID')
			};
		},
		methods: {
			onClickItem(event) {
				if (this.current !== event.currentIndex) {
					this.current = event.currentIndex;
				}
			},
			// 加入会议
			apply() {
				let u_id = uni.getStorageSync('SUID')
				this.$http.post('meetingapi/v1/getmeeting/', {
					u_id: u_id,
					m_id: this.m_id
				}).then(res => {
					console.log(res.data);
					if (res.data.msg == 200) {
						this.sign = true
					}
				}).catch(err => {
					console.log(err);
				})
			}
		},
		onLoad(option) {
			console.log(option);
			this.m_id = option.m_id
			// 获得会议详情
			this.$http.get('meetingapi/v1/getmeeting/', {
				params: {
					m_id: option.m_id
				}
			}).then(res => {
				this.m_obj = res.data.data
				console.log(this.m_obj);
			}).catch(err => {
				console.log(err);
			})
		}
	}
</script>

<style lang="less" scoped>

</style>
