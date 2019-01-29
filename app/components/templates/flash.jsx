import React from 'react'
import PropTypes from 'prop-types'

class Flash extends React.Component {
  render() {
    if (this.props.flash) {
      return (
        <div className="ui flash component container">
          <div className="message">
            <i className="icon close" onClick={this.props.removeFlash}/>
            <div className="content">{this.props.flash.message}</div>
          </div>
        </div>
      )
    }
    else {
      return null
    }
  }
}

Flash.propTypes = {
  flash: PropTypes.object,
  removeFlash: PropTypes.func.isRequired
}

export default Flash
