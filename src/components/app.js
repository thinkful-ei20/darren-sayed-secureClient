import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import ShowModal from './showModal';
import RegistrationPage from './registration-page';
import {refreshAuthToken, userActive, clearAuth, showModal, hideModal} from '../actions/auth';

export class App extends React.Component {
  componentDidUpdate(prevProps) {
    // console.log('componnentnndidiidduppatee');
        
    if (!prevProps.loggedIn && this.props.loggedIn) {
      // When we are logged in, refresh the auth token periodically
      this.startPeriodicRefresh();
      this.initLogoutInterval();
      this.initLogoutModal();
    } else if (prevProps.loggedIn && !this.props.loggedIn) {
      // Stop refreshing when we log out
      this.stopPeriodicRefresh();
    }
  }

  componentWillUnmount() {
    this.stopPeriodicRefresh();
  }

  startPeriodicRefresh() {
    this.refreshInterval = setInterval(
      () => this.props.dispatch(refreshAuthToken()),
      60 * 10 * 1000 // One hour changed to 10 min            
    );        
  }

  logout() {
    this.props.dispatch(clearAuth());
  }

  initLogoutInterval() {
    const DEFAULT_INACTIVE = 300000;
    setInterval(() => {
      if (Date.now() - this.props.lastActive >= DEFAULT_INACTIVE) {
        this.logout();
      }
    }, DEFAULT_INACTIVE);
  }

  initLogoutModal() {
    // const MODAL_TIMEOUT = 240000;
    const MODAL_TIMEOUT = 5000;
    setInterval(() => {
        if (Date.now() - this.props.lastActive >= MODAL_TIMEOUT) {
            this.props.dispatch(showModal());
        }
    }, MODAL_TIMEOUT)
  }

  restartTimer() {
    this.props.dispatch(userActive());
  }

  restartModal() {
    this.props.dispatch(hideModal());
  }

  stopPeriodicRefresh() {
    if (!this.refreshInterval) {
      return;
    }

    clearInterval(this.refreshInterval);
  }

  render() {
    return (
      <div className="app" onMouseMove={() => this.restartTimer()}>
        <HeaderBar />
        <ShowModal restartModal={this.restartModal}/>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/register" component={RegistrationPage} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hasAuthToken: state.auth.authToken !== null,
  loggedIn: state.auth.currentUser !== null,
  lastActive: state.auth.lastActivity,
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
