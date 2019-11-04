import React from 'react';
import axios from 'axios';
import {Alert} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { Redirect } from "react-router-dom"; 
import { tokenConfig } from '../helpers/security';

class Profile extends React.Component 
{
    state = {
        username: '',
        email: '',
        identicalBillingAddress: true,
        phone: '',
        d_address: '',
        d_address2: '',
        d_zipCode: '',
        d_city: '',
        b_address: '',
        b_address2: '',
        b_zipCode: '',
        b_city: '',
        cities: []
    };
    
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };

    componentDidMount = () => {
        axios.get('/api/cities', tokenConfig())
             .then((res) => {
                this.setState({ cities : res.data['hydra:member'] });
                if (this.props.user.metadata.length > 0) {
                    let user_d_city = this.props.user.metadata.find(meta => meta.type === 'delivery_city');
                    let user_b_city = this.props.user.metadata.find(meta => meta.type === 'billing_city');
                    let d_city = (typeof user_d_city !== 'undefined') ? res.data['hydra:member'].find(city => city.zipCode === parseInt(user_d_city.field)) : '';
                    let b_city = (user_b_city === user_d_city) ? d_city : ((typeof user_d_city !== 'undefined') ? res.data['hydra:member'].find(city => city.zipCode === parseInt(user_b_city.field)) : '');
                    this.setState({
                        d_city: d_city,
                        b_city: b_city,
                    });
                }
             });
        this.setState({
            username: this.props.user.username,
            email: this.props.user.email,
            identicalBillingAddress: true,
        });

        for (let i = 0; i < this.props.user.metadata.length; i++) {
            switch ( this.props.user.metadata[i].type) {
                case 'phone_number':
                    this.setState({phone: this.props.user.metadata[i].field});
                    break;
                case 'billing_line_1':
                    this.setState({b_address: this.props.user.metadata[i].field});
                    break;
                case 'billing_line_2':
                    this.setState({b_address2: this.props.user.metadata[i].field});
                    break;
                case 'billing_city':
                    this.setState({b_zipCode: this.props.user.metadata[i].field});
                    break;
                case 'delivery_line_1':
                    this.setState({d_address: this.props.user.metadata[i].field});
                    break;
                case 'delivery_line_2':
                    this.setState({d_address2: this.props.user.metadata[i].field});
                    break;
                case 'delivery_city':
                    this.setState({d_zipCode: this.props.user.metadata[i].field});
                    break;
                default:
                    return ;
            }
        }
        if (this.state.b_address === this.state.d_address && this.state.b_address2 === this.state.d_address2 && this.state.b_zipCode === this.state.d_zipCode ) {
            document.getElementById('billingAddress-checkbox').setAttribute('checked', 'checked');
        }
    }

    onZipCodeChange = e => {
        for (let i = 0; i < this.state.cities.length; i++) {

        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };
    
    handleLogin = e => {
        e.preventDefault();
        const { email, password } = this.state;
        const user = { email, password};
        this.setState({email: '', password: ''});
        this.props.login(user);
    };

    handleBillingAddress = e => {
        if ( this.state.identicalBillingAddress === true) {
            this.setState({
                identicalBillingAddress: false,
                b_address: '',
                b_address2: '',
                b_zipCode: '',
            });
            e.target.removeAttribute('checked');
        } else {
            this.setState({
                identicalBillingAddress: true,
                b_address: this.state.d_address,
                b_address2: this.state.d_address2,
                b_zipCode: this.state.d_zipCode,
            });
            e.target.setAttribute('checked', 'checked');
        }
    }

    render() {
        const { user, isAuthenticated, item } = this.props;
        return (
            <div className="container mt-3">
                <div className="row">
                    {/* Addresses panel */}
                    <div className="col-md-8 order-md-1" id="adresses-panel">
                        <form className="needs-validation">
                            <div className="row">
                                <div className="row">
                                    {/* <div className="col-md-4 mb-3"></div> */}
                                    
                                        {/* User info */}
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="firstName">Nom</label>
                                            <input type="text" className="form-control" id="firstName" value={ this.state.username } required=""/>     {/* style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;" /> */}
                                            <div className="invalid-feedback">
                                                Un prénom est nécessaire pour la livraison.
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="email">Email</label>
                                            <input type="email" className="form-control" id="email" value={ this.state.email }/>
                                            <div className="invalid-feedback">
                                                Merci de renseigner un email afin d'être informé de étapes de votre commande.
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="phone">Tel</label>
                                            <input type="text" className="form-control" id="phone" value={ this.state.phone }/>
                                            <div className="invalid-feedback">
                                                Merci de renseigner un tel afin d'être informé de étapes de votre commande.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/* Delivery address panel */}
                            <hr className="mb-4"/>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <h4 className="mb-3">Adresse de livraison</h4>
                                </div>

                                <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="address">Adresse</label>
                                            <input type="text" className="form-control" id="address" value={ this.state.d_address } required="" />
                                            <div className="invalid-feedback">
                                                Merci de saisir une adresse de livraison.
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="complément">Complement d'adresse</label>
                                            <input type="textarea" className="form-control" id="complément" value={ this.state.d_address2 } required="" placeholder="Appt, Immeuble, Digicode, etc" />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="zip">CP</label>
                                            <input type="text" className="form-control" id="zip" value={ this.state.d_zipCode } required="" />
                                            <div className="invalid-feedback">
                                                Code Postal nécessaire.
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <span>{ this.state. d_city.name }</span>
                                            {/* { this.state. d_city.name } */}
                                        </div>
                                </div>
                            </div>

                            {/* Billing address */}
                            <hr className="mb-4"/>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <h4 className="mb-3">Adresse de facturation</h4>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="custom-control custom-checkbox custom-checkbox-primary">
                                        <input id="billingAddress-checkbox" type="checkbox" className="custom-control-input" onClick={ this.handleBillingAddress } />
                                        <span className="custom-control-indicator"></span>
                                        <span className="custom-control-description">Identique à adresse de livraison</span>
                                    </label>
                                </div>

                                { this.state.identicalBillingAddress === true ? <p></p> : 
                                    (<span>
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="address">Adresse</label>
                                                <input type="text" className="form-control" id="address" value={ this.state.b_address } required="" />
                                                <div className="invalid-feedback">
                                                    Merci de saisir une adresse de livraison.
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="complément">Complement d'adresse</label>
                                                <input type="textarea" className="form-control" id="complément" value={ this.state.b_address2 } required="" placeholder="Appt, Immeuble, Digicode, etc" />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="zip">CP</label>
                                                <input type="text" className="form-control" id="zip" value={ this.state.b_zipCode } required="" />
                                                <div className="invalid-feedback">
                                                    Code Postal nécessaire.
                                                </div>
                                            </div>
                                        </div>
                                    </span>)
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    error: state.error
  });
  
  export default connect( mapStateToProps, { login, clearErrors })(Profile);