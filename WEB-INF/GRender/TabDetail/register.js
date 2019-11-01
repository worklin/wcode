let pageProps = null;

let isInit = false;

const checkRewrite = newProps => {
	if (!ecodeSDK.checkLPath('/spa/workflow/static4form/index.html#/main/workflow/req')) return;
	// 过滤签字意见的分页组件
	if (newProps.defaultCurrent !== undefined || newProps.weaSimple) return
	return true
}
// 重写分页，设置成单页模式
const rewritePage = newProps => {
	if (newProps === null) return
	// 每页显示的行数
	let pageSize = 1;
	if (newProps.pageSize === pageSize && !isInit) {
		isInit = true
	}
	// 判断明细表是否加载完毕
	const allTable = document.querySelectorAll('table[name^=oTable]').length
	if (allTable && allTable.length === 0) return
	if (newProps.pageSize !== pageSize && !isInit) {
		const { onShowSizeChange, current } = newProps
		if (onShowSizeChange && typeof onShowSizeChange === 'function') {
			onShowSizeChange(current, pageSize);
			isInit = true
		}
	}
}

// 重写明细表分页组件
ecodeSDK.overwritePropsFnQueueMapSet('Pagination', {
	fn: (newProps) => {
		if (!checkRewrite(newProps)) return
		pageProps = newProps
		newProps.className = 'yf_tab_page'
		newProps.showSizeChanger = false
		newProps.defaultPageSize = 1
		return newProps;
	},
});

const render = (proxyField, props, cb) => {
	ecCom.WeaLoadingGlobal.start()
	rewritePage(pageProps)
	const render = () => {
		let TabDetailRoot = ecodeSDK.getCom('${appId}', 'TabDetailRoot')
		if (TabDetailRoot) {
			const Com = <TabDetailRoot { ...props }/>
			GForm.proxyFieldComp(proxyField, Com)
			ecCom.WeaLoadingGlobal.destroy()
			if (cb) cb()
			return true
		}
	}
	if (render()) return;
	const timer = setInterval(() => {
		if (window.ecCom && ecCom.WeaTools.Base64) {
			clearInterval(timer)
			ecodeSDK.load({
				id: '${appId}',
				noCss: false,
				cb: render
			})
		}
	}, 50)
}

window.GRender = {
	...window.GRender,
	TabDetail: {
		render,
		getTabStore: () => ecodeSDK.getCom('${appId}', 'tabStore'),
		getRelateStore: () => ecodeSDK.getCom('${appId}', 'relateStore')
	}
}