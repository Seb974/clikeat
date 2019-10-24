import React from 'react';
import Product from './product';
import { connect } from 'react-redux';
import { getProducts } from '../actions/productActions';
import PropTypes from 'prop-types';

class Products extends React.Component 
{
    static propTypes = {
        getProducts: PropTypes.func.isRequired,
        product: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool
      };
    
      componentDidMount() {
        this.props.getProducts();
      }

    render() {
        const products = this.props.product.products;
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

const mapStateToProps = state => ({
    product: state.product,
    isAuthenticated: state.auth.isAuthenticated
  });
  
  export default connect(
    mapStateToProps,
    { getProducts }
  )(Products);
