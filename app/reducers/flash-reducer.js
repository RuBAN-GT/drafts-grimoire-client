import * as types from 'constants/flash-types'

function flashReducer(state = null, action) {
  switch(action.type) {
    case types.NEW_FLASH:
      return action.payload
    case types.REMOVE_FLASH:
      return null
    default:
      return null
  }
}

export default flashReducer
