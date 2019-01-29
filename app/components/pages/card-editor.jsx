import React from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import { Dropdown } from 'semantic-ui-react'
import ReactTooltip from 'react-tooltip'
import { Editor, EditorState, ContentState, convertFromHTML } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import Glossary from 'components/common/glossary'
import GlossaryName from 'components/common/glossary-name'
import Scroller from 'components/templates/scroller'

class CardEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editable: false,
      name: null,
      intro: null,
      description: null,
      glossary: null,
      replacement: null,
      theme: null,
      collection: null,
      lock: true
    }

    this.handleOriginal = this.handleOriginal.bind(this)
    this.handleLock     = this.handleLock.bind(this)
    this.handleRead     = this.handleRead.bind(this)
    this.enableEditor   = this.enableEditor.bind(this)
    this.disableEditor  = this.disableEditor.bind(this)
    this.saveEditable   = this.saveEditable.bind(this)
    this.handleChange   = this.handleChange.bind(this)
  }

  handleOriginal() {
    return this.props.cardsActions.toggleOriginal(
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
    this.props.cardsActions.toggleReadCard(this.props.card)
  }

  /**
   * Enable editor with states
   */
  enableEditor() {
    const prom = (this.props.original) ? this.handleOriginal() : new Promise(resolve => resolve(this.props.card))

    prom.then(card => {
      let state = {
        lock: false,
        editable: true,
        name: EditorState.createWithContent(ContentState.createFromText(card.attrs.name)),
        glossary: card.attrs.glossary,
        replacement: card.attrs.replacement,
        theme: EditorState.createWithContent(ContentState.createFromText(this.props.theme.attrs.name)),
        collection: EditorState.createWithContent(ContentState.createFromText(this.props.collection.attrs.name))
      }
      const keys  = ['intro', 'description']

      keys.forEach(key => {
        let field = card.attrs[key]

        if (field) {
          field = convertFromHTML(field)
          field = EditorState.createWithContent(
            ContentState.createFromBlockArray(
              field.contentBlocks,
              field.entityMap
            )
          )
        }
        else {
          field = EditorState.createEmpty()
        }

        state[key] = field
      })

      this.setState(state)
    })
  }

  /**
   * Disable editor
   */
  disableEditor() {
    this.setState({
      editable: false,
      name: null,
      intro: null,
      description: null,
      glossary: null,
      replacement: null,
      theme: null,
      collection: null
    })
  }

  /**
   * Save editable information
   */
  saveEditable() {
    this.props.updateTheme(
      this.props.theme,
      this.state.theme.getCurrentContent().getPlainText(null)
    ).then(theme => {
      this.props.updateCollection(
        this.props.collection,
        this.state.collection.getCurrentContent().getPlainText(null)
      ).then(collection => {
        const empty = ['<p><br></p>', '<p></p>']
        let intro   = stateToHTML(this.state.intro.getCurrentContent())
        let descr   = stateToHTML(this.state.description.getCurrentContent())

        intro = (empty.indexOf(intro) > -1) ? null : intro
        descr = (empty.indexOf(descr) > -1) ? null : descr

        this.props.cardsActions.updateCard(
          this.props.card,
          {
            name: this.state.name.getCurrentContent().getPlainText(null),
            intro: intro,
            description: descr,
            glossary: this.state.glossary,
            replacement: this.state.replacement
          }
        ).then(card => {
          if (theme.errors.length == 0 && collection.errors.length == 0 && card.errors.length == 0) {
            this.disableEditor()
          }
        })
      })
    })
  }

  /**
   * Handle editors changes
   *
   * @param {String} key
   * @param {Object} value
   */
  handleChange(key, value) {
    this.setState(prevState => {
      prevState[key] = value

      return prevState
    })
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.card, prevProps.card)) {
      this.disableEditor()
    }

    ReactTooltip.hide()
    ReactTooltip.rebuild()
  }

  render() {
    return (
      <div className="card editor component">
        <div className="basic wrapper">
          <div className="breadcrumbs">
            {this.state.editable ? (
              <Editor
                editorState={this.state.theme}
                onChange={(editor) => this.handleChange('theme', editor)}
              />
            ) : (
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
            )}

            <span className="divider"></span>

            {this.state.editable ? (
              <Editor
                className="editable"
                editorState={this.state.collection}
                onChange={(editor) => this.handleChange('collection', editor)}
              />
            ) : (
              <span dangerouslySetInnerHTML={{__html: this.props.collection.attrs.name}} />
            )}

            <span className="divider"></span>

            {this.state.editable ? (
              <Editor
                className="editable"
                editorState={this.state.name}
                onChange={(editor) => this.handleChange('name', editor)}
              />
            ) : (
              <GlossaryName
                content={this.props.card.attrs.name}
                className="current"
                replacement={this.props.card.attrs.replacement && this.props.original == false}
              />
            )}
          </div>

          <div className="grid">
            <div className="poster">
              <div className="picture">
                <img src={this.props.card.image()} alt={this.props.card.attrs.name} />
                {this.props.isOpened == false && this.state.lock && (
                  <div className="closed overlay" />
                )}
              </div>
              {(this.state.editable) ? (
                <div className="actions">
                  <div className="action" onClick={this.saveEditable}>
                    <i data-tip={this.props.i18n.t('actions.save')} data-for="actions" className="icon check"/>
                  </div>

                  <div
                    className={`action ${(this.state.glossary) ? 'on' : 'off'}`}
                    onClick={() => this.handleChange('glossary', !this.state.glossary)}
                  >
                    <i data-tip={this.props.i18n.t('cards.glossary')} data-for="actions" className="icon comment"/>
                  </div>
                  <div
                    className={`action ${(this.state.replacement) ? 'on' : 'off'}`}
                    onClick={() => this.handleChange('replacement', !this.state.replacement)}
                  >
                    <i data-tip={this.props.i18n.t('cards.replacement')} data-for="actions" className="icon retweet"/>
                  </div>

                  <div className="action" onClick={this.disableEditor}>
                    <i data-tip={this.props.i18n.t('actions.cancel')} data-for="actions" className="icon cancel"/>
                  </div>
                </div>
              ) : (
                <div className="actions">
                  <div className="action" onClick={this.enableEditor}>
                    <i data-tip={this.props.i18n.t('actions.edit')} data-for="actions" className="icon edit"/>
                  </div>
                  <div className="action" onClick={this.handleOriginal}>
                    {this.props.original ? (
                      <i data-tip={this.props.i18n.t('actions.translated')} data-for="actions" className="icon selected radio"/>
                    ) : (
                      <i data-tip={this.props.i18n.t('actions.original')} data-for="actions" className="icon radio"/>
                    )}
                  </div>
                  {this.props.isOpened == false && (
                    <div className="action" onClick={this.handleLock}>
                      {this.state.lock ? (
                        <i data-tip={this.props.i18n.t('actions.show')} data-for="actions" className="icon unhide"/>
                      ) : (
                        <i data-tip={this.props.i18n.t('actions.hide')} data-for="actions" className="icon hide"/>
                      )}
                    </div>
                  )}
                  <div className="action" onClick={this.handleRead}>
                    {this.props.isReaded  ? (
                      <i data-tip={this.props.i18n.t('actions.read')} data-for="actions" className="icon bookmark"/>
                    ) : (
                      <i data-tip={this.props.i18n.t('actions.unread')} data-for="actions" className="icon remove bookmark"/>
                    )}
                  </div>
                </div>
              )}

              <ReactTooltip id="actions" className="tooltip" />
            </div>
            <div className="info">
              {(this.state.editable) ? (
                <div className="content editable">
                  <Scroller>
                    <div className="intro">
                      <Editor
                        editorState={this.state.intro}
                        placeholder={this.props.i18n.t('cards.placeholder')}
                        onChange={(editor) => this.handleChange('intro', editor)}
                      />
                    </div>
                    <div className="description">
                      <Editor
                        editorState={this.state.description}
                        placeholder={this.props.i18n.t('cards.placeholder')}
                        onChange={(editor) => this.handleChange('description', editor)}
                      />
                    </div>
                  </Scroller>
                </div>
              ) : (
                <div className="content">
                  {(this.props.isOpened == false && this.state.lock) ? (
                    <div className="lock">{this.props.i18n.t('cards.lock')}</div>
                  ) : (
                    <Scroller>
                      <Glossary
                        glossary={this.props.card.attrs.glossary && this.props.original == false}
                        replacement={this.props.card.attrs.replacement && this.props.original == false}
                        content={this.props.card.fullContent()}
                      />
                    </Scroller>
                  )}

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

CardEditor.defaultProps = {
  original: false,
  isOpened: true,
  isReaded: true
}
CardEditor.propTypes = {
  i18n: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  themes: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  collection: PropTypes.object.isRequired,
  card: PropTypes.object.isRequired,
  updateTheme: PropTypes.func.isRequired,
  updateCollection: PropTypes.func.isRequired,
  cardsActions: PropTypes.object.isRequired,
  original: PropTypes.bool,
  isOpened: PropTypes.bool,
  isReaded: PropTypes.bool
}

export default CardEditor
