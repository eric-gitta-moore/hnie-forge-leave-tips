<template>
	<view class="container">
		<u-navbar title='易班请假数据生成' :is-back='false' :background='{background:`#f8f8f8`}' :title-bold='true'
			:height='navbarHeight' title-color='#000'>
			<template #right>
				<u-icon name='more-dot-fill' style='margin: 0 24px;' @click='aboutActionSheetIsShow=true'></u-icon>
			</template>
		</u-navbar>
		<u-action-sheet v-model="aboutActionSheetIsShow" :list='aboutActionSheetList' :cancel-btn="false"
			@click='onClickAbout'>
		</u-action-sheet>

		<u-top-tips ref="uTips" :navbar-height='statusBarHeight+navbarHeight'></u-top-tips>

		<u-section class='section' title='设置' :right='false'></u-section>
		<u-form :label-width='250'>
			<u-form-item label='自动计算'>
				<view style="display: flex;flex:1;justify-content: flex-end;">
					<u-switch v-model="configure.autoCalc"></u-switch>
				</view>
			</u-form-item>
			<u-form-item label='自动生成'>
				<view style='width: 100%;'>
					<u-button @click='actionSheetIsShow=true'>点我快速生成</u-button>
					<u-action-sheet v-model="actionSheetIsShow" :list='actionSheetList' @click='automaticCompletion'>
					</u-action-sheet>
				</view>
			</u-form-item>
		</u-form>

		<u-section class='section' title='信息' :right='false'></u-section>
		<u-form :model='form' :label-width='250'>
			<u-form-item label='学号'>
				<u-input v-model="form.id"></u-input>
			</u-form-item>
			<u-form-item label='姓名'>
				<u-input v-model="form.name"></u-input>
			</u-form-item>
			<u-form-item label='班级'>
				<u-input v-model="form.className" placeholder='例如: 经济学1902'></u-input>
			</u-form-item>
			<u-form-item label='性别'>
				<u-input v-model="form.sex" type='select' @click='selectSexIsShow=true'></u-input>
				<u-select v-model='selectSexIsShow' :list="selectSexList" @confirm='(res)=>form.sex=res[0].value'
					:default-value='selectSexDefaultValue'>
				</u-select>
			</u-form-item>
			<u-form-item label='请假类型'>
				<u-input v-model="form.type" type='select' @click='selectTypeIsShow=true'></u-input>
				<u-select v-model='selectTypeIsShow' :list="selectTypeList" @confirm='(res)=>form.type=res[0].value'
					:default-value='selectTypeDefaultValue'>
				</u-select>
			</u-form-item>
			<u-form-item label='请假事由'>
				<u-input v-model="form.reason"></u-input>
			</u-form-item>
			<u-form-item label='紧急联系人'>
				<u-input v-model="form.emergencyContact" placeholder='可留空'></u-input>
			</u-form-item>
			<u-form-item label='紧急联系人电话'>
				<u-input v-model="form.emergencyContactPhone" placeholder='可留空'></u-input>
			</u-form-item>


			<u-form-item label='离校'>
				<view style="display: flex;justify-content: flex-end;flex:1">
					<u-switch v-model="form.leaveSchool"></u-switch>
				</view>
			</u-form-item>
			<u-form-item label='离校去向' v-if="form.leaveSchool">
				<u-input type='select' v-model="destText" @click='pickerRegionDestIsShow=true'></u-input>
				<u-picker mode="region" v-model="pickerRegionDestIsShow" :area-code='defaultAreaCode'
					@confirm='(res)=>form.dest=res'>
				</u-picker>
			</u-form-item>
			<u-form-item label='详细地址' v-if="form.leaveSchool">
				<u-input v-model="form.destDetail"></u-input>
			</u-form-item>
			<u-form-item label='请假开始时间'>
				<u-input v-model="beginTimeText" type='select' @click='pickerBeginTimeIsShow=true'></u-input>
				<u-picker :params='pickerTimeParams' v-model="pickerBeginTimeIsShow" @confirm='onPickerBeginTimeChanged'
					:default-time='beginTimeText'>
				</u-picker>
			</u-form-item>
			<u-form-item label='请假结束时间'>
				<u-input v-model="endTimeText" type='select' @click='pickerEndTimeIsShow=true'></u-input>
				<u-picker :params='pickerTimeParams' v-model="pickerEndTimeIsShow" @confirm='onPickerEndTimeChanged'
					:default-time='endTimeText'>
				</u-picker>
			</u-form-item>
			<u-form-item label='计算时长'>
				<u-input v-model="computedDuringTime" disabled></u-input>
			</u-form-item>
			<u-form-item label='请假材料' label-position='top'>
				<u-upload :file-list='form.fileList' :auto-upload='false' :max-count='8' @on-list-change='onChooseFile'>
				</u-upload>

			</u-form-item>

			<u-divider half-width='100%' class='form-divider' :margin-top='20' :margin-bottom='20'>审批信息</u-divider>

			<u-form-item label='班主任审批时间'>
				<u-input v-model="headmasterApproveTimeText" type='select'
					@click='pickerHeadmasterApproveTimeIsShow=true'>
				</u-input>
				<u-picker :params='pickerApproveTimeParams' v-model="pickerHeadmasterApproveTimeIsShow"
					@confirm='(res)=>form.headmasterApproveTime=res.timestamp'
					:default-time='headmasterApproveTimeText'>
				</u-picker>
			</u-form-item>
			<u-form-item label='班主任审批意见'>
				<u-input v-model="form.headmasterApproveReason" placeholder='默认是"通过"'></u-input>
			</u-form-item>
			<u-form-item label='辅导员审批时间'>
				<u-input v-model="instructorApproveTimeText" type='select'
					@click='pickerInstructorApproveTimeTimeIsShow=true'></u-input>
				<u-picker :params='pickerApproveTimeParams' v-model="pickerInstructorApproveTimeTimeIsShow"
					@confirm='(res)=>form.instructorApproveTime=res.timestamp'
					:default-time='instructorApproveTimeText'>
				</u-picker>
			</u-form-item>
			<u-form-item label='辅导员审批意见'>
				<u-input v-model="form.instructorApproveReason" placeholder='默认值是空的'></u-input>
			</u-form-item>
			<u-form-item label='副书记审批时间' :label-style='{"background-color": `#ff5e66`}' v-if="form.computedDays>=3">
				<u-input v-model="secretaryApproveTimeText" type='select'
					@click='pickerSecretaryApproveTimeTimeIsShow=true'></u-input>
				<u-picker :params='pickerApproveTimeParams' v-model="pickerSecretaryApproveTimeTimeIsShow"
					@confirm='(res)=>form.secretaryApproveTime=res.timestamp' :default-time='secretaryApproveTimeText'>
				</u-picker>
			</u-form-item>
			<u-form-item label='副书记审批意见' v-if="form.computedDays>=3">
				<u-input v-model="form.secretaryApproveReason" placeholder='生成之前请三思,该空默认值未知'></u-input>
			</u-form-item>
			<u-row class='button-group'>
				<u-alert-tips class='button-group__item' type="warning" title="使用提示"
					description="代码生成是给HttpCanary使用的.正常情况下使用注入易班即可.如果进入易班后无法返回,请点击右上角.其他更多帮助点击右上角."></u-alert-tips>
				<u-col class='button-group__item'>
					<u-button type='primary' @click='reset'>重置</u-button>
				</u-col>
				<u-col class='button-group__item'>
					<u-button type='warning' @click='gotoGenerate'>生成代码</u-button>
				</u-col>
				<u-col class='button-group__item'>
					<u-button type='success' @click='gotoInject'>注入易班</u-button>
				</u-col>
			</u-row>
		</u-form>

		<wrap-version-update ref="wrapVersionUpdate" id="633d4fda0f90b7000173039a" @check='onUpdateCheck'>
		</wrap-version-update>
	</view>
</template>

<script>
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	import dayjs from 'dayjs'
	import 'dayjs/locale/zh-cn' // 导入本地化语言
	dayjs.locale('zh-cn') // 使用本地化语言
	import {
		cloneDeep
	} from 'lodash-es'
	import random from 'uview-ui/libs/function/random'
	import {
		mapGetters,
		mapState,
		mapActions
	} from 'vuex'
	import DateUtil from '@/util/date.js'
	import treeDaysLeaveTipExample from '@/assets/threeDaysLeaveTipExample'

	export default {
		data() {
			const presetData = {}
			if (Object.entries(this.$store.state.form).length) {
				Object.assign(presetData, this.$store.state.form)
			}
			return {

				// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				// 导航栏内容区域高度，不包括状态栏高度在内
				navbarHeight: 44,
				configure: {
					autoCalc: true
				},
				form: Object.assign({
					id: '',
					name: '',
					sex: '男性',
					className: '',
					type: '病假',
					reason: '',
					emergencyContact: '',
					emergencyContactPhone: '',
					leaveSchool: true,
					dest: {
						"province": {
							"label": "湖南省",
							"value": "43"
						},
						"city": {
							"label": "湘潭市",
							"value": "4303"
						},
						"area": {
							"label": "岳塘区",
							"value": "430304"
						},
					},
					destDetail: '',
					beginTime: dayjs().hour(8).minute(0).second(0).unix(),
					endTime: dayjs().hour(12).minute(0).second(0).unix(),
					headmasterApproveTime: DateUtil.radomUnixTimeWithHour(8)
						.add(-1, 'day')
						.unix(),
					instructorApproveTime: DateUtil.radomUnixTimeWithHour(9)
						.add(-1, 'day')
						.unix(),
					secretaryApproveTime: DateUtil.radomUnixTimeWithHour(10)
						.add(-1, 'day')
						.unix(),
					headmasterApproveReason: '通过',
					instructorApproveReason: '',
					secretaryApproveReason: '',
					fileList: [],
					computedDays: 0,
					computedHours: 0,
				}, presetData),
				formDefault: {},

				selectSexIsShow: false,
				selectSexList: [{
					value: '男性',
					label: '男性'
				}, {
					value: '女性',
					label: '女性'
				}],

				selectTypeIsShow: false,
				selectTypeList: [{
					value: '事假',
					label: '事假'
				}, {
					value: '病假',
					label: '病假'
				}],

				pickerTimeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
					timestamp: true,
				},
				pickerApproveTimeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true,
					timestamp: true,
				},
				pickerBeginTimeIsShow: false,
				pickerEndTimeIsShow: false,
				pickerHeadmasterApproveTimeIsShow: false,
				pickerInstructorApproveTimeTimeIsShow: false,
				pickerSecretaryApproveTimeTimeIsShow: false,
				pickerRegionDestIsShow: false,

				actionSheetIsShow: false,
				actionSheetList: [{
					text: '今天上午'
				}, {
					text: '今天下午'
				}, {
					text: '昨天上午'
				}, {
					text: '昨天下午'
				}, {
					text: '四天请假例子',
					subText: '加载一个真实四天请假的例子'
				}, ],

				aboutActionSheetIsShow: false,
				aboutActionSheetList: [{
						text: '使用帮助'
					},
					{
						text: '关于'
					},
					{
						text: '检查更新'
					}
				],
			}
		},
		computed: {
			...mapGetters(['applyCode']),
			computedDuringTime() {
				return `${this.form.computedDays} 天 ${this.form.computedHours} 小时`
			},
			beginTimeText: {
				get() {
					return dayjs.unix(this.form.beginTime).format('YYYY-MM-DD HH:mm:ss')
				},
				set() {

				}
			},
			endTimeText: {
				get() {
					return dayjs.unix(this.form.endTime).format('YYYY-MM-DD HH:mm:ss')
				},
				set() {

				}
			},
			headmasterApproveTimeText: {
				get() {
					return dayjs.unix(this.form.headmasterApproveTime).format('YYYY-MM-DD HH:mm:ss')
				},
				set() {

				}
			},
			instructorApproveTimeText: {
				get() {
					return dayjs.unix(this.form.instructorApproveTime).format('YYYY-MM-DD HH:mm:ss')
				},
				set() {

				}
			},
			secretaryApproveTimeText: {
				get() {
					return dayjs.unix(this.form.secretaryApproveTime).format('YYYY-MM-DD HH:mm:ss')
				},
				set() {

				}
			},
			destText: {
				get() {
					const dest = this.form.dest
					return `${dest.province.label} ${dest.city.label} ${dest.area.label}`
				},
				set() {}
			},
			defaultAreaCode() {
				return [this.form.dest.province.value, this.form.dest.city.value, this.form.dest.area.value]
			},
			selectSexDefaultValue() {
				return [this.selectSexList.findIndex(e => e.value === this.form.sex)]
			},
			selectTypeDefaultValue() {
				return [this.selectTypeList.findIndex(e => e.value === this.form.type)]
			}
		},
		onLoad() {},
		mounted() {
			this.saveDefault()
		},
		watch: {
			'form.beginTime': {
				handler() {
					this.autoCalc()
				}
			},
			'form.endTime': {
				handler() {
					this.autoCalc()
				},
				immediate: true
			},
			form: {
				async handler(value) {
					this.$store.dispatch('dispatchForm', value)
				},
				deep: true,
			}
		},
		methods: {
			async onChooseFile(list) {
				const res = []
				for (const cursor of list) {
					const data = {
						url: cursor.url,
						base64: cursor?.base64,
					}
					try {
						data.base64 = await pathToBase64(cursor.url)
					} catch (e) {
						console.warn(e);
					}
					res.push(data)
				}
				this.form.fileList = res
			},
			saveDefault() {
				this.formDefault = cloneDeep(this.form)
			},
			reset() {
				this.form = cloneDeep(this.formDefault)
			},
			onPickerBeginTimeChanged(res) {
				this.form.beginTime = res.timestamp
			},
			onPickerEndTimeChanged(res) {
				this.form.endTime = res.timestamp
			},
			autoCalc() {
				if (!this.configure.autoCalc) return false;

				this.form.headmasterApproveTime = DateUtil.radomUnixTimeWithHour(8, this.form.beginTime)
					.add(-1, 'day')
					.unix()
				this.form.instructorApproveTime = DateUtil.radomUnixTimeWithHour(9, this.form.beginTime)
					.add(-1, 'day')
					.unix()

				this.form.secretaryApproveTime = DateUtil.radomUnixTimeWithHour(10, this.form.beginTime)
					.add(-1, 'day')
					.unix()

				const days = DateUtil.calcDiffDay(this.form.beginTime, this.form.endTime)
				const hours = DateUtil.calcDiffHourWithoutDays(this.form.beginTime, this.form.endTime)
				if (days >= 3) {
					this.$refs.uTips?.show({
						title: '超过及三天需要副书记审核',
						type: 'warning',
						duration: 2000
					});
				}
				this.form.computedDays = days
				this.form.computedHours = hours
			},
			gotoGenerate() {
				uni.navigateTo({
					url: 'generate'
				})
			},
			gotoInject() {
				uni.navigateTo({
					url: 'web'
				})
			},
			automaticCompletion(idx) {
				switch (this.actionSheetList[idx].text) {
					case '今天上午':
						this.form.beginTime = dayjs().hour(8).minute(0).second(0).unix()
						this.form.endTime = dayjs().hour(12).minute(0).second(0).unix()
						break;

					case '今天下午':
						this.form.beginTime = dayjs().hour(14).minute(0).second(0).unix()
						this.form.endTime = dayjs().hour(18).minute(0).second(0).unix()
						break;

					case '昨天上午':
						this.form.beginTime = dayjs().add(-1, 'day').hour(8).minute(0).second(0).unix()
						this.form.endTime = dayjs().add(-1, 'day').hour(12).minute(0).second(0).unix()
						break;

					case '昨天下午':
						this.form.beginTime = dayjs().add(-1, 'day').hour(14).minute(0).second(0).unix()
						this.form.endTime = dayjs().add(-1, 'day').hour(18).minute(0).second(0).unix()
						break;

					case '四天请假例子':
						this.form = {
							...this.form,
							...treeDaysLeaveTipExample
						}
						break;
				}
			},
			validate() {

			},
			onClickAbout(idx) {
				switch (this.aboutActionSheetList[idx].text) {
					case '关于':
						uni.navigateTo({
							url: '/pages/about/about'
						})
						break;

					case '使用帮助':
						uni.navigateTo({
							url: '/pages/about/help'
						})
						break;

					case '检查更新':
						try {
							this.$refs.wrapVersionUpdate.check()
						} catch (e) {
							console.warn(e);
						}

						break;
				}
			},
			/**
			 * @description 检查更新确认确实有更新
			 * @param {Object} res
			 */
			onUpdateCheck(res) {
				if (!res.needUpdate) return;
				uni.setClipboardData({
					data: res.pkgUrl,
					success() {
						uni.showToast({
							title: '下载链接已复制',
							position: 'bottom',
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 10px 20px;
	}

	.section {
		margin-top: 20px;
	}

	.button-group {
		&__item {
			margin-top: 20rpx;
		}
	}
</style>
