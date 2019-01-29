import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { isEqual } from 'lodash'
import setTitle from 'helpers/set-title'
import Collections from 'components/common/collections'

class Theme extends React.Component {
  constructor(props) {
    super(props)

    this.state = { redirect: false }

    this.getTheme = this.getTheme.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.match.params.theme_id != nextProps.match.params.theme_id ||
      !isEqual(this.props.themes.current, nextProps.themes.current) ||
      !isEqual(this.props.collections.collection, nextProps.collections.collection) ||
      this.props.i18n.locale != nextProps.i18n.locale
    )
  }

  componentDidMount() {
    this.getTheme()
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.theme_id != prevProps.match.params.theme_id || this.props.i18n.locale != prevProps.i18n.locale) {
      this.getTheme()
    }
  }

  componentWillUnmount() {
    this.props.themesActions.resetTheme()
    this.props.collectionsActions.resetAll()
  }

  getTheme() {
    this.props.themesActions.setTheme(
      this.props.match.params.theme_id
    ).then(result => {
      if (result == null) {
        this.setState({ redirect: true })
      }
      else {
        setTitle([
          this.props.i18n.t('title'),
          result.attrs.name
        ])
      }
    })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/404' />
    }
    else if (this.props.themes.current){
      return <Collections 
        i18n={this.props.i18n}
        themes={this.props.themes}
        collections={this.props.collections}
        collectionsActions={this.props.collectionsActions} 
      />
    }
    else {
      return null
    }
  }
}

Theme.propTypes = {
  i18n: PropTypes.object.isRequired,
  themes: PropTypes.object.isRequired,
  themesActions: PropTypes.object.isRequired,
  collections: PropTypes.object.isRequired,
  collectionsActions: PropTypes.object.isRequired
}

export default Theme
