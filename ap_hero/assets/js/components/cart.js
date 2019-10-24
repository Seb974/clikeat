import React from 'react';
import ReactDOM from 'react-dom';
import CartItem from './cartItem';

export default class Cart extends React.Component 
{
    state = {
        items: this.props.items || [],
        total: this.props.total || 0
    };

    render() {
        return (
            <span>

                <h5 className="dropdown-header mb-0">
                    <i className="fas fa-shopping-cart"></i>
                    Panier
                </h5>

                <div className="dropdown-block">

                    <ul className="dropdown-list">
                        { this.state.items.map(item => {
                            <CartItem details={item}/>
                        })}
                        
                    </ul>

                    <div className="d-flex border-bottom mb-2 px-3 py-2">Total:
                        <span className="ml-auto font-weight-bold text-success">{ this.props.total }€</span>
                    </div>

                    <div className="d-flex px-3">
                        <button className="btn btn-outline btn-sm" >Editer quantité</button>
                        <button className="btn btn-success btn-sm ml-auto" >Payer</button>
                    </div>

                </div>

            </span>
            );
    }
}

// ReactDOM.render(<Cart/>, document.getElementById('cart-summary'));