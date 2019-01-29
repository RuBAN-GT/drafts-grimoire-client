import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from 'root/reducers'

const configureStore = (history) => {
  const middleware = routerMiddleware(history)

  return createStore(
    rootReducer,
    applyMiddleware(thunk, middleware)
  )
}

export default configureStore
