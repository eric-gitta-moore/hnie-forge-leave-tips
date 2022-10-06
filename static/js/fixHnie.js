/**
 * 修复点击错误，防止他们使用的mui误伤了我
 */
window.addEventListener('load', () => {
	setTimeout(() => {
		$('[href^="javascript:openWindow"]').each((idx, el) => {
			const href = $(el).attr('href')
			const regex = /\('(.*?)'/
			try {
				const res = regex.exec(href)
				$(el).attr('href', res[1])
			} catch (e) {
				//TODO handle the exception
			}
		})
	}, 2000)
})

try {
	/**
	 * 删除头部
	 */
	window.addEventListener('load', () => {
		document.querySelector('header.mui-bar-nav').style.display = 'none'


		const style = document.createElement('style')
		style.textContent = `
.mui-bar-nav~.mui-content {
	padding-top: 0!important;
}
.mui-bar-nav~.mui-content .mui-scroll {
    top: 0!important;
}
`
		document.body.appendChild(style)


		/**
		 * 同步标题
		 */
		let title = document.querySelector('h1.mui-title').textContent
		uni.postMessage({
			data: {
				action: 'updateTitle',
				title
			}
		})
	})
} catch (e) {
	console.warn(e);
}
