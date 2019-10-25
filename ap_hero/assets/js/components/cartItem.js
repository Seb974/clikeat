import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { getItems, deleteItem } from '../actions/itemActions';
import PropTypes from 'prop-types';
class CartItem extends React.Component 
{
    state = {
        // productName: this.props.productName || "",
        // variantName: this.props.variantName || "",
        quantity: 1,
        price: 0
    };

    // Début
    static propTypes = {
        getItems: PropTypes.func.isRequired,
        item: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool
      };
    
      componentDidMount() {
        this.props.getItems();
      }
    
      onDeleteClick = id => {
        this.props.deleteItem(id);
      };

    render() {
        // const {productName, variantName, quantity, price} = this.props;
        const {quantity, price} = this.state;
        const item = this.props.details;

        return (
            <li className="d-flex flex-row ml-auto">
                <a href="#" className="d-flex flex-row ml-auto">
                    x{ quantity } { productName } { item.name } | { item.price }€
                </a>
                <button className="btn btn-link"><i className="fa fa-trash"></i></button>
            </li>
            );
    }
}

const mapStateToProps = state => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated
  });
  
  export default connect(
    mapStateToProps,
    { getItems, deleteItem }
  )(CartItem);

//ReactDOM.render(<CartItem/>, document.getElementById('cart-summary'));