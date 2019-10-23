console.log("From product !");

import React from 'react';
import ReactDOM from 'react-dom';
import CartItem from './cartItem';
import Variant from './variant';

export default class Product extends React.Component 
{
    state = {
        product: this.props.details || [],
        total: this.props.total || 0
    };

    render() {
        const product = this.state.product;
        return (
            <div className="col-12 col-sm-6 col-md-4 react-product">
                <div className="card card-lg">
                    <div className="card-img">
                        <a href="{{ path('product_show', { id: product.id }) }}">
                            { 
                                (product.picture !== null && product.picture !== "") ? <img src={ 'uploads/pictures/' + product.picture.b64 } className="card-img-top" alt={ product.picture.b64 }/> : ""
                            }
                        </a>
                    </div>
                    <div className="card-block">
                        <ul>
                            <li key={product.id}>
                                <a href="{{ path('product_show', { id: product.id }) }}">
                                    { product.name }
                                    <br/>
                                    <i className="fas fa-truck"></i>
                                    { product.supplier.preparationPeriod }mn @
                                    { product.supplier.name }
                                </a>
                            </li>
                        </ul>

                        {product.variants.map(variant => {
                            return (
                                <span>
                                    <hr/>
                                    <Variant details={variant} product={product}/>
                                </span>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

// document.querySelectorAll("div.react-product").forEach( (div) => {
//     const name = div.dataset.name;
//     const stock = +div.dataset.stock;
//     const price = +div.dataset.price;
//     ReactDOM.render(<Product name={name} stock={stock} price={price}/>, div);
// });

// {# <img src="{{ asset('uploads/pictures/' ~ product.picture.b64) }}" className="card-img-top" alt="{{ product.picture.b64 }}"> #}</div>