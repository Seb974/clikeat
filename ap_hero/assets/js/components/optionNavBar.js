import React, { Component } from 'react';
import Cart from './cart';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class OptionNavbar extends Component {

    state = {
        count: 0,
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object
    };

    render() {
        const { user, isAuthenticated } = this.props;
        const { count } = this.state;
        
        if (isAuthenticated) {
            return (
                <ul>
                    <li className="dropdown">
                        <Link to="/" data-toggle="dropdown">
                            <img src="" alt=""/>
                            <span>{ user.username }
                                <i className="fas fa-chevron-down"></i>
                            </span>
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="{{ path('user_self_show') }}">
                                <i className="fas fa-user"></i>Mon profil
                            </a>
                            { user.roles.indexOf('ROLE_ADMIN') === -1 ? "" : (
                                <span>
                                    <a className="dropdown-item" href="{{ path('user_self_show') }}">
                                        <i className="fas fa-user"></i>Mon profil</a>
                                    <div className="dropdown-divider"></div>
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
                                    <a className="dropdown-item" href="{{ path('deliverer') }}">
                                        <i className="fas fa-truck"></i>Livraisons</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="{{ path('get_order') }}">
                                        <i className="fas fa-cash-register"></i>Orders</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="{{ path('stock_index') }}">
                                        <i className="fas fa-box-open"></i>Stocks</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="{{ path('disconnect') }}">
                                        <i className="fas fa-sign-out-alt"></i>Se déconnecter
                                    </a>
                                </span>
                                )
                            }
                            { user.roles.indexOf('ROLE_DELIVERER') === -1 ? "" : (
                                <span>
                                    <a className="dropdown-item" href="{{ path('user_self_show') }}">
                                        <i className="fas fa-user"></i>Mon profil</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="{{ path('deliverer') }}">
                                        <i className="fas fa-truck"></i>Livraisons</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="{{ path('disconnect') }}">
                                        <i className="fas fa-sign-out-alt"></i>Se déconnecter
                                    </a>
                                </span>
                                )
                            }
                            { user.roles.indexOf('ROLE_SUPPLIER') === -1 ? "" : (
                                <span>
                                    <a className="dropdown-item" href="{{ path('user_self_show') }}">
                                        <i className="fas fa-user"></i>Mon profil</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="{{ path('get_order') }}">
                                        <i className="fas fa-cash-register"></i>Orders</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="{{ path('stock_index') }}">
                                        <i className="fas fa-box-open"></i>Stocks</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="{{ path('disconnect') }}">
                                        <i className="fas fa-sign-out-alt"></i>Se déconnecter
                                    </a>
                                </span>
                                )
                            }
                        </div>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fas fa-home"></i>
                        </Link>
                    </li>
                    <li className="dropdown dropdown-notification">
                        <a href="{{path('get_cart') }}" data-toggle="dropdown">
                            <i className="fas fa-shopping-cart"></i>
                            { count <= 0 ? "" : (<span className="badge badge-cart">{ count }</span>) }
                        </a>
                        <div className="dropdown-menu dropdown-menu-right" id="cart-summary">
                            <Cart/>
                        </div>
                    </li>
                    <li>
                        <a data-toggle="search">
                            <i className="fas fa-search"></i>
                        </a>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul>
                    <li>
                        {/* <a href="/login" onClick={this.handleConnexion}>Se connecter</a> */}
                        <Link to="/login">Se connecter</Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fas fa-home"></i>
                        </Link>
                    </li>
                    
                    <li className="dropdown dropdown-notification">
                        <a href="{{path('get_cart') }}" data-toggle="dropdown">
                            <i className="fas fa-shopping-cart"></i>
                            { count <= 0 ? "" : (<span className="badge badge-cart">{ count }</span>) }
                        </a>
                        <div className="dropdown-menu dropdown-menu-right" id="cart-summary">
                            <Cart/>
                        </div>
                    </li>

                    <li>
                        <a data-toggle="search">
                            <i className="fas fa-search"></i>
                        </a>
                    </li>
                </ul>
            );
        }
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  });
  
  export default connect( mapStateToProps)(OptionNavbar);