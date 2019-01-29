import * as types from 'constants/session-types'
import User from 'misc/user'

function sessionReducer(state = new User(), action) {
  switch(action.type) {
    case types.SIGN_IN_SUCCESS:
      return new User(action.payload)

    case types.SIGN_IN_FAIL:
    case types.SIGN_IN_SYSTEM_FAIL:
    case types.SIGN_OUT: {
      return new User()
    }

    default:
      return state.load()
  }
}

export default sessionReducer
