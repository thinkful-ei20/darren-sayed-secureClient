import React from 'react';
import {connect} from 'react-redux';
import requiresLogin from './requires-login';
import {fetchProtectedData} from '../actions/protected-data';

export class Dashboard extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchProtectedData());
        console.log('comp did mount from dashbaord.js');
        
    }

    onSubmit = () => {
        console.log('clicked');
    }

    render() {
        const formattedDate = this.props.lastActive;
        return (
            <div className="dashboard">
                <div>Last active: {formattedDate}</div>
                <div className="dashboard-username">
                    Username: {this.props.username}
                </div>
                <div className="dashboard-name">Name: {this.props.name}</div>
                <div className="dashboard-protected-data">
                    Protected data: {this.props.protectedData}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {currentUser} = state.auth;
    return {
        username: state.auth.currentUser.username,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        protectedData: state.protectedData.data,
        lastActive: state.auth.lastActivity
    };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
