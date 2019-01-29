import Tooltip from 'models/tooltip'
import * as types from 'constants/tooltips'
import { FAIL } from 'constants/flash-types'
import { newFlash } from 'actions/flash-actions'

export function setTooltips() {
  return dispatch => {
    return Tooltip.collection().then(data => {
      dispatch({
        type: types.SET_TOOLTIPS,
        payload: data
      })

      return new Promise(resolve => resolve(data))
    })
  }
}

export function saveTooltip(tooltip) {
  return dispatch => {
    return tooltip.save().then(data => {
      dispatch({
        type: types.SAVE_TOOLTIP,
        payload: data
      })

      if (data.errors.length) {
        dispatch(newFlash({ 
          type: FAIL,
          message: data.errors[0]
        }))
      }

      return new Promise(resolve => resolve(data))
    })
  }
}

export function destroyTooltip(item) {
  return dispatch => {
    return item.destroy().then(() => {
      dispatch({
        type: types.DESTROY_TOOLTIP,
        payload: item.id()
      })
    })
  }
}

export function toggleReplacement() {
  return { type: types.TOGGLE_REPLACEMENT }
}

export function toggleGlossary() {
  return { type: types.TOGGLE_GLOSSARY }
}

export function toggleEditor() {
  return { type: types.TOGGLE_EDITOR }
}
