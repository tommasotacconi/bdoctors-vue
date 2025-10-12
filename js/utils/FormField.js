export default class FormField {
	constructor(id, type, label, { v: value = undefined, p: placeholder = undefined, d: disabled = false, wS: wrapperStyle = undefined } = {}) {
		Object.assign(this, { id, type, label, value, placeholder, disabled, wrapperStyle });
	}
}