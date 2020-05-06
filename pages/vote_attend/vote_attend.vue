<template>
	<view class="vote_attend">
		<view v-if='type=="list"'>
			<view class='title_block'>
				<view class='title_icon'>
					<image src='title_record'></image>
				</view>
				<text>最新投票</text>
			</view>

			<view class='cut'></view>

			<view v-for='(item,index) in vote' id='index' :key='index' class='vote_record_block' @click='btn_vote'>
				<text class='vote_id'>{{index+1}}</text>
				<text class='vote_time'>{{item[0].time}}</text>
				<image src='enter'></image>
			</view>

		</view>

		<view v-if='type=="vote" || type=="preview"'>

			<view class='item_block' v-for='(qitem,qindex) in vote' :key='qindex'>
				<view class='question_block'>
					<view class='remark'>{{qindex+1}}</view>
					<text>{{qitem.question}}</text>
				</view>
				<view class='title_time'>
					<view class='title_time_icon'>
						<image src='title_time'></image>
					</view>
					<text>{{qitem.time}} 发起</text>
				</view>
				<view class="uni-list">
					<radio-group @change="radioChange" :id='qitem.flag'>
						<label class="uni-list-cell uni-list-cell-pd" v-for="(oitem, oindex) in qitem.choices" :key="oindex">
							<view>
								<radio :value="oitem.id" />
							</view>
							<view>{{oitem.option}}</view>
						</label>
					</radio-group>
				</view>
				<!-- <view class='choice_block' v-for='(oitem,oindex) in qitem.choices' :key='oindex'>

					<view :id='qindex' :data-choice_id='oindex' class="label-2" @click='btn_choose'>
						<view class="label-2__icon">
							<view class="label-2__icon-checked" :style="{opacity:oitem.checked ? 1: 0}"></view>
						</view>
						<view class="label-2__text"><text>{{oitem.option}}</text></view>
					</view>

				</view> -->
			</view>

			<view class='cut'></view>
			<view v-if='type!="preview"' class='submit' @click='submit'>
				<text>投 票</text>
			</view>
			<view v-if='type!="preview"' class='submit' @click='btn_record'>
				<text>查看投票结果</text>
			</view>
		</view>
	</view>
</template>

<script>
	let that;
	export default {
		data() {
			return {
				// 判断是投票预览还是用户跳转过来投票
				type: '',
				// 投票列表
				vote: '',
				mid: '',
				// 选项id
				oid:{},
				// 发送的单个vote
				sv:''
			};
		},
		methods: {
			btn_record(){
				uni.navigateTo({
					url: '../vote_manage/vote_manage?type=record_all&m_id=' + that.mid + '&theme=' + that.mid + '&time=' + that.mid, //转向投票记录页（id为会议ID、theme为会议主题、time为会议时间）
					
				})
			},
			radioChange: function(evt) {
				console.log(evt);
				let qid = evt.currentTarget.id
				console.log(qid);
				this.oid[qid] = evt.detail.value // 将投票标识符和选项序号组成字典发送
				console.log(this.oid);
				
			},
			// 选择选项
			// btn_choose(e) {
			// 	let question_id = e.currentTarget.id
			// 	let option_id = e.currentTarget.dataset.choice_id
			// 	let votes = this.vote
			// 	console.log(this.vote);

			// }
			// 投票
			submit(){
				this.$http.post('meetingapi/v1/vote/',{
					type:'vote_append',
					option_id:this.oid,
					uid:uni.getStorageSync('SUID')
				}).then(res=>{
					console.log(res);
					if(res.data.msg == 'ok'){
						uni.showToast({
							title: '投票成功',
							duration: 1500,
							success() {
								uni.navigateTo({
									url: '../vote_manage/vote_manage?type=record_all&m_id=' + that.mid + '&theme=' + that.mid + '&time=' + that.mid, //转向投票记录页（id为会议ID、theme为会议主题、time为会议时间）					
								success() {
									that.$Socket.nsend(JSON.stringify({type:'vote',contain:that.oid,mid:that.mid}))
								}
									
								})
							}
						})
					} else {
						uni.showToast({
							title: '失败'
						})
					}
				}).catch()
			}
		},
		onLoad(option) {
			this.type = option.type
			this.mid = option.m_id
			that = this
			if (this.type == 'preview') {
				uni.setNavigationBarTitle({
					title: '投票预览'
				})
				this.vote = JSON.parse(option.vote)
				console.log(this.vote);
			} else if (this.type == 'vote') {
				//请求后端投票总列表的数据
				this.$http.get('meetingapi/v1/vote/', {
					params: {
						mid: that.mid
					}
				}).then(res => {
					this.vote = res.data.data
					console.log(this.vote);
				}).catch()
			}
		}
	}
</script>

<style lang="less">
	/* pages/vote_attend/vote_attend.wxss */
	.theme_block {
		width: 60%;
		height: 100rpx;
		border-bottom-color: #888888;
		border-bottom-style: solid;
		border-bottom-width: 2rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 42rpx;
		color: #333333;
	}

	.time_block {
		width: 55%;
		height: 60rpx;
		position: relative;
		display: flex;
		align-items: center;
	}

	.time_block text {
		position: absolute;
		right: 0;
		font-size: 30rpx;
		color: #888888;
	}

	.item_block {
		width: 100%;
		background: #ffffff;
	}

	.question_block {
		width: 90%;
		height: 90rpx;
		margin: 0 5% 0 5%;
		margin-top: 32rpx;
		color: #333333;
		display: flex;
		align-items: center;
		border-bottom: 10rpx solid #ffffff;
	}

	.question_block text {
		margin-left: 20rpx;
	}

	.remark {
		height: 90rpx;
		width: 70rpx;
		color: #ffffff;
		background: #1d93ec;
		border-radius: 0 0 6rpx 6rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.label-2 {
		height: 60rpx;
		display: flex;
		align-items: center;
	}

	.label-2__icon {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		margin-right: 10px;
		margin-left: 20rpx;
		width: 14px;
		height: 14px;
		border-color: #888888;
		border-style: solid;
		border-width: 2rpx;
		border-radius: 50%;

	}

	.label-2__icon-checked {
		position: absolute;
		left: 3px;
		top: 3px;
		width: 8px;
		height: 8px;
		background: #0066b9;
		border-radius: 50%;
	}

	.label-2__text {
		font-size: 30rpx;
		color: #333333;
	}

	.choice_block {
		height: 80rpx;
		width: 84%;
		margin: 0 8% 0 8%;
		display: flex;
		align-items: center;
	}

	.vote_record_block {
		width: 90%;
		height: 100rpx;
		background: #ffffff;
		margin-left: 5%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-bottom-style: solid;
		border-bottom-color: #efeff4;
		border-bottom-width: 20rpx;
		border-radius: 4rpx;
	}

	.vote_record_block image {
		width: 34rpx;
		height: 34rpx;
	}

	.vote_id {
		margin-left: 5%;
		width: 13%;
		height: 104rpx;
		background: #1d93ec;
		font-size: 36rpx;
		color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		/* border-left: 6rpx solid #1d93ec; */
	}

	.vote_time {
		width: 50%;
		font-size: 32rpx;
		color: #888888;
	}

	.cut {
		width: 100%;
		height: 40rpx;
		background: #efeff4;
	}

	.title_block {
		width: 100%;
		border-bottom: 10rpx solid #ffffff;
		height: 90rpx;
		display: flex;
		align-items: center;
		background: #ffffff;
	}

	.title_icon {
		margin-left: 5%;
		height: 90rpx;
		width: 70rpx;
		border-radius: 0 0 8rpx 8rpx;
		background: #0066b9;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.title_icon image {
		margin-bottom: 10rpx;
		width: 50rpx;
		height: 50rpx;
	}

	.title_block text {
		height: 90rpx;
		margin-left: 3%;
		font-size: 36rpx;
		display: flex;
		align-items: center;
	}

	.submit {
		width: 100%;
		height: 100rpx;
		color: #333333;
		font-size: 36rpx;
		background: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.title_time {
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		color: #333333;
		background: #ffffff;
		font-size: 30rpx;
		border-top: 20rpx solid #efeff4;
	}

	.title_time text {
		margin-left: 10%;
	}

	.title_time_icon {
		height: 100rpx;
		width: 80rpx;
		margin-left: 4%;
		background: #0066b9;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.title_time_icon image {
		width: 55rpx;
		height: 55rpx;
	}

	.btn_note {
		position: fixed;
		background: #1d93ec;
		top: 900rpx;
		right: 30rpx;
		width: 90rpx;
		height: 90rpx;
		border-radius: 100%;
		opacity: 0.5;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn_note image {
		height: 55rpx;
		width: 55rpx;
	}

	.btn_photo {
		position: fixed;
		background: #1d93ec;
		top: 1020rpx;
		right: 30rpx;
		width: 90rpx;
		height: 90rpx;
		border-radius: 100%;
		opacity: 0.5;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn_photo image {
		height: 55rpx;
		width: 55rpx;
	}
</style>
