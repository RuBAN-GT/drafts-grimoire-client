import store from 'store'
import translations from 'root/i18n.json'
import { get, merge } from 'lodash'

export default class I18n {
  /**
   * Init i18n object
   *
   * @param {Object} options
   * @param {Array}  options.locales list of available translations
   * @param {String} options.locale current locale for translations
   * @param {String} options.fallBack locale for rescue of empty translation
   * @param {Boolean} options.detect locale for user
   * @param {Object} options.translations extra for common translations
   */
  constructor(options = {}) {
    this.locales = options.locales || ['en']

    this.locale = (options.detect) ? this.constructor.detect() : null
    if (this.locale == null) {
      this.locale = options.locale  || 'en'
    }
    if (this.locales.indexOf(this.locale) == -1) {
      this.locale = 'en'
    }

    this.setLocale(this.locale)

    this.fallBack = options.fallBack || 'en'
    if (this.locales.indexOf(this.fallBack) == -1) {
      this.fallBack = 'en'
    }

    this.translations = {}
    this.locales.forEach(locale => {
      this.translations[locale] = translations[locale] || {}
    })

    if (options.translations) {
      this.translations = merge(this.translations, options.translations)
    }
  }

  /**
   * Try to find locale for user
   *
   * @return {String|null}
   */
  static detect() {
    let locale = store.get('locale')

    if (locale == null && navigator) {
      locale = navigator.language || navigator.userLanguage
    }

    if (locale) {
      if (['ru', 'ru-RU', 'rus'].indexOf(locale) > -1) {
        locale = 'ru'
      }
      else if (['en', 'en-US', 'eng'].indexOf(locale) > -1) {
        locale = 'en'
      }
    }

    return locale || null
  }

  /**
   * Set locale
   *
   * @param {String} locale
   */
  setLocale(locale) {
    if (this.locales.indexOf(locale) > -1) {
      this.locale = locale

      store.set('locale', locale)
    }
  }

  /**
   * Load translation
   *
   * @param {String} key
   * @return {String}
   */
  translate(key) {
    let result = get(this.translations[this.locale], key) || ''

    if (result == '') {
      result = get(this.translations[this.fallBack], key)
    }

    return result || key
  }
  t(key) {
    return this.translate(key)
  }
}
