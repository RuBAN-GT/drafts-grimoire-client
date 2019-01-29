import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class GlossaryName extends React.Component {
  constructor(props) {
    super(props)

    this.transform = this.transform.bind(this)
  }

  transform() {
    let content = this.props.content

    if (this.props.tooltips.replacement && this.props.i18n.locale != 'en' && this.props.replacement) {
      this.props.tooltips.collection.some(tip => {
        const tmp = content

        content = tip.fullReplace(content)

        return tmp != content
      })
    }

    return content
  }

  render() {
    return <div className={this.props.className} dangerouslySetInnerHTML={{__html: this.transform()}} />
  }
}

GlossaryName.defaultProps = {
  className: 'glossary',
  replacement: true
}
GlossaryName.propTypes = {
  content: PropTypes.string.isRequired,
  className: PropTypes.string,
  replacement: PropTypes.bool
}

export default connect(state => {
  return {
    i18n: state.i18n,
    tooltips: state.tooltips
  }
})(GlossaryName)
