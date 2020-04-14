<template>
	<view class="meeting_detail">
		<view class="action">
			<text class="cuIcon-title text-orange "></text> 会议数据统计
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">报名人数:</text>
					
				</view>
				<view class="action">
					<view class="cu-tag round bg-green lg">{{m_obj.m_append}}</view>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">签到人数</text>
	
				</view>
				<view class="action">
					<view class="cu-tag round bg-red lg">{{m_obj.m_sign}}</view>
				</view>
			</view>
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 会议设置
			</view>
			<view class="cu-item arrow" @click="meeting_change">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">会议详情</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">会议邀请码</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">会议管理密码:</text>
					<text class="text-grey">{{m_obj.m_content}}</text>
				</view>
			</view>
			<view class="margin-top">
				<button type="primary" v-if="type=='append'">进入会议</button>
				<button type="primary" v-if="type=='manage'">管理会议</button>
				<button type="warn" v-if="type=='append'">退订会议</button>
				<button type="warn" v-if="type=='manage'">删除会议</button>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 会议信息
				m_obj: {},
				m_id: '',
				u_id: uni.getStorageSync('SUID'),
				// 参会人员
				append:[],
				// 判断是管理员,还是用户跳转过来
				type:''
			};
		},
		methods: {
			// 跳转到会议修改或查看页面
			meeting_change(){
				if(this.type == 'append'){
					uni.navigateTo({
						url:'./meeting_change?mid='+this.m_id
					})
				}else if(this.type == 'manage'){
					uni.navigateTo({
						url:'../create_meeting/create_meeting?type=put&mid='+this.m_id
					})
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
			// 判断是管理员,还是用户跳转过来
			this.type = option.type;
			this.m_id = option.mid;
			// 获得会议详情
			this.$http.get('meetingapi/v1/getmeeting/', {
				params: {
					type:'getmeetingmember',
					mid: option.mid
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
