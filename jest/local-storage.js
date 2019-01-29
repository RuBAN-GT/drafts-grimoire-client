import { values } from 'lodash'

// Define localStorage mock
class localStorageMock {
  constructor() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key]
  }

  setItem(key, value) {
    this.store[key] = value.toString()
  }

  clear() {
    this.store = {}
  }

  removeItem(key) {
    delete this.store[key]
  }

  key(i) {
    return values(this.store)[i]
  }
}

global.localStorage = new localStorageMock()
