window.Wcode = {
	WF_TYPE: 'WF_TYPE',
	MODE_TYPE: 'MODE_TYPE',
	LIST_TYPE: 'LIST_TYPE',
	ALL_NODE: 'ALL_NODE',
	ALL_MODE_LIST: 'ALL_MODE_LIST',
	ALL_TEMPLATE: 'ALL_TEMPLATE',
	// 模板类型 0显示模板 1 新建模板 2 编辑模板 3 监控模板 4 打印模板
	SHOW_TEMPLATE: 0,
	NEW_TEMPLATE: 1,
	EDIT_TEMPLATE: 2,
	loadListen: false,
	loadConfMap: new Map(),

	runScript(params) {
		const conf = this.loadTypeConf(params)
		if (!conf) return
		let { id, appId, noCss, cb } = params
		const { url, retKey, runFunc, _k, name } = conf
		const { hash } = window.location
		if (!hash.startsWith(url)) return;
		const key = retKey()
		const loadConf = {
			id: appId,
			noCss: noCss === undefined ? true : noCss,
			cb: cb ? cb : () => {},
			key, name
		}
		ecodeSDK.overwritePropsFnQueueMapSet(name, {
			fn: () => runFunc(id, loadConf, _k),
			desc: key
		})
	},

	loadScript(loadConf, checkFunc) {
		const { key, name } = loadConf
		if (Wcode.loadConfMap.get(key)) return
		if (!(window.ecCom && ecCom.WeaTools && ecCom.WeaTools.Base64) || !checkFunc()) return
		Wcode.loadConfMap.set(key, loadConf)
		Wcode.clearPropsFn(name, key)
		ecodeSDK.load(loadConf)
	},

	runWfScript(wid, loadConf, nid) {
		Wcode.loadScript(loadConf, () => {
			const { workflowid, nodeid } = WfForm.getBaseInfo()
			if (workflowid != wid) return
			const { submitParam: { nodetype }} = WfForm.getGlobalStore()
			if (nid ===  Wcode.ALL_NODE || nid == nodeid || (nid === '0' && nodetype === '0'))
				return true
		})
	},

	runModeScript(mid, loadConf, _type) {
		if (!Wcode.loadListen && window.weaHistory) {
			const { listen } = window.weaHistory
			listen(Wcode.listenRouter)
			Wcode.loadListen = true
		}
		Wcode.loadScript(loadConf, () => {
			const { type, modeId } = ModeForm.getCardUrlInfo()
			if (modeId != mid) return
			if (_type === Wcode.ALL_TEMPLATE || type == _type)
				return true
		})
	},

	runModeListScript(cid, loadConf, _menuIds) {
		Wcode.loadScript(loadConf, () => {
			const { customid, menuIds} = ecCom.WeaTools.getUrlParams()
			if (customid != cid) return
			if (_menuIds === Wcode.ALL_MODE_LIST || _menuIds == menuIds)
				return true
		})
	},

	listenRouter(location) {
		const {  query: { modeId, type } } = location
		const key = `mode-${modeId}-type-${type}-`
		const tail = '?v=' + Math.random().toString().slice(-6)
		Wcode.loadConfMap.forEach((conf, _key) => {
			if (_key.startsWith(key)) {
				const { id: appId, cb: success } = conf
				const src = `/cloudstore/release/${appId}/index.js`
				const script = document.querySelector(`script[src*="${src}"]`)
				if (script) script.remove()
				ecodeSDK.loadjs.reset()
				ecodeSDK.loadjs(src + tail, appId, { success })
			}
		})
	},

	clearPropsFn(name, key) {
		const { queue } = ecodeSDK.overwritePropsFnQueueMap[name]
		queue.forEach(({desc}, i) => {
			if (key === desc) queue.splice(i, 1)
		})
	},

	loadTypeConf(params) {
		let { mode, id, appId, nodeId, type, menuIds } = params
		let _k = ''
		switch (mode) {
			case this.WF_TYPE:
				_k  = nodeId === undefined ? '0' : nodeId
				return {
					_k,
					url: '#/main/workflow/req',
					retKey() { return `workflow-${id}-node-${_k}-${appId}` },
					runFunc: Wcode.runWfScript,
					name: 'WeaReqTop'
				};
			case this.MODE_TYPE:
				_k = type === undefined ? Wcode.NEW_TEMPLATE : type
				return {
					_k,
					url: '#/main/cube/card',
					retKey: () => `mode-${id}-type-${_k}-${appId}`,
					runFunc: Wcode.runModeScript,
					name: 'WeaReqTop'
				};
			case this.LIST_TYPE:
				_k = menuIds === undefined ? Wcode.ALL_MODE_LIST : menuIds
				return {
					_k,
					url: '#/main/cube/search',
					retKey: () => `mode-list-${id}-menuIds-${_k}-${appId}`,
					runFunc: Wcode.runModeListScript,
					name: 'Table'
				}
		}
	}
}