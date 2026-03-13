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
   * @param {mixed} [options.v=undefined] - Field value
   * @param {string} [options.t=undefined] - Input type
   * @param {array} [options.fGN=['m', 's']] - Field genre (masculine/feminine) and number (singular/plural)
   * @param {string} [options.p=undefined] - Placeholder text
   * @param {boolean} [options.r=false] - Required option
   * @param {boolean} [options.d=false] - Disabled option
   * @param {string} [options.a=undefined] - Accepted file's MIME type
   * @param {number} [options.s=undefined] - Accepted file's size
   * @param {boolean} [options.sP=false] - Show previous option
   * @param {array} [options.rGO=[]] - Radio group options
   * @param {object} [options.wS=undefined] - Class object for binding properties
   */
  constructor(
    id,
    elementType,
    label,
    {
      v: value = undefined,
      t: type = undefined,
      fGN: fieldGenreNumber = ["m", "s"],
      p: placeholder = undefined,
      r: required = false,
      d: disabled = false,
      a: accept = undefined,
      s: size = undefined,
      sP: showPrevValue = false,
      rGO: radioGroupOptions = [],
      wS: wrapperStyle = undefined,
    } = {},
  ) {
    Object.assign(this, {
      id,
      elementType,
      label,
      value,
      type,
      fieldGenreNumber,
      placeholder,
      required,
      disabled,
      accept,
      size,
      showPrevValue,
      radioGroupOptions,
      wrapperStyle,
    });
  }
}
