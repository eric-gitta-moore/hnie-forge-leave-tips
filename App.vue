<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				form: {}
			}
		},
		computed: {
			...mapState({
				formStore: s => s.form
			})
		},
		onLaunch: function() {
			const initializeFormData = {}
			try {
				const keyFormData = uni.getStorageSync('form')
				keyFormData && Object.assign(initializeFormData, keyFormData)
			} catch (e) {
				console.warn(e);
			}
			Object.assign(this.form, initializeFormData)

			if (process.env.NODE_ENV === 'development') {
				Object.assign(this.form, {
					id: '202110050329',
					name: '陈柯雨',
					sex: '男',
					className: '软件工程2102',
					type: '病假',
					reason: '去第六人民院看病',
					destDetail: '湘潭市第六人民医院',
				})
			}
			this.$store.dispatch('dispatchForm', this.form)
		},
	}
</script>

<style lang='scss'>
	@import "uview-ui/index.scss";
</style>
