window.addEventListener('load', () => {
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

})
