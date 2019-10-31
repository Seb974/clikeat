import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import ScrollToTop from './helpers/scrollToTop';
import { UPDATE_PRODUCT_STOCK } from './actions/types';
import { Provider } from 'react-redux';
import Navbar from './components/navbar';
import ProductList from './components/productList';
import ProductDetails from './components/productDetails';
import CartList from './components/cartList';
import Checkout from './components/checkout';
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
        user: PropTypes.object,
        updateProductStock: PropTypes.func,
    };

    componentDidMount = () => {
        const url = new URL('http://localhost:3000/hub');
        url.searchParams.append('topic', 'pong/ping');

        const eventSource = new EventSource(url);
        eventSource.onmessage = event => {
            event.preventDefault();
            store.dispatch({
                type: UPDATE_PRODUCT_STOCK,
                payload: {
                    variant: JSON.parse(event.data),
                }
              })
        }
    }

    render() {
        return (
            <Provider store={store}>
                <Router onUpdate={() => window.scrollTo(0, 0)}>
                <span>
                    <span id="react-header">
                        <Navbar/>
                    </span>
                    <div id="page-container">
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
                            <ScrollToTop>
                                <Switch>
                                    <Route path='/' exact component={ProductList} />
                                    <Route path='/show/:id' component={ProductDetails} />
                                    <Route path='/login' component={Login} />
                                    <Route path='/cart' component={CartList} />
                                    <Route path='/checkout' component={Checkout} />
                                    <Route path="*" render={() => (<Redirect to="/" />)} /> 
                                </Switch>
                            </ScrollToTop>
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