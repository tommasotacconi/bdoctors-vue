/**
 * Represents the generic form field for every app's form
 * @class 
 */
export default class FormField {
	/**
	 * Creates new FormField
	 * @param {number} id 
	 * @param {string} type 
	 * @param {string} label 
	 * @param {object} [options={}]
	 * @param {string} [options.fG='m'] 
	 * @param {string} [options.v=undefined] - Field value
	 * @param {string} [options.p=undefined] - Placeholder text
	 * @param {boolean} [options.d=false] - Disabled option
	 * @param {boolean} [options.sP=false] - Hidden option
	 * @param {string} [options.a=undefined] - Accepted file's MIME type 
	 * @param {number} [options.s=undefined] - Accepted file's size
	 * @param {object} [options.wS=undefined] - Class object for binding properties  
	 */
	constructor(id, type, label, { fG: fieldGenre = 'm', v: value = undefined, p: placeholder = undefined, d: disabled = false, a: accept = undefined, s: size = undefined, sP: showPreviousFile = false, wS: wrapperStyle = undefined } = {}) {
		Object.assign(this, { id, type, label, fieldGenre, value, placeholder, disabled, showPreviousFile, accept, size, wrapperStyle });
	}
}