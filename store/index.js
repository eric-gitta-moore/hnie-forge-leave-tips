import {
	cloneDeep
} from 'lodash-es'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const keyForm = 'form'

let init = false

const store = new Vuex.Store({
	state: {
		form: {}
	},
	mutations: {
		SET_FORM(state, obj) {
			Object.assign(state.form, obj)
		}
	},
	actions: {
		dispatchForm(ctx, obj) {
			const data = cloneDeep(obj)
			uni.setStorage({
				data: data,
				key: keyForm,
				success() {
					console.log('保存成功', data);
				}
			})
			ctx.commit('SET_FORM', obj)
		}
	},
	strict: true
})

export default store
