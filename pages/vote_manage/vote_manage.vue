<template>
	<view class="vote_manage">
		<view v-if="type == 'choose'" style='background：#ffffff;'>
			<view class='cut'></view>
			<view class='function_block'>
				<view class='title_block'>
					<view class='title_icon'>
						<image src='../../static/Homehomepagemenu.png'></image>
					</view>
					<text>投票功能</text>
				</view>

				<view class='sign_block' @click='btn_set'>
					<view class='sign_icon'>
						<image src=vote_icon></image>
					</view>
					<text>发起新的投票</text>
				</view>
				<view class='sign_block' @click='btn_record'>
					<view class='sign_icon'>
						<image src='vote_record'></image>
					</view>
					<text>投票问题记录</text>
				</view>
			</view>

		</view>

		<view v-if='type=="set"' class='set' style='background：#ffffff;'>
			<view style='background: #fff;'>
				<view class='title_block'>
					<view class='title_icon'>
						<image src='function'></image>
					</view>
					<text>发起新的投票</text>
				</view>
				<view class='tip_block'><text>长按问题删除问题，长按选项删除选项（当问题仅有一个选项时，问题自动删除）</text></view>
			</view>
			<view class='cut'></view>

			<view class='list_block' v-for="(item,qindex) in vote" :key='qindex' v-if="updata">
				<view class='item_block'>
					<view :id='qindex' class='question_block' @longpress='del_question'>
						<view class='question_title'><text>问 题 {{qindex+1}}</text></view>

						<view class='question_item'>
							<input :value="item.question" :id='qindex' @input.stop="question_input" placeholder='请输入您的问题' placeholder-class='placeholder'
							 :focus="focus" />
						</view>
					</view>

					<view class='choice_block' :id="oindex" :data-question_id='qindex' v-for='(option ,oindex) in item.choices' :key='oindex'
					 @longpress='del_choice'>
						<view class='standard_choice'><text>选 项 {{oindex+1}}:</text></view>
						<view class='choice_item'>
							<!-- 这里value要绑定option,不然画面不更新 -->
							<input :value="option" :id='oindex' :data-question_id='qindex' @input='choice_input' placeholder='请输入问题的选项'
							 placeholder-class='placeholder' :focus="focus" />
						</view>

					</view>
					<view class='choice_block'>
						<view class='standard_choice'><text>. . . ：</text></view>
						<view :id='qindex' class='choice_item' @click='add_choice'><text>添加新的选项</text></view>
					</view>


					<view class="group">
						<view class='standard_choice'><text>是否单选 ：</text></view>
						<view :id='qindex' class="label-2" @click='btn_radio'>
							<view class="label-2__icon">
								<view class="label-2__icon-checked" :style="{opacity:item.radio=='true' ? 1: 0}"></view>
							</view>
							<view class="label-2__text"><text>是</text></view>
						</view>

						<view :id='qindex' class="label-2" @click='btn_checkbox'>
							<view class="label-2__icon">
								<view class="label-2__icon-checked" :style="{opacity:item.radio=='true' ? 0: 1}"></view>
							</view>
							<view class="label-2__text"><text>否</text></view>
						</view>

					</view>
				</view>
			</view>

			<view class='cut'></view>
			<view class='function_block'>
				<view class='sign_block' @click='add_question'>
					<view class='sign_icon'>
						<image src='add_question'></image>
					</view>
					<text>添加新的问题</text>
				</view>
				<view class='sign_block' @click='preview'>
					<view class='sign_icon'>
						<image src='preview'></image>
					</view>
					<text style='border-bottom-width:0;'>投票预览</text>
				</view>
			</view>

			<view class='cut'></view>
			<view class='submit' @click='submit'>发起投票</view>
			<view class='cut'></view>

		</view>

		<view v-if='type=="record_detail"'>
			<vote-result :vote_message='vote_message'></vote-result>
		</view>

		<view v-if='type=="record_all"'>
			<view class='title_block'>
				<view class='title_icon'>
					<image src='title_record'></image>
				</view>
				<text>已发起投票记录</text>
			</view>

			<view class='cut'></view>

			<view v-for='(item,qindex) in vote' :id='qindex' :key='qindex' class='vote_record_block' @click='btn_detail_record'>
				<text class='vote_id'>{{qindex+1}}</text>
				<text class='vote_time'>{{item.time}}</text>
			</view>

		</view>

	</view>
</template>

<script>
	import voteResult from './vote_result.vue'
	export default {
		components:{voteResult},
		data() {
			return {
				updata: true, //数据更新标志
				m_id: '', //会议ID
				focus: false, //input自动聚焦关闭
				type: 'choose', //默认为选择页面
				info: {}, //保存会议信息
				vote: [], //保存投票列表,
				vote_message:''  //投票详细信息
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {

			this.type = options.type;
			this.mid = options.m_id;
			

			let that = this;
			if (options.type == 'set') { //如果操作类型为设置投票
				
				//添加问题，每个问题有两个默认答案
				this.add_question()

			} else if (options.type == 'record_all') { //如果操作类型为发起过的投票列表总览
				this.info = {
					theme: options.m_id,
					time: options.m_id
				}
				//请求后端投票总列表的数据
				this.$http.get('meetingapi/v1/vote/', {
					params: {
						mid: that.mid
					}
				}).then(res => {
					console.log(res);
					this.vote = res.data.data
					console.log(this.vote);
				}).catch()
			} else if (options.type == 'record_detail') { //如果操作类型为投票记录详情
				this.vote_message = JSON.parse(options.vote_message)
				console.log(this.vote_message);
			}
		},
		methods: {
			//获取当前时间
			CurentTime: function() {
				let now = new Date(); //创建一个新的对象
				let year = now.getFullYear(); //年  
				let month = now.getMonth() + 1; //月  
				let day = now.getDate(); //日  
				let hh = now.getHours(); //时  
				let mm = now.getMinutes(); //分  
				let ss = now.getSeconds(); //秒  

				//格式化处理时间
				let clock = year + "-";

				if (month < 10)
					clock += "0";

				clock += month + "-";

				if (day < 10)
					clock += "0";

				clock += day + " ";

				if (hh < 10)
					clock += "0";

				clock += hh + ":";
				if (mm < 10) clock += '0';
				clock += mm + ":";

				if (ss < 10) clock += '0';
				clock += ss;

				return (clock); //返回当前时间
			},

			//添加选项
			add_choice: function(event) {

				let index = event.currentTarget.id //获取当前要添加选项的问题的下标
				let votes = this.vote //获取当前投票列表
				votes[index].choices.push('') //添加一个选项
				this.vote = votes //将重置后的列表保存
			},

			//添加问题
			add_question: function() {
				let that = this;
				let votes = this.vote; //获取当前页面的投票列表

				//添加一个默认问题和两个默认选项
				votes.push({
					question: '', //问题名称
					radio: "true", //是否为单选（true为是，false为否）
					time: that.CurentTime(), //问题创建时间为当前时间
					choices: [
						'', '' //两个默认选项
					]
				})
				this.vote = votes //更新当前的投票列表


			},

			//删除问题
			del_question: function(event) {

				let index = event.currentTarget.id //获取当前问题在当前投票列表中的下标
				let votes = this.vote //获取当前页面的投票列表
				votes.splice(index, 1) //投票数组列表中删除此问题及其答案
				this.vote = votes //更新当前的投票列表


			},

			del_choice: function(event) {

				let choice_index = event.currentTarget.id //获取当前选项在问题中的下标
				let question_index = event.currentTarget.dataset.question_id //获取当前问题在当前投票列表中的下标
				console.log(choice_index, question_index);
				let votes = this.vote //获取当前页面的投票列表
				// let oindex = votes[question_index].choices.findIndex((item,index)=>{
				// 	index == choice_index
				// })
				votes[question_index].choices.splice(choice_index, 1) //删除特定问题的特定选项
				if (votes[question_index].choices.length == 0 || votes[question_index].choices.length == 1) {
					votes.splice(question_index, 1) //如果当前问题无选项或者只有一个选项时，自动删除该问题
				}
				this.vote = votes //更新当前的投票列表
				this.updata = false;
				this.updata = true;
				console.log(this.vote);
			},

			//设置问题为单选
			btn_radio: function(event) {

				let index = event.currentTarget.id //获取当前问题的下标
				let votes = this.vote //获取当前页面的投票列表
				votes[index].radio = "true" //将其属性改为true
				this.vote = votes
				//更新当前的投票列表

			},

			//设置问题为多选
			btn_checkbox: function(event) {

				let index = event.currentTarget.id //获取当前问题的下标
				let votes = this.vote //获取当前页面的投票列表
				votes[index].radio = "false" //将其属性改为false
				this.vote = votes
				//更新当前的投票列表

			},

			//设置问题
			question_input: function(event) {
				console.log(event)
				let index = event.currentTarget.id //获取问题在当前投票列表中的下标
				let votes = this.vote //获取当前页面的投票列表
				votes[index].question = event.detail.value //获取问题内容并设置
				this.vote = votes
				//更新投票列表
				console.log(this.vote);
			},

			//设置选项
			choice_input: function(event) {
				console.log(event)
				let choice_index = event.currentTarget.id //获取选项在当前问题列表中的下标
				let question_index = event.currentTarget.dataset.question_id //获取问题在当前投票列表中的下标
				let votes = this.vote //获取当前页面的投票列表
				votes[question_index].choices[choice_index] = event.detail.value //获取选项内容并设置
				this.vote = votes
				//更新投票列表
			},

			//点击发起新的投票
			btn_set: function() {
				let that = this;
				let theme = this.info.m_id //获取当前会议的主题
				let time = this.info.m_id //获取当前会议的时间
				uni.navigateTo({
					url: 'vote_manage?type=set&m_id=' + that.mid + '&theme=' + theme + '&time=' + time, //转向当前页面（id为会议ID、theme为会议主题、time为会议时间）
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
			},

			//点击投票记录查询
			btn_record: function() {
				let that = this;
				let theme = this.info.m_id //获取当前会议的主题
				let time = this.info.m_id //获取当前会议的时间
				uni.navigateTo({
					url: 'vote_manage?type=record_all&m_id=' + that.mid + '&theme=' + theme + '&time=' + time, //转向当前页面（id为会议ID、theme为会议主题、time为会议时间）
					
				})
			},

			//投票预览
			preview: function() {

				let that = this;
				let vote_list = JSON.stringify(that.vote);
				console.log(vote_list);
				uni.navigateTo({
					url: '../vote_attend/vote_attend?vote=' + vote_list + '&type=preview',
				})

			},

			//提交问题及答案
			submit: function() {
				let that = this;
				let count = 0;
				let vote_list = new Array();
				console.log(this.vote);
				//遍历投票数组去除空问题数组
				for (let i = 0; i < that.vote.length; ++i) {
					if (that.vote[i].question.length != 0) {
						vote_list[count] = that.vote[i];
						count++;
					}
				}

				that.$http.post('meetingapi/v1/vote/', {
						type: 'vote', //操作类型为投票
						from: 'wx',
						mid: that.mid, //会议ID
						vote: vote_list //投票列表
					},

				).then(res => {
					console.log(res);
					if (res.data.msg == 'ok') {
						uni.showToast({
							title: '发起投票成功',
							duration: 1500,
							success() {
								console.log('调了吗');
								uni.navigateTo({
									url: 'vote_manage?type=record_all&m_id=' + that.mid + '&theme=' + that.mid + '&time=' + that.mid, //转向当前页面（id为会议ID、theme为会议主题、time为会议时间）
									
								})
							}
						})
					} else {
						uni.showToast({
							title: '失败'
						})
					}
				}).catch(err => {
					console.log(err);
				})
			},

			//获取投票的详细信息
			btn_detail_record: function(event) {

				let index = event.currentTarget.id; //保存当前投票的下标
				// let theme = this.info.m_id
				// let time = this.info.m_id
				let vote_message = JSON.stringify(this.vote[index])
				//跳转当前页面
				wx.navigateTo({
					url: 'vote_manage?type=record_detail&m_id=' + this.mid + '&vote_message=' + vote_message, //id为会议ID、index为投票的下标
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
			}
		}


	}
</script>

<style lang="less" scoped>
	.sign_block {
		width: 100%;
		height: 100rpx;
		font-size: 32rpx;
		color: #333333;
		display: flex;
		align-items: center;
	}

	.sign_icon {
		width: 15%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sign_block image {
		width: 55rpx;
		height: 55rpx;
	}

	.sign_block text {
		width: 85%;
		height: 100rpx;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		border-bottom-color: #DCDCDC;
		border-bottom-style: solid;
		border-bottom-width: 2rpx;
	}

	.function_block {
		width: 100%;
		background: #ffffff;
	}

	.list_block {
		background: #ffffff;
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
		background: #1d93ec;
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

	.question_title {
		width: 100%;
		height: 100rpx;
	}

	.question_title text {
		height: 90rpx;
		width: 140rpx;
		font-size: 36rpx;
		margin-left: 5%;
		display: flex;
		color: #ffffff;
		justify-content: center;
		align-items: center;
		background: #1d93ec;
		border-radius: 0 0 6rpx 6rpx;
	}

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
		margin-bottom: 20rpx;
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

	.question_block {
		width: 100%;
		height: 160rpx;
		margin: 20rpx 0 30rpx 0;
		position: relative;
	}

	.question_item {
		width: 75%;
		margin-left: 10%;
		height: 80rpx;
		font-size: 34rpx;
		color: #333333;
		display: flex;
		align-items: center;
		padding: 0rpx 15rpx 0 15rpx;
		border-bottom-color: #DCDCDC;
		border-bottom-style: solid;
		border-bottom-width: 2rpx;
	}

	.question_item input {
		width: 100%;
	}

	.choice_block {
		width: 100%;
		height: 110rpx;
		display: flex;
		align-items: center;
	}

	.standard_choice {
		width: 28%;
		height: 60rpx;
		margin-left: 5%;
		font-size: 34rpx;
		color: #333333;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.choice_item {
		width: 50%;
		height: 70rpx;
		font-size: 34rpx;
		color: #333333;
		display: flex;
		align-items: center;
		padding: 0rpx 15rpx 0 15rpx;
		border-bottom-color: #DCDCDC;
		border-bottom-style: solid;
		border-bottom-width: 2rpx;
	}

	.choice_item input {
		width: 100%;
	}

	.add_choice {
		width: 100%;
		height: 130rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.add_choice text {
		width: 60%;
		height: 80rpx;
		font-size: 34rpx;
		color: #333333;
		border-bottom-color: #DCDCDC;
		border-bottom-style: solid;
		border-bottom-width: 2rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.set button {
		width: 60%;
		color: #888888;
		font-size: 34rpx;
		border-width: 0rpx;
		margin: 30rpx 0 30rpx 20%;
	}

	.placeholder {
		font-size: 30rpx;
		width: 350rpx;
		color: #DCDCDC;
		display: flex;
		align-items: center;
	}

	.group {
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.tip_block {
		width: 80%;
		height: 100rpx;
		margin: 0 10% 0 10%;
		font-size: 27rpx;
		color: #A0A0A0;
	}

	.label-2 {
		width: 25%;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.label-2__icon {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		margin-right: 10px;
		margin-left: 20rpx;
		width: 16px;
		height: 16px;
		border-color: #888888;
		border-style: solid;
		border-width: 2rpx;
		border-radius: 50%;
	}

	.label-2__icon-checked {
		position: absolute;
		left: 3px;
		top: 3px;
		width: 10px;
		height: 10px;
		background: #1d93ec;
		border-radius: 50%;
	}

	.label-2__text {
		font-size: 30rpx;
		color: #888888;
	}

	.record_block {
		display: flex;
		flex-wrap: wrap;
		background: #ffffff;
		border-bottom-style: solid;
		border-bottom-color: #efeff4;
		border-bottom-width: 20rpx;
		padding-bottom: 30rpx;
	}

	.record_question {
		width: 90%;
		margin-left: 5%;
		margin-top: 30rpx;
		margin-bottom: 14rpx;
		padding-left: 14rpx;
		border-left: 6rpx solid #1d93ec;
		font-size: 34rpx;
		color: #333333;
	}

	.record_choice {
		width: 90%;
		margin: 1% 0% 1% 10%;
		font-size: 32rpx;
		color: #333333;
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
		margin-right: 10%;
		font-size: 32rpx;
		color: #333333;
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
