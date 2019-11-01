
class OverwriteForm {
	OPER_SAVE = 'oper_save'
	actionFun = {}
	overwriteSave = false
	overwriteAction = false
	callNumber = 0

	static getForm() {
		return window.WfForm || window.ModeForm
	}

	pushAction(actionName, fn){
		if (!this.actionFun[actionName]) this.actionFun[actionName] = []
		this.actionFun[actionName].push(fn)
	}

	registerAction(actionName, fn) {
		const form = OverwriteForm.getForm();
		if ('registerAction' in form) {
			form.registerAction(actionName, fn)
			return;
		}
		if (!actionName.startsWith(ModeForm.ACTION_ADDROW) &&
			!actionName.startsWith(ModeForm.ACTION_DELROW)) return;

		this.pushAction(actionName, fn);

		if (!this.overwriteAction) {
			ModeForm.triggerAction = (k, args, timeout=50) => {
				const fns = this.actionFun[actionName]
				try {
					fns.forEach(fn => setTimeout(() => fn(args), timeout))
				} catch (e) { }
			}
			this.overwriteAction = true;
		}
	}

	registerCheckEvent(actionName, fn) {
		const form = getForm()
		if ('registerCheckEvent' in form) {
			form.registerCheckEvent(actionName, fn)
			return;
		}
		const operList = actionName.split(',')

		operList.forEach(oper => {
			if (oper.trim() === this.OPER_SAVE) {
				this.pushAction(oper, fn)
			}
		})

		if (!this.overwriteSave) {
			const {Actions} = ModeForm.getCurrentModeStore()
			const callback = Actions.doSubmit

			Actions.doSubmit = () => {
				let index = 0;
				const eventArr = this.actionFun[this.OPER_SAVE]
				let result = null;
				if (eventArr.length > 0) {
					const executeVerify = () => {
						if (index < eventArr.length) {
							eventArr[index++](() => {
								executeVerify();
							});
						} else {
							result = callback();
						}
					}
					executeVerify();
				}
				if (result) callback()
			}
			this.overwriteSave = true;
		}
	}
}

ecodeSDK.exp(OverwriteForm)