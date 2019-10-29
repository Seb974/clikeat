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

    componentDidMount = () => {
        const url = new URL('http://localhost:3000/hub');
        url.searchParams.append('topic', 'pong/ping');

        const eventSource = new EventSource(url);
        eventSource.onmessage = event => {
            this.updateProduct(event);
            // const data = JSON.parse(event.data);
            // document.getElementById('content-wrap').insertAdjacentHTML('afterbegin', '<div class="alert alert-success"><strong>Mise a jour du stock de ' + data.product.name + ' ' + data.name + '</strong></div>')
            // window.setTimeout(() => {
            //     const $alert = document.querySelector('.alert');
            //     $alert.parentNode.removeChild($alert);
            // }, 2000);
        }
    }

    updateProduct = (event) => {
        const data = JSON.parse(event.data);
        alert("Mise à jour du produit " + data.product.name + " " + data.name);
    }

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
                                <Route path="/*" render={() => (<Redirect to="/" />)} /> 
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