import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { Dimmer, Loader } from 'semantic-ui-react'

import { signIn } from 'actions/session-actions'
import { setUserCards } from 'actions/cards-actions'
import { push } from 'react-router-redux'

import { FAIL } from 'constants/flash-types'
import { CLIENT_ID } from 'constants/environment'

class SignInContainer extends React.Component {
  componentDidMount() {
    if ( typeof window  === undefined) { return }

    if (this.props.user.isAuthed() == false) {
      let query = queryString.parse(this.props.location.search)

      if (query.code == null) {
        window.location.replace(
          `https://www.bungie.net/en/OAuth/Authorize?client_id=${CLIENT_ID}&response_type=code`
        )
      }
      else {
        this.props.signIn(query.code)
      }
    }
  }

  componentDidUpdate() {
    if (this.props.user.isAuthed()) {
      this.props.setUserCards()
    }

    if (this.props.user.isAuthed() || this.props.flash && this.props.flash.type == FAIL) {
      this.props.push('/')
    }
  }
  

  render() {
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    flash: state.flash,
    user: state.session
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    signIn: bindActionCreators(signIn, dispatch),
    setUserCards: bindActionCreators(setUserCards, dispatch),
    push: bindActionCreators(push, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInContainer)
