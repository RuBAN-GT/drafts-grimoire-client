import store from 'store'
import * as sessionTypes from 'constants/session-types'
import * as flashTypes from 'constants/flash-types'
import { newFlash } from 'actions/flash-actions'
import ApiClient from 'misc/api-client'

export function signInSuccess(user) {
  return {
    type: sessionTypes.SIGN_IN_SUCCESS,
    payload: user
  }
}

export function signInFail() {
  return { type: sessionTypes.SIGN_IN_FAIL }
}
export function signInSystemFail() {
  return { type: sessionTypes.SIGN_IN_SYSTEM_FAIL }
}

/**
 * Action for authentication with oauth2 code
 * @param  {String} code
 */
export function signIn(code) {
  return (dispatch, getState) => {
    const i18n = getState().i18n

    ApiClient.post('auth/bungie', { code: code }).then(response => {
      if (response.data && response.data.auth_token) {
        store.set('token', response.data.auth_token)

        dispatch(signInSuccess(response.data.user))

        dispatch(newFlash({
          type: flashTypes.SUCCESS,
          message: i18n.t('session.success')
        }))
      }
      else {
        dispatch(signInFail())

        dispatch(newFlash({
          type: flashTypes.FAIL,
          message: i18n.t('session.fail')
        }))
      }
    }).catch(error => {
      dispatch(signInSystemFail())

      dispatch(newFlash({
        type: flashTypes.WARNING,
        message: i18n.t('session.warning')
      }))

      throw(error)
    })
  }
}

// Action sign out of user
export function signOut() {
  return (dispatch, getState) => {
    store.remove('token')

    dispatch({ type: sessionTypes.SIGN_OUT })

    dispatch(newFlash({
      type: flashTypes.SUCCESS,
      message: getState().i18n.t('session.sign_out')
    }))
  }
}
