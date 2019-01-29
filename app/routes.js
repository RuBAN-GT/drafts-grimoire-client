import React from 'react'
import { Route, Switch } from 'react-router-dom'

import LayoutContainer from 'containers/layout-container'
import SignInContainer from 'containers/sign-in-container'
import GrimoireContainer from 'containers/grimoire-container'
import CardsContainer from 'containers/cards-container'

import NoMatch from 'components/pages/no-match'

export default (
  <LayoutContainer>
    <Switch>
      <Route exact path='/' component={GrimoireContainer} />
      <Route path='/grimoire/:theme_id/:collection_id' component={CardsContainer} />
      <Route path='/grimoire' component={GrimoireContainer} />

      <Route path='/sign_in' component={SignInContainer} />

      <Route component={NoMatch}/>
    </Switch>
  </LayoutContainer>
)
