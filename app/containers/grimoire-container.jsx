import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import * as themesActions from 'actions/themes-actions'
import * as collectionsActions from 'actions/collections-actions'
import Theme from 'components/pages/theme'
import Home from 'components/pages/home'
import Themes from 'components/common/themes'

class GrimoireContainer extends React.Component {
  render() {
    let currentTheme = this.props.location.pathname
    if (currentTheme.length > 1) {
      currentTheme = currentTheme.split('/')[2] || null
    }
    else {
      currentTheme = null
    }

    return (
      <div className="grimoire">
        <Themes
          current={currentTheme}
          locale={this.props.i18n.locale}
          location={this.props.location.pathname}
          setThemes={this.props.themesActions.setThemes}
          themes={this.props.themes}
        />

        <div className="special">
          <Switch>
            <Route
              path='/grimoire/:theme_id'
              render={props => {
                const common = Object.assign({}, props, {
                  themesActions: this.props.themesActions,
                  collectionsActions: this.props.collectionsActions,
                  i18n: this.props.i18n,
                  themes: this.props.themes,
                  collections: this.props.collections,
                })

                return <Theme {...common} />
              }}
            />
            <Route exact path='/grimoire' component={Home} />
            <Route exact path='/' component={Home} />
          </Switch>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    i18n: state.i18n,
    themes: state.themes,
    collections: state.collections
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    themesActions: bindActionCreators(themesActions, dispatch),
    collectionsActions: bindActionCreators(collectionsActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GrimoireContainer)
