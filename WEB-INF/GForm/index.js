const OverwriteForm = ecodeSDK.imp(OverwriteForm)

const overForm = new OverwriteForm()

const getForm = OverwriteForm.getForm

const registerAction = (actionName, fn) => overForm.registerAction(actionName, fn)

const registerCheckEvent = (actionName, fn) => overForm.registerCheckEvent(actionName, fn)

/** 字段信息缓存 */
let cacheFieldInfo = {};

let fieldNameMap;

/** 字段名称缓存 **/
let cacheFieldNameMap = {};

let fieldAttrMap;

const getFieldNameMap = () => {
	if (!fieldNameMap) {
		if (window.WfForm) {
			fieldNameMap = mobx.toJS(WfForm.getLayoutStore().fieldNameMap)
		} else if (window.ModeForm) {
			fieldNameMap = mobx.toJS(cubeStore.Card.fieldNameMap)
		}
	}
	return fieldNameMap
}

const getFieldAttrMap = () => {
	if (!fieldAttrMap) {
		if (window.WfForm) {
			fieldAttrMap = mobx.toJS(WfForm.getLayoutStore().fieldAttrMap)
		} else {
			fieldAttrMap = window.cubeStore.Card.allFields
		}
	}
	return fieldAttrMap
}

const getFieldAttr = fieldMark => {
	if (!fieldAttrMap) getFieldAttrMap()
	const fieldId = getFieldId(fieldMark)
	if (window.WfForm) {
		return fieldAttrMap[fieldId.replace('field', '')]
	}
	return fieldAttrMap[fieldId]
}

const isBlank = str => {
	if (str === undefined || str === null || str === '') {
		return true;
	}
	if (typeof str === 'string' && str.trim() === '') return true;
}

/**
 * 将字段标识转化成字段ID
 * @param fieldMark		字段标识
 * @returns {string|*}
 */
const convertFieldNameToId = fieldMark => {
	if (isBlank(fieldMark)) return '';
	// 非空判断
	if (!fieldMark) return '';
	// 表单判断
	const map = getFieldNameMap();
	if(!map) return '';
	// 缓存判断
	let val = cacheFieldNameMap[fieldMark];
	if (val !== undefined) return val;
	const tmpMark = fieldMark;
	fieldMark = fieldMark.toUpperCase();
	let key = `main.${fieldMark}`;
	let isDetail = false, lock = false, pos;
	// 明细字段判断
	if ((pos = fieldMark.indexOf('.')) !== -1 && fieldMark.indexOf('D') === 0) {
		key = fieldMark.replace('D', 'detail_');
		isDetail = true;
		lock = pos !== 1;
		fieldMark = fieldMark.substr(pos + 1)
	}
	let fieldId = map[key];
	if (fieldId === undefined && isDetail) {
		// d.字段名判断
		Object.keys(map).every(fName => {
			if (fName.startsWith('detail_') && fName.endsWith(`.${fieldMark}`) && !lock) {
				fieldId = map[fName];
				return false;
			}
			return true;
		});
	}
	val = fieldId ? `field${fieldId}` : '';
	// 写入缓存
	cacheFieldNameMap[tmpMark] = val;
	return val
}

const getFieldId = fieldMark => {
	if (fieldMark === '' || fieldMark === undefined) return ''
	return /field\d/.test(fieldMark) ? fieldMark : convertFieldNameToId(fieldMark)
}

/**
 * 获取字段信息
 * @param fieldMark
 * @returns {map|*}: isDetail: 是否是明细表, tableMark: main/detail_xx, detailId: 明细表下标
 */
const getFieldInfo = fieldMark => {
	if (isBlank(fieldMark)) return {}
	let info = cacheFieldInfo[fieldMark];
	if (info !== undefined) return info;
	const fieldId = getFieldId(fieldMark)
	if (!fieldId) return {}
	if(window.WfForm) {
		const fid = fieldId.replace('field', '')
		info = WfForm.getFieldInfo(fid)
	} else if (window.ModeForm) {
		info = ModeForm.getFieldInfo(fieldId);
		const { isdetail, detail } = info;
		info.isDetail = isdetail || false
		info.tableMark = isdetail ? detail : 'main'
	}
	if (!info) return;
	const {isDetail, tableMark} = info
	if (isDetail) {
		info.detailId = tableMark.replace('detail_', '')
	}
	info.fieldId = `field${info.fieldid}`
	cacheFieldInfo[fieldMark] = info;
	return info
};

/**
 * 遍历明细表
 * @param detailMark：	detail_xx || xx
 * @param callback		回调函数
 */
const forEachDetail = (detailMark, callback) => {
	if (isBlank(detailMark)) return;
	const form = getForm()
	let allRows;
	if (/detail_\d/.test(detailMark)) {
		allRows = form.getDetailAllRowIndexStr(detailMark);
	} else {
		allRows = form.getDetailAllRowIndexStr(`detail_${detailMark}`);
	}
	if (allRows === '') return;
	allRows.split(',').forEach(callback)
}

/**
 * 获取字段值
 * @param fieldMark		字段标识
 * @param rowIndex		明细表下标
 * @returns {string}
 */
const getFieldValue = (fieldMark, rowIndex = null) => {
	if (isBlank(fieldMark)) return ''
	const {isDetail, detailId, fieldId} = getFieldInfo(fieldMark)
	const form = getForm()
	if (!isDetail) return form.getFieldValue(fieldId)
	if (rowIndex !== null) {
		return form.getFieldValue(`${fieldId}_${rowIndex}`)
	}
	let l = []
	forEachDetail(detailId, idx => {
		l.push(form.getFieldValue(`${fieldId}_${idx}`))
	})
	return l.join(',')
}

/**
 * 计算明细表列的总值
 * @param colFields
 */
const computeColValue = (...colFields) => {
	let map = {};
	if (colFields.length === 0) return map;
	const form = getForm()
	const detailIdMap = {}
	colFields.forEach(fieldId => {
		const {isDetail, detailId} = getFieldInfo(fieldId)
		if (!isDetail) return false;
		if (!detailIdMap[detailId]) detailIdMap[detailId] = []
		detailIdMap[detailId].push(fieldId)
	})

	Object.keys(detailIdMap).forEach(detailId => {
		const fields = detailIdMap[detailId]
		forEachDetail(detailId, idx => {
			fields.forEach(field => {
				if (!field) return false;
				if (!map[field]) map[field] = 0;
				let val = form.getFieldValue(`${field}_${idx}`) || 0
				val = val !== 0 ? Number.parseFloat(val) || 0 : 0
				map[field] = map[field] + val
			})
		})
	})
	return map
}

/**
 * 字段值改变事件
 * @param fieldMarks  字段标识
 * @param callback    回调函数
 */
const bindFieldChangeEvent = (fieldMarks, callback) => {
	if (isBlank(fieldMarks)) return;
	const form = getForm();
	const handler = fieldMark => {
		const {isDetail, fieldId, detailId} = getFieldInfo(fieldMark)
		if (!isDetail) {
			form.bindFieldChangeEvent(fieldId, callback);
			return
		}
		form.bindDetailFieldChangeEvent(fieldId, callback);
		form.registerAction(form.ACTION_ADDROW + detailId, idx => setTimeout(() => callback(fieldId, idx), 100))
	};
	fieldMarks.split(',').forEach(fieldMark => {
		fieldMark = fieldMark.trim()
		if (!fieldMark) return false;
		handler(fieldMark)
	})
}

const setBrowserDataRange = fieldMap => {
	const form = getForm();
	const handler = (vFieldMark, selectids, kFieldMark) => {
		const {isDetail, detailId, fieldId} = getFieldInfo(vFieldMark)
		if (!isDetail) {
			form.appendBrowserDataUrlParam(fieldId, {selectids})
		} else {
			forEachDetail(detailId, idx => form.appendBrowserDataUrlParam(`${fieldId}_${idx}`, {selectids}))
			if (kFieldMark) {
				registerAction(form.ACTION_ADDROW + detailId,
						idx => form.appendBrowserDataUrlParam(`${fieldId}_${idx}`, {
					selectids: getFieldValue(kFieldMark) || '-1'
				}))
			}
		}
	}
	Object.keys(fieldMap).forEach(kFieldMark => {
		const vFieldMark = fieldMap[kFieldMark]
		const selectids = getFieldValue(kFieldMark) || '-1'
		bindFieldChangeEvent(kFieldMark, () => {
			handler(vFieldMark, getFieldValue(kFieldMark))
		})
		handler(vFieldMark, selectids, kFieldMark)
	})
}

/**
 * 字段值校验事件 支持主表字段和明细表字段
 * @param fieldMark 字段标记 fieldId/数据库字段名
 * @param checkFunc 校验函数
 * @param callback  回调
 */
const bindFieldCheckEvent = (fieldMark, checkFunc, callback) => {
	if (isBlank(fieldMark)) return;
	const form = getForm()
	const {isDetail, detailId, fieldId} = getFieldInfo(fieldMark)
	let rowIndex = [], lock = false;

	const clear = () => {
		rowIndex.forEach(idx => {
			const fid = isDetail ? `${fieldId}_${idx}` : fieldId
			lock = true;
			form.changeFieldValue(fid, {
				value: '',
				specialobj:[
					{id: '', name: ''}
				],
				showhtml: ''
			});
			lock = false
		})
		rowIndex = [];
	}

	const handlerCall = (a, b, value) => {
		const call = checkFunc(a, b, value)
		return Promise.resolve(call).then(bool => ({
			bool, idx: b
		}));
	}

	const doHandler = (resp, func) => {
		const {bool, idx} = resp
		if (bool) {
			if (func) func()
			return;
		}
		if (!callback) return;
		rowIndex = []
		if (Array.isArray(idx)) {
			rowIndex.push([...idx])
		} else {
			rowIndex.push(idx);
		}
		callback(clear, rowIndex)
	}

	bindFieldChangeEvent(fieldId, (a, b, value) => {
		if (lock) return
		handlerCall(a, b, value).then(resp => doHandler(resp))
	})

	const doSubmit = func => {
		if (!isDetail) {
			const val = getFieldValue(fieldId)
			handlerCall(document.querySelector(`input[name="${fieldId}"]`), fieldId, val)
				.then(resp => doHandler(resp, func))
			return;
		}
		const allPromise = []
		forEachDetail(detailId, idx => {
			const val = getFieldValue(fieldId, idx)
			let promise = handlerCall(fieldId, idx, val);
			allPromise.push(promise)
		})
		Promise.all(allPromise).then(array => {
			let l = []
			array.forEach(({bool, idx}) => {
				if (!bool) l.push(idx)
			});
			doHandler({
				bool: l.length === 0,
				idx: l
			}, func)
		})
	}
	if (window.WfForm) {
		WfForm.registerCheckEvent(WfForm.OPER_SAVE + ',' + WfForm.OPER_SUBMIT, cb => doSubmit(cb))
	}
	// const key = window.WfForm ? WfForm.OPER_SAVE + ',' + WfForm.OPER_SUBMIT : overForm.OPER_SAVE
	// registerCheckEvent(key, doSubmit)
}

const proxyFieldComp = (fieldMark, Com, props) => {
	if (!fieldMark || !Com) return;
	const {isDetail, detailId, fieldId} = getFieldInfo(fieldMark)
	const form = getForm();
	if (!isDetail)  form.proxyFieldComp(fieldId, Com)

	const render = idx => {
		props = {
			...props,
			rowIdx: Number(idx),
			idx: Number(idx)
		}
		form.proxyFieldComp(`${fieldId}_${idx}`, <Com {...props} />)
	}
	forEachDetail(detailId, idx => render(idx))
	registerAction(form.ACTION_ADDROW + detailId, idx => render(idx));
}

const getFieldCurViewAttr = fieldMark => {
	const {viewattr} = getFieldInfo(fieldMark)
	return viewattr
}

const getFieldNum = fieldId => {
	const form = getForm();
	return Number.parseFloat(form.getFieldValue(fieldId)) || 0
}

const toggleDetail = (detailId, show) => {
	const dom = document.querySelector(`#dTableArea_${detailId-1}`)
	if (dom) {
		const pNode = dom.parentNode;
		if (pNode) pNode.style.display = show ? '' : 'none'
	}
}

/**
 * @param target
 * @param fieldMarks  'field1001,field1002'
 * @param mode  1: 主表合并到主表；2: 明细表合并到明细表
 */
const mergeFieldValue = (target, fieldMarks, mode=1) => {
	const { fieldId, detailId } = getFieldInfo(target)
	const handler = (rowIdx = null) => {
		let newVal = ''
		fieldMarks.split(',').forEach(fieldMark => {
			const val = GForm.getFieldValue(fieldMark, rowIdx)
			if (val !== '') {
				const tmp = newVal ? `,${val}` : val
				newVal += tmp
			}
		})
		const valSet = new Set(newVal.split(','))
		const value = [...valSet].join(',')
		const fId = rowIdx ? `${fieldId}_${rowIdx}` : fieldId
		WfForm.changeFieldValue(fId, { value })
	}
	if (mode === 1) {
		handler()
	} else {
		GForm.forEachDetail(detailId, idx => handler(idx))
	}
	switch (mode) {
		case 1:
			GForm.bindFieldChangeEvent(fieldMarks,
				() => handler())
			break
		case 2:
			GForm.bindFieldChangeEvent(fieldMarks,
				(id, rowIdx) => handler(rowIdx))
			break
		case 3:
			GForm.bindFieldChangeEvent(fieldMarks,
				(id, rowIdx) => handler(rowIdx))
			break
	}
}

window.GForm = {
	...window.GForm,
	forEachDetail, setBrowserDataRange, getFieldInfo,
	getFieldValue, computeColValue, bindFieldChangeEvent,
	convertFieldNameToId, getFieldNameMap, bindFieldCheckEvent,
	proxyFieldComp, registerAction, getFieldCurViewAttr,
	OPER_SAVE: overForm.OPER_SAVE, registerCheckEvent, getFieldNum,
	toggleDetail, getFieldAttrMap, getFieldAttr, mergeFieldValue
}