import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

class Glossary extends React.Component {
  constructor(props) {
    super(props)

    this.transform = this.transform.bind(this)
  }

  /**
   * Make complex transformation of property `content` with tooltips
   *
   * @return {String|
   */
  transform() {
    let content = this.props.content

    if (this.props.tooltips.replacement && this.props.i18n.locale != 'en' && this.props.replacement) {
      this.props.tooltips.collection.forEach(tip => content = tip.replace(content) )
    }

    if (this.props.tooltips.glossary && this.props.i18n.locale != 'en' && this.props.glossary) {
      this.props.tooltips.collection.forEach(tip => content = tip.tooltip(content) )
    }

    return content
  }

  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="body" dangerouslySetInnerHTML={{__html: this.transform()}} />
      </div>
    )
  }
}

Glossary.defaultProps = {
  className: 'glossary',
  glossary: true,
  replacement: true
}
Glossary.propTypes = {
  content: PropTypes.string.isRequired,
  className: PropTypes.string,
  glossary: PropTypes.bool,
  replacement: PropTypes.bool
}

export default connect(state => {
  return {
    i18n: state.i18n,
    tooltips: state.tooltips
  }
})(Glossary)
