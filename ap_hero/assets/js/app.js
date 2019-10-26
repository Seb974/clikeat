import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import { Provider } from 'react-redux';
import Navbar from './components/navbar';
import ProductList from './components/productList';
import ProductDetails from './components/productDetails';
import Login from './components/login';
import store from './store';
import { loadUser } from './actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

require('../css/app.css');

class App extends React.Component 
{

    state = {
        cart: this.props.cart || [],
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object
    };

    render() {
        return (
            <Provider store={store}>
                <Router>
                <span>
                    <span id="react-header">
                        <Navbar/>
                    </span>
                    <div id="page-container">
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
                            <Switch>
                                <Route path='/' exact component={ProductList} />
                                <Route path='/show/:id' component={ProductDetails} />
                                <Route path='/login' component={Login} />
                            </Switch>
                    </div>
                </span>
                </Router>
            </Provider>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  });
  
  export default connect( mapStateToProps)(App);

  ReactDOM.render(<App/>, document.getElementById("root"));