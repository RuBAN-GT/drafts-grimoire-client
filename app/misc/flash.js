import * as types from 'constants/flash-types'

export default class Flash {
  /**
   * Init the flash object
   * @param {Object} options flash parameters
   * @param {String} options.message
   * @param {Constant} options.type
   */
  constructor(options = {}) {
    this.created = new Date()

    this.message = options.message || ''
    this.type    = options.type

    let tmp = types
    if (!tmp.hasOwnProperty(options.type)) {
      this.type = types.DEFAULT
    }
  }
}
