import React from 'react';
import { connect } from 'react-redux';
import { getItems, addItem, deleteItem, updateItem } from '../actions/itemActions';
import PropTypes from 'prop-types';

class CartList extends React.Component 
{
    state = {
      quantities: '',
    };

    static propTypes = {
        getItems: PropTypes.func.isRequired,
        addItem: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired,
        updateItem: PropTypes.func.isRequired,
        item: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool
      };
    
    componentDidMount() {
        
        this.props.getItems();

      }
    
    onDeleteClick = item => {
        this.props.deleteItem(item);
    };

    handleUpdateQty = (itemUpdated, event) => {

        console.log(event.currentTarget.value);
        itemUpdated.quantity = parseInt(event.currentTarget.value);
        console.log(itemUpdated);
        this.props.updateItem(itemUpdated);

        // this.props.item.items.forEach(item => {
        //     return item.product.id !== itemUpdated.product.id ? 
        //                 item : 
        //                 {...item, quantity: event.currentTarget.value} ;
        // });
        // item.quantity +=1;
    }

    displayItems = () => {
      let CartItem = (props) => {
          return (
              <span>
                  <hr/>
                  <ul className="d-flex flex-row-reverse">
                   <li key={"cartitem-item-" + props.details.product.id} >    {/* className="d-flex flex-row ml-auto" */}
                    <span>{ props.details.parent.name } { props.details.product.name } </span>
                      {/* <a href="#">
                          x{ props.details.quantity } { props.details.parent.name } { props.details.product.name } | { props.details.product.price * props.details.quantity }€
                      </a> */}
                      <input name="Bois2Lo" type="number" value={props.details.quantity} onChange={(event) => this.handleUpdateQty(props.details, event)} min="1" max={props.details.product.stock.quantity}/>
                      <button className="btn btn-link" onClick={() => this.onDeleteClick(props.details)}><i className="fa fa-trash"></i></button> 

                      {props.details.product.stock.quantity > 5 ? "" : 
                          (<span className="badge badge-cart">
                              { "Plus que " + props.details.product.stock.quantity + " en stock !"}
                          </span>)
                      }
                      </li>
                  </ul>
              </span>
          );
      }
      return this.props.item.items.map(item => {
          return (
            <span key={"cartitem-span-" + item.product.id} >
                <CartItem key={"cartitem-" + item.product.id} details={item} />
                <hr/> 
            </span>
          );
      });
    };

    render() {
        return (
            <section className="p-t-30">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="post">
                            <div className="post-header">
                                <h2 className="post-title"><i className="fas fa-shopping-cart"></i> Panier</h2>
                                {/* 
                                UTILISABLE POUR DISPLAY UN TEMPS APPROXIMATIF DE LIVRAISON
                                <div className="post-meta">
                                    <span>
                                        <i className="fas fa-utensils"></i>
                                        { product.category ? product.category.name : "" }
                                    </span>
                                    <p>{ this.displayAllergens(product) }</p>
                                </div> */}
                            </div>
                            <div className="post-thumbnail">
                                { this.displayItems() }
                                {/*   { (!product.picture || product.picture === "" ) ? "" :
                                      <div className="embed-responsive embed-responsive-16by9">
                                          <img className="embed-responsive-item" src={ '../uploads/pictures/' + product.picture.b64 } alt={ product.picture.b64 }/>
                                      </div>
                                  }*/}
                            </div> 
                            
                            <div>
                                <button className="btn btn-success btn-sm ml-auto" >Payer</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="sidebar">
                            <div className="d-flex border-bottom">Total HT:
                                <span className="ml-auto">{ Math.round(this.props.item.totalToPayHT * 100)/100 }€</span>
                            </div>
                            <div className="d-flex border-bottom">TVA:
                                <span className="ml-auto">{ Math.round(this.props.item.totalTax * 100)/100 }€</span>
                            </div>
                            <div className="d-flex border-bottom">Total TTC:
                                <span className="ml-auto font-weight-bold text-success">{ Math.round(this.props.item.totalToPayTTC *100)/100 }€</span>
                            </div>
                            {/* { this.displayNutritionals(product) } */}

                            {/* {% if is_granted('ROLE_ADMIN') %}
                            <ul class="d-flex flex-row">
                                <button class="btn btn-secondary btn-sm">
                                    <a href="{{ path('product_edit', {'id': product.id}) }}">edit</a>
                                </button>
                                {{ include('product/_delete_form.html.twig') }}
                            </ul>
                            {% endif %} */}

                        </div>
                    </div>
                </div>
            </div>
            </section>




        );
    }
}

const mapStateToProps = state => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated
  });
  
  export default connect(
    mapStateToProps,
    { getItems, addItem, deleteItem, updateItem }
  )(CartList);