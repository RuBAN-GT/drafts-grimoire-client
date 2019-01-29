import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { isEqual } from 'lodash'
import setTitle from 'helpers/set-title'

import { Dimmer, Loader } from 'semantic-ui-react'
import Carousel from 'components/templates/carousel'
import CardEditor from 'components/pages/card-editor'
import Card from 'components/pages/card'

import * as themesActions from 'actions/themes-actions'
import * as collectionsActions from 'actions/collections-actions'
import * as cardsActions from 'actions/cards-actions'

import { isMobile, isDesktop } from 'helpers/responsive'

class CardsContainer extends React.Component {
  constructor(props) {
    super(props)

    this.handleTheme      = this.handleTheme.bind(this)
    this.handleCollection = this.handleCollection.bind(this)
    this.getCards         = this.getCards.bind(this)
    this.detectCard       = this.detectCard.bind(this)
    this.handleChange     = this.handleChange.bind(this)
  }

  /**
   * Try to find card id
   *
   * @return {String|null}
   */
  detectCard() {
    const card_id = this.props.location.pathname.split('/').slice(-1)[0]

    return (card_id == this.props.match.params.collection_id) ? null : card_id
  }

  /**
   * Load theme
   *
   * @param {Boolean} replace it updates object without checking params
   * @return {Promise}
   */
  handleTheme(replace = false) {
    if (replace == false && this.props.themes.current && this.props.match.params.theme_id == this.props.themes.current.id()) {
      return new Promise(resolve => resolve(this.props.themes.current))
    }

    return this.props.themesActions.setTheme(this.props.match.params.theme_id)
  }

  /**
   * Load collection
   *
   * @param {Boolean} replace it updates object without checking params
   * @return {Promise}
   */
  handleCollection(replace = false) {
    if (replace == false && this.props.collections.current && this.props.match.params.collection_id == this.props.collections.current.id()) {
      return new Promise(resolve => resolve(this.props.collections.current))
    }

    return this.props.collectionsActions.setCollection(this.props.match.params.collection_id, {
      theme_real_id: this.props.themes.current.id()
    })
  }

  /**
   * Load cards
   *
   * This method loads cards for component.
   * If component hasn't got selected card then user will be redirected to card.
   *
   * @return {Promise}
   */
  getCards() {
    return this.props.cardsActions.setCards({
      theme_real_id: this.props.themes.current.id(),
      collection_real_id: this.props.collections.current.id()
    }).then(data => {
      if (data == null || data.length == 0) {
        this.props.push('/404')
      }

      return new Promise(resolve => resolve(data))
    })
  }

  /**
   * Load card
   *
   * This method loads card.
   */
  getCard(real_id) {
    this.props.cardsActions.setCard(real_id, {
      theme_real_id: this.props.themes.current.id(),
      collection_real_id: this.props.collections.current.id()
    }).then(data => {
      if (data == null) {
        this.props.push('/404')
      }
      else {
        this.props.push(data.url())

        setTitle([
          this.props.i18n.t('title'),
          this.props.themes.current.attrs.name,
          this.props.collections.current.attrs.name,
          data.attrs.name
        ])
      }
    }).catch(error => {
      throw(error)
    })
  }

  /**
   * Handle selection of card from carousel or other sources
   *
   * @param {String} real_id
   */
  handleChange(real_id) {
    if (!this.props.cards.current || real_id != this.props.cards.current.id()) {
      this.getCard(real_id)

      if (isMobile()) { this.refs.container.scrollIntoView() }
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(this.props.match.params, nextProps.match.params) ||
      !isEqual(this.props.themes.collection, nextProps.themes.collection) ||
      !isEqual(this.props.cards, nextProps.cards) ||
      !isEqual(this.props.user, nextProps.user) ||
      this.props.location.pathname != nextProps.location.pathname ||
      this.props.i18n.locale != nextProps.i18n.locale
    )
  }

  componentDidMount() {
    this.props.themesActions.setThemes()

    this.handleTheme().then(this.handleCollection).then(this.getCards).then(data => {
      if (this.props.cards.current == null) {
        this.getCard(this.detectCard() || data[0].id())
      }
    })
  }

  componentDidUpdate(prevProps) {
    const localeChanged = this.props.i18n.locale != prevProps.i18n.locale
    const paramsChanged = !isEqual(this.props.match.params, prevProps.match.params)

    if (paramsChanged) {
      this.props.cardsActions.resetCard()
    }

    this.handleTheme(localeChanged).then(() => this.handleCollection(localeChanged)).then(() => {
      if (paramsChanged || localeChanged) {
        this.getCards()
      }
      if (this.props.location.key != prevProps.location.key || localeChanged) {
        this.getCard(this.detectCard() || this.props.cards.collection[0].id())
      }
    })
  }

  componentWillUnmount() {
    this.props.cardsActions.resetCard()
  }

  render() {
    if (this.props.cards.collection.length > 0 && this.props.cards.current) {
      return (
        <div className="cards component" ref="container">
          {(isDesktop() && this.props.user.hasRole('admin') && this.props.i18n.locale != 'en') ? (
            <CardEditor
              i18n={this.props.i18n}
              user={this.props.user}
              push={this.props.push}
              themes={this.props.themes.collection}
              theme={this.props.themes.current}
              collection={this.props.collections.current}
              card={this.props.cards.current}
              updateTheme={this.props.themesActions.updateTheme}
              updateCollection={this.props.collectionsActions.updateCollection}
              cardsActions={this.props.cardsActions}
              original={this.props.cards.original}
              isOpened={this.props.cardsActions.isOpened(this.props.cards.current.id())}
              isReaded={this.props.cardsActions.isReaded(this.props.cards.current.attrs.id)}
            />
          ) : (
            <Card
              i18n={this.props.i18n}
              isAuthed={this.props.user.isAuthed()}
              push={this.props.push}
              themes={this.props.themes.collection}
              theme={this.props.themes.current}
              collection={this.props.collections.current}
              card={this.props.cards.current}
              toggleOriginal={this.props.cardsActions.toggleOriginal}
              toggleReadCard={this.props.cardsActions.toggleReadCard}
              original={this.props.cards.original}
              isOpened={this.props.cardsActions.isOpened(this.props.cards.current.id())}
              isReaded={this.props.cardsActions.isReaded(this.props.cards.current.attrs.id)}
            />
          )}

          <Carousel current={this.props.cards.current.id()} onChange={this.handleChange} items={
            this.props.cards.collection.map(item => {
              return {
                id: item.id(),
                image: item.image(),
                title: (item.id() == this.props.cards.current.id()) ? this.props.cards.current.attrs.name : item.attrs.name,
                locked: this.props.cardsActions.isOpened(item.id()) == false,
                replacement: item.attrs.replacement
              }
            })
          } />
        </div>
      )
    }
    else {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    i18n: state.i18n,
    user: state.session,
    themes: state.themes,
    collections: state.collections,
    cards: state.cards
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    push: bindActionCreators(push, dispatch),
    themesActions: bindActionCreators(themesActions, dispatch),
    collectionsActions: bindActionCreators(collectionsActions, dispatch),
    cardsActions: bindActionCreators(cardsActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardsContainer)
