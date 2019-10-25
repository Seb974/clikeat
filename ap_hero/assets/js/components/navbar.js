import React, { Component } from 'react';
import Cart from './cart';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import PropTypes from 'prop-types';

class Navbar extends Component {

    state = {
        count: 0,
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object,
        logout: PropTypes.func.isRequired,
    };

    handleLogout = (e) => {
        e.preventDefault();
        this.props.logout();
    }

    displayAnonymousView = () => {
        let Anonymous = () => <li><Link to="/login">Se connecter</Link></li>
        return <Anonymous />
    }

    displayLoggedView = (user) => {
        let Identified = (props) => {
            return (
                <li className="dropdown">
                    <Link to="/" data-toggle="dropdown">
                        <img src="" alt=""/>
                        <span>{ user.username }
                            <i className="fas fa-chevron-down"></i>
                        </span>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                        <a className="dropdown-item" href="{{ path('user_self_show') }}">
                            <i className="fas fa-user"></i>Mon profil</a>
                        <div className="dropdown-divider"></div>
                        { (props.user.roles.indexOf('ROLE_SUPPLIER') === -1 && props.user.roles.indexOf('ROLE_ADMIN') === -1) ? "" : (
                            <span>
                                <a className="dropdown-item" href="{{ path('stock_index') }}">
                                    <i className="fas fa-box-open"></i>Stocks</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="{{ path('get_order') }}">
                                    <i className="fas fa-cash-register"></i>Orders</a>
                                <div className="dropdown-divider"></div>
                            </span>
                            )
                        }
                        { (props.user.roles.indexOf('ROLE_DELIVERER') === -1 && props.user.roles.indexOf('ROLE_ADMIN') === -1) ? "" : (
                            <span>
                                <a className="dropdown-item" href="{{ path('deliverer') }}">
                                    <i className="fas fa-truck"></i>Livraisons</a>
                                <div className="dropdown-divider"></div>
                            </span>
                            )
                        }
                        { (props.user.roles.indexOf('ROLE_ADMIN') === -1) ? "" : (
                            <span>
                                <a className="dropdown-item" href="{{ path('user_index') }}">
                                    <i className="fas fa-users"></i>Users</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="{{ path('city_index') }}">
                                    <i className="fas fa-city"></i>City</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="{{ path('product_index') }}">
                                    <i className="fas fa-utensils"></i>Produits</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="{{ path('variant_index') }}">
                                        <i className="fas fa-sort"></i>Variantes</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="{{ path('category_index') }}">
                                    <i className="fas fa-columns"></i>Catégories</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="{{ path('tva_index') }}">
                                    <i className="fas fa-calculator"></i>Taxes</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="{{ path('allergen_index') }}">
                                    <i className="fas fa-exclamation-triangle"></i>Allergènes</a>
                                <div className="dropdown-divider"></div>
                            </span>
                            )
                        }
                            <a className="dropdown-item" href="#" onClick={ this.handleLogout }>
                            <i className="fas fa-sign-out-alt"></i>Se déconnecter</a>
                    </div>
                </li>
              );
        }
        return <Identified user={user}/>
    }

    render() {
        const { user, isAuthenticated, item } = this.props;
        return (
            <header id="header">
                <div className="container">
                    <div className="navbar-backdrop">
                        <div className="navbar">
                            <Link to="/" className="logo"> <img src="uploads/logos/clikEat.png" alt="Clik Eat Logo" height="50px"/></Link>
                            <div className="toright">
                                <nav className="nav">
                                    <ul>
                                        { isAuthenticated ? this.displayLoggedView(user) : this.displayAnonymousView() }
                                        <li>
                                            <Link to="/"><i className="fas fa-home"></i></Link>
                                        </li>
                                        <li className="dropdown dropdown-notification">
                                            <a href="{{path('get_cart') }}" data-toggle="dropdown">
                                                <i className="fas fa-shopping-cart"></i>
                                                { item.items.length <= 0 ? "" :
                                                    (<span className="badge badge-cart">
                                                        { item.items.reduce((cumul, current) => {
                                                            return current.quantity == null ? cumul : cumul + current.quantity;
                                                            }, 0) 
                                                        }
                                                    </span>) 
                                                }
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right" id="cart-summary"><Cart/></div>
                                        </li>
                                        <li>
                                            <a data-toggle="search">
                                                <i className="fas fa-search"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="navbar-search">
                        <div className="container">
                            <form method="post">
                                <input type="text" className="form-control" placeholder="Rechercher..."/>
                                <i className="fas fa-times close"></i>
                            </form>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    item: state.item,
    user: state.auth.user,
  });
  
  export default connect( mapStateToProps, { logout })(Navbar);