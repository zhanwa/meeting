<template>
	<view class="sign_in">
		<view class="sign_append" v-if="role == 'append'">
			<sign-append></sign-append>
		</view>
		<view class="sign_manage" v-if="role == 'manage'">
			<sign-manage :m_id='m_id'></sign-manage>
		</view>
	</view>
</template>

<script>
	import signAppend from './sign_append.vue'
	import signManage from './sign_manage.vue'
	export default {
		components:{signManage,signAppend},
		data() {
			return {
				m_id: '',
				role:'',
			};
		},
		methods: {},
		onLoad(option) {
			this.m_id = option.m_id,
			this.role = option.role
		}
	}
</script>

<style lang="less">

</style>
