const { computed, observable } = mobx
const { Modal } = antd

class TabDetailStore {

	rowReadMap = new Map()

	@observable showDetail = false

	instance

	unReadCount = 0

	detailInfo

	initEventLock = false

	selectedKey = null

	showDetailTable = show => this.showDetail = show

	setSelectedKey = selectedKey => this.selectedKey = selectedKey

	clearInstance = () => this.instance = null

	setRead = tabKey => {
		if (this.selectedKey !== null) {
			this.rowReadMap.set(this.selectedKey, true)
		}
		this.rowReadMap.set(Number(tabKey), true)
	}

	initialize = (instance, detailInfo, props) => {
		this.instance = instance
		this.detailInfo = detailInfo
		!this.initEventLock && this.initEvent(props)
	}

	initEvent = props => {
		const { checkUnRead } = props
		checkUnRead && WfForm.registerCheckEvent(WfForm.OPER_SUBMIT, callback => {
			if (this.unReadCount !== 0) {
				Modal.confirm({
					title: '提示消息',
					content: `有 ${this.unReadCount} 个卡片信息未读，是否跳转到未读卡片？`,
					onOk: this.goUnReadTab
				})
			} else {
				callback()
			}
		})
		this.initEventLock = true
	}

	changePage = tabKey => {
		if (!this.instance.checkRequired()) return
		const { rowInfoArr } = this.detailInfo
		let current = 0
		rowInfoArr.forEach((data, i) => {
			const { rowIndex } = data
			if (rowIndex === Number(tabKey)) {
				current = i + 1
			}
		})
		this.detailInfo.controlPagingInfo({current})
	}

	goUnReadTab = () => {
		this.tabInfo.every(tabObj => {
			const { isRead, tabKey } = tabObj
			if (!isRead) {
				this.setRead(this.selectedKey)
				this.changePage(tabKey)
			}
			return isRead
		})
	}

	/**
	 * 自动计算 tabInfo
	 */
	@computed get tabInfo() {
		let tabInfo = []
		const editable = this.isDelete
		let unReadCount = 0
		this.detailInfo.rowInfoArr.forEach(rowObj => {
			const { needHide, rowIndex: tabKey, serialNum } = rowObj
			if (needHide) return false
			let title = this.instance.getTitle(tabKey, serialNum)
			// 判断当前行是否已读
			const isRead = this.rowReadMap.get(tabKey) || tabKey === this.tabKey
			if (!isRead) unReadCount ++
			title = isRead ? title : <span>{ title } (<span style={{ color: 'red' }}>未读</span>)</span>
			const tabObj = {
				tabKey,
				editable,
				title,
				isRead
			}
			tabInfo.push(tabObj)
		})
		this.unReadCount = unReadCount
		return tabInfo
	}

	@computed get tabKey() {
		return Number(this.detailInfo.currentPageRowIndexStr)
	}

	@computed get isAdd() {
		const {attr: { isadd }} = this.detailInfo
		return isadd === 1
	}

	@computed get isDelete() {
		const {attr: { isdelete }} = this.detailInfo
		return isdelete === 1
	}

	@computed get display() {
		let display = ''
		if (this.tabInfo.length === 0 && !this.isAdd) {
			display = 'none'
		} else {
			display = 'flex'
		}
		return display
	}

	@computed get dataSource() {
		return this.tabInfo.map(tabObj => tabObj)
	}
}

ecodeSDK.exp(TabDetailStore)