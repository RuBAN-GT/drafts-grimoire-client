import { forEach, kebabCase } from 'lodash'
import ApiClient from 'misc/api-client'
import Cache from 'misc/cache'
import I18n from 'misc/i18n'

class Model {
  /**
   * Get model slug with kebab case
   * 
   * @return {String}
   */
  static slug() {
    if (!this._slug && this._old != this.name) {
      this._slug = kebabCase(this.name)
      this._old  = this.name
    }

    return this._slug
  }

  /**
   * Get model root key for attrs
   * 
   * @return {String}
   */
  static root() {
    if (!this._root) {
      this._root = this.slug()

      if (this._root.slice(-1) == 's') {
        this._root = this._root.slice(0, -1)
      }
    }

    return this._root
  }

  /**
   * Get key of main identificator
   * 
   * @return {String}
   */
  static id() {
    return this._id || 'id'
  }

  /**
   * Create object that can contain only keys from fields
   * 
   * @param {Object} attrs 
   * @return {Object}
   */
  static filterAttrs(attrs) {
    let result = {}

    this.fields.forEach(key => {
      if (attrs[key] !== undefined) {
        result[key] = attrs[key]
      }
    })

    return result
  }

  /**
   * Build url with parent parameters
   * 
   * @param {String} path 
   * @param {Object} attrs
   * 
   * @return {String} 
   */
  static buildUrl(path = '', attrs = {}) {
    let url = ''

    if (this.parents && attrs) {
      forEach(this.parents, (attr, key) => {
        url += `${key}/${attrs[attr]}/`
      })
    }

    return url + this.slug() + '/' + path
  }

  /** 
   * Reset cache for record
   * 
   * @param {String} id
  */
  static resetRecordCache(id = null) {
    Cache.removeAll(`${I18n.detect() || 'ru'}.${this.slug()}.collections`)
    if (id != null) {
      Cache.removeAll(`${I18n.detect() || 'ru'}.${this.slug()}.record.${id}`)
    }
  }

  /**
   * Get response from API
   * 
   * @param {String} path
   * @param {Object} parameters 
   * @param {String} key for cache
   * @return {Promise} with response
   */
  static getResponse(path, parameters, key) {
    let parents = {}
    if (this.parents && parameters) {
      forEach(this.parents, attr => {
        if (parameters.hasOwnProperty(attr)) {
          parents[attr] = parameters[attr]

          delete parameters[attr]
        }
      })
    }

    const recache = parameters.hasOwnProperty('recache') && parameters.recache
    delete parameters.recache

    const locale = parameters['locale'] || I18n.detect() || 'ru'
    delete parameters.locale

    path = this.buildUrl(path, parents)
    key  = `${locale}.${this.slug()}.${(key == null) ? '' : key}.${path}`  
    if (parameters) {
      key += '.' + JSON.stringify(parameters)
    }

    const data = Cache.get(key)
    if (data == null || recache) {
      return ApiClient.get(path, parameters, { 'Accept-Language': locale }).then(response => {
        if (response && response.data) {
          Cache.set(key, response, 86400)
        }

        return new Promise(resolve => resolve(response))
      })
    }
    else {
      return new Promise(resolve => resolve(data))
    }
  }

  /**
   * Get collection with records
   * 
   * @param {Object} parameters
   * @return {Promise} with result
   */
  static collection(parameters = {}) {
    return this.getResponse('', parameters, 'collections').then(response => {
      const data = (response.data) ? response.data.map(record => {
        record = new this(record)

        record.persisted = true

        return record
      }) : []

      return new Promise(resolve => resolve(data))
    })
  }

  /**
   * Get full collection without parameters
   * 
   * @return {Promise}
   */
  static all() {
    return this.collection()
  }

  /**
   * Find record
   * 
   * @param {String} id
   * @param {Object} parameters
   * @return {Promise}
   */
  static find(id, parameters = {}) {
    return this.getResponse(id, parameters, `record.${id}`).then(response => {
      if (response.data) {
        let record = new this(response.data)

        record.persisted = true

        return new Promise(resolve => resolve(record))
      }
      else {
        return new Promise(resolve => resolve(null))
      }
    })
  }

  /**
   * Init object of model
   * 
   * @param {Object} attrs 
   */
  constructor(attrs = {}) {
    this.attrs = {}

    this.constructor.fields.forEach(key => {
      this.attrs[key] = (attrs.hasOwnProperty(key)) ? attrs[key] : null
    })

    this.persisted = false
    this.parents   = {}
    this.errors    = []
  }

  /**
   * Get record identificator
   * 
   * @return {String}
   */
  id() {
    return this.attrs[this.constructor.id()]
  }

  /**
   * Merge current record attributes with argument
   * 
   * @param {Object} attrs 
   * @return {Object}
   */
  mergeAttributes(attrs) {
    this.constructor.fields.forEach(key => {
      if (attrs.hasOwnProperty(key)) {
        this.attrs[key] = attrs[key]
      }
    })

    return this.attrs
  }

  /**
   * Export attributes for json requests
   * 
   * @return {Object}
   */
  exportAttrs() {
    let content = {}

    content[this.constructor.root()] = this.attrs

    return content
  }

  /**
   * Create record of model
   * 
   * @return {Model|null}
   */
  create() {
    return ApiClient.post(
      this.constructor.buildUrl('', this.attrs),
      this.exportAttrs()
    ).then(result => {
      if (result.errors) {
        this.errors = result.errors
      }
      if (result.data) {
        this.mergeAttributes(result.data)
      }
      if (result.success) {
        this.persisted = true

        this.constructor.resetRecordCache(this.id())
      }

      return new Promise(resolve => resolve(this))
    })
  }

  /**
   * Update persisted record
   * 
   * @return {Promise}
   */
  update() {
    if (this.persisted == false) { return null }

    return ApiClient.put(
      this.constructor.buildUrl(this.id(), this.attrs),
      this.exportAttrs()
    ).then(result => {
      if (result.errors) {
        this.errors = result.errors
      }
      if (result.data) {
        this.mergeAttributes(result.data)
      }
      if (result.success) {
        this.constructor.resetRecordCache(this.id())
      }

      return new Promise(resolve => resolve(this))
    })
  }

  /**
   * Save record
   * 
   * @return {Promise}
   */
  save() {
    return (this.persisted) ? this.update() : this.create()
  }

  /**
   * Destroy record
   * 
   * @return {Promise|null}
   */
  destroy() {
    if (this.persisted == false) { return null }

    return ApiClient.del(
      this.constructor.buildUrl(this.id(), this.attrs)
    ).then(result => {
      if (result.success) {
        this.persisted = false
        this.constructor.resetRecordCache(this.id())
      }
      if (result.errors) {
        this.errors = result.errors
      }

      return new Promise(resolve => resolve(this))
    })
  }
}

Model._id     = ''
Model._slug   = ''
Model._root   = ''
Model.fields  = ['id']
Model.parents = {}

export default Model
