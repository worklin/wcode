const enable = false

const fieldMarks = {
	fieldid: {}
}

const checkRewrite = newProps => {
	if (!enable) return
	const { fieldid, dataParams: { formmodefieldid } } = newProps
	if (fieldMarks[fieldid] || fieldMarks[formmodefieldid]) return true
}

ecodeSDK.overwriteClassFnQueueMapSet('WeaBrowser', {
	fn: (Com, newProps, name) => {
		if (!checkRewrite(newProps)) return
		const acParams = {
			appId: '${appId}',
			name: 'BrowserCheckGroup', //模块名称
			isPage: false, //是否是路由页面
			noCss: true, //是否禁止单独加载css，通常为了减少css数量，css默认前置加载
			props: newProps
		}
		return {
			com: () => {
				if (window.comsMobx)
					return ecodeSDK.getAsyncCom(acParams);
				else
					return Com;
			},
			props: newProps
		}
	}
})