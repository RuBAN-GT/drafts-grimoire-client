import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Sidebar } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class SidebarMenu extends React.Component {
  render() {
    return (
      <Sidebar
        as={Menu}
        animation='overlay'
        width='thin'
        direction='right'
        visible={this.props.visible}
        icon='labeled'
        className="second mobile only"
        vertical
        inverted
      >
        <a
          href="https://vk.com/thegamedestiny"
          className="item"
          title={this.props.i18n.t('general_site')} target="_blank"
        >
          <i className="icon vk" />
          {this.props.i18n.t('general_site')}
        </a>

        {!this.props.user.isAuthed() && (
          <Link to='/sign_in' className="item">
            <i className="icon sign in" />
            {this.props.i18n.t('sign_in')}
          </Link>
        )}

        {this.props.i18n.locale == 'en' ? (
          <Menu.Item
            onClick={() => this.props.setLocale('ru')}
            icon="globe"
            name="Русский"
          />
        ) : (
          <Menu.Item
            onClick={() => this.props.setLocale('en')}
            icon="globe"
            name="English"
          />
        )}

        {this.props.i18n.locale != 'en' && this.props.glossary && (
          <Menu.Item
            onClick={this.props.tooltipsActions.toggleGlossary}
            icon="check circle"
            name={this.props.i18n.t('tooltips.disable_glossary')}
          />
        )}
        {this.props.i18n.locale != 'en' && !this.props.glossary && (
          <Menu.Item
            onClick={this.props.tooltipsActions.toggleGlossary}
            icon="circle outline"
            name={this.props.i18n.t('tooltips.allow_glossary')}
          />
        )}
        {this.props.i18n.locale != 'en' && this.props.replacement && (
          <Menu.Item
            onClick={this.props.tooltipsActions.toggleReplacement}
            icon="check circle"
            name={this.props.i18n.t('tooltips.disable_replacement')}
          />
        )}
        {this.props.i18n.locale != 'en' && !this.props.replacement && (
          <Menu.Item
            onClick={this.props.tooltipsActions.toggleReplacement}
            icon="circle outline"
            name={this.props.i18n.t('tooltips.allow_replacement')}
          />
        )}

        {this.props.user.isAuthed() && this.props.openAll && (
          <Menu.Item
            onClick={this.props.toggleLocked}
            icon="lock"
            name={this.props.i18n.t('cards.only_opened')}
          />
        )}
        {this.props.user.isAuthed() && !this.props.openAll && (
          <Menu.Item
            onClick={this.props.toggleLocked}
            icon="unlock"
            name={this.props.i18n.t('cards.open_all')}
          />
        )}

        {this.props.user.isAuthed() && (
          <Menu.Item icon="sign out" name={this.props.i18n.t('sign_out')} onClick={this.props.signOut} />
        )}
      </Sidebar>
    )
  }
}

SidebarMenu.defaultProps = {
  glossary: true,
  openAll: false,
  replacement: true,
  visible: false
}
SidebarMenu.propTypes = {
  glossary: PropTypes.bool,
  i18n: PropTypes.object.isRequired,
  openAll: PropTypes.bool,
  replacement: PropTypes.bool,
  setLocale: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  toggleLocked: PropTypes.func.isRequired,
  tooltipsActions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  visible: PropTypes.bool
}

export default SidebarMenu
