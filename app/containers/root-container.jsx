import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import routes from 'root/routes'

const RootContainer = ({store, history}) => (
  <Provider store={store}>
    <ConnectedRouter history={history} children={routes} />
  </Provider>
)

RootContainer.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default RootContainer
