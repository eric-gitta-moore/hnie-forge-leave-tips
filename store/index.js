import {
	cloneDeep,
	random
} from 'lodash-es'
import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 导入本地化语言
dayjs.locale('zh-cn') // 使用本地化语言
import apply from '@/assets/apply.js'
import audit from '@/assets/audit.js'
import auditSecretary from '@/assets/audit-secretary.js'
import stringify from "json-stringify-pretty-compact";
import DateUtil from '@/util/date.js'

Vue.use(Vuex)
const keyForm = 'form'

let init = false

const store = new Vuex.Store({
	state: {
		form: {}
	},
	getters: {
		auditText(state, getters) {
			return stringify(getters.audit, {
				maxLength: 50
			})
		},
		audit(state, getters) {
			const code = cloneDeep(audit)
			code[0].SHSJ = dayjs.unix(state.form.headmasterApproveTime).format('YYYY-MM-DD HH:mm:ss')
			code[0].SHYJ = state.form.headmasterApproveReason
			code[1].SHSJ = dayjs.unix(state.form.instructorApproveTime).format('YYYY-MM-DD HH:mm:ss')
			code[1].SHYJ = state.form.instructorApproveReason

			if (getters.applyCode.ts >= 3) {
				const auditSecretaryData = cloneDeep(auditSecretary)
				auditSecretaryData.SHSJ = dayjs.unix(state.form.secretaryApproveTime).format(
					'YYYY-MM-DD HH:mm:ss')
				auditSecretaryData.SHYJ = state.form.secretaryApproveReason
				code[2] = auditSecretaryData
			}
			return code
		},
		applyCode(state) {
			const code = cloneDeep(apply)
			code.qjdh = `${dayjs().format('YYYYMM')}${random(1000,9999)}`
			code.qjlxM.mc = state.form.type
			code.stu.xh = state.form.id
			code.stu.szbj.bjmc = state.form.className
			code.stu.xm = state.form.name
			code.stu.xb.mc = state.form.sex
			code.kssj = dayjs.unix(state.form.beginTime).format('YYYY-MM-DD HH:mm:ss')
			code.jssj = dayjs.unix(state.form.endTime).format('YYYY-MM-DD HH:mm:ss')
			code.qjsy = state.form.reason
			code.lxr = state.form.emergencyContact
			code.lxrdh = state.form.emergencyContactPhone
			code.fileList = state.form.fileList.map(e => ({
				path: e.base64
			}))

			if (state.form.leaveSchool) {
				code.lxInd = '1'
				code.lxqx.dm = state.form.dest.area.value
				code.lxMdd = state.form.destDetail
			} else {
				code.lxInd = '0'
				code.lxMdd = null
				code.lxqx = null
			}

			code.xjsj = dayjs.unix(state.form.endTime)
				.add(2, 'month')
				.hour(random(8, 22))
				.minute(random(1, 59))
				.second(random(1, 59))
				.format('YYYY-MM-DD HH:mm:ss')
			code.ts = code.jsTs = DateUtil.calcDiffDay(state.form.beginTime, state.form.endTime)

			code.hour = code.jsHour = DateUtil.calcDiffHourWithoutDays(state.form.beginTime, state.form.endTime)
			return code
		},
		applyCodeText(state, getters) {
			return stringify(getters.applyCode, {
				maxLength: 50
			})
		}
	},
	mutations: {
		SET_FORM(state, obj) {
			Object.assign(state.form, obj)
		}
	},
	actions: {
		dispatchForm(ctx, obj) {
			const data = cloneDeep(obj)
			ctx.commit('SET_FORM', data)
			uni.setStorage({
				data: data,
				key: keyForm,
				success() {
					console.log('保存成功', data);
				}
			})
		},
	},
	strict: true
})

export default store
