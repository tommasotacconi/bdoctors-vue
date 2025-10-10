export default class formField {
	constructor(id, type, label, { p: placeholder = undefined, d: disabled = false, wS: wrapperStyle = undefined }) {
		Object.assign(this, { id, type, label, placeholder, disabled, wrapperStyle });
	}
}