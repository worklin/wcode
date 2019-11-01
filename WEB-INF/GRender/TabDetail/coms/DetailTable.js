const { Button, Modal } = antd
const { inject, observer } = mobxReact
const { WeaDialog, WeaTable, WeaRightMenu } = ecCom

@inject('tabStore')
@inject('relateStore')
@observer
class DetailTable extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			title: '卡片列表',
			selectedRowKeys: [],
			removeRowStr: ''
		}
	}

	getColumns = () => {
		const { onTabChange } = this.props
		return [{
			title: 'ID',
			key: 'tabKey',
			dataIndex: 'tabKey'
		}, {
			title: '标题',
			key: 'title',
			dataIndex: 'title'
		}, {
			title: '操作',
			key: 'operator',
			width: 100,
			dataIndex: 'tabKey',
			render: tabKey => <Button onClick={() => onTabChange(tabKey)}>查看</Button>
		}]
	}

	removeSelectRowKeys = () => {
		const { relateStore } = this.props
		Modal.confirm({
			title: '提示消息',
			content: '是否要删除选中的卡片，该过程不可恢复！',
			onOk: () => {
				const { removeRowStr } = this.state
				const { detailId } = this.props
				relateStore.deleteRow(detailId, removeRowStr)
				this.setState({ selectedRowKeys: [] })
			}
		})
	}

	onChangeSelectKeys = (selectedRowKeys, selectedRows) => {
		const _selectedRowKeys = selectedRows.map(({tabKey}) => tabKey)
		const removeRowStr = _selectedRowKeys.join(',')
		this.setState({ selectedRowKeys, removeRowStr })
	}

	render() {
		const { title, selectedRowKeys } = this.state
		const { tabStore } = this.props
		const { showDetail, showDetailTable, dataSource, isDelete } = tabStore
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onChangeSelectKeys
		}
		const menu = [
			{
				key: 'removeSelectRowKeys',
				icon: <i className="icon-coms-Delete" />,
				content: '全部删除',
				onClick: this.removeSelectRowKeys
			}
		];
		const table = <WeaTable
			rowSelection={rowSelection}
			columns={this.getColumns()}
			dataSource={dataSource} />
		return (
			<WeaDialog
				onCancel={() => showDetailTable(false)}
				title={title}
				visible={showDetail}
				hasScroll >
				{
					isDelete ? <WeaRightMenu datas={menu} showUrlItem={false}>
						{table}
					</WeaRightMenu> : table
				}
			</WeaDialog>
		)
	}
}

ecodeSDK.exp(DetailTable)