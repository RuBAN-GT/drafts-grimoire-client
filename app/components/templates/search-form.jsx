import React from 'react'
import PropTypes from 'prop-types'
import SearchModel from 'models/search'
import { connect } from 'react-redux'
import { Dimmer, Loader } from 'semantic-ui-react'
import { isOpened } from 'actions/cards-actions'
import Scroller from 'components/templates/scroller'

class SearchForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      query: '',
      total: 0,
      page: 0,
      results: [],
      loading: false,
      allowMore: false
    }

    this.timer       = null
    this.handleInput = this.handleInput.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.findCards   = this.findCards.bind(this)
    this.findMore    = this.findMore.bind(this)
  }

  /**
   * Handle the inputing of search field
   *
   * @param {Object} event
   */
  handleInput(event) {
    const self  = this
    const value = event.target.value

    clearTimeout(this.timer)

    this.timer = setTimeout(() => {
      if (self.timer == null) {
        return
      }

      self.setState({
        query: value.slice(0, 40),
        total: 0,
        page: 0,
        results: [],
        allowMore: false
      }, () => {
        if (self.state.query) {
          self.findCards()
        }
      })
    }, 400)
  }

  /**
   * Handle the closing of search
   */
  handleClose() {
    if (this.props.onClose) {
      this.props.onClose(this.state)
    }
  }

  /**
   * Handle a click to the card
   *
   * @param {Card} record
   */
  handleClick(record) {
    this.handleClose()
    this.props.history.push(record.url())
  }

  /**
   * Find cards
   */
  findCards() {
    if (!this.state.query || this.state.page >= this.state.total && this.state.total > 0) {
      return
    }

    this.setState({ loading: true })

    SearchModel.getResponse(
      '',
      {
        q: this.state.query.toLowerCase(),
        page: this.state.page + 1
      },
      'collection'
    ).then(response => {
      response.data = response.data.map(item => {
        return new SearchModel(item)
      })

      this.setState(prevState => {
        return {
          total: response.meta.total_pages,
          page: response.meta.current_page,
          results: prevState.results.concat(response.data),
          loading: false,
          allowMore: true
        }
      })
    })
  }

  /**
   * Find more cards, if it is allow
   */
  findMore() {
     if (this.state.allowMore) {
       this.findCards()
     }
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden'
  }

  componentWillUnmount() {
    this.timer = null

    document.body.style.overflow = 'inherit'
  }

  render() {
    return (
      <div className="search form component">
        <div className="field container">
          <div className="input">
            <input
              type="text"
              placeholder={this.props.i18n.t('search.placeholder')}
              onChange={this.handleInput}
              autoFocus
            />
          </div>
          <span onClick={this.handleClose} className="close">
            <i className="icon close"/>
          </span>
        </div>

        <div className="content">
          {this.state.loading && (
            <Dimmer active>
              <Loader />
            </Dimmer>
          )}

          <div className="ui container basic wrapper">
            <Scroller onReachEnd={this.findMore} refreshOnUpdate={false}>
              {this.state.query == '' && (
                <div className="none message">
                  {this.props.i18n.t('search.empty')}
                </div>
              )}
              {this.state.query.length >= 2 && this.state.results.length == 0 && (
                <div className="empty message">
                  {this.props.i18n.t('search.no_result')}
                </div>
              )}
              {this.state.results.length > 0 &&
                this.state.results.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => this.handleClick(item)}
                    className="result"
                  >
                    <div className="image">
                      <img src={item.image('mini')} alt={item.attrs.name} />
                      {this.props.isOpened(item.id()) == false && (
                        <div className="closed overlay" />
                      )}
                    </div>
                    <div className="content">
                      <div className="name" dangerouslySetInnerHTML={{__html: item.attrs.name}} />
                      <div className="breadcrumbs">
                        <span dangerouslySetInnerHTML={{__html: item.attrs.theme_name}} />
                        <span className="divider"></span>
                        <span dangerouslySetInnerHTML={{__html: item.attrs.collection_name}} />
                      </div>
                    </div>
                  </div>
                ))
              }

              {this.state.page > 0 && this.state.page < this.state.total && (
                <div className="ui center aligned basic segment">
                  <div onClick={this.findMore} className="ui inverted big basic button more" >
                    {this.props.i18n.t('search.more')}
                  </div>
                </div>
              )}
            </Scroller>
          </div>
        </div>
      </div>
    )
  }
}

SearchForm.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isOpened: PropTypes.func.isRequired,
  onClose: PropTypes.func
}

export default connect(null, { isOpened })(SearchForm)
