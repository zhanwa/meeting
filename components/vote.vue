<template>
	<view class="vote">
		<view v-if='{{type=="list"}}'>
		
		  <view class='title_block'>
		    <view class='title_icon'><image src='{{title_record}}'></image></view>
		    <text>最新投票</text>
		  </view>
		
		  <view class='cut'></view>
		
		  <view wx:for='{{vote}}' id='{{index}}' wx:key='{{vote}}' class='vote_record_block' bindtap='btn_vote'>
		    <text class='vote_id'>{{index+1}}</text>
		    <text class='vote_time'>{{item[0].time}}</text>
		    <image src='{{enter}}'></image>
		  </view>
		  
		</view>
		
		<view v-if='{{type=="vote" || type=="preview"}}'>
		
		  <view class='title_time'>
		    <view class='title_time_icon'><image src='{{title_time}}'></image></view>
		    <text>{{vote[0].time}} 发起</text>
		  </view>
		
		  <view class='item_block' wx:for='{{vote}}' wx:key='vote' wx:for-item='question_item' wx:for-index='question_index'>
		    <view class='question_block'>
		      <view class='remark'>{{question_index+1}}</view>
		      <text>{{question_item.question}}</text>
		    </view>
		    <view class='choice_block' wx:for='{{question_item.choices}}' wx:key='choice' wx:for-index='choice_index'>
		    
		      <view id='{{question_index}}' data-choice_id='{{choice_index}}' class="label-2" bindtap='btn_choose'>
		        <view class="label-2__icon">
		          <view class="label-2__icon-checked" style="opacity:{{item.checked ? 1: 0}}"></view>
		        </view>
		        <view class="label-2__text"><text>{{item.value}}</text></view>
		      </view>
		    
		    </view>
		  </view>
		  
		  <view class='cut'></view>
		  <view v-if='{{type!="preview"}}' class='submit' bindtap='submit'>
		    <text>投 票</text>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less">

</style>
