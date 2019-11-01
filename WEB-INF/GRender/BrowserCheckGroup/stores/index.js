const { observable, reaction, toJS, action } = mobx

class BrowserCheckGroupStore {
	@observable options = []
	@observable checkedValues = []
	@observable newProps
	@observable disableArr = []

	initialize = newProps => {
		this.newProps = newProps
		this.callData({})
		const { value } = newProps
		this.checkedValues = value === '' ? [] : value.split(',')
	}

	@action
	callData = params => {
		const { type, dataParams } = this.newProps;
		WeaTools.callApi(`/api/public/browser/data/${type}`,
			'GET', { ...dataParams, ...params }).then(resp => {
			const { total, pageSize } = resp
			if (total > pageSize) {
				this.callData({
					pageSize: total,
				})
				return
			}
			this.initOptions(resp)
		});
	}

	initOptions = dataObj => {
		const { columns, datas } = dataObj
		let { labelKey, valKey, viewAttr } = this.newProps
		if (!(labelKey && valKey)) {
			columns.forEach(({isInputCol, isPrimarykey, dataIndex}) => {
				if (isInputCol === 'true') labelKey = dataIndex
				if (isPrimarykey === 'true') valKey = dataIndex
			})
		}
		// 1: 只读, 2: 编辑
		this.options = datas.map(data => ({
			label: data[labelKey],
			value: data[valKey],
			disabled: viewAttr === 1 || this.disableArr.includes(data[valKey])
		}))
	}

	onChange = checkedValues => {
		const value = checkedValues.join(',')
		const { onChange } = this.newProps
		if(onChange && typeof onChange==='function') {
			onChange(value)
			this.checkedValues = checkedValues
		}
	}

	/**
	 * mode: true -> 将values设置为只读；false -> 将除values外的值设为只读
	 */
	changeReadOnly = (values, mode=true) => {
		let disableArr = []
		this.options = toJS(this.options).map(option => {
			const {label, value} = option
			let disabled = values.includes(value)
			if (!mode) disabled = !disabled
			if (disabled) disableArr.push(value)
			return {label, value, disabled}
		})
		this.disableArr = disableArr
	}
}

ecodeSDK.exp(BrowserCheckGroupStore)