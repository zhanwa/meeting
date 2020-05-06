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
			<view class="cu-item arrow" @click="meeting_code">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">会议邀请码</text>
				</view>
			</view>
			<view class="cu-item arrow" v-if="type == 'manage'">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey" v-if="type == 'manage'">会议管理密码:</text>
					
				</view>
			</view>
			<view class="margin-top">
				<button type="primary" v-if="type=='append' && append_flag == false" @click="apply">预定会议</button>
				<button type="primary" v-if="type=='append' && append_flag" @click="tomeeting">进入会议</button>
				<button type="primary" v-if="type=='manage'" @click="manage_meeting">管理会议</button>
				<button type="warn" v-if="type=='append' && append_flag" @click="back_meeting">退订会议</button>
				<button type="warn" v-if="type=='manage'" @click="del_meeting">删除会议</button>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	let that;
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
				type:'',
				// 判断是否加入会议
				append_flag:false
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
			// 跳转到会议邀请码页面
			meeting_code(){
				uni.navigateTo({
					url:'../qr_code/qr_code?type=meeting_code&flag='+this.m_obj.flag
				})
			},
			// 删除会议
			del_meeting(){
				uni.showModal({
					title:'删除会议',
					comtent:'确认删除吗?',
					success() {
						that.$http.delete('meetingapi/v1/setmeeting/',{
							mid:that.m_id
						}).then(res=>{
							if(res.data.msg == 'ok'){
								uni.showToast({
									title:'删除成功'
								})
							}
							uni.navigateBack(-1)
						}).catch()
					}
					
				})
			},
			// 加入会议
			apply() {
				this.$http.post('meetingapi/v1/getmeeting/', {
					type:'join',
					u_id: this.u_id,
					m_id: this.m_id
				}).then(res => {
					console.log(res.data);
					if (res.data.msg == 200) {
						this.append_flag = true
						this.m_obj.m_append = this.m_obj.m_append+1
						uni.showToast({
							title:'预定成功'
						})
					}
				}).catch(err => {
					console.log(err);
				})
			},
			// 进入会议
			tomeeting() {
				uni.navigateTo({
				    url: `../append/append?m_id=${this.m_id}&role=append`
				});
			},
			// 管理会议
			manage_meeting(){
				uni.navigateTo({
				    url: `../append/append?m_id=${this.m_id}&role=manage`
				});
			},
			// 退订会议
			back_meeting(){
				this.$http.post('meetingapi/v1/getmeeting/', {
					type:'back',
					u_id: this.u_id,
					m_id: this.m_id
				}).then(res => {
					console.log(res.data);
					if (res.data.msg == 200) {
						this.append_flag = false
						this.m_obj.m_append = this.m_obj.m_append-1
						uni.showToast({
							title:'退订成功'
						})
					}
				}).catch(err => {
					console.log(err);
				})
			}
		},
		onLoad(option) {
			that= this
			console.log(option);
			// 判断是管理员,还是用户跳转过来
			this.type = option.type;
			this.m_id = option.mid;
			// 获得会议数据
			this.$http.get('meetingapi/v1/getmeeting/', {
				params: {
					type:'getmeetingmember',
					mid: option.mid,
					uid:that.u_id
				}
			}).then(res => {
				this.m_obj = res.data.data
				if(res.data.data.append_flag == '1'){
					this.append_flag = true
				}
				console.log(this.m_obj);
			}).catch(err => {
				console.log(err);
			})
		}
	}
</script>

<style lang="less" scoped>

</style>
