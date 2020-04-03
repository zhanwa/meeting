<template>
	<view>
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#4cd964"></uni-segmented-control>
		<view class="content">
			<view v-show="current === 0">
				<view class="forcard" v-for="item in m_list" :key="item.m_id">
					<uni-card :title=item.m_title note="true" :is-shadow="true">
						<text>{{item.m_content}}</text>
						<text>{{item.m_place}}</text>
						<text>{{item.b_time}}</text>
						<uni-tag :text=item.mlabel> </uni-tag>
						<template v-slot:footer>
							<view class="footer-box flex-r">
								<view v-if="item.mcreator_id == u_id" @click="nato(item.m_id,item.mcreator_id)">开始</view>
								<view v-if="item.mcreator_id !== u_id" @click="nato(item.m_id)">加入</view>
								<view>分享</view>
								<view style="background-color: red;" @click="detail_meeting(item.m_id)">详情</view>
							</view>
						</template>

					</uni-card>
				</view>

			</view>
			<view v-show="current === 1">
				选项卡2的内容
			</view>
			<view v-show="current === 2">
				选项卡3的内容
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniCard from '../../components/uni-card/uni-card.vue'
	import uniTag from "../../components/uni-tag/uni-tag.vue"
	export default {
		components: {
			uniSegmentedControl,
			uniCard,
			uniTag
		},
		data() {
			return {
				items: ['全部会议', '已完成', '未完成'],
				current: 0,
				m_list: [],
				u_id : uni.getStorageSync("SUID")
			}
		},
		methods: {
			// event接收{currentIndex: 2}对象
			onClickItem(event) {
				if (this.current !== event.currentIndex) {
					this.current = event.currentIndex;
				}
			},
			detail_meeting(m_id) {
				uni.navigateTo({
				    url: `../meeting_detail/meeting_detail?m_id=${m_id}`
				});
			},
			nato(m_id,mcreator_id) {
				let role = '';
				if(mcreator_id == this.u_id){
					role = 'manage'
				}else{
					role = 'append'
				}
				uni.navigateTo({
				    url: `../append/append?m_id=${m_id}&role=${role}`
				});
			}
		},
		onLoad() {
			
			this.$http.get('meetingapi/v1/setmeeting/', {
				params: {
					opt:"all"
				}
			}).then(res => {
				this.m_list = res.data.data.reverse()
			}).catch(err => {
				console.log(err);
			})
		}
	}
</script>

<style>
	.footer-box {
		justify-content: space-between;
	}
</style>
