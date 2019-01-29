import * as types from 'constants/i18n'

export function setLocale(locale) {
  return {
    type: types.SET_LOCALE,
    payload: locale
  }
}
