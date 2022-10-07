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
			this.$store.dispatch('dispatchForm', this.form)
		},
	}
</script>

<style lang='scss'>
	@import "uview-ui/index.scss";
</style>
