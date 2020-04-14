<template>
	<view class="user_message">
		<cmd-transition name="fade-up">
			<view>
				<cmd-cel-item title="头像" slot-right arrow>
					<cmd-avatar :src="userInfo.useravator" @click="previewimg(userInfo.useravator)"></cmd-avatar>
				</cmd-cel-item>
				<cmd-cel-item title="昵称" :addon="userInfo.username" arrow></cmd-cel-item>
				<cmd-cel-item title="个性签名" addon="" arrow></cmd-cel-item>
				<cmd-cel-item title="性别" addon="" arrow></cmd-cel-item>
				<cmd-cel-item title="地区" addon="" arrow></cmd-cel-item>
				<cmd-cel-item title="二维码名片" addon="" arrow></cmd-cel-item>
				<cmd-cel-item title="联系方式" addon="" arrow></cmd-cel-item>
				<cmd-cel-item title="我的地址" addon="" arrow></cmd-cel-item>
				<button class="btn-logout">退出登录</button>
			</view>
		</cmd-transition>
	</view>
</template>

<script>
	import cmdPageBody from "@/components/cmd-page-body/cmd-page-body.vue"
	import cmdTransition from "@/components/cmd-transition/cmd-transition.vue"
	import cmdCelItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	import cmdAvatar from "@/components/cmd-avatar/cmd-avatar.vue"
	let _self;
	export default {
		components: {
			cmdPageBody,
			cmdTransition,
			cmdCelItem,
			cmdAvatar
		},

		data() {
			return {
				// 用户信息
				userInfo: {
					username: '',
					useravator: '',
				}
			};
		},

		mounted() {},
		onLoad() {
			_self = this
			this.userInfo.useravator = uni.getStorageSync('SFACE');
			this.userInfo.username = uni.getStorageSync('SNAME');
		},

		methods: {
			/**
			 * 点击触发
			 * @param {Object} type 跳转页面名或者类型方式
			 */
			// 点击头像放大
			previewimg(image) {
				var imgArr = [];
				imgArr.push(image);
				//预览图片
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0]
				});

			},
			fnClick(type) {
				if (type == 'modify') {
					uni.navigateTo({
						url: '/pages/user/modify/modify'
					})
				}
			}
		}
	}
</script>

<style>
	.btn-logout {
		margin-top: 100upx;
		width: 80%;
		border-radius: 50upx;
		font-size: 16px;
		color: #fff;
		background: linear-gradient(to right, #365fff, #36bbff);
	}

	.btn-logout-hover {
		background: linear-gradient(to right, #365fdd, #36bbfa);
	}
</style>
