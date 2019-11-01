const { WeaTab } = ecCom;
const { Button } = antd
const { inject, observer } = mobxReact

const DetailTable = ecodeSDK.imp(DetailTable)

@inject('relateStore')
@inject('tabStore')
@inject('layoutStore')
@observer
class TabDetail extends React.Component {

	btnWidth = 150

	constructor(props) {
		super(props)
		const {
			fieldMark, layoutStore, detailId, tabStore,
			relateStore, mainKey, subKeys
		} = this.props
		const width = fieldMark ? jQuery(`[data-fieldmark="${fieldMark}"]`).width() : 1143
		const detailInfo = layoutStore.detailMap.get(`detail_${detailId}`)
		tabStore.initialize(this, detailInfo, this.props)
		if (mainKey && subKeys && subKeys.length) {
			relateStore.initialize(mainKey, subKeys, layoutStore)
		}
		this.state = { width, detailInfo }
	}

	componentDidUpdate() {
		const btnDom = this.refs.buttons
		this.btnWidth = jQuery(btnDom).width()
	}

	componentWillUnmount() {
		const { tabStore } = this.props
		tabStore.clearInstance()
	}

	onEdit = (tabKey, type) => {
		const { checkAdd, checkRemove, tabStore, relateStore } = this.props
		const { subIndexMap } = relateStore
		if (type === 'remove') {
			checkRemove ? checkRemove(tabKey, subIndexMap, () => this.onTabRemove(tabKey)) : this.onTabRemove(tabKey)
		} else {
			checkAdd ? checkAdd(tabStore.tabKey, subIndexMap, this.onTabAdd) : this.onTabAdd()
		}
	}

	getTitle = (idx, serialNum) => {
		const { createTitle, title } = this.props
		if (title) {
			return `${title}-${serialNum}`
		}
		return createTitle ? createTitle(idx) : `卡片信息-${serialNum}`
	}

	onTabChange = tabKey => {
		const { tabStore } = this.props
		tabStore.setRead(tabKey)
		tabStore.changePage(tabKey)
	}

	onTabRemove = tabKey => {
		const { detailId, relateStore } = this.props
		relateStore.deleteRow(detailId, tabKey)
	}

	checkRequired = () => {
		const { relateStore, checkRequired } = this.props
		if (!checkRequired) return true
		return relateStore.checkRequired()
	}

	onTabAdd = () => {
		const { detailId, tabStore } = this.props
		if (this.checkRequired()) {
			const { detailInfo } = this.state
			tabStore.setRead(detailInfo.indexnum)
			WfForm.addDetailRow(`detail_${detailId}`,{});
		}
	}

	render() {
		const { tabStore, relateStore, detailId, changePage } = this.props
		const {
			tabKey, tabInfo, isAdd,
			unReadCount, display, goUnReadTab,
			selectedKey, setSelectedKey
		} = tabStore
		let { width } = this.state
		relateStore.showSubDetail(tabInfo)
		if (tabKey !== null) {
			if (changePage && typeof changePage === 'function')
				changePage(tabKey, selectedKey)
			setSelectedKey(tabKey)
		}
		const style = {
			marginTop: 7,
			marginLeft: 5,
			height: 30
		}
		return (
			<div style={{ display }}>
				<WeaTab
					type= 'editable-inline'
					keyParam = 'tabKey'
					style={{ width: width - this.btnWidth }}
					showAddBtn = { isAdd }
					datas = { tabInfo }
					selectedKey = { tabKey }
					onChange = { this.onTabChange }
					onEdit = { this.onEdit }
				/>
				<div style={{ display: 'flex' }} ref={'buttons'}>
					{
						tabInfo.length > 1 ? <Button style={style} onClick={() => tabStore.showDetailTable(true)}>
							详情
							<DetailTable
								onTabChange={this.onTabChange}
								detailId={detailId}/>
						</Button> : ''
					}
					{
						unReadCount ? <Button style={style} onClick={goUnReadTab}>
							未读 (<span style={{color: 'red'}}>{unReadCount}</span>)
						</Button> : ''
					}
				</div>
			</div>
		)
	}
}

ecodeSDK.exp(TabDetail)