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
	import apply from '../../assets/apply.js'
	import audit from '../../assets/audit.js'
	import stringify from "json-stringify-pretty-compact";
	import {
		mapState
	} from 'vuex'
	import dayjs from 'dayjs'
	import {
		cloneDeep,
		random
	} from 'lodash-es';
	export default {
		name: 'Generate',
		data() {
			return {
				auditText: '',
				applyCodeText: '',
			}
		},
		computed: {
			...mapState({
				form: s => s.form
			}),
		},
		created() {
			this.auditText = this.getAuditText()
			this.applyCodeText = this.getApplyCodeText()
		},
		methods: {
			getAuditText() {
				const code = cloneDeep(audit)
				code[0].SHSJ = dayjs.unix(this.form.headmasterApproveTime).format('YYYY-MM-DD HH:mm:ss')
				code[1].SHSJ = dayjs.unix(this.form.instructorApproveTime).format('YYYY-MM-DD HH:mm:ss')
				return stringify(code, {
					maxLength: 50
				})
			},
			getApplyCodeText() {
				const code = cloneDeep(apply)
				code.qjdh = `${dayjs().format('YYYYMM')}${random(1000,9999)}`
				code.qjlxM.mc = this.form.type
				code.stu.xh = this.form.id
				code.stu.szbj.bjmc = this.form.className
				code.stu.xm = this.form.name
				code.stu.xb.mc = this.form.sex
				code.kssj = dayjs.unix(this.form.beginTime).format('YYYY-MM-DD HH:mm:ss')
				code.jssj = dayjs.unix(this.form.endTime).format('YYYY-MM-DD HH:mm:ss')
				code.qjsy = this.form.reason

				if (this.form.leaveSchool) {
					code.lxInd = '1'
					code.lxqx.dm = this.form.dest.area.value
					code.lxMdd = this.form.destDetail
				} else {
					code.lxInd = '0'
					code.lxMdd = null
					code.lxqx = null
				}

				code.xjsj = dayjs.unix(this.form.endTime)
					.add(2, 'month')
					.hour(random(8, 22))
					.minute(random(1, 59))
					.second(random(1, 59))
					.format('YYYY-MM-DD HH:mm:ss')
				code.ts = code.jsTs = dayjs.unix(this.form.endTime).diff(dayjs.unix(this.form.beginTime), 'day')
				code.hour = code.jsHour = Math.ceil(
					dayjs.unix(this.form.endTime)
					.diff(dayjs
						.unix(this.form.beginTime)
						.subtract(code.ts, 'day'), 'hour', true)
				)


				return stringify(code, {
					maxLength: 50
				})
			}
		}
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
