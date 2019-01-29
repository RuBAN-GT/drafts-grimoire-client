import Collection from 'models/collection'
import * as types from 'constants/collections'
import { FAIL } from 'constants/flash-types'
import { newFlash } from 'actions/flash-actions'

export function collectionNotFound() {
  return { type: types.COLLECTION_404 }
}

export function setCollections(params) {
  return dispatch => {
    Collection.collection(params).then(data => {
      dispatch({
        type: types.SET_COLLECTIONS,
        payload: data
      })
    })
  }
}

export function setCollection(id, params) {
  return dispatch => {
    return Collection.find(id, params).then(data => {
      if (data) {
        dispatch({
          type: types.SET_COLLECTION,
          payload: data
        })
      }
      else {
        dispatch(collectionNotFound())
      }

      return new Promise(resolve => resolve(data))
    })
  }
}

export function updateCollection(collection, name) {
  return dispatch => {
    if (collection.attrs.name === name) {
      return new Promise(resolve => resolve(collection))
    }
    else {
      collection.attrs.name = name

      return collection.save().then(data => {
        dispatch({
          type: types.UPDATE_COLLECTION,
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

export function resetAll() {
  return { type: types.RESET_COLLECTIONS }
}
