import React, { Component } from 'react';
import Cart from './cart';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import PropTypes from 'prop-types';

class Checkout extends Component {

    state = {
        count: 0,
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object,
    };

    displayItems = () => {
        let CartItem = (props) => {
            console.log(props.details);
          return (
            <li className="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                    <h6 className="my-0">{ props.details.quantity }x
                        { props.details.parent.name }
                        { props.details.product.name }</h6>
                    <small className="text-muted">{ props.details.product.category ? props.details.product.category.name : "" }</small>
                </div>
                <span className="text-muted">{ props.details.product.price }€</span>
            </li>
          );
        }
        return this.props.item.items.map(item => {
            return <CartItem key={"cartitem-" + item.product.id} details={item} />
        });
      }

    render() {
        const { user, isAuthenticated, item } = this.props;
        return (
            <div className="container mt-3">
                <div className="row">
                    {/* Right Panel Block */}
                    <div className="col-md-4 order-md-2 mb-4">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Ton panier</span>
                            <span className="badge badge-secondary badge-pill">{ "count" }</span>
                        </h4>
                        <ul className="list-group mb-3">

                            { this.displayItems() }
                            {/* {% for item in cart.cartItems %}
                                {% if item.ispaid == false %} */}

                                    {/* <li className="list-group-item d-flex justify-content-between lh-condensed">
                                        <div>
                                            <h6 className="my-0">{ item.quantity }x
                                                { item.product.product.name }
                                                { item.product.name }</h6>
                                            <small className="text-muted">{ item.product.product.category.name }</small>
                                        </div>
                                        <span className="text-muted">{ item.product.price }€</span>
                                    </li> */}

                                {/* {% endif %}
                            {% endfor %} */}

                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (HT)</span>
                                <strong>{ item.totalTax }€</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>TVA</span>
                                <strong>{ item.totalToPayHT }€</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (TTC)</span>
                                <strong>{ item.totalToPayTTC }€</strong>
                            </li>
                            <a href="{ payment_url }">
                                <button className="btn btn-primary btn-lg btn-block" type="submit">PAYER</button>
                            </a>
                        </ul>
                    </div>

                    {/* Addresses panel */}
                    <div className="col-md-8 order-md-1" id="adresses-panel">
                        <form className="needs-validation">
                            <div className="row">

                                {/* User info */}
                                <div className="col-md-4 mb-3">
                                    <label htmlfor="firstName">Nom</label>
                                    <input type="text" className="form-control" id="firstName" value={ !this.props.isauthenticated ? "" : user.username } required=""/>     {/* style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;" /> */}
                                    <div className="invalid-feedback">
                                        Un prénom est nécessaire pour la livraison.
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlfor="email">Email</label>
                                    <input type="email" className="form-control" id="email" value={ !this.props.isauthenticated ? "" : user.email }/>
                                    <div className="invalid-feedback">
                                        Merci de renseigner un email afin d'être informé de étapes de votre commande.
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlfor="phone">Tel</label>
                                    <input type="text" className="form-control" id="phone" value={ !this.props.isauthenticated ? "" : user.metadata.phone.field }/>
                                    <div className="invalid-feedback">
                                        Merci de renseigner un tel afin d'être informé de étapes de votre commande.
                                    </div>
                                </div>
                            </div>

                            {/* Delivery address panel */}
                            <hr className="mb-4"/>
                            <h4 className="mb-3">Adresse de livraison</h4>

                            <div className="row">
                                <div className="col-md-12">
                                    <div id="map-example-container"></div>
                                </div>

                                <div className="col-md-5 mt-3">
                                    <label htmlfor="input-map">Rue</label>
                                    <input type="search" id="input-map" className="form-control" placeholder="Saisir nom d'une rue :"/>
                                </div>

                                <div className="col-md-5 mt-3">
                                    <label htmlfor="complément">Complement d'adresse</label>
                                    <input type="textarea" className="form-control" id="complément" value="" required="" placeholder="Appt, Immeuble, Digicode, etc" />
                                </div>

                                <div className="col-md-2 mt-3">
                                    <small>
                                        <label htmlfor="complément">GPS</label>
                                        <input type="input" className="form-control" id="gps" value="" required="" placeholder="" />
                                    </small>
                                </div>
                            </div>

                            {/* Billing address */}
                            <hr className="mb-4"/>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <h4 className="mb-3">Adresse de facturation</h4>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="custom-control custom-checkbox custom-checkbox-primary">
                                        <input type="checkbox" className="custom-control-input" checked />
                                        <span className="custom-control-indicator"></span>
                                        <span className="custom-control-description">Identique à adresse de livraison</span>
                                    </label>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlfor="address">Adresse</label>
                                        <input type="text" className="form-control" id="address" value={ !this.props.isauthenticated ? "" : user.metadata.billing1.field } required="" />
                                        <div className="invalid-feedback">
                                            Merci de saisir une adresse de livraison.
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlfor="zip">CP</label>
                                        <input type="text" className="form-control" id="zip" value={ !this.props.isauthenticated ? "" : user.metadata.billing_city.zipCode } required="" />
                                        <div className="invalid-feedback">
                                            Code Postal nécessaire.
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlfor="address2">Adresse 2
                                            <span className="text-muted">(Optionel)</span>
                                        </label>
                                        <input type="text" className="form-control" id="address2" value={ !this.props.isauthenticated ? "" : user.metadata.billing2.field } />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlfor="billing_city">CP</label>
                                        <input type="text" className="form-control" id="billing_city" value={ !this.props.isauthenticated ? "" : user.metadata.billing_city.name } required="" />
                                        <div className="invalid-feedback">
                                            Code Postal nécessaire.
                                        </div>
                                    </div>
                                </div>
                            </div>
                                {/* </div>
                            </div> */}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    item: state.item,
    user: state.auth.user,
  });
  
  export default connect( mapStateToProps )(Checkout);