<template>
	<view>
	</view>
</template>

<script>
	import {
		cloneDeep,
		forIn
	} from 'lodash-es';
	import {
		mapState,
		mapGetters
	} from 'vuex'
	import ApplyListDataTemplate from '@/assets/apply-list.js'
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#00FF00'
					},
				},
				homeUrl: 'http://xggl.hnie.edu.cn/wap/main/welcome',
				lastPostMessage: null
			}
		},
		beforeMount() {},
		mounted() {
			this.currentWebview = this.$scope.$getAppWebview()
			this.top = uni.getSystemInfoSync().statusBarHeight + 44;
			this.currentWebview.setStyle({
				disablePlus: false,
				titleNView: {
					backgroundColor: '#6cb0f7',
					titleText: '学生工作服务平台',
					titleColor: '#fff',
					titleAlign: 'left',
					autoBackButton: true,
					backButton: {
						color: '#fff'
					},
					progress: {
						color: '#008585'
					},
					buttons: [{
						type: 'menu',
						color: '#fff',
						onclick: this.onClickMore
					}]
				}
			})
			this.createWebview()
			plus.globalEvent.addEventListener('plusMessage', (msg) => {
				if (msg.data.args.data.name == 'postMessage') {
					const message = msg.data.args.data.arg
					this.lastPostMessage = message
					if (message?.action === 'updateTitle' && message?.title) {
						this.currentWebview.setStyle({
							titleText: message.title
						})
					}
				}
			});
		},
		async onBackPress() {
			console.log(333);
			const canClose = await this.canback();
			if (!canClose) uni.navigateBack()
		},
		computed: {
			...mapState({
				form: s => s.form
			}),
			...mapGetters(['audit', 'applyCode'])
		},
		methods: {
			onClickMore() {
				const list = ['回到平台登录页', '回到APP首页']
				const success = (idx) => {
					switch (list[idx.tapIndex]) {
						case '回到平台登录页':
							this.subWebview.loadURL(this.homeUrl)
							break;
						case '回到APP首页':
							uni.reLaunch({
								url: '/pages/index/index'
							})
							break
					}
				}
				uni.showActionSheet({
					itemList: list,
					success,
				})
			},
			canback() {
				console.log(222);
				return new Promise((res, rej) => {
					console.log(111);
					this.subWebview.canBack(e => {
						console.log(`method.canback`, e);
						if (e.canBack) {
							this.subWebview.back();
							res(false);
						} else {
							res(true);
						}
					});
				});
			},
			createWebview() {
				let wv = plus.webview.create(
					'',
					'', {
						height: uni.getSystemInfoSync().screenHeight - this.top,
						top: this.top,
						bounce: 'vertical',
						disablePlus: false,
						plusrequire: 'ahead'
					}
				);
				wv.setPullToRefresh({
					support: true,
					height: '50px',
					range: '200px',
					contentdown: {
						caption: '下拉可以刷新'
					},
					contentover: {
						caption: '释放立即刷新'
					},
					contentrefresh: {
						caption: '正在刷新...'
					}
				}, () => {
					this.subWebview.loadURL(this.subWebview.getUrl())
				});
				this.intercept(wv)
				this.addListener(wv)
				wv.loadURL(this.homeUrl)
				this.currentWebview.append(wv)
				this.subWebview = wv
			},
			addListener(wv) {
				// 不是更新title标签的标题
				// wv.addEventListener('titleUpdate', (e) => {
				// 	this.currentWebview.setStyle({
				// 		titleNView: {
				// 			titleText: e.title
				// 		}
				// 	})
				// })

				/**
				 * webview向app传递信息
				 */
				true ||
					wv.addEventListener('loading', (e) => {
						wv.evalJS(`
					document.addEventListener('UniAppJSBridgeReady', function() {
						     	uni.postMessage({
						     		data: {
						     			html: document.children[0].outerHTML
						     		}
						     	});
							 })
							 `)
					})

				wv.appendJsFile('_www/static/js/uni.webview.1.5.4.js')
				wv.appendJsFile('_www/static/js/ajaxhook.min.js')
				wv.appendJsFile('_www/static/js/inject.js')
				wv.appendJsFile('_www/static/js/fixHnie.js')
			},
			intercept(wv) {
				const applyList = (wv) => {
					console.log(`intercept applyList`);
					const data = cloneDeep(ApplyListDataTemplate)
					wv.evalJS(`window.applyList = ${JSON.stringify(data)}`)
				}

				const applyDetail = (wv) => {
					console.log(`intercept applyDetail`);
					try {
						wv.evalJS(`window.applyDetail = ${JSON.stringify(this.applyCode)}`)
						wv.evalJS(`window.applyDetailAudit = ${JSON.stringify(this.audit)}`)
					} catch (e) {
						console.warn(e);
					}
				}
				const interceptList = {
					'wap/menu/student/leave/apply_stu': applyList,
					'wap/menu/student/leave/apply_stu/_child_/detail': applyDetail,
				}
				wv.addEventListener('loading', (e) => {
					for (const uri in interceptList) {
						const url = e.target.getURL()
						if (url.includes(uri)) {
							interceptList[uri](wv)
						}
					}
				})
			},
			getWebviewCookie(wv) {
				let msgData = null
				wv.evalJS(`
					uni.postMessage({
						data: {
							html: document.cookie
						}
					});
				 `)
			}
		},
	}
</script>

<style lang="scss">
</style>
