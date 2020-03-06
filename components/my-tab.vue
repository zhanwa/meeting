<template>
	<view>
		<view class="inv-h-w">
			<view :class="['inv-h',Inv==0?'inv-h-se':'']" @click="Inv=0">开具发票</view>
			<view :class="['inv-h',Inv==1?'inv-h-se':'']" @click="Inv=1">开票记录</view>
		</view>
		<view class="" v-show="Inv == 0">
			我是选项卡一
		</view>
		<view class="" v-show="Inv == 1">
			我是选项卡二
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Inv: 0
			}
		},
		methods: {
			changeTab(Inv) {
				that.navIdx = Inv;

			},
		}
	}
</script>

<style>
	.inv-h-w {
		background-color: #FFFFFF;
		height: 100upx;
		display: flex;
	}

	.inv-h {
		font-size: 30upx;
		flex: 1;
		text-align: center;
		color: #C9C9C9;
		height: 100upx;
		line-height: 100upx;
	}

	.inv-h-se {
		color: #FF9014;
		border-bottom: 4upx solid #FF9014;
	}

	page {
		background-color: #F2F2F2;
	}
</style>
