import React from 'react';
import ReactDOM from 'react-dom';

export default class CartItem extends React.Component 
{
    state = {
        productName: this.props.productName || "",
        variantName: this.props.variantName || "",
        quantity: this.props.quantity || 0,
        price: this.props.price || 0
    };

    render() {
        const {productName, variantName, quantity, price} = this.props;
        return (
            <li className="d-flex flex-row ml-auto">
                <a href="#" className="d-flex flex-row ml-auto">
                    x{ quantity } { productName } { variantName } | { price }€
                </a>
                <button className="btn btn-link"><i className="fa fa-trash"></i></button>
            </li>
            );
    }
}

//ReactDOM.render(<CartItem/>, document.getElementById('cart-summary'));