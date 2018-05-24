import React from 'react'
import { Router, Route, Link, useRouterHistory} from 'react-router'
import { createHashHistory } from 'history';
import { Provider } from 'react-redux'

import HomeView from '../modules/homeView/homeView';
import Admin from '../modules/admin/admin';

const appHistory = useRouterHistory(createHashHistory)({});

class App extends React.Component {
  shouldComponentUpdate () {
    return false
  }
  render () {
    return (
      <Provider store={this.props.store}>
          <Router history={appHistory} children={this.props.routes} >
            <Route path="/" component={HomeView} />
            <Route path="/admin" component={Admin} />
          </Router>
      </Provider>
    )
  }
}

export default App
