<template>
	<view class="my_award">
		<view class="table">
		  <view class="tr bg-w">
		    <view class="th">等级</view>
		    <view class="th">名称</view>
		    <view class="th ">数量</view>
			<view class="th ">时间</view>
		  </view>
		  <block v-for="(item,index) in awardList" :key="index">
		    <view class="tr">
		      <view class="td">{{item.award_leval}}</view>
		      <view v-for="(aitem,aindex) in item.award_name" :key='aindex' class="flex-r" style="width: 50%;justify-content: space-between;">
				  <view class="td">{{aitem.award}}</view>
				  <view class="td">{{aitem.num}}</view>
			  </view>
		      <view class="td">{{item.award_time}}</view>
		    </view>
		  </block>
		</view>
		<!-- <view class="aList flex-r" v-for="(item,index) in awardList" :key='index'>
			<view class="award_leval" style="padding: 20rpx;">
				奖品等级:{{item.award_leval}}
			</view>
			<view class="award_leval" style="padding: 20rpx;">
				<view class="name_num flex-r" v-for="(aitem,aindex) in item.award_name" :key='aindex'>
					<view class="name">
						奖品名称:{{aitem.award}}
					</view>
					<view class="num">
						数量:{{aitem.num}}
					</view>
				</view>
			</view>
			<view class="award_time" style="padding: 20rpx;">
				中奖时间:{{item.award_time}}
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid : uni.getStorageSync('SUID'),
				awardList :[]
			}
		},
		methods: {
			
		},
		onLoad() {
			let that = this
			this.$http.get('meetingapi/v1/lottery/', {
				params: {
					uid:that.uid,
					type:'get_award'
				}
			}).then(res => {
				console.log(res)
				this.awardList = res.data.data
			}).catch(err => {
				console.log(err);
			})
		}
	}
</script>

<style lang="less">
.table {
  border: 0px solid darkgray;
  font-size: 12px;
}
.tr {
  display: flex;
  width: 100%;
  // justify-content: center;
  // justify-content: space-between;
  height: 2rem;
  align-items: center;
}
.td {
    width:39%;
    // justify-content: center;
    text-align: center;
}
.bg-w{
  background: snow;
}

.th {
  width: 40%;
  justify-content: center;
  background: #3366FF;
  color: #fff;
  display: flex;
  height: 2rem;
  align-items: center;
}
</style>
