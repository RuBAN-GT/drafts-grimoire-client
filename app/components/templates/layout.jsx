import React from 'react'
import ReactGA from 'react-ga'
import { isDesktop } from 'helpers/responsive'
import ym from 'react-yandex-metrika'
import { YMInitializer } from 'react-yandex-metrika'
import GlossaryEditor from 'containers/glossary-editor'
import MainMenu from 'components/templates/main-menu'
import SidebarMenu from 'components/templates/sidebar-menu'
import Flash from 'components/templates/flash'

export default class Layout extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.location.key != nextProps.location.key) {
      const path = window.location.pathname + window.location.search

      ReactGA.set({ page: path })
      ReactGA.pageview(path)

      ym('hit', path)
    }
  }

  render() {
    return (
      <div className="super wrapper">
        <div className="puser">
          <MainMenu
            glossary={this.props.tooltips.glossary}
            history={this.props.history}
            i18n={this.props.i18n}
            location={this.props.location}
            openAll={this.props.openAll}
            setLocale={this.props.i18nActions.setLocale}
            signOut={this.props.sessionActions.signOut}
            toggleSidebar={this.props.templateActions.toggleSidebar}
            replacement={this.props.tooltips.replacement}
            toggleLocked={this.props.toggleLocked}
            tooltipsActions={this.props.tooltipsActions}
            user={this.props.user}
          />

          <div className="ui main container">
            {this.props.children}
          </div>

          <Flash
            flash={this.props.flash}
            removeFlash={this.props.flashActions.removeFlash}
          />

          {isDesktop() && this.props.tooltips.editor && this.props.user.hasRole('admin') && (
            <GlossaryEditor />
          )}
        </div>

        <SidebarMenu
          glossary={this.props.tooltips.glossary}
          i18n={this.props.i18n}
          openAll={this.props.openAll}
          setLocale={this.props.i18nActions.setLocale}
          signOut={this.props.sessionActions.signOut}
          toggleLocked={this.props.toggleLocked}
          tooltipsActions={this.props.tooltipsActions}
          replacement={this.props.tooltips.replacement}
          user={this.props.user}
          visible={this.props.template.sidebar}
        />

        <YMInitializer
          accounts={[45724002]}
          options={{ defer: true }}
        />
      </div>
    )
  }
}
