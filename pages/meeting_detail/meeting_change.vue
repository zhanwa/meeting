<template>
	<!-- 查看或修改会议信息 -->
	<view class="c_s">
		<view class="title">
			{{m_obj.m_title}}
		</view>
		<view class="content">
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-circlefill text-grey"></text>
						<text class="text-grey">会议简介:</text>
						<text class="text-grey">{{m_obj.m_content}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-circlefill text-grey"></text>
						<text class="text-grey">会议时间:</text>
						<text class="text-grey">{{m_obj.b_time}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-circlefill text-grey"></text>
						<text class="text-grey">会议地点:</text>
						<text class="text-grey">{{m_obj.m_content}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-circlefill text-grey"></text>
						<text class="text-grey">会议状态:</text>
						<text class="text-grey">{{m_obj.status}}</text>
					</view>
				</view>
				<view class="cu-item" :class="menuArrow?'arrow':''">
					<view class="content">
						<text class="cuIcon-tagfill text-red  margin-right-xs"></text>
						<text class="text-grey">标签</text>
					</view>
					<view class="action">
						<view class="cu-tag round bg-orange light">{{m_obj.mlabel}}</view>

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
				// 会议id
				mid: '',
				// 会议信息
				m_obj: ''
			};
		},
		onLoad(option) {
			console.log(option);
			this.mid = option.mid
			// 获得会议详情
			this.$http.get('meetingapi/v1/getmeeting/', {
				params: {
					type: 'getmeetingdetail',
					mid: option.mid
				}
			}).then(res => {

				if (res.data.msg == 'ok') {
					this.m_obj = res.data.data
					console.log(this.m_obj);
				}
			}).catch(err => {
				console.log(err);
			})
		}
	}
</script>

<style lang="less">
	.title {
		width: 90%;
		margin: 0 auto;
		font-size: 20px;
		font-weight: bolder;
		text-align: center;
	}
</style>
