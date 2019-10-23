/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

console.log('Hello Webpack Encore! Edit me in assets/js/app.js');

import React from 'react';
import ReactDOM from 'react-dom';
// import {Router, Route, Switch, Redirect} from "react-router-dom";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import { Provider } from 'react-redux';
import Navbar from './components/navBar';
import Products from './components/products';
import Login from './components/login';
import store from './store';
import { loadUser } from './actions/authActions';

// import { connect } from 'react-redux';

// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

export default class App extends React.Component 
{

    state = {
        user: this.props.items || [],
        cart: this.props.cart || [],
    };

    render() {
        return (
            <Provider store={store}>
                <Router>
                <span>
                    <span id="react-header">
                        {/* <Navbar details={this.state.user}/> */}
                        <Navbar/>
                    </span>
                    <div id="page-container">
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
                            <Switch>
                                <Route path='/' exact component={Products} />
                                <Route path='/login' component={Login} />
                                {/* <Redirect from="*" to="/" /> */}
                            </Switch>
                    </div>
                </span>
                </Router>
            </Provider>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));