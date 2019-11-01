const { Provider } = mobxReact

const TabDetail = ecodeSDK.imp(TabDetail)
const TabDetailStore = ecodeSDK.imp(TabDetailStore)
const RelateStore = ecodeSDK.imp(RelateStore)

const tabStore = new TabDetailStore()
const relateStore = new RelateStore()
const layoutStore = WfForm.getLayoutStore()
const allStore = { tabStore, layoutStore, relateStore }

class TabDetailRoot extends React.Component {
	render() {
		return (
			<Provider {...allStore}>
				<TabDetail {...this.props}/>
			</Provider>
		)
	}
}

ecodeSDK.setCom('${appId}', 'TabDetailRoot', TabDetailRoot)
ecodeSDK.setCom('${appId}', 'tabStore', tabStore)
ecodeSDK.setCom('${appId}', 'relateStore', relateStore)