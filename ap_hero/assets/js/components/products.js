import React from 'react';
// import Product from './product';
// import VariantAction from './variant';

import { connect } from 'react-redux';
import { getProducts } from '../actions/productActions';
import PropTypes from 'prop-types';

import { addItem } from '../actions/itemActions';

class Products extends React.Component 
{
    static propTypes = {
        getProducts: PropTypes.func.isRequired,
        addItem: PropTypes.func.isRequired,
        product: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool
      };
    
    componentDidMount() {
        this.props.getProducts();
    }

    handleClick = (product, variant) => {
        const newItem = { product: product, variant: variant, quantity: 1 };
        this.props.addItem(newItem);
    };

    // displayVariants = (product) => {
    //     let Variant = (props) => {
    //         return (
    //             <span>
    //                 <li key={props.details.id}>
    //                     <i className="fas fa-dolly"></i> 
    //                     {" "} {props.details.stock.quantity} {" "}
    //                     {/* <VariantAction details={props.details} product={product}/> */}
    //                     <button className="btn btn-primary btn-sm" onClick={() => this.handleClick(product, props.details)} id={props.details.id}>
    //                         <i className="fas fa-shopping-cart"></i>
    //                         {props.details.name}  à {props.details.price}€
    //                     </button>
    //                 </li>
    //             </span>
    //           );
    //         }
    //     return product.variants.map(variant => {
    //         return (
    //             <span>
    //                 <hr/>
    //                 <Variant details={variant} product={product}/>
    //             </span>
    //         )
    //     });
    // }

    // displayProducts = () => {
    //     let Product = (props) => {
    //       return (
    //         <div className="col-12 col-sm-6 col-md-4 react-product">
    //             <div className="card card-lg">
    //                 <div className="card-img">
    //                     <a href="{{ path('product_show', { id: product.id }) }}">
    //                         { 
    //                             (props.details.picture !== null && props.details.picture !== "") ? <img src={ 'uploads/pictures/' + props.details.picture.b64 } className="card-img-top" alt={ props.details.picture.b64 }/> : ""
    //                         }
    //                     </a>
    //                 </div>
    //                 <div className="card-block">
    //                     <ul>
    //                         <li key={props.details.id}>
    //                             <a href="{{ path('product_show', { id: product.id }) }}">
    //                                 { props.details.name }
    //                                 <br/>
    //                                 <i className="fas fa-truck"></i>
    //                                 { props.details.supplier.preparationPeriod }mn @
    //                                 { props.details.supplier.name }
    //                             </a>
    //                         </li>
    //                     </ul>
    //                     <ul>
    //                         { props.details.variants.map(variant => {
    //                             return (
    //                                 <span>
    //                                     <hr/>
    //                                     <li key={variant.id}>
    //                                         <i className="fas fa-dolly"></i> 
    //                                         {" "} {variant.stock.quantity} {" "}
    //                                         <button className="btn btn-primary btn-sm" onClick={() => this.handleClick(props.details, variant)} id={variant.id}>
    //                                             <i className="fas fa-shopping-cart"></i>
    //                                             {variant.name}  à {variant.price}€
    //                                         </button>
    //                                     </li>
    //                                 </span>
    //                             )
    //                         }) }
    //                     </ul>
    //                 </div>
    //             </div>
    //         </div>
    //       );
    //     }
    //     return this.props.product.products.map(product => {
    //         return <Product details={product} />
    //     });
    // }

    render() {
        // const products = this.props.product.products;
        return (
            <div id="content-wrap">
                <div className="product-wrapper">
                    <section className="p-t-30" id="react-product-list">
                        <div className="container">
                            <div className="row">

                                { this.props.product.products.map(product => {
                                    return (
                                    <div className="col-12 col-sm-6 col-md-4 react-product">
                                        <div className="card card-lg">
                                            <div className="card-img">
                                                <a href="{{ path('product_show', { id: product.id }) }}">
                                                    { 
                                                        (product.picture !== null && product.picture !== "") ? 
                                                            <img src={ 'uploads/pictures/' + product.picture.b64 } className="card-img-top" alt={ product.picture.b64 }/> 
                                                            : ""
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

                                                <ul>
                                                    { product.variants.map(variant => {
                                                        return (
                                                            <span>
                                                                <hr/>
                                                                <li key={variant.id}>
                                                                    <i className="fas fa-dolly"></i> 
                                                                    {" "} {variant.stock.quantity} {" "}
                                                                    <button className="btn btn-primary btn-sm" onClick={() => this.handleClick(product, variant)} id={variant.id}>
                                                                        <i className="fas fa-shopping-cart"></i>
                                                                        {variant.name}  à {variant.price}€
                                                                    </button>
                                                                </li>
                                                            </span>
                                                        )
                                                    }) }
                                                </ul>

                                            </div>
                                        </div>
                                    </div>)
                                }) }

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
    { getProducts, addItem }
  )(Products);
