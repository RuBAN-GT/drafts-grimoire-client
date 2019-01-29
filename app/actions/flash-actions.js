import Flash from 'misc/flash'
import * as types from 'constants/flash-types'

/**
 * Action for pushing a new flash
 * @param {Object} options
 * @return {Object}
 */
export function newFlash(options) {
  return {
    type: types.NEW_FLASH,
    payload: new Flash(options)
  }
}

// Remove flash from system
export function removeFlash() {
  return { type: types.REMOVE_FLASH }
}
