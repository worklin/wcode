const { WeaBrowser, WeaTools } = ecCom;
const { Button } = antd
const { inject, observer } = mobxReact;
const { toJS } = mobx;

@inject('store')
@observer
class SearchBrowser extends React.Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		const { store, fieldid, source } = this.props
		if (source) {
			store.handlerDataParams(fieldid, this.props)
		}
	}

	render() {
		const { store: {dataParamMap}, fieldid, source } = this.props
		let newProps = {
			customized: true,
			_noOverwrite: true
		}
		if (source) {
			newProps.dataParams = toJS(dataParamMap)[fieldid]
		}
		return (
			<WeaBrowser {...this.props} { ...newProps } >
				<Button icon="search">搜索</Button>
			</WeaBrowser>
		)
	}
}

//发布模块
ecodeSDK.setCom('${appId}', 'SearchBrowser', SearchBrowser);