import * as consts from 'constants/template'

export default function templateReducer(state = consts.INITIAL_STATE, action) {
  switch(action.type) {
    case consts.TOGGLE_SIDEBAR:
      return Object.assign(
        {},
        state,
        { sidebar: !state.sidebar }
      )
    default:
      return state
  }
}
