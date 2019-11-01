const { Checkbox } = antd;
const { WeaTools } = ecCom;
const { inject, observer } = mobxReact
const CheckboxGroup = Checkbox.Group;

@inject('store')
@observer
class BrowserCheckGroup extends React.Component {

	componentDidMount() {
		const { store } = this.props
		store.initialize(this.props)
	}

	render() {
		const { store: { options, checkedValues, onChange }} = this.props
		return (
			<CheckboxGroup
				onChange= { onChange }
				options = { options }
				value = { checkedValues } />
		)
	}
}

ecodeSDK.exp(BrowserCheckGroup)