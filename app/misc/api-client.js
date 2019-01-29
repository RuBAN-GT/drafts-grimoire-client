import store from 'store'
import { merge } from 'lodash'
import I18n from 'misc/i18n'
import { API_URL, API_VERSION } from 'constants/environment'

export default {
  /**
   * Make request to url source
   * @param  {String} url
   * @param  {String} method such as GET, POST, etc
   * @param  {Object} parameters for request
   * @return {Promise} with response
   */
  request(url, method = 'get', parameters = {}, headers = {}) {
    if (url.indexOf('http') != 0) {
      url = `${API_URL.replace(/[\/]+$/i, '')}/api/v${API_VERSION}/${url.replace(/^\/+/i, '')}`
    }
    parameters = (method == 'get') ? null : JSON.stringify(parameters)

    headers = merge({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept-Language': I18n.detect()
    }, headers)

    let token = store.get('token')
    if (token != null) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return fetch(url, {
      body: parameters,
      method: method,
      headers: headers,
      credentials: 'include'
    }).catch(error => {
      throw(error)
    })
  },

  get(url, parameters = {}, headers = {}) {
    parameters = Object.keys(parameters).map(key => {
      return `${key}=${encodeURIComponent(parameters[key])}`
    }).join('&')

    if (parameters) { url += '?' + parameters }
    return this.request(url, 'get', {}, headers)
      .then(response => response.json())
  },

  post(url, body = {}, headers = {}) {
    return this.request(url, 'post', body, headers)
      .then(response => response.json())
  },

  put(url, body = {}, headers = {}) {
    return this.request(url, 'put', body, headers)
      .then(response => response.json())
  },

  del(url, headers = {}) {
    return this.request(url, 'delete', {}, headers)
      .then(response => response.json())
  }
}
