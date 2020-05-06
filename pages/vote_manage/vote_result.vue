<template>
	<view class="qiun-columns">
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<view class="qiun-title-dot-light">{{title}}</view>
		</view>
		<view class="qiun-charts">
			<!--#ifdef MP-ALIPAY -->
			<!-- <canvas canvas-id="canvasPie" id="canvasPie" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio"
			 :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchPie"></canvas> -->
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
			<!--#endif-->
		</view>
	</view>
</template>

<script>
	import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js';
	var _self;
	var canvaPie = null;

	export default {
		props: {
			vote_message: {
				type: Object
			}
		},
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				// 标题
				title: '',
				// 具体数据
				chartData: {
					"series": [{
						"name": "一班",
						"data": 50
					}, {
						"name": "二班",
						"data": 30
					}, {
						"name": "三班",
						"data": 20
					}, {
						"name": "四班",
						"data": 18
					}, {
						"name": "五班",
						"data": 8
					}]
				},
				// 实时数据
				rt_data:{}
			}
		},
		mounted() {
			_self = this;
			uni.getSystemInfo({
				success: function(res) {
					if (res.pixelRatio > 1) {
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio = 0.9;
					}
				}
			});
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.$nextTick(function() {
				this.title = this.vote_message.question;
				this.chartData.series = this.convertKey(this.vote_message.choices)
				console.log('dfadaflaj');
				console.log(this.chartData);
				this.showPie('canvasPie', this.chartData) 
			})
			this.$Socket.eventPatch.onMsg((msg,sk)=> {
				console.log(msg)
				let data = JSON.parse(msg.data)
				if( data.type== 'vote'){
					this.rt_data = data.contain
					for(let key in this.rt_data){
						if(this.vote_message.flag == key){
							let option_id = this.rt_data[key]//选项序号
							console.log(option_id);
							 this.vote_message.choices.forEach(el=>{
								 if(el.id == option_id){
									 el.result = parseInt(el.result)+1
								 }
							 })
						} 
					}
					this.chartData.series = this.convertKey(this.vote_message.choices)
					this.showPie('canvasPie', this.chartData)
				}
			})
			
		},
		methods: {
			// 改变对象的key
			convertKey(arr) {
				let newArr = [];
				arr.forEach((item, index) => {
					let newObj = {};
					newObj.name = item.option
					newObj.data = item.result ? parseInt(item.result) : 0
					newArr.push(newObj);
				})
				return newArr;
			},


			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 14,
					legend: {
						show: true,
						padding: 5,
						lineHeight: 11,
						margin: 0,
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							border: true,
							borderColor: '#FFFFFF',
							borderWidth: 3
						}
					},
				});
			},
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
				canvaPie.touchLegend(e, {
					animation: true
				});
			}
		}
	}
</script>

<style>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.qiun-title-bar {
		width: 100%;
		text-align: center;
	}
</style>

},
