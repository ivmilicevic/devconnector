import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import PrivateRoute from './components/common/PrivateRoute';

// Import Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';

import './App.css';
import { CLEAR_CURRENT_PROFILE } from './actions/types';

if (localStorage.jwtToken) {
    // Set request headers to jwt if there's saved token in localStorage
    setAuthToken(localStorage.jwtToken);

    // Also set currently logged in user
    const decodedToken = jwt_decode(localStorage.jwtToken);
    store.dispatch(setCurrentUser(decodedToken));

    // Redirect user to login page if token has expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
        // Log user out and clear currenly loaded profile
        store.dispatch(logoutUser());
        store.dispatch(clearCurrentProfile());
        // Redirect to login page
        window.location.href = '/login';
    }
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Navbar />
                        <Route exact path="/" component={Landing} />
                        <div className="container">
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                            <Switch>
                                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                            </Switch>
                            <Switch>
                                <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                            </Switch>
                            <Switch>
                                <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                            </Switch>
                        </div>
                        <Footer />
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
