import { INITIAL_STATE } from 'constants/models'
import * as types from 'constants/collections'

function collectionsReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case types.SET_COLLECTIONS:
      return Object.assign(
        {},
        state,
        { collection: action.payload }
      )
    case types.SET_COLLECTION:
      return Object.assign(
        {},
        state,
        { current: action.payload }
      )
    case types.UPDATE_COLLECTION:
      return Object.assign(
        {},
        { 
          current: action.payload,
          collection: state.collection.map(record => {
            return (record.id() == action.payload.id()) ? action.payload : record
          })
        }
      ) 
    case types.COLLECTION_404:
      return Object.assign(
        {},
        state,
        { current: null }
      )
    case types.RESET_COLLECTIONS:
      return INITIAL_STATE
    default:
      return state
  }
}

export default collectionsReducer
