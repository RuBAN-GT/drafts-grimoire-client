import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { isEqual } from 'lodash'

import Coverflow from 'components/templates/coverflow'

class Themes extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange   = this.handleChange.bind(this)
    this.toCurrentTheme = this.toCurrentTheme.bind(this)
  }

  handleChange(real_id) {
    this.props.push(`/grimoire/${real_id}`)
    this.props.push(`/grimoire/${real_id}`)
  }

  toCurrentTheme() {
    if (this.props.locale != 'en') { return }

    let current = this.props.current

    if (current == null && this.props.themes.collection) {
      current = this.props.themes.collection[Math.round(this.props.themes.collection.length / 2)].id()
    }

    if (current) {
      this.props.push(`/grimoire/${current}`)
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.locale != nextProps.locale ||
      this.props.current != nextProps.current ||
      !isEqual(this.props.themes, nextProps.themes)
    )
  }

  componentDidMount() {
    this.props.setThemes().then(() => {
      this.toCurrentTheme()
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.locale != prevProps.locale) {
      this.props.setThemes({ recache: true })
    }

    if (['/', '/grimoire'].indexOf(this.props.location) > -1) {
      this.toCurrentTheme()
    }
  }

  render() {
    return (
      <div className="themes basic wrapper component">
        {this.props.themes.collection.length > 0 && (
          <Coverflow
            startFrom={this.props.current}
            onChange={this.handleChange}
            items={
              this.props.themes.collection.map(item => {
                return {
                  id: item.id(),
                  image: item.image(),
                  title: item.attrs.name
                }
              })
            }
          />
        )}
      </div>
    )
  }
}

Themes.defaultProps = {
  current: null
}
Themes.propTypes = {
  locale: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  current: PropTypes.string,
  themes: PropTypes.object.isRequired,
  setThemes: PropTypes.func.isRequired
}

export default connect(null, { push })(Themes)
