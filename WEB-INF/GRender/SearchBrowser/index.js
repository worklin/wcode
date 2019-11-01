const { Provider } = mobxReact;
const SearchBrowserStore = ecodeSDK.imp(SearchBrowserStore)
const SearchBrowser = ecodeSDK.imp(SearchBrowser)

const store = new SearchBrowserStore()
const allStores = { store }
class SearchBrowserRoot extends React.Component {
	render() {
		return (
			<Provider {...allStores}>
				<SearchBrowser {...this.props}/>
			</Provider>
		)
	}
}

ecodeSDK.setCom('${appId}', 'SearchBrowser', SearchBrowserRoot)

window.GRender = {
	...window.GRender,
	SearchBrowser: {
		getStore: () => store
	}
}