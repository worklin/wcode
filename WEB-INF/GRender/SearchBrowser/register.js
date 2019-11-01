const enable = false

const fieldMap = {
	fileid: {
		source: '',
		getDataSource: () => {

		}
	}
}

const checkRewrite = newProps => {
	if (!enable) return
	if (newProps._noOverwrite) return
	if (!ecodeSDK.checkLPath('/spa/workflow/static4form/index.html#/main/workflow/req')) return
	const {fieldid} = newProps
	if (fieldid in fieldMap) return true
}

ecodeSDK.overwriteClassFnQueueMapSet('WeaBrowser', {
	fn: (Com, newProps) => {
		if (!checkRewrite(newProps)) return
		newProps = {
			...newProps,
			...fieldMap[newProps.fieldid]
		}
		const acParams = {
			appId: '${appId}',
			name: 'SearchBrowser', //模块名称
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