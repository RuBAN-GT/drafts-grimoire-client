import { isEqual } from 'lodash'
import ApiClient from 'misc/api-client'
import Cache from 'misc/cache'
import Card from 'models/card'
import * as types from 'constants/cards'
import { FAIL } from 'constants/flash-types'
import { newFlash } from 'actions/flash-actions'


/**
 * Check card on opened status by real_id
 *
 * @param {String} real_id
 * @return {Boolean}
 */
export function isOpened(real_id) {
  return (dispatch, getStore) => {
    const store = getStore()

    return store.cards.openAll || store.cards.opened.indexOf(real_id) > -1 || store.session.isAuthed() == false
  }
}

/**
 * Check card on readed status by id
 *
 * @param {String} id
 * @return {Boolean}
 */
export function isReaded(id) {
  return (dispatch, getStore) => {
    const store = getStore()

    return store.cards.readed.indexOf(id) > -1 || store.session.isAuthed() == false
  }
}

export function toggleLocked() {
  return { type: types.TOGGLE_LOCKED }
}

export function cardNotFound() {
  return { type: types.CARD_404 }
}

/**
 * Set cards collection to store
 *
 * @param {Object} params
 */
export function setCards(params) {
  return dispatch => {
    return Card.collection(params).then(data => {
      dispatch({
        type: types.SET_CARDS,
        payload: data
      })

      return new Promise(resolve => resolve(data))
    })
  }
}

/**
 * Set card object in store
 *
 * @param {String} id
 * @param {Object} params
 */
export function setCard(id, params) {
  return dispatch => {
    return Card.find(id, params).then(data => {
      if (data) {
        dispatch({
          type: types.SET_CARD,
          payload: data
        })
      }
      else {
        dispatch(cardNotFound())
      }

      return new Promise(resolve => resolve(data))
    })
  }
}

function setOpenedAction(data) {
  return {
    type: types.SET_OPENED,
    payload: data
  }
}
function setReadedAction(data) {
  return {
    type: types.SET_READED,
    payload: data
  }
}

/**
 * Set readed and opened cards for user
 */
export function setUserCards() {
  return (dispatch, getState) => {
    const user = getState().session

    if (user.isAuthed()) {
      const opened = Cache.get('opened')
      const readed = Cache.get('readed')

      if (Array.isArray(opened) && Array.isArray(readed)) {
        dispatch(setOpenedAction(opened))
        dispatch(setReadedAction(readed))
      }
      else {
        ApiClient.get('users/' + user.id).then(response => {
          let opened = []
          let readed = []

          if (response && response.data) {
            opened = response.data.opened
            readed = response.data.readed
          }

          Cache.set('opened', opened, 86400)
          Cache.set('readed', readed, 86400)

          dispatch(setOpenedAction(opened))
          dispatch(setReadedAction(readed))
        })
      }
    }
  }
}

/**
 * Change read status for card
 *
 * @param {Card} card
 */
export function toggleReadCard(card) {
  return (dispatch, getState) => {
    if (getState().cards.readed.indexOf(card.attrs.id) > -1) {
      card.unread().then(response => {
        if (response && response.success) {
          dispatch({
            type: types.UNREAD_CARD,
            payload: card.attrs.id
          })
        }
      })
    }
    else {
      card.read().then(response => {
        if (response && response.success) {
          dispatch({
            type: types.READ_CARD,
            payload: card.attrs.id
          })
        }
      })
    }
  }
}

/**
 * Load original translate for card
 *
 * @param {String} id
 * @param {Object} params
 */
export function toggleOriginal(id, params) {
  return (dispatch, getState) => {
    params.locale = (getState().cards.original) ? getState().i18n.locale : 'en'

    return Card.find(id, params).then(data => {
      if (data) {
        dispatch({
          type: types.TOGGLE_ORIGINAL,
          payload: data
        })
      }
      else {
        dispatch(cardNotFound())
      }

      return new Promise(resolve => resolve(data))
    })
  }
}

/**
 * Update card attributes
 *
 * @param {Card} card
 * @param {Object} params
 */
export function updateCard(card, params) {
  return dispatch => {
    if (isEqual({
      name: card.attrs.name,
      intro: card.attrs.intro,
      description: card.attrs.description,
      glossary: card.attrs.glossary,
      replacement: card.attrs.replacement
    }, params)) {
      return new Promise(resolve => resolve(card))
    }
    else {
      card.mergeAttributes(params)

      return card.save().then(data => {
        dispatch({
          type: types.UPDATE_CARD,
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

export function resetCard() {
  return { type: types.RESET_CARD }
}
