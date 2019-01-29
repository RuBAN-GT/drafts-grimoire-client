import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import cardsReducer from 'reducers/cards-reducer'
import collectionsReducer from 'reducers/collections-reducer'
import flashReducer from 'reducers/flash-reducer'
import i18nReducer from 'reducers/i18n-reducer'
import sessionReducer from 'reducers/session-reducer'
import templateReducer from 'reducers/template-reducer'
import themesReducer from 'reducers/themes-reducer'
import tooltipsReducer from 'reducers/tooltips-reducer'

const rootReducer = combineReducers({
  router: routerReducer,
  session: sessionReducer,
  flash: flashReducer,
  i18n: i18nReducer,
  template: templateReducer,
  tooltips: tooltipsReducer,
  themes: themesReducer,
  collections: collectionsReducer,
  cards: cardsReducer
})

export default rootReducer
