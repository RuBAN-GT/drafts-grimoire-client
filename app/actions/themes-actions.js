import Theme from 'models/theme'
import * as types from 'constants/themes'
import { FAIL } from 'constants/flash-types'
import { newFlash } from 'actions/flash-actions'

// Action for 404
export function themeNotFound() {
  return { type: types.THEME_404 }
}

// Get themes collection
export function setThemes(params = {}) {
  return dispatch => {
    return Theme.collection(params).then(data => {
      dispatch({
        type: types.SET_THEMES,
        payload: data
      })

      return new Promise(resolve => resolve(data))
    })
  }
}

// Get theme record
export function setTheme(id, params = {}) {
  return dispatch => {
    return Theme.find(id, params).then(data => {
      if (data) {
        dispatch({
          type: types.SET_THEME,
          payload: data
        })
      }
      else {
        dispatch(themeNotFound())
      }

      return new Promise(resolve => resolve(data))
    })
  }
}

// Update theme by name
export function updateTheme(theme, name) {
  return dispatch => {
    if (theme.attrs.name === name) {
      return new Promise(resolve => resolve(theme))
    }
    else {
      theme.attrs.name = name

      return theme.save().then(data => {
        dispatch({
          type: types.UPDATE_THEME,
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
}

// Reset current record
export function resetTheme() {
  return { type: types.RESET_THEME }
}
