import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 导入本地化语言
dayjs.locale('zh-cn') // 使用本地化语言
import {
	random
} from 'lodash-es'

export default class DateUtil {
	static calcDiffDay(begin, end) {
		return dayjs.unix(end).diff(dayjs.unix(begin), 'day')
	}
	static calcDiffHourWithoutDays(begin, end) {
		const offsetDays = DateUtil.calcDiffDay(begin, end)
		return Math.ceil(
			dayjs.unix(end)
			.diff(dayjs
				.unix(begin)
				.add(offsetDays, 'day'), 'hour', true)
		)
	}
	static radomUnixTimeWithHour(hour, stamp) {
		if (stamp)
			return dayjs.unix(stamp)
				.hour(hour)
				.minute(random(1, 59))
				.second(random(1, 59))
		return dayjs().hour(hour)
			.minute(random(1, 59))
			.second(random(1, 59))
	}
}
