<template>
	<view>
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#4cd964"></uni-segmented-control>
		<uni-search-bar placeholder="请输入要搜索会议名称" :cancelButton='none' @input="search"></uni-search-bar>
		<view class="forcard" v-if="flag == false" v-for="item in s_list" :key="item.m_id">
			<uni-card :title=item.m_title note="true" :is-shadow="true" class="flex-c"  @click='detail_meeting(item.m_id,item.mcreator_id)'>
				<text>简介:{{item.m_content}}</text>
				<view class="tag flex">
					<uni-tag v-for="(label,index) in item.mlabel" :key='index' :text=label.name> </uni-tag>
				</view>
				<template v-slot:footer>
					<view class="footer-box flex-r">
						<view v-if="item.mcreator_id == u_id" @click="nato(item.m_id,item.mcreator_id)">收藏</view>
						<view v-if="item.mcreator_id !== u_id" @click="nato(item.m_id)">加入</view>
						<view>评论</view>
						<view style="background-color: red;" @click="detail_meeting(item.m_id,item.mcreator_id)">分享</view>
					</view>
				</template>

			</uni-card>
		</view>
		<view class="content" v-if="flag">
			<view v-show="current === 0">
				<view class="forcard" v-for="item in m_list" :key="item.m_id">
					<uni-card :title=item.m_title note="true" :is-shadow="true" class="flex-c" @tap.self='detail_meeting(item.m_id,item.mcreator_id)' :extra="item.status?'进行中':'未开始'">
						<text>简介:{{item.m_content}}</text>
						<view class="tag flex">
							<uni-tag v-for="(label,index) in item.mlabel" :key='index' :text=label.name> </uni-tag>
						</view>
						<template v-slot:footer>
							<view class="footer-box flex-r">
								<view>收藏</view>
								<button type="primary" size="mini" @tap.stop="comment(item.m_id)">评论</button>
								<view @tap.stop='detail_meeting(item.m_id,item.mcreator_id)'>分享</view>
							</view>
						</template>
						
					</uni-card>
					<view class="comment" v-if="t_index == item.m_id">
						<view class="user_comment">
							<view class="rate flex-r" >
								<uni-rate max="5" :value="rate" style='padding-top: 10rpx;'></uni-rate>
								<button type="primary" size="mini" class="fabu" style="margin: 0;" @click="fubu(t_index)">发布</button>
							</view>
							<view class="cu-form-group align-start margin-top">
								<view class="title">评论</view>
								<textarea :value='commet_value' maxlength="-1" @input="textareaBInput" placeholder="请输入你的评论"></textarea>
							</view>
						</view>
					    <view class="uni-comment-list" v-for="(citem,cindex) in comment_list" :key='cindex'>
					       <!-- <view class="uni-comment-face">
					            <image :src="'http://192.168.2.104:8000/'+citem.avator"></image>
					        </view> -->
							<cmd-avatar :src="'http://192.168.2.104:8000/'+citem.avator"></cmd-avatar>
					        <view class="uni-comment-body">
					            <view class="uni-comment-top">
					                <text>{{citem.username}}</text>
					            </view>
					            <view class="uni-comment-date">
					                <text>{{citem.ctime}}</text>
					            </view>
					            <view class="uni-comment-content">{{citem.comment}}</view>
					        </view>
					    </view>
					</view>
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
	let that;
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniCard from '../../components/uni-card/uni-card.vue'
	import uniTag from "../../components/uni-tag/uni-tag.vue"
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	import cmdAvatar from "@/components/cmd-avatar/cmd-avatar.vue"
	export default {
		components: {
			uniSegmentedControl,
			uniCard,
			uniTag,
			uniSearchBar, //搜索框插件
			uniRate ,// 评分组件
			cmdAvatar
		},
		data() {
			return {
				rate:'2.5' ,// 评分数
				items: ['全部会议', '已完成', '未完成'],
				current: 0,
				m_list: [],
				u_id: uni.getStorageSync("SUID"),
				s_list: [], //搜索列表
				flag: true ,//搜索是隐藏m_list
				t_index:'', //打开的huiyi
				fold:false, // 弹出收起
				commet_value:'', //会议评论
				comment_list:[],//评论表
			}
		},
		methods: {
			fubu(mid){
				console.log(this.commet_value,this.rate)
				if(this.commet_value.trim()){
					this.$http.post('meetingapi/v1/comment/',{
						type:'post',
						rate:this.rate,
						comment:this.commet_value,
						mid:mid,
						uid:this.u_id 
					}).then(res=>{
						console.log(res)
						if(res.data.msg == 'ok'){
							that.rate = 2.5;
							that.commet_value = ''
							uni.showToast({
								title:'评论成功'
							})
						}else{
							uni.showToast({
								title:res.data.data
							})
						}
						
					}).catch()
				}else{
					uni.showToast({
						title:'不能为空啊'
					})
				}
				
			},
			// 评论框输入
			textareaBInput(e){
				console.log(e)
				this.commet_value=e.detail.value
			},
			// 展开评论
			comment(index){
				this.t_index = index
				this.$http.get('meetingapi/v1/comment/',{params:{
					type:'get',
					mid:index
				}}).then(res=>{
					console.log(res)
					this.comment_list = res.data.data
				}).catch()
			},
			//搜索框输入时
			search(e) {
				// 节流
				let search_timer = null
				if (search_timer == null) {
					search_timer = setTimeout(() => {
						// 输入的值
						let search_v = e.value.toLowerCase()
						this.flag = false
						let m_list = this.m_list
						// 保存查找到的数组
						let NewItems = [];
						m_list.map(function(item) {
							if (item.m_title.toLowerCase().search(search_v) != -1) {
								NewItems.push(item);
							}
						});
						this.s_list = NewItems
					}, 500)
				}else{
					clearTimeout(search_timer)
				}

			},
			// event接收{currentIndex: 2}对象
			onClickItem(event) {
				if (this.current !== event.currentIndex) {
					this.current = event.currentIndex;
				}
			},
			// 详情接口
			detail_meeting(m_id, mcreator_id) {
				let role = '';
				if (mcreator_id == this.u_id) {
					role = 'manage'
				} else {
					role = 'append'
				}
				uni.navigateTo({
					url: `../meeting_detail/meeting_detail?mid=${m_id}&type=${role}`
				});
			},
			// 管理或加入会议接口
			nato(m_id, mcreator_id) {
				let role = '';
				let send_data = {};
				if (mcreator_id == this.u_id) {
					role = 'manage';
					send_data = {
						type: 'manage',
						mid: m_id,
						uid: that.u_id,
					}
				} else {
					role = 'append'
					send_data = {
						type: 'append',
						mid: m_id,
						uid: that.u_id,
					}
				}
				uni.navigateTo({
					url: `../append/append?m_id=${m_id}&role=${role}`,
					success() {
						that.$Socket.nsend(JSON.stringify(send_data))
					}
				});
			}
		},
		onShow() {
			that = this
			this.t_index=''
			this.$http.get('meetingapi/v1/setmeeting/', {
				params: {
					opt: "all"
				}
			}).then(res => {
				this.m_list = res.data.data.reverse()
				this.m_list.forEach((el, index) => {
					let s = JSON.parse(el.mlabel)
					this.m_list[index].mlabel = s
				})
				console.log(res);
			}).catch(err => {
				console.log(err);
			})
		}
	}
</script>

<style lang="less">
	.footer-box {
		justify-content: space-between;
	}
	.comment{
		width: 90%;
		margin: 0 auto;
		background-color: #D9D9D9;
		.user_comment{
			background-color: #fff;
		}
	}
</style>
