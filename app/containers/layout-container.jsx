import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ApiClient from 'misc/api-client'

import * as flashActions from 'actions/flash-actions'
import * as sessionActions from 'actions/session-actions'
import * as i18nActions from 'actions/i18n-actions'
import * as templateActions from 'actions/template-actions'
import * as tooltipsActions from 'actions/tooltips-actions'
import { setUserCards, toggleLocked } from 'actions/cards-actions'

import Layout from 'components/templates/layout'

class LayoutContainer extends React.Component {
  componentDidMount() {
    // Preload tooltips
    this.props.tooltipsActions.setTooltips()

    // Check user token & load open cards list
    if (this.props.user.isAuthed()) {
      ApiClient.get('auth/validate_token').then(data => {
        if (data && data.success == true) {
          this.props.setUserCards()
        }
        else {
          this.props.sessionActions.signOut()
        }
      })
    }
  }

  render() {
    return (
      <Layout {...this.props}>{this.props.children}</Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    flash: state.flash,
    user: state.session,
    i18n: state.i18n,
    openAll: state.cards.openAll,
    template: state.template,
    tooltips: state.tooltips
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    flashActions: bindActionCreators(flashActions, dispatch),
    i18nActions: bindActionCreators(i18nActions, dispatch),
    tooltipsActions: bindActionCreators(tooltipsActions, dispatch),
    sessionActions: bindActionCreators(sessionActions, dispatch),
    setUserCards: bindActionCreators(setUserCards, dispatch),
    toggleLocked: bindActionCreators(toggleLocked, dispatch),
    templateActions: bindActionCreators(templateActions, dispatch)
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutContainer))
