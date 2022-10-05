<template>
	<web-view :src="url" :webview-styles="webviewStyles">
	</web-view>
</template>

<script>
	import {
		help
	} from '@/constant/about.js'
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#00FF00'
					}
				},
				url: help
			}
		},
		onLoad() {
			uni.setClipboardData({
				data: this.url,
				success() {
					uni.showToast({
						title: '链接已复制'
					})
				}
			})
		}
	}
</script>

<style>
</style>
