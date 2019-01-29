import React from 'react'
import { connect } from 'react-redux'
import setTitle from 'helpers/set-title'
import Events from 'components/common/events'

class Home extends React.Component {
  componentDidMount() {
    setTitle([ this.props.i18n.t('title') ])
  }

  render() {
    if (this.props.i18n.locale == 'en') {
      return null
    }
    else {
      return <Events />
    }
  }
}

export default connect(state => {
  return { i18n: state.i18n }
})(Home)
