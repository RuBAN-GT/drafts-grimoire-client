import I18n from 'misc/i18n'
import * as types from 'constants/i18n'
import { I18N } from 'constants/environment'

export default function i18nReducer(state = new I18n(I18N), action) {
  let clone = null

  switch(action.type) {
    case types.SET_LOCALE:
      clone = Object.assign(
        Object.create( Object.getPrototypeOf(state)),
        state
      )
      clone.setLocale(action.payload)

      return clone
    default:
      return state
  }
}
