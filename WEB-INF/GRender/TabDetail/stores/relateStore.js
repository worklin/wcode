const { observable, reaction, toJS } = mobx

class RelateStore {

	@observable subMap = new Map()

	@observable detailArr = []

	subIndexMap = new Map()

	requiredMap = new Map()

	mainKey = ''

	initEventLock = false

	initialize = (mainKey, subKeys, layoutStore) => {
		const mainInfo = GForm.getFieldInfo(mainKey)
		if (!mainInfo.isDetail) return
		const detailArr = []
		const detailMap = layoutStore.detailMap
		const mainDetailInfo = detailMap.get(`detail_${mainInfo.detailId}`)
		mainDetailInfo.isMain = true
		detailArr.push(mainDetailInfo)
		const subMap = new Map()
		subKeys.forEach(k => {
			let {isDetail, detailId, fieldId} = GForm.getFieldInfo(k)
			if (!isDetail) return
			detailId = Number(detailId)
			if (!subMap.has(detailId)) {
				subMap.set(detailId, fieldId)
				const detailInfo = layoutStore.detailMap.get(`detail_${detailId}`)
				this.requiredMap.set(detailId, this.getRequiredField(detailInfo))
				detailArr.push(detailInfo)
			}
		})
		this.mainKey = mainKey
		this.detailArr = detailArr
		this.subMap = subMap
		this.autoRelate()
		!this.initEventLock && this.initEvent(mainInfo.fieldId, mainDetailInfo)
	}

	deleteRow = (detailId, rowStr, exec = false) => {
		if (exec) {
			this.subIndexMap.forEach((arr, _detailId) => {
				if (arr.length > 0)
					WfForm.delDetailRow(`detail_${_detailId}`, arr.join(','))
			})
			WfForm.delDetailRow(`detail_${detailId}`, String(rowStr))
		}
		!exec && String(rowStr).split(',').forEach(idx => {
			this.deleteRow(detailId, idx, true)
		})
	}

	getRequiredField = detailInfo => {
		const { fieldInfo } = detailInfo
		const array = []
		Object.values(fieldInfo).forEach(fieldObj => {
			const { fieldid, viewattr } = fieldObj
			if (viewattr === 3) {
				// 必填
				array.push(`field${fieldid}`)
			}
		})
		return array
	}

	showSubDetail = tabInfo => {
		const show = tabInfo.length !== 0
		this.subMap.keys().forEach(detailId => GForm.toggleDetail(detailId, show))
	}

	initEvent = (mainFieldId, mainDetailInfo) => {
		const handler = (mainIdx, subKey, subIdx) => {
			const valObj = toJS(WfForm.getFieldObj(`${mainFieldId}_${mainIdx}`))
			const subVal = GForm.getFieldValue(subKey, subIdx)
			if (subVal === '') {
				WfForm.changeFieldValue(`${subKey}_${subIdx}`, valObj)
			}
		}
		GForm.bindFieldChangeEvent(this.mainKey, (id, rowIndex) => {
			this.subMap.forEach((fieldId, detailId) => {
				GForm.forEachDetail(detailId, idx => handler(rowIndex, fieldId, idx))
			})
			this.autoRelate(false)
		})
		this.subMap.forEach((fieldId, detailId) => {
			WfForm.registerAction(WfForm.ACTION_ADDROW + detailId, idx => {
				const { currentPageRowIndexStr } = mainDetailInfo
				handler(currentPageRowIndexStr, fieldId, idx)
				// 新增的子明细表主键字段设为只读
				WfForm.changeFieldAttr(`${fieldId}_${idx}`, 1);
				this.autoRelate(false)
			})
		})
		this.initEventLock = true
	}

	getDetailArr = () => this.detailArr.map(obj => ({
		rowIdxStr: obj.allRowIndexStr,
		detailId: obj.attr.groupid,
		isMain: obj.isMain,
		controlDetailRowAttr: obj.controlDetailRowAttr,
		currentPageRowIndexStr: obj.currentPageRowIndexStr,
		rowInfoArr: obj.rowInfoArr
	}))

	autoRelate = (init = true) => {
		this.handler(this.getDetailArr())
		init && reaction(this.getDetailArr, this.handler)
	}

	checkRequired = () => {
		let hasNext = true
		this.requiredMap.forEach((fieldArr, detailId) => {
			if (fieldArr.length === 0) return
			const idxArr = this.subIndexMap.get(detailId)
			for (let i = 0, idxLen = idxArr.length; i < idxLen; i++) {
				for (let j = 0, fieldLen = fieldArr.length; j < fieldLen; j++) {
					const val = WfForm.getFieldValue(`${fieldArr[j]}_${idxArr[i]}`)
					if (val === '') {
						antd.message.warn('请完善当前卡片页信息！')
						hasNext = false
						break
					}
				}
			}
		})
		return hasNext
	}

	handler = detailArr => {
		let mainVal = ''
		detailArr.forEach(({isMain, currentPageRowIndexStr}) => {
			if (isMain) mainVal = GForm.getFieldValue(this.mainKey, currentPageRowIndexStr)
		})
		detailArr.forEach(info => {
			const { isMain, rowInfoArr, detailId, controlDetailRowAttr } = info
			if (isMain) return
			let attr = {}, array = []
			const fieldId = this.subMap.get(detailId)
			rowInfoArr.forEach(({rowIndex}) => {
				const subVal = GForm.getFieldValue(fieldId, rowIndex)
				const needHide = mainVal !== subVal
				attr[`row_${rowIndex}`] = { needHide, disableCheck: needHide }
				if (!needHide) array.push(rowIndex)
			})
			controlDetailRowAttr(attr)
			this.subIndexMap.set(detailId, array)
		})
	}
}
ecodeSDK.exp(RelateStore)