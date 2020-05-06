<template>
	<view class="lottery">
		<view v-if='type=="set"'>
			<view style='background: #fff;'>
				<view class='title_block'>
					<view class='title_icon'>
						<image src='title_prize'></image>
					</view>
					<text>发起抽奖</text>
				</view>
				<view class='tip_block'><text>点击奖项选择奖项（如 “特等奖” ），长按奖项删除奖项，长按奖品删除奖品</text></view>
			</view>
			<view class='cut'></view>
			<view class='list_block' v-for='(Litem,Lindex) in lottery' :key='Lindex'>
				<view class='item_block'>
					<view :id='Lindex' @longpress='del_grade'>
						<view class='question_item'>
							<image src='trophy'></image>
							<picker :range="lottery_leval" @change="leval_change" :id="Lindex">
								<view>{{leval_number>-1?lottery_leval[leval_number]:'请选择奖品等级'}}</view>
							</picker>
						</view>
					</view>
					<view class='choice_block' v-for='(aitem,aindex) in Litem.awards' :key='aindex'>
						<view :id='aindex' :data-grade_id='Lindex' @longpress='del_award' class='del_block'>
							<view class='standard_choice'><text>奖 品：</text></view>

							<view class='check_box_block'>

								<view class='choice_item'>
									<!-- aitem.award为奖品名称 -->
									<input :value="aitem.award" :id='aindex' :data-grade_id='Lindex' @input='award_input' placeholder='输入奖品名称'
									 placeholder-class='placeholder' focus="focus" />
								</view>
								<view class="weui-cell__ft">

									<view class="wux-xnumber  className ">
										<view :id='aindex' :data-grade_id='Lindex' @click='bindtap' data-type="sub" class="wux-number-selector wux-number-selector-sub">-</view>
										<input :id='aindex' :data-grade_id='Lindex' @input="num_input" :value="aitem.num" type="number" class="wux-number-input" />
										<view :id='aindex' :data-grade_id='Lindex' @click="bindtap" data-type="add" class="wux-number-selector wux-number-selector-plus">+</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class='choice_block' style='height:100rpx;border-bottom:30rpx solid #fff;'>
						<view class='standard_choice'><text>. . . ：</text></view>
						<view :id='Lindex' class='choice_item' @click='add_award'><text>添加新的奖品</text></view>
					</view>

				</view>
			</view>

			<view class='cut'></view>
			<view class='function_block'>
				<view class='sign_block' @click='add_grade'>
					<view class='sign_icon'>
						<image src='add_question'></image>
					</view>
					<text>添加新的奖项</text>
				</view>
				<view class='sign_block' @click='preview'>
					<view class='sign_icon'>
						<image src='preview'></image>
					</view>
					<text style='border-bottom-width:0;'>抽奖信息预览</text>
				</view>
			</view>

			<view class='cut'></view>
			<view class='submit' @click='submit'>发起抽奖</view>
			<view class='cut'></view>


		</view>

		<!-- 抽奖信息预览 -->
		<view v-if='type=="preview"'>

			<view style='background: #fff;'>
				<view class='title_block'>
					<view class='title_icon'>
						<image src='title_prize'></image>
					</view>
					<text>抽奖信息预览</text>
				</view>
			</view>
			<view class='cut'></view>

			<view class='list_block' v-for='(Litem,Lindex) in lottery' :key='Lindex' >
				<view class='item_block'>
					<view id='Lindex' @longpress='del_grade'>
						<view class='question_item'>
							<image src='trophy'></image>
							<view id='Lindex' class='question_item_text' @click="onTapDefault">{{Litem.grade}}</view>
						</view>
					</view>
					<view class='choice_block' v-for='(aitem, aindex) in Litem.awards' :key='aindex' >
						<view :id='aindex' :data-grade_id='Lindex' @longpress='del_award' class='del_block'>
							<view class='standard_choice'><text>奖 品：</text></view>

							<view class='check_box_block'>

								<view class='choice_item'>
									<input :id='aindex' :data-grade_id='Lindex' :value='aitem.award' disabled='true' @input='award_input'
									 placeholder='输入奖品名称' placeholder-class='placeholder' focus="focus" />
								</view>

								<view>{{aitem.num }}人</view>

							</view>

						</view>

					</view>

				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				focus: false,
				type: 'set',
				id: '',
				isShow: false,
				leval_number: -1,
				lottery_function: ['随机按停抽奖', '摇一摇抽奖', '拼手速抽奖', '根据弹幕数量抽奖'],
				lottery_leval: ['特等奖', '一等奖', '二等奖', '三等奖', '参与奖', '幸运奖'],
				lottery_list: [{
					theme: '测试会议',
					time: '2018-01-31',
					grade: '特等奖',
					award: '电饭煲'
				}, {
					theme: '测试会议',
					time: '2018-01-31',
					grade: '特等奖',
					award: '电饭煲'
				}, {
					theme: '测试会议',
					time: '2018-01-31',
					grade: '特等奖',
					award: '电饭煲'
				}, {
					theme: '测试会议',
					time: '2018-01-31',
					grade: '特等奖',
					award: '电饭煲'
				}, ],
				lottery: [{
					grade: '特等奖',
					awards: [{
						award: '',
						num: 0
					}]
				}]
			};
		},
		methods: {
			num_input(event) {

				let award_index = event.currentTarget.id //获取选项在当前问题列表中的下标
				let grade_index = event.currentTarget.dataset.grade_id //获取问题在当前投票列表中的下标
				let lotterys = this.lottery //获取当前页面的投票列表
				lotterys[grade_index].awards[award_index].num = event.detail.value //获取选项内容并设置
				this.lottery = lotterys
				//更新投票列表

			},

			bindtap(event) {
				const type = event.currentTarget.dataset.type
				let award_index = event.currentTarget.id //获取选项在当前问题列表中的下标
				let grade_index = event.currentTarget.dataset.grade_id //获取问题在当前投票列表中的下标
				let lotterys = this.lottery //获取当前页面的投票列表
				let num = lotterys[grade_index].awards[award_index].num
				if (type == 'add') {
					lotterys[grade_index].awards[award_index].num++; //获取选项内容并设置
				} else if (type == 'sub' && num > 0) {
					lotterys[grade_index].awards[award_index].num--; //获取选项内容并设置
				}
				this.lottery = lotterys
				//更新投票列表

			},

			CurentTime() {
				let now = new Date();

				let year = now.getFullYear(); //年
				let month = now.getMonth() + 1; //月
				let day = now.getDate(); //日

				let hh = now.getHours(); //时
				let mm = now.getMinutes(); //分
				let ss = now.getSeconds(); //秒

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
				return (clock);
			},


			// 奖品等级改变
			leval_change(e){
				console.log(e);
				this.leval_number = e.detail.value
				let lottery_id = e.currentTarget.id
				this.lottery[lottery_id].grade = this.lottery_leval[this.leval_number]
				console.log(this.lottery);
			},

			//设置选项
			award_input(event) {
				let award_index = event.currentTarget.id //获取选项在当前问题列表中的下标
				let grade_index = event.currentTarget.dataset.grade_id //获取问题在当前投票列表中的下标
				let lotterys = this.lottery //获取当前页面的投票列表
				lotterys[grade_index].awards[award_index].award = event.detail.value //获取选项内容并设置
				this.lottery = lotterys //更新投票列表
			},
			// 添加奖品
			add_award(event) {
				console.log(event)
				let index = event.currentTarget.id
				let lotterys = this.lottery
				lotterys[index].awards.push({
					award: '',
					num: 0
				})
				this.lottery = lotterys
			},
			// 添加奖项
			add_grade() {
				let lotterys = this.lottery
				lotterys.push({
					grade: '特等奖',
					awards: [{
						award: '',
						num: 0
					}, {
						award: '',
						num: 0
					}]
				})
				this.lottery= lotterys
			},

			del_grade(event) {
				console.log(event)
				let index = event.currentTarget.id
				let lotterys = this.lottery
				lotterys.splice(index, 1)
				this.lottery = lotterys
			},
			// 预览
			preview() {
				let that = this;
				let lottery = JSON.stringify(that.lottery);

				wx.navigateTo({
					url: '../lottery/lottery?vote=' + lottery + '&type=preview',
				})

			},

			del_award(event) {
				console.log(event)
				let award_index = event.currentTarget.id
				let grade_index = event.currentTarget.dataset.grade_id
				let lotterys = this.lottery
				console.log(lotterys);
				lotterys[grade_index].awards.splice(award_index, 1)
				if (lotterys[grade_index].awards.length == 0) {
					lotterys.splice(grade_index, 1)
				}
				this.lottery = lotterys
			},
			// 发起抽奖
			submit(){
			    let that = this;	
				console.log(this.lottery);
				console.log(that.mid);
				that.$http.post('meetingapi/v1/lottery/',{
					mid:that.id,
					lottrey:that.lottery,
					type:'admin_lottery'
				}).then(res=>{
					console.log(res);
				}).catch()
			    
			  }
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: '抽 奖 管 理'
			})
			let that = this;
			that.id= options.m_id
			;
			this.type= options.type
		
			if (options.type == 'preview') {

				this.lottery= JSON.parse(options.vote);

			} else if (options.type == 'collect') {

				wx.request({
					url: 'https://www.viaviai.com/thz/sever/collect.php',
					data: {
						'type': 'get_lottery',
						'openid': app.globalData.openid
					},
					header: {},
					method: 'GET',
					dataType: 'json',
					responseType: 'text',
					success: function(res) {
						that.lottery_list= res.data
					},
					fail: function(res) {},
					complete: function(res) {},
				})

			} else if (options.type == 'attend') {



			}

			if (this.data.type == 'shake') {

				that.data.isShow = true;
				wx.onAccelerometerChange(function(e) {
					if (!that.isShow) {
						return;
					}
					console.log(e.x)
					console.log(e.y)
					console.log(e.z)
					if (e.x > 1 && e.y > 1) {
						wx.showToast({
							title: '摇一摇成功',
							icon: 'success',
							duration: 2000
						})
					}
				})

			}
		}
	}
</script>

<style lang="less">
	/* pages/vote/vote.wxss */

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

	/* .title_block {
  width: 50%;
  margin: 20rpx 0 20rpx 0;
  height: 80rpx;
  border-bottom-color: #888888;
  border-bottom-style: solid;
  border-bottom-width: 2rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.setting_block {
  width: 80%;
  margin-left: 10%;
  height: 110rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-style: solid;
  border-bottom-width: 2rpx;
  border-bottom-color: #EBEBEB;
}

.setting_block text {
  width: 75%;
  height: 90rpx;
  font-size: 34rpx;
  margin-left: 10%;
  color: #333333;
  display: flex;
  align-items: center;
}

.setting_block image {
  height: 34rpx;
  width: 34rpx;
} */

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
		display: flex;
		background: #ffffff;
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
		height: 200rpx;
		margin: 20rpx 0 30rpx 0;
		position: relative;
	}

	.question_item {
		width: 100%;
		height: 100rpx;
		font-size: 36rpx;
		border-top: 10rpx solid #ffffff;
		color: #333333;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.question_item image {
		width: 70rpx;
		height: 70rpx;
		margin-right: 10rpx;
	}

	.question_item_text {
		height: 70rpx;
		display: flex;
		align-items: flex-end;
	}

	.del_block {
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
	}

	.choice_block {
		width: 100%;
		height: 110rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.standard_choice {
		width: 15%;
		height: 60rpx;
		margin-left: 10%;
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
		margin-right: 20rpx;
	}

	.choice_item input {
		width: 100%;
	}

	.check_box_block {
		width: 75%;
		height: 70rpx;
		display: flex;
		align-items: center;
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

	.list_item_container {
		width: 90%;
		margin-left: 5%;
		background: #ffffff;
		height: 250rpx;
		display: flex;
		flex-wrap: wrap;
		margin-top: 30rpx;
		padding: 15rpx 0 15rpx 0;
		border-left: 10rpx solid #6bc3ff;
		border-radius: 6rpx;
	}

	.list_item_block {
		width: 100%;
		height: 60rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.list_item_standard {
		margin-left: 10%;
		width: 20%;
		height: 60rpx;
		color: #1d93ec;
		display: flex;
		align-items: center;
	}

	.list_item_info {
		margin-right: 5%;
		width: 65%;
		height: 60rpx;
		color: #333333;
		display: flex;
		align-items: center;
	}

	.choose_function_block {
		width: 100%;
		height: 100rpx;
		border-bottom: 2rpx solid #efeff4;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #ffffff;
	}

	.choose_function_block text {
		margin-left: 10%;
		height: 100rpx;
		display: flex;
		align-items: center;
		color: #333333;
	}

	.choose_function_block image {
		width: 50rpx;
		height: 50rpx;
		margin-right: 10%;
	}

	.make_sure {
		margin-top: 40rpx;
		height: 80rpx;
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1d93ec;
		color: #ffffff;
		margin-left: 25%;
		border-radius: 10rpx;
	}
</style>
