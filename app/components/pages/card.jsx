import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'semantic-ui-react'
import ReactTooltip from 'react-tooltip'
import Glossary from 'components/common/glossary'
import GlossaryName from 'components/common/glossary-name'
import Scroller from 'components/templates/scroller'

class Card extends React.Component {
  constructor(props) {
    super(props)

    this.state = { lock: true }

    this.handleOriginal = this.handleOriginal.bind(this)
    this.handleLock     = this.handleLock.bind(this)
    this.handleRead     = this.handleRead.bind(this)
  }

  handleOriginal() {
    this.props.toggleOriginal(
      this.props.card.id(),
      {
        theme_real_id: this.props.theme.id(),
        collection_real_id: this.props.collection.id()
      }
    )
  }

  handleLock() {
    this.setState(prevState => {
      return { lock: !prevState.lock }
    })
  }

  handleRead() {
    this.props.toggleReadCard(this.props.card)
  }

  componentDidUpdate() {
    ReactTooltip.hide()
    ReactTooltip.rebuild()
  }

  render() {
    return (
      <div className="card component">
        <div className="basic wrapper">
          <div className="breadcrumbs">
            <Dropdown
              inline
              icon={null}
              options={this.props.themes.map(item => {
                return { text: item.attrs.name, value: item.id() }
              })}
              onChange={(event, data) => {
                const theme = this.props.themes.find(item => item.id() == data.value)

                if (theme && (event.target.className == 'text' || event.target.className == 'item'))  {
                  this.props.push(theme.url())
                }
              }}
              defaultValue={this.props.theme.id()}
            />

            <span className="divider"></span>
            <span dangerouslySetInnerHTML={{__html: this.props.collection.attrs.name}} />
            <span className="divider"></span>

            <GlossaryName
              content={this.props.card.attrs.name}
              className="current"
              replacement={this.props.card.attrs.replacement && this.props.original == false}
            />
          </div>

          <div className="grid">
            <div className="poster">
              <div className={`picture ${(this.props.isAuthed == false && this.props.i18n.locale == 'en') ? 'rounded' : ''}`}>
                <img src={this.props.card.image()} alt={this.props.card.attrs.name} />
                {this.props.isOpened == false && this.state.lock && (
                  <div className="closed overlay" />
                )}
              </div>
              {(this.props.isAuthed || this.props.i18n.locale != 'en') && (
                <div className="actions">
                  {this.props.i18n.locale != 'en' && (
                    <div className="action" onClick={this.handleOriginal}>
                      {this.props.original ? (
                        <i data-tip={this.props.i18n.t('actions.translated')} data-for="actions" className="icon selected radio"/>
                      ) : (
                        <i data-tip={this.props.i18n.t('actions.original')} data-for="actions" className="icon radio"/>
                      )}
                    </div>
                  )}
                  {this.props.isOpened == false && (
                    <div className="action" onClick={this.handleLock}>
                      {this.state.lock ? (
                        <i data-tip={this.props.i18n.t('actions.show')} data-for="actions" className="icon unhide"/>
                      ) : (
                        <i data-tip={this.props.i18n.t('actions.hide')} data-for="actions" className="icon hide"/>
                      )}
                    </div>
                  )}
                  {this.props.isAuthed && (
                    <div className="action" onClick={this.handleRead}>
                      {this.props.isReaded  ? (
                        <i data-tip={this.props.i18n.t('actions.read')} data-for="actions" className="icon bookmark"/>
                      ) : (
                        <i data-tip={this.props.i18n.t('actions.unread')} data-for="actions" className="icon remove bookmark"/>
                      )}
                    </div>
                  )}

                  <ReactTooltip id="actions" className="tooltip" />
                </div>
              )}
            </div>
            <div className="info">
              {(this.props.isOpened == false && this.state.lock) ? (
                <div className="content lock">{this.props.i18n.t('cards.lock')}</div>
              ) : (
                <div className="content">
                  <div className="mobile only">
                    <Glossary
                      glossary={this.props.card.attrs.glossary && this.props.original == false}
                      replacement={this.props.card.attrs.replacement && this.props.original == false}
                      content={this.props.card.fullContent()}
                    />
                  </div>

                  <Scroller className="mobile hidden">
                    <Glossary
                      glossary={this.props.card.attrs.glossary && this.props.original == false}
                      replacement={this.props.card.attrs.replacement && this.props.original == false}
                      content={this.props.card.fullContent()}
                    />
                  </Scroller>

                  <ReactTooltip id="card" className="tooltip" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Card.defaultProps = {
  original: false,
  isAuthed: false,
  isOpened: true,
  isReaded: true
}
Card.propTypes = {
  i18n: PropTypes.object.isRequired,
  isAuthed: PropTypes.bool,
  push: PropTypes.func.isRequired,
  themes: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  collection: PropTypes.object.isRequired,
  card: PropTypes.object.isRequired,
  toggleOriginal: PropTypes.func.isRequired,
  toggleReadCard: PropTypes.func.isRequired,
  original: PropTypes.bool,
  isOpened: PropTypes.bool,
  isReaded: PropTypes.bool
}

export default Card
