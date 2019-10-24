import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Product from './product';

export default class Products extends React.Component 
{
    state = {
        products: [],
    };

    componentDidMount = () => {
        axios.get('http://localhost:8000/api_index')
            .then(response => {
                this.setState({ products: response.data })
                })
            .catch((err) => console.log(err));
    }

    render() {
        const products = this.state.products;
        return (
            <div id="content-wrap">
                <div className="product-wrapper">
                    <section className="p-t-30" id="react-product-list">
                        <div className="container">
                            <div className="row">
                                    {products.map(product => {
                                        return (
                                            <Product details={product}/>
                                        )
                                    })}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

// ReactDOM.render(<Products/>, document.getElementById("react-product-list"));
