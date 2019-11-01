const { observable, action, toJS } = mobx;

class SearchBrowserStore {

	@observable propMap = {}

	@observable dataParamMap = {}

	@observable lockMap = {}

	@action
	handlerDataParams = (fieldid, newProps) => {
		this.propMap[fieldid] = newProps
		this.callData({}, newProps)
		this.handlerEvent(fieldid)
	}

	handlerEvent = fieldid => {
		const lockMap = this.lockMap
		const newProps = this.propMap[fieldid];
		const { source } = newProps
		if (!lockMap[fieldid] && source) {
			const {detailId} = GForm.getFieldInfo(source)
			const handler = () => this.callData({}, newProps)
			WfForm.bindDetailFieldChangeEvent(source, handler);
			WfForm.registerAction(WfForm.ACTION_ADDROW + detailId, handler);
			lockMap[fieldid] = true
		}
	}

	getDataSource = newProps => {
		const { source, getDataSource } = newProps
		if (getDataSource && typeof getDataSource === 'function')
			return getDataSource()
		const val = GForm.getFieldValue(source)
		return val ? val.split(',') : []
	}

	@action
	reload = fieldId => {
		fieldId = fieldId.replace('field', '')
		const newProps = this.propMap[fieldId];
		this.callData({}, newProps)
	}

	callData = (params, newProps) => {
		const { type, dataParams, fieldid } = newProps;
		ecCom.WeaLoadingGlobal.start()
		WeaTools.callApi(`/api/public/browser/data/${type}`, 'GET', {
			...dataParams,
			...params
		}).then(action(resp => {
			const { total, pageSize, datas } = resp
			if (total > pageSize) {
				this.callData({
					pageSize: total
				}, newProps)
			} else {
				const allData = datas.map(({randomFieldId}) => randomFieldId)
				const arr = this.getDataSource(newProps)
				let selectArr = allData.filter(x => x && !arr.includes(x))
				const selectids = selectArr.length === 0 ? '-1' : selectArr.join(',')
				const dataParamMap = toJS(this.dataParamMap)
				dataParamMap[fieldid] = {
					...dataParams, selectids
				}
				this.dataParamMap = dataParamMap
				ecCom.WeaLoadingGlobal.destroy()
			}
		}))
	}
}

ecodeSDK.exp(SearchBrowserStore)