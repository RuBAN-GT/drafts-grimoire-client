// Defaults
require.context('./assets/', true)
require('stylesheets/application.sass')

// SPA
import React from 'react'
import Perf from 'react-addons-perf'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import ReactGA from 'react-ga'
import { AppContainer } from 'react-hot-loader'
import configureStore from './store/configure-store'
import RootContainer from 'containers/root-container'
import Rasputin from 'misc/rasputin'

// Global initializations
if (process.env.NODE_ENV == 'development') {
  window.Perf = Perf
}
window.Rasputin = new Rasputin()
ReactGA.initialize('UA-4938354-4')

// Configure app
const history = createHistory()
const store   = configureStore(history)

render(
  <AppContainer>
    <RootContainer store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
)

if (process.env.NODE_ENV == 'development' && module.hot) {
  module.hot.accept('./containers/root-container', () => {
    const NewRoot = require('./containers/root-container').default
    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    )
  })
}
