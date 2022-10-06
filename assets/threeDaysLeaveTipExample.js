import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 导入本地化语言
dayjs.locale('zh-cn') // 使用本地化语言
import DateUtil from '@/util/date.js'

const beginTime = dayjs().hour(8).minute(0).second(0)
const endTime = dayjs().add(4, 'day').hour(8).minute(0).second(0)
export default {
	id: '202222222222',
	name: '张三',
	sex: '男',
	className: '厚学法考2202',
	type: '病假',
	reason: '在家带病学习张三老师视频',
	leaveSchool: true,
	dest: {
		area: {
			label: "宝安区",
			value: "440306"
		},
		city: {
			label: "深圳市",
			value: "4403"
		},
		province: {
			label: "广东省",
			value: "44"
		},
	},
	destDetail: '',
	beginTime: beginTime.unix(),
	endTime: endTime.unix(),
	headmasterApproveTime: DateUtil.radomUnixTimeWithHour(8, beginTime.unix())
		.add(-1, 'day')
		.unix(),
	instructorApproveTime: DateUtil.radomUnixTimeWithHour(9, beginTime.unix())
		.add(-1, 'day')
		.unix(),
	secretaryApproveTime: DateUtil.radomUnixTimeWithHour(10, beginTime.unix())
		.add(-1, 'day')
		.unix(),
	headmasterApproveReason: '通过',
	instructorApproveReason: '回家做好疫情防控',
	secretaryApproveReason: '离开湘潭的同学，返校提供48小时的核酸',
}
