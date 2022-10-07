<template>
	<view class="container">
		<u-section class='section' title='请假单JSON' :right='false'></u-section>
		<uni-easyinput type="textarea" v-model="applyCodeText" autoHeight>
		</uni-easyinput>

		<u-section class='section' title='审批信息JSON' :right='false'></u-section>
		<uni-easyinput type="textarea" v-model="auditText" autoHeight></uni-easyinput>
	</view>
</template>

<script>
	import apply from '@/assets/apply.js'
	import audit from '@/assets/audit.js'
	import stringify from "json-stringify-pretty-compact";
	import DateUtil from '@/util/date.js'
	import {
		mapState,
		mapGetters
	} from 'vuex'
	import dayjs from 'dayjs'
	import {
		cloneDeep,
		random
	} from 'lodash-es';
	export default {
		name: 'Generate',
		data() {
			return {}
		},
		computed: {
			...mapState({
				form: s => s.form
			}),
			...mapGetters(['auditText', 'applyCodeText'])
		},
		created() {
			console.log(`this.form.fileList`, this.form.fileList);
		},
		methods: {}
	}
</script>

<style lang="scss">
	.container {
		padding: 10px 20px;
	}

	.section {
		margin-top: 20px;
		margin-bottom: 10px;
	}
</style>
