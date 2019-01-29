import store from 'store'
import decoder from 'jwt-decode'

export default class User {
  /**
   * Init user
   *
   * @param {Object} options
   */
  constructor(options = {}) {
    this.id = options.id || null
    this.uniqueName = options.uniqueName || ''
    this.displayName = options.displayName || ''
    this.roles = options.roles || []
  }

  /**
   * Check authentication status
   * @returns {Boolean}
   */
  isAuthed() {
    return this.id != null
  }

  /**
   * Check user on role
   *
   * @param {String} role
   * @return {Boolea}
   */
  hasRole(role = 'admin') {
    return this.roles.indexOf(role) > -1
  }

  /**
   * Load information about user from token
   *
   * @returns {User}
   */
  load() {
    let token = store.get('token')
    if (token != null) {
      let payload = decoder(token)

      this.id = payload.id
      this.uniqueName = payload.unique_name
      this.displayName = payload.display_name
      this.roles = payload.roles
    }

    return this
  }
}
