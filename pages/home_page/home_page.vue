<template>
	<view class="first">
		<view class="friend_list" v-if="flag == 'friend'">
			<view class="cu-bar bg-white solid-bottom">
				<view class="action" @click="torequest">
					<text class="cuIcon-title text-orange" ></text> 请求消息
					<view class="cu-tag round bg-red sm">{{waitList.length}}</view>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-orange "></text> 好友列表
				</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item,index) in friendList" :key='index' @click="one(item)">
					<view class="cu-avatar round lg" :style="{backgroundImage:`url(${url}${item.image})`}"></view>
					<view class="content">
						<view class="text-grey">{{item.username}}</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								<text class="cuIcon-infofill text-red  margin-right-xs"></text>
								{{item.sign?item.sign:''}}
							</view> </view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">{{item.status?'在线':'离线'}}</view>
						<view class="cu-tag round bg-grey sm">{{item.num}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="friend_list" v-if="flag == 'wait'">
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-orange "></text> 请求列表
				</view>
				<view class="action">
					<button class="cu-btn bg-blue shadow" @click="tofriend">返回</button>
				</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item,index) in waitList" :key='index'>
					<view class="cu-avatar round lg" :style="{backgroundImage:`url(${url}${item.image})`}"></view>
					<view class="content">
						<view class="text-grey">{{item.username}}</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								<text class="cuIcon-infofill text-red  margin-right-xs"></text>
								{{item.sign}}
							</view> </view>
					</view>
					<view class="action flex-c w">
						<button type="primary" size="mini" @click="accept(item.u_id)">同意</button>
						<button type="warn" size="mini">拒绝</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let that
	export default {
		data() {
			return {
				u_id: uni.getStorageSync('SUID'),
				friendList:[],
				waitList:[],
				flag:'friend',
				url:this.baseurl,
				num:'',
				f_message:[] //接收到的消息列表
		}
	},
	mounted() {
		// 监听好友上线
		this.$nextTick(function(){
			this.$Socket.eventPatch.onMsg((msg,sk)=> {
				let data = JSON.parse(msg.data)
				if(data.data == 'up'){
					// 获取上线好友id
					let fid= data.fid
					if(that.friendList){
						that.friendList.map(el=>{
							if(el.u_id == fid){
								el.status = true
							}
						})
					}
				}else if(data.flag == 'onetoone'){
					this.f_message.push(data)
					console.log(this.f_message);
					console.log(data.flag);
					let f = this.friendList
					f.forEach(el=>{
						if(el.u_id == data.fid){
							if(!el.num){
								el.num = 1
							}else{
								el.num+=1
							}
							
						} 
					})
					this.friendList = f
					console.log(this.friendList);
				}
				
			})
		})
	},
	methods:{
		// 聊天
		one(item){
			console.log(item);
			console.log(item);
			let i = JSON.stringify(item)
			let f_message = JSON.stringify(this.f_message)
			uni.navigateTo({
				url:'../chat/chat?type=one&friend='+i+'&f_message='+f_message
			})
		},
		// 同意
		accept(id){
			// id为请求用户id
			this.$http.post('userapi/v1/friend/',{
				type:'accept',
				uid:this.u_id,
				rid:id
			}).then(res=>{
				if(res.data.msg == 'ok'){
					let index = this.waitList.findIndex((el)=>{
						el.id=id
					})
					console.log(index);
					that.waitList.splice(index,1)
				}
			}).catch()
		},
		tofriend(){
			this.flag = 'friend'
		},
		torequest(){
			this.flag = 'wait'
		},
		getmessage(){
			this.$http.get('userapi/v1/friend/',{params:{
				type:'getmessage',
				uid:this.u_id
			}}).then(res=>{
				if(res.data.msg == 'ok'){
					console.log(res);
					that.friendList = res.data.fList
					that.waitList = res.data.waitList
					// that.friendList.map(el=>{
					// 	el.num=0
					// })
				}
			}).catch()
		}
	},
	onLoad() {
		that = this
	},
	onShow() {
		this.getmessage()
	},
	beforeDestroy() {
		this.$Socket.nsend(JSON.stringify('不行'))
	}
}
</script>

<style lang="less">
.w{
	width: 300rpx !important;
}
</style>
