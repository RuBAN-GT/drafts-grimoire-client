import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import * as actions from 'actions/tooltips-actions'
import { newFlash } from 'actions/flash-actions'
import Tooltip from 'models/tooltip'
import { Checkbox } from 'semantic-ui-react'
import Scroller from 'components/templates/scroller'

class GlossaryEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      query: '',
      start: 0,
      end: 30,
      editable: null,
      results: props.tooltips.collection || []
    }

    this.moreItems     = this.moreItems.bind(this)
    this.handleSearch  = this.handleSearch.bind(this)
    this.handleClose   = this.handleClose.bind(this)
    this.handleChange  = this.handleChange.bind(this)
    this.addTooltip    = this.addTooltip.bind(this)
    this.cancelEdit    = this.cancelEdit.bind(this)
    this.saveTooltip   = this.saveTooltip.bind(this)
    this.selectTooltip = this.selectTooltip.bind(this)
    this.deleteTooltip = this.deleteTooltip.bind(this)
  }

  /**
   * Load more tips
   */
  moreItems() {
    if (this.state.end < this.state.results.length) {
      this.setState(prevState => {
        return { end: prevState.end + 20 }
      })
    }
  }

  /**
   * Handle search input
   *
   * @param {Object} event
   */
  handleSearch(event) {
    const value   = event.target.value
    const results = (value) ? this.props.tooltips.collection.filter(item => {
      return item.attrs.slug.indexOf(value) == 0
    }) : this.props.tooltips.collection

    this.setState({
      query: value,
      editable: null,
      results: results,
      start: 0,
      end: 30
    })
  }

  /**
   * Handle close of editor
   */
  handleClose() {
    this.props.actions.toggleEditor()
  }

  /**
   * Cancel of editing
   */
  cancelEdit() {
    this.setState({ editable: null })
  }

  /**
   * Start to create tooltip
   */
  addTooltip() {
    this.setState({ editable: new Tooltip({ replacement: false }) })
  }

  /**
   * Save tooltip
   */
  saveTooltip() {
    this.props.actions.saveTooltip(this.state.editable).then(tooltip => {
      if (tooltip.errors.length == 0) {
        this.cancelEdit()
      }
    })
  }

  /**
   * Handle of textarea editing
   *
   * @param {String} key
   * @param {String} value
   */
  handleChange(key, value) {
    this.setState(prevState => {
      const tooltip = new Tooltip(prevState.editable.attrs)
      tooltip.persisted = prevState.editable.persisted

      tooltip.attrs[key] = value

      return { editable: tooltip }
    })
  }

  /**
   * Select row for edit
   *
   * @param {Tooltip} tooltip
   */
  selectTooltip(tooltip) {
    this.setState({ editable: tooltip })
  }

  /**
   * Remove tooltip
   *
   * @param {Object} item
   */
  deleteTooltip(item) {
    this.props.actions.destroyTooltip(item)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.tooltips, this.props.tooltips) ||
      !isEqual(nextState.results, this.state.results) ||
      !isEqual(nextState.editable, this.state.editable) ||
      nextState.end != this.state.end
    )
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.results, this.props.tooltips)) {
      this.setState({
        query: '',
        start: 0,
        end: 20,
        results: nextProps.tooltips.collection
      })
    }
  }

  render() {
    return (
      <div className="glossary editor">
        <div className="header">
          {this.props.i18n.t('tooltips.glossary')}

          {(this.state.editable == null) ? (
            <div className="actions">
              <div className="add" onClick={this.addTooltip}>
                <i className="icon plus"/>
              </div>
              <div className="close" onClick={this.handleClose}>
                <i className="icon close"/>
              </div>
            </div>
          ) : (
            <div className="actions">
              <div className="save" onClick={this.saveTooltip}>
                <i className="icon check"/>
              </div>
              <div className="back" onClick={this.cancelEdit}>
                <i className="icon arrow right"/>
              </div>
            </div>
          )}
        </div>

        <div className="container">
          {(this.state.editable == null) ? (
            <div className="view">
              <div className="search">
                <input
                  type="text"
                  onChange={this.handleSearch}
                  placeholder={this.props.i18n.t('tooltips.search')}
                  autoFocus
                />
              </div>

              {this.state.results.length == 0 ? (
                <div className="empty">
                  {this.props.i18n.t('tooltips.empty')}...
                </div>
              ) : (
                <div className="tooltips">
                  <Scroller onReachEnd={this.moreItems} refreshOnUpdate={false}>
                    <div className="content">
                      <table className="ui inverted compact very basic selectable celled table">
                        <tbody>
                          {this.state.results.length > 0 && this.state.results.slice(this.state.start, this.state.end).map((item, i) => (
                            <tr data-id={item.id()} key={i} className="tooltip">
                              <td className="slug">{item.attrs.slug.split(',').join(', ')}</td>
                              <td className="body">{item.attrs.body}</td>
                              <td className="replacement collapsing">
                                <i className={`icon ${(item.attrs.replacement) ? 'retweet' : 'comment'}`}/>
                              </td>
                              <td className="edit collapsing">
                                <button onClick={() => this.selectTooltip(item)} className="ui small circular inverted basic icon blue button">
                                  <i className="edit icon"/>
                                </button>
                                <button onClick={() => this.deleteTooltip(item)} className="ui small circular inverted basic icon red button">
                                  <i className="trash icon"/>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {(this.state.end < this.state.results.length) && (
                        <div className="ui center aligned basic segment">
                          <div onClick={this.moreItems} className="ui inverted big basic button more" >
                            {this.props.i18n.t('search.more')}
                          </div>
                        </div>
                      )}
                    </div>
                  </Scroller>
                </div>
              )}
            </div>
          ) : (
            <div className="editor">
              <div className="field">
                <div className="label">{this.props.i18n.t('tooltips.slug')}</div>
                <div className="editable">
                  <input
                    type="text"
                    defaultValue={this.state.editable.attrs.slug}
                    onChange={event => this.handleChange('slug', event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <div className="label">{this.props.i18n.t('tooltips.body')}</div>
                <div className="editable">
                  <input
                    type="text"
                    defaultValue={this.state.editable.attrs.body}
                    onChange={event => this.handleChange('body', event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <Checkbox
                  label={this.props.i18n.t('tooltips.tooltip')}
                  checked={this.state.editable.attrs.replacement == false}
                  radio
                  onChange={() => this.handleChange('replacement', false)}
                />
                <Checkbox
                  label={this.props.i18n.t('tooltips.replacement')}
                  checked={this.state.editable.attrs.replacement == true}
                  radio
                  onChange={() => this.handleChange('replacement', true)}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    )
  }
}

GlossaryEditor.defaultProps = {
  className: 'glossary'
}
GlossaryEditor.propTypes = {
  i18n: PropTypes.object.isRequired,
  tooltips: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  newFlash: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    i18n: state.i18n,
    tooltips: state.tooltips
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    newFlash: bindActionCreators(newFlash, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlossaryEditor)
