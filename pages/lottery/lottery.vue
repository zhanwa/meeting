<template>
	<view class="lottery">
		<view class="title">
			发起抽奖
		</view>
		<view class="jiangping">
			<label>奖品名称</label>
			<input type="text" v-model="value" />
			<label >数量</label>
			<input type="text" />
		</view>
		<view class="lottery-style">
			<view class="style">
				抽奖方式
			</view>
			<view class="danmu">
				弹幕抽奖:
				<switch @change="s_change('1')" />
			</view>
			<button type="primary" @click="start">开启抽奖</button>
			<button type="warn" @click="stop">结束抽奖</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 奖品
				value: '',
				style:''
			};
		},
		methods: {
			s_change(e) {
				if(e == '1'){
					console.log('弹幕');
					this.style = e
				}
			},
			// 开始抽奖
			start() {

			},
			// 结束抽奖
			stop() {

			}
		}
	}
</script>

<style lang="less">

</style>
