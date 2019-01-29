import Cache from 'misc/cache'
import * as types from 'constants/cards'

const INITIAL_STATE = {
  collection: [],
  current: null,
  original: false,
  opened: [],
  readed: [],
  openAll: false
}

function cardsReducer(state = INITIAL_STATE, action) {
  let readed = []

  switch(action.type) {
    case types.SET_CARDS:
      return Object.assign(
        {},
        state,
        {
          collection: action.payload,
          original: false
        }
      )
    case types.SET_CARD:
      return Object.assign(
        {},
        state,
        {
          current: action.payload,
          original: false
        }
      )
    case types.SET_OPENED:
      return Object.assign(
        {},
        state,
        { opened: action.payload }
      )
    case types.SET_READED:
      return Object.assign(
        {},
        state,
        { readed: action.payload }
      )
    case types.READ_CARD:
      if (readed.indexOf(action.payload) == -1) {
        readed.push(action.payload)
      }

      Cache.set('readed', readed, 86400)

      return Object.assign(
        {},
        state,
        { readed: readed }
      )
    case types.UNREAD_CARD:
      if (readed.indexOf(action.payload) > -1) {
        readed.splice(readed.indexOf(action.payload), 1)
      }

      Cache.set('readed', readed, 86400)

      return Object.assign(
        {},
        state,
        { readed: readed }
      )
    case types.TOGGLE_ORIGINAL:
      return Object.assign(
        {},
        state,
        {
          current: action.payload,
          original: !state.original
        }
      )
    case types.TOGGLE_LOCKED:
    return Object.assign(
      {},
      state,
      { openAll: !state.openAll }
    )
    case types.UPDATE_CARD:
      return Object.assign(
        {},
        state,
        {
          current: action.payload,
          collection: state.collection.map(record => {
            return (record.id() == action.payload.id()) ? action.payload : record
          }),
          original: false
        }
      )
    case types.RESET_CARD:
    case types.CARD_404:
      return Object.assign(
        {},
        state,
        {
          current: null,
          original: false
        }
      )
    default:
      return state
  }
}

export default cardsReducer
