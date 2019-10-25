import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { addItem } from '../actions/itemActions';
import PropTypes from 'prop-types';

class Variant extends React.Component 
{
    state = {
        variant: this.props.details || {},
        product: this.props.product || {},
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        addItem: PropTypes.func.isRequired,
    };
    
    handleClick = e => {
        e.preventDefault();
        const newItem = { product: this.state.product, variant: this.state.variant, quantity: 1 };
        this.props.addItem(newItem);
    };

    render() {
        const variant = this.state.variant;
        return (
            <li key={variant.id}>
                <i className="fas fa-dolly"></i> 
                {" "} {variant.stock.quantity} {" "}
                <button className="btn btn-primary btn-sm" onClick={this.handleClick} id={variant.id}>
                    <i className="fas fa-shopping-cart"></i>
                    {variant.name}  à {variant.price}€
                </button>
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
    { addItem }
  )(Variant);