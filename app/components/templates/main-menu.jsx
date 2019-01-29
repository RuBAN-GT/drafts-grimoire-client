import React from 'react'
import PropTypes from 'prop-types'
import { isDesktop } from 'helpers/responsive'
import { Link } from 'react-router-dom'
import { Dropdown } from 'semantic-ui-react'
import SearchForm from 'components/templates/search-form'

class MainMenu extends React.Component {
  constructor(props) {
    super(props)

    this.state = { search: false }

    this.openSearch  = this.openSearch.bind(this)
    this.closeSearch = this.closeSearch.bind(this)
  }

  openSearch() {
    this.setState({ search: true })
  }

  closeSearch() {
    this.setState({ search: false })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname != nextProps.location.pathname) {
      this.closeSearch()
    }
  }

  render() {
    return (
      <div className="ui inverted main menu">
        <div className="ui container basic wrapper">
          <Link to='/' className="header title item">
            <span className="mobile only" title={this.props.i18n.t('grimoire')}>
              <i className="icon destiny"/>
            </span>

            <span className="mobile hidden">
              Destiny
              <i className="icon destiny"/>
              {this.props.i18n.t('grimoire')}
            </span>
          </Link>


          {this.state.search && (
            <SearchForm
              i18n={this.props.i18n}
              history={this.props.history}
              location={this.props.location}
              onClose={this.closeSearch}
            />
          )}

          <div className="menu right">
            <div className="menu right">
              {this.state.search == false && (
                <span onClick={this.openSearch} className="link icon item">
                  <i className="search icon"/>
                </span>
              )}
              <a
                href="https://vk.com/thegamedestiny"
                className="item mobile hidden"
                title={this.props.i18n.t('general_site')} target="_blank"
              >
                <i className="icon vk" />
              </a>

              <Dropdown
                item
                icon={this.props.user.isAuthed() ? 'dropdown' : 'user'}
                text={this.props.user.isAuthed() ? this.props.user.displayName : null}
                className={`mobile hidden ${this.props.user.isAuthed() ? '' : 'icon'}`}
              >
                <Dropdown.Menu>
                  {!this.props.user.isAuthed() && (
                    <Link to='/sign_in' className="item">
                      <i className="icon sign in" />
                      {this.props.i18n.t('sign_in')}
                    </Link>
                  )}

                  {this.props.i18n.locale == 'en' ? (
                    <Dropdown.Item
                      onClick={() => this.props.setLocale('ru')}
                      icon="globe"
                      text="Русский"
                    />
                  ) : (
                    <Dropdown.Item
                      onClick={() => this.props.setLocale('en')}
                      icon="globe"
                      text="English"
                    />
                  )}

                  {this.props.i18n.locale != 'en' && this.props.glossary && (
                    <Dropdown.Item
                      onClick={this.props.tooltipsActions.toggleGlossary}
                      icon="check circle"
                      text={this.props.i18n.t('tooltips.disable_glossary')}
                    />
                  )}
                  {this.props.i18n.locale != 'en' && !this.props.glossary && (
                    <Dropdown.Item
                      onClick={this.props.tooltipsActions.toggleGlossary}
                      icon="circle outline"
                      text={this.props.i18n.t('tooltips.allow_glossary')}
                    />
                  )}
                  {this.props.i18n.locale != 'en' && this.props.replacement && (
                    <Dropdown.Item
                      onClick={this.props.tooltipsActions.toggleReplacement}
                      icon="check circle"
                      text={this.props.i18n.t('tooltips.disable_replacement')}
                    />
                  )}
                  {this.props.i18n.locale != 'en' && !this.props.replacement && (
                    <Dropdown.Item
                      onClick={this.props.tooltipsActions.toggleReplacement}
                      icon="circle outline"
                      text={this.props.i18n.t('tooltips.allow_replacement')}
                    />
                  )}

                  {this.props.user.isAuthed() && isDesktop() && this.props.user.hasRole('admin') && (
                    <Dropdown.Item
                      onClick={this.props.tooltipsActions.toggleEditor}
                      icon="list"
                      text={this.props.i18n.t('tooltips.edit')}
                    />
                  )}

                  {this.props.user.isAuthed() && this.props.openAll && (
                    <Dropdown.Item
                      onClick={this.props.toggleLocked}
                      icon="lock"
                      text={this.props.i18n.t('cards.only_opened')}
                    />
                  )}
                  {this.props.user.isAuthed() && !this.props.openAll && (
                    <Dropdown.Item
                      onClick={this.props.toggleLocked}
                      icon="unlock"
                      text={this.props.i18n.t('cards.open_all')}
                    />
                  )}

                  {this.props.user.isAuthed() && (
                    <Dropdown.Item icon="sign out" text={this.props.i18n.t('sign_out')} onClick={this.props.signOut} />
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <span onClick={this.props.toggleSidebar} className="icon link item mobile only">
              <i className="icon sidebar"/>
            </span>
          </div>
        </div>
      </div>
    )
  }
}

MainMenu.defaultProps = {
  glossary: true,
  openAll: false,
  replacement: true
}
MainMenu.propTypes = {
  glossary: PropTypes.bool,
  history: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  openAll: PropTypes.bool,
  replacement: PropTypes.bool,
  setLocale: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  toggleLocked: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  tooltipsActions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default MainMenu
