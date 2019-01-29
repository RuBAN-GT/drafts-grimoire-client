import store from 'store'
import * as types from 'constants/tooltips'

const INITIAL_STATE = {
  collection: [],
  glossary: true,
  replacement: true,
  editor: false
}

function themesReducer(state = null, action) {
  let collection = []
  let tmp = false

  switch(action.type) {
    case types.SET_TOOLTIPS:
      return Object.assign({}, state, { collection: action.payload })
    case types.SAVE_TOOLTIP:
      if (action.payload.errors.length) {
        return state
      }

      collection = state.collection.map(item => {
        if (item.id() == action.payload.id()) {
          tmp = true

          return action.payload
        }
        else {
          return item
        }
      })

      if (tmp == false) {
        collection.unshift(action.payload)
      }

      return Object.assign({}, state, { collection: collection })
    case types.DESTROY_TOOLTIP:
      return Object.assign(
        {},
        state,
        {
          collection: state.collection.filter(item => {
            return item.id() != action.payload
          })
        }
      )
    case types.TOGGLE_REPLACEMENT:
      store.set('tooltips.replacement', !state.replacement)

      return Object.assign({}, state, { replacement: !state.replacement })
    case types.TOGGLE_GLOSSARY:
      store.set('tooltips.glossary', !state.glossary)

      return Object.assign(
        {},
        state,
        { glossary: !state.glossary }
      )
    case types.TOGGLE_EDITOR:
      return Object.assign({}, state, { editor: !state.editor })
    default:
      if (state == null) {
        state = INITIAL_STATE

        state.glossary = store.get('tooltips.glossary')
        state.glossary = (state.glossary === null || state.glossary == 'true')

        state.replacement = store.get('tooltips.replacement')
        state.replacement = (state.replacement === null || state.replacement == 'true')
      }

      return state
  }
}

export default themesReducer
