import { INITIAL_STATE } from 'constants/models'
import * as types from 'constants/themes'

function themesReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case types.SET_THEMES:
      return Object.assign(
        {},
        state,
        { collection: action.payload }
      )
    case types.SET_THEME:
      return Object.assign(
        {},
        state,
        { current: action.payload }
      ) 
    case types.UPDATE_THEME:
      return Object.assign(
        {},
        { 
          current: action.payload,
          collection: state.collection.map(record => {
            return (record.id() == action.payload.id()) ? action.payload : record
          })
        }
      ) 
    case types.RESET_THEME:
    case types.THEME_404:
      return Object.assign(
        {},
        state,
        { current: null }
      )
    default:
      return state
  }
}

export default themesReducer
