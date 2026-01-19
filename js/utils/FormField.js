/**
 * Represents the generic form field for every app's form
 * @class 
 */
export default class FormField {
	/**
	 * Creates new FormField
	 * @param {number} id 
	 * @param {string} elementType 
	 * @param {string} label 
	 * @param {object} [options={}]
	 * @param {string} [options.v=undefined] - Field value
	 * @param {string} [options.t=undefined] - Input type
	 * @param {string} [options.p=undefined] - Placeholder text
	 * @param {string} [options.fG='m'] - Field genre 
	 * @param {boolean} [options.d=false] - Disabled option
	 * @param {boolean} [options.sP=false] - Show previous option
	 * @param {string} [options.a=undefined] - Accepted file's MIME type 
	 * @param {number} [options.s=undefined] - Accepted file's size
	 * @param {object} [options.wS=undefined] - Class object for binding properties  
	 */
	constructor(
		id,
		elementType,
		label,
		{
			v: value = undefined,
			t: type = undefined,
			p: placeholder = undefined,
			fG: fieldGenre = 'm',
			d: disabled = false,
			a: accept = undefined,
			s: size = undefined,
			sP: showPrevValue = false,
			wS: wrapperStyle = undefined
		}  = {}
	) {
		Object.assign(this, { id, elementType, label, value, type, placeholder, fieldGenre, disabled, accept, size, showPrevValue, wrapperStyle });
	}
}