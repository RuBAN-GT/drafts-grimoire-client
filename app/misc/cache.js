import store from 'store'
import expirePlugin from 'store/plugins/expire'

store.addPlugin(expirePlugin)

export default {
  /**
   * Get data from cache
   *
   * @param  {String} key
   * @return {Object|String|null}
   */
  get(key) {
    return (process.env.NODE_ENV == 'development') ? null : store.get('cache.' + key)
  },

  /**
   * Set value in cache
   *
   * @param {String} key
   * @param {Object|String} value
   * @param {Integer} ttl
   */
  set(key, value, ttl = null) {
    store.set('cache.' + key, value, new Date().getTime() + ttl * 1000)
  },

  /**
   * Remove cache key
   *
   * @param  {String} key
   */
  remove(key) {
    store.remove('cache.' + key)
  },

  /**
   * Flush cache
   *
   * @param {String} prefix
   */
  removeAll(prefix = '') {
    let forRemove = []

    store.each((value, key) => {
      if (key.indexOf(`cache.${prefix}`) == 0) {
        forRemove.push(key)
      }
    })

    forRemove.forEach(key => store.remove(key))
  }
}
