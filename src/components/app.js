import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import {refreshAuthToken, userActive} from '../actions/auth';

export class App extends React.Component {
    componentDidUpdate(prevProps) {
        // console.log('componnentnndidiidduppatee');
        
        if (!prevProps.loggedIn && this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
            this.startTimeoutTimer();
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

    startTimeoutTimer() {
        console.log(this.props.lastActive);
        
        const logoutTime = this.props.lastActive + 300000
        console.log(logoutTime);
        
        this.props.dispatch(userActive(logoutTime));
        console.log(this.props.logoutTimer);
        
    }

    stopPeriodicRefresh() {
        if (!this.refreshInterval) {
            return;
        }

        clearInterval(this.refreshInterval);
    }

    render() {
        return (
            <div className="app" >
                <HeaderBar />

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
    logoutTimer: state.auth.logoutTime
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
