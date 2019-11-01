const { Provider } = mobxReact

const BrowserCheckGroupStore = ecodeSDK.imp(BrowserCheckGroupStore)

const BrowserCheckGroup = ecodeSDK.imp(BrowserCheckGroup)

const store = new BrowserCheckGroupStore()
const allStore = { store }

class BrowserCheckGroupRoot extends React.Component {
	render() {
		return (
			<Provider {...allStore}>
				<BrowserCheckGroup {...this.props}/>
			</Provider>
		)
	}
}

ecodeSDK.setCom('${appId}', 'BrowserCheckGroup', BrowserCheckGroupRoot)

window.GRender = {
	...window.GRender,
	BrowserCheckGroup: {
		getStore: () => store
	}
}