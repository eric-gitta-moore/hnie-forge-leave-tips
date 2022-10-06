(function() {
	const cacheResponseMap = new Map()
	const injectUriList = {
		'content/tabledata/student/leave/apply_stu': applyList,
		'content/student/leave/apply_stu': applyDetail,
		'content/audit/audit/getAuditDetails': applyDetailAudit
	}
	window.injectOnce_applyList = false
	window.injectOnce_applyDetail = false
	window.injectOnce_applyDetailAudit = false

	function applyList(response) {
		if (window.applyList === undefined && !window.injectOnce_applyList) plus.nativeUI.confirm('注入失败')
		// console.log(`window.applyList`, JSON.stringify(window.applyList));
		// console.log(`applyList`, response);
		const injectApply = JSON.parse(JSON.stringify(window.applyList))
		const responseJson = JSON.parse(response)
		const aaDataFirstOne = responseJson.aaData[0]
		responseJson.aaData[0] = Object.assign(injectApply, {
			ID: aaDataFirstOne.ID
		})
		const result = JSON.stringify(responseJson)
		// console.log(`result`, result);
		if (result && !window.injectOnce_applyList) {
			plus.nativeUI.confirm('注入成功')
		}
		window.injectOnce_applyList = true;
		return result
	}

	function applyDetail(response) {
		if (!window.injectOnce_applyDetail) {
			if (window.applyDetail === undefined) plus.nativeUI.confirm('请假申请注入失败')
			else plus.nativeUI.confirm('请假申请注入成功')
		}
		window.injectOnce_applyDetail = true
		return JSON.stringify(window.applyDetail)
	}

	function applyDetailAudit(response) {
		if (window.injectOnce_applyDetailAudit) {
			if (window.applyDetailAudit === undefined) plus.nativeUI.confirm('审批进度注入失败')
			else plus.nativeUI.confirm('审批进度注入成功')
		}
		window.injectOnce_applyDetailAudit = true
		console.log(`window.applyDetail`, JSON.stringify(window.applyDetailAudit));
		return JSON.stringify(window.applyDetailAudit)
	}


	try {
		function hookFn(text, xhr) {
			const uri = Object.keys(injectUriList).find(e => xhr.responseURL.includes(e))
			if (uri) {
				cacheResponseMap.set(uri, text)
				return injectUriList[uri](text)
			}
		}
		ah.hook({
			//拦截回调
			responseText: {
				getter: hookFn
			},
		});
	} catch (e) {
		alert(e.message)
	}
})()
