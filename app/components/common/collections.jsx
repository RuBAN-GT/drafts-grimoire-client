import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { isEqual } from 'lodash'
import Carousel from 'components/templates/carousel'
import { API_URL } from 'constants/environment'

class Collections extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange   = this.handleChange.bind(this)
    this.getCollections = this.getCollections.bind(this)
  }

  handleChange(real_id) {
    this.props.push(`/grimoire/${this.props.themes.current.attrs.real_id}/${real_id}`)
  }

  getCollections() {
    this.props.collectionsActions.setCollections({
      theme_real_id: this.props.themes.current.attrs.real_id
    })
  }

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(this.props.themes.current, nextProps.themes.current) ||
      !isEqual(this.props.collections.collection, nextProps.collections.collection) ||
      this.props.i18n.locale != nextProps.i18n.locale
    )
  }

  componentDidMount() {
    this.getCollections()
  }
  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.themes.current, prevProps.themes.current) || this.props.i18n.locale != prevProps.i18n.locale) {
      this.getCollections()
    }
  }

  render() {
    return (
      <div className="collections component">
        {this.props.collections.collection.length > 0 && (
          <Carousel step={3} onChange={this.handleChange} items={
            this.props.collections.collection.map(item => {
              return {
                id: item.attrs.real_id,
                image: `${API_URL}/${item.attrs.full_picture_url}`,
                title: item.attrs.name,
                replacement: true
              }
            })
          } />
        )}
      </div>
    )
  }
}

Collections.propTypes = {
  i18n: PropTypes.object.isRequired,
  themes: PropTypes.object.isRequired,
  collections: PropTypes.object.isRequired,
  collectionsActions: PropTypes.object.isRequired
}

export default connect(null, { push })(Collections)
