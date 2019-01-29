import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Dimmer, Loader } from 'semantic-ui-react'

class NoMatch extends React.Component {
  componentDidMount() {
    this.props.push('/')
  }

  render() {
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    )
  }
}

export default connect(null, { push })(NoMatch)
