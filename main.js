import App from './App'
import uView from "uview-ui";
import store from './store'

import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store
})
Vue.use(uView);
app.$mount()
