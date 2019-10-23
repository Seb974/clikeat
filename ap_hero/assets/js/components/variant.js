console.log("Hello friends !");

import React from 'react';
import ReactDOM from 'react-dom';

export default class Variant extends React.Component 
{
    state = {
        variant: this.props.details || [],
        productName: this.props.product.name || "",
        
    };

    handleClick = (event) => {
        event.preventDefault();
        alert('Commande de ' + this.state.variant.name + " " + this.state.productName + " à " + this.state.variant.price + "€");

    }

    render() {
        const variant = this.state.variant;
        return (
            <li key={variant.id}>
                <i className="fas fa-dolly"></i> 
                {" "} {variant.stock.quantity} {" "}
                <button className="btn btn-primary btn-sm" onClick={this.handleClick}>
                    <i className="fas fa-shopping-cart"></i>
                    {variant.name}  à {variant.price}€
                </button>
            </li>
            );
    }
}