import React, { Component } from 'react';
import axios from 'axios';
import Cart from './cart';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import PropTypes from 'prop-types';
import { tokenConfig } from '../helpers/security';

class Checkout extends Component {

    state = {
        user: this.props.user || {},
        username: this.props.user === null ? '' : this.props.user.username || '',
        email: this.props.user === null ? '' : this.props.user.email || '',
        phone: this.props.user === null ? '' : typeof this.props.user.metadata.find(metadata => (metadata.type === 'phone_number')) === 'undefined' ? 
                '' : this.props.user.metadata.find(metadata => (metadata.type === 'phone_number')).field || '',
        d_address: this.props.user === null ? '' : typeof this.props.user.metadata.find(metadata => (metadata.type === 'delivery_line_1')) === 'undefined' ?
                '' : this.props.user.metadata.find(metadata => (metadata.type === 'delivery_line_1')).field || '',
        d_address2: this.props.user === null ? '' : typeof this.props.user.metadata.find(metadata => (metadata.type === 'delivery_line_2')) === 'undefined' ?
                '' : this.props.user.metadata.find(metadata => (metadata.type === 'delivery_line_2')).field || '',
        d_zipCode: this.props.user === null ? '' : typeof this.props.user.metadata.find(metadata => (metadata.type === 'delivery_city')) === 'undefined' ? 
                '' : this.props.user.metadata.find(metadata => (metadata.type === 'delivery_city')).field || '',
        b_address: this.props.user === null ? '' : typeof this.props.user.metadata.find(metadata => (metadata.type === 'billing_line_1')) === 'undefined' ?
                '' : this.props.user.metadata.find(metadata => (metadata.type === 'billing_line_1')).field || '',
        b_address2: this.props.user === null ? '' : typeof this.props.user.metadata.find(metadata => (metadata.type === 'billing_line_2')) === 'undefined' ?
                '' : this.props.user.metadata.find(metadata => (metadata.type === 'billing_line_2')).field || '',
        b_zipCode: this.props.user === null ? '' : typeof this.props.user.metadata.find(metadata => (metadata.type === 'billing_city')) === 'undefined' ? 
                '' : this.props.user.metadata.find(metadata => (metadata.type === 'billing_city')).field || '',
        d_gps: this.props.user === null ? '-21.329519,55.471617' : typeof this.props.user.metadata.find(metadata => (metadata.type === 'delivery_gps')) === 'undefined' ?
                '-21.329519,55.471617' : this.props.user.metadata.find(metadata => (metadata.type === 'delivery_gps')).field || '-21.329519,55.471617',
        identicalBillingAddress: true,
        d_city: '',
        b_city: '',
        cities: []
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object,
    };

    componentDidMount = () => {
        this.initMap();
        if (this.state.b_address === this.state.d_address && this.state.b_address2 === this.state.d_address2 && this.state.b_zipCode === this.state.d_zipCode )
            this.setState( { identicalBillingAddress: true } );
        else 
            this.setState( { identicalBillingAddress: false } );

        axios.get('/api/cities', tokenConfig())
             .then((res) => {
                this.setState({ cities : res.data['hydra:member'] });
                if (this.props.user !== null) {
                    if (this.props.user.metadata.length > 0) {
                        let user_d_city = this.props.user.metadata.find(meta => meta.type === 'delivery_city');
                        let user_b_city = this.props.user.metadata.find(meta => meta.type === 'billing_city');
                        let d_city = (typeof user_d_city !== 'undefined') ? res.data['hydra:member'].find(city => city.zipCode === parseInt(user_d_city.field)) : '';
                        let b_city = (user_b_city === user_d_city) ? d_city : ((typeof user_b_city !== 'undefined') ? res.data['hydra:member'].find(city => city.zipCode === parseInt(user_b_city.field)) : '');
                        this.setState({
                            d_city: d_city,
                            b_city: b_city,
                        });
                    }
                }
             });
    }

    initMap = () => {
        let markers = [];
        let [lat, long] = this.state.d_gps.split(',');
        let placesAutocomplete = places( {
            appId     : process.env.ALGOLIA_APPID,
            apiKey    : process.env.ALGOLIA_APIKEY,
            container : document.querySelector( '#input-map' ),
        } ).configure( {
            countries         : ['fr'],
            useDeviceLocation : false
        } );

        let map = L.map( 'map-example-container', {
            scrollWheelZoom : true,
            zoomControl     : true
        } );

        let osmLayer = new L.TileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom     : 8,
            maxZoom     : 19,
            attribution : 'Map © <a href="https://openstreetmap.org">OpenStreetMap</a>'
        } );

        let userAddress = new L.LatLng( lat, long);
        map.setView( userAddress, 1 );
        map.addLayer( osmLayer );
        let marker = L.marker( userAddress, {opacity: .4} );
        marker.addTo( map );
        markers.push( marker );
        if (this.state.d_gps !== '-21.329519,55.471617') {
            findBestZoom();
        }

        placesAutocomplete.on( 'suggestions'  , handleOnSuggestions.bind(this));
        placesAutocomplete.on( 'cursorchanged', handleOnCursorchanged.bind(this));
        placesAutocomplete.on( 'change'       , handleOnChange.bind(this));
        placesAutocomplete.on( 'clear'        , handleOnClear.bind(this));

        function handleOnSuggestions( e ) {
            markers.forEach( removeMarker );
            markers = [];
            if ( e.suggestions.length === 0 ) {
                map.setView( new L.LatLng( 0, 0 ), 1 );
                return;
            }
            e.suggestions.forEach( addMarker );
            findBestZoom();
        }
    
        function handleOnChange( e ) {
            markers.forEach( function ( marker, markerIndex ) {
                if ( markerIndex === e.suggestionIndex ) {
                    markers = [marker];
                    marker.setOpacity( 1 );
                    findBestZoom();
                } else {
                    removeMarker( marker );
                }
            } );
            this.setState({
                d_address: e.suggestion.value,
                d_gps: e.suggestion.latlng.lat + ',' + e.suggestion.latlng.lng,
            });
        }
    
        function handleOnClear() {
            map.setView( new L.LatLng( 0, 0 ), 1 );
            markers.forEach( removeMarker );
        }
    
        function handleOnCursorchanged( e ) {
            markers.forEach( function ( marker, markerIndex ) {
                if ( markerIndex === e.suggestionIndex ) {
                    marker.setOpacity( 1 );
                    marker.setZIndexOffset( 1000 );
                } else {
                    marker.setZIndexOffset( 0 );
                    marker.setOpacity( 0.5 );
                }
            } );
        }
    
        function addMarker( suggestion ) {
            let marker = L.marker( suggestion.latlng, {
                opacity: .4
            } );
            marker.addTo( map );
            markers.push( marker );
        }
    
        function removeMarker( marker ) {
            map.removeLayer( marker );
        }
    
        function findBestZoom() {
            let featureGroup = L.featureGroup( markers );
            map.fitBounds( featureGroup.getBounds().pad( 0.5 ), {
                animate: false
            } );
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onZipCodeChange = e => {
        this.setState({ [e.target.name]: e.target.value });
        const errorMsg = "Code postal invalide.";
        const notDeliverableMsg = "Nous ne livrons malheureusement pas encore votre ville...";
        let cityId = e.target.id === 'b_zip' ? 'b_city' : 'd_city';
        let cityInput = document.getElementById(cityId);
        if ( (e.target.value.length > 0 && e.target.value.length < 5) || e.target.value.length <= 0 || e.target.value.length > 5 ) {
            cityInput.textContent = e.target.value.length !== 0 ? errorMsg : '';
            return ;
        }
        const selectedCity = this.state.cities.find(city => city.zipCode === parseInt(e.target.value));
        cityInput.textContent = (typeof selectedCity === 'undefined') ? errorMsg : ((cityId === 'd_city' && selectedCity.isDeliverable === false) ? notDeliverableMsg : selectedCity.name);
    };

    handleBillingAddress = (e) => {
        this.setState({
            identicalBillingAddress: !this.state.identicalBillingAddress,
          });
    };

    onSubmit = e => {
        e.preventDefault();
        let userDetails = { 
            ...this.state,
            b_address: this.state.identicalBillingAddress === false ? this.state.b_address : this.state.d_address,
            b_address2: this.state.identicalBillingAddress === false ? this.state.b_address2 : this.state.d_address2,
            b_zipCode: this.state.identicalBillingAddress === false ? this.state.b_zipCode : this.state.d_zipCode,
            b_city: this.state.identicalBillingAddress === false ? this.state.b_city : this.state.d_city,
            cities: [],
        };
        // this.props.updateUser(userDetails);
    }

    displayItems = () => {
        let CartItem = (props) => {
          return (
            <li className="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                    <h6 className="my-0">
                        <strong>{ props.details.parent.name + " "}
                        { props.details.product.name }</strong>
                        {"    x" + props.details.quantity }
                    </h6>
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
        const { item } = this.props;
        return (
            <div className="container mt-3">
                <div className="row">
                    {/* Right Panel Block */}
                    <div className="col-md-4 order-md-2 mb-4">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Votre panier</span>
                            <span className="badge badge-secondary badge-pill">
                                { item.items.reduce((cumul, current) => {
                                    return current.quantity == null ? cumul : cumul + current.quantity;
                                    }, 0) + " articles"
                                }
                            </span>
                        </h4>
                        <ul className="list-group mb-3">

                            { this.displayItems() }

                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (HT)</span>
                                <strong>{  Math.round(item.totalTax * 100) / 100 }€</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>TVA</span>
                                <strong>{ Math.round(item.totalToPayHT * 100) / 100 }€</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (TTC)</span>
                                <strong>{ Math.round(item.totalToPayTTC * 100) / 100 }€</strong>
                            </li>
                            <a href="{ payment_url }">
                                <button className="btn btn-primary btn-lg btn-block" type="submit">PAYER</button>
                            </a>
                        </ul>
                    </div>

                    {/* Addresses panel */}
                    <div className="col-md-8 order-md-1" id="adresses-panel">
                        <form className="needs-validation" onSubmit={ this.onSubmit }>
                            <div className="row">
                                <div className="row">
                                    {/* <div className="col-md-4 mb-3"></div> */}
                                    
                                        {/* User info */}
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="firstName">Nom</label>
                                            <input type="text" className="form-control" id="firstName" name="username" value={ this.state.username } onChange={ this.onChange } required/>     {/* style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;" /> */}
                                            <div className="invalid-feedback">
                                                Un prénom est nécessaire pour la livraison.
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="email">Email</label>
                                            <input type="email" className="form-control" id="email" name="email" value={ this.state.email } onChange={ this.onChange } required/>
                                            <div className="invalid-feedback">
                                                Merci de renseigner un email afin d'être informé de étapes de votre commande.
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="phone">Tel</label>
                                            <input type="text" className="form-control" id="phone" name="phone" value={ this.state.phone } onChange={ this.onChange } required/>
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
                                        <div className="col-md-12">
                                            <div id="map-example-container">
                                                {/* <Map/> */}
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="input-map">Adresse</label>
                                            <input type="text" className="form-control" id="input-map" name="d_address" value={ this.state.d_address } onChange={ this.onChange } required />
                                            <div className="invalid-feedback">
                                                Merci de saisir une adresse de livraison.
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="complément">Complement d'adresse</label>
                                            <input type="textarea" className="form-control" id="complément" name="d_address2" value={ this.state.d_address2 } placeholder="Appt, Immeuble, Digicode, etc" onChange={ this.onChange } />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="zip">CP</label>
                                            <input type="text" className="form-control" id="d_zip" name="d_zipCode"  value={ this.state.d_zipCode } onChange={ this.onZipCodeChange } required/>
                                            <div className="invalid-feedback">
                                                Code Postal nécessaire.
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <span id="d_city">{ this.state. d_city.name }</span>
                                            {/* { this.state. d_city.name } */}
                                        </div>
                                        <div className="col-md-2 mt-3">
                                            <small>
                                                <label htmlFor="complément">GPS</label>
                                                <input type="hidden" className="form-control" id="gps" name="d_gps" value={ this.state.d_gps } placeholder="" onChange={ this.onChange } />
                                            </small>
                                        </div>
                                </div>
                            </div>
                    {/* <div className="col-md-8 order-md-1" id="adresses-panel">
                        <form className="needs-validation">
                            <div className="row">

                                {/* User info 
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="firstName">Nom</label>
                                    <input type="text" className="form-control" id="firstName" value={ this.props.isauthenticated === false ? "" : user.username } required=""/>     {/* style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;" /> 
                                    <div className="invalid-feedback">
                                        Un prénom est nécessaire pour la livraison.
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" className="form-control" id="email" value={ this.props.isauthenticated === false ? "" : user.email }/>
                                    <div className="invalid-feedback">
                                        Merci de renseigner un email afin d'être informé de étapes de votre commande.
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="phone">Tel</label>
                                    <input type="text" className="form-control" id="phone" value={ this.props.isauthenticated === false ? "" : (typeof user.metadata.phone !== 'undefined' ? user.metadata.phone.field : "") }/>
                                    <div className="invalid-feedback">
                                        Merci de renseigner un tel afin d'être informé de étapes de votre commande.
                                    </div>
                                </div>
                            </div>

                            {/* Delivery address panel 
                            <hr className="mb-4"/>
                            <h4 className="mb-3">Adresse de livraison</h4>

                            <div className="row">
                                <div className="col-md-12">
                                    <div id="map-example-container"></div>
                                </div>

                                <div className="col-md-5 mt-3">
                                    <label htmlFor="input-map">Rue</label>
                                    <input type="search" id="input-map" className="form-control" placeholder="Saisir nom d'une rue :"/>
                                </div>

                                <div className="col-md-5 mt-3">
                                    <label htmlFor="complément">Complement d'adresse</label>
                                    <input type="textarea" className="form-control" id="complément" value="" required="" placeholder="Appt, Immeuble, Digicode, etc" />
                                </div>

                                <div className="col-md-2 mt-3">
                                    <small>
                                        <label htmlFor="complément">GPS</label>
                                        <input type="input" className="form-control" id="gps" value="" required="" placeholder="" />
                                    </small>
                                </div>
                            </div> */}

                            {/* Billing address */}
                            {/* <hr className="mb-4"/>
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
                                        <label htmlFor="address">Adresse</label>
                                        <input type="text" className="form-control" id="address" value={ !this.props.isauthenticated ? "" : user.metadata.billing1.field } required="" />
                                        <div className="invalid-feedback">
                                            Merci de saisir une adresse de livraison.
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="zip">CP</label>
                                        <input type="text" className="form-control" id="zip" value={ !this.props.isauthenticated ? "" : user.metadata.billing_city.zipCode } required="" />
                                        <div className="invalid-feedback">
                                            Code Postal nécessaire.
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="address2">Adresse 2
                                            <span className="text-muted">(Optionel)</span>
                                        </label>
                                        <input type="text" className="form-control" id="address2" value={ !this.props.isauthenticated ? "" : user.metadata.billing2.field } />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="billing_city">CP</label>
                                        <input type="text" className="form-control" id="billing_city" value={ !this.props.isauthenticated ? "" : user.metadata.billing_city.name } required="" />
                                        <div className="invalid-feedback">
                                            Code Postal nécessaire.
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <hr className="mb-4"/>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <h4 className="mb-3">Adresse de facturation</h4>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="custom-control custom-checkbox custom-checkbox-primary">
                                        <input id="billingAddress-checkbox" type="checkbox" className="custom-control-input" checked={this.state.identicalBillingAddress} onChange={ this.handleBillingAddress } />
                                        <span className="custom-control-indicator"></span>
                                        <span className="custom-control-description">Identique à adresse de livraison</span>
                                    </label>
                                </div>

                                { this.state.identicalBillingAddress === true ? <p></p> : 
                                    (<span>
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="address">Adresse</label>
                                                <input type="text" className="form-control" id="address" name="b_address" value={ this.state.identicalBillingAddress === false ? this.state.b_address : this.state.d_address } onChange={ this.onChange } />
                                                <div className="invalid-feedback">
                                                    Merci de saisir une adresse de livraison.
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="complément">Complement d'adresse</label>
                                                <input type="textarea" className="form-control" id="complément" name="b_address2" value={ this.state.identicalBillingAddress === false ? this.state.b_address2 : this.state.d_address2 } onChange={ this.onChange } placeholder="Appt, Immeuble, etc" />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="zip">CP</label>
                                                <input type="text" className="form-control" id="b_zip" name="b_zipCode" value={ this.state.identicalBillingAddress === false ? this.state.b_zipCode : this.state.d_zipCode } onChange={ this.onZipCodeChange } />
                                                <div className="invalid-feedback">
                                                    Code Postal nécessaire.
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <span id="b_city">{ this.state.b_city.name }</span>
                                                {/* { this.state. d_city.name } */}
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
    item: state.item,
    user: state.auth.user,
  });
  
export default connect( mapStateToProps )(Checkout);