import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { getItems, deleteItem } from '../actions/itemActions';
import PropTypes from 'prop-types';

class Cart extends React.Component 
{
    state = {
         total: 0
    };

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

    displayItems = () => {
      let CartItem = (props) => {
        return (
          <li className="d-flex flex-row ml-auto">
              <a href="#" className="d-flex flex-row ml-auto">
                  x{ props.details.quantity } { props.details.parent.name } { props.details.product.name } | { props.details.product.price * props.details.quantity }€
              </a>
              <button className="btn btn-link"><i className="fa fa-trash"></i></button> 
          </li>
        );
      }
      return this.props.item.items.map(item => {
          return <CartItem details={item} />
      });
    }

    render() {
        return (
            <span>
                <h5 className="dropdown-header mb-0">
                    <i className="fas fa-shopping-cart"></i>
                    Panier
                </h5>

                <div className="dropdown-block">

                    <ul className="dropdown-list">
                        { this.displayItems() }
                    </ul>

                    <div className="d-flex border-bottom mb-2 px-3 py-2">Total:
                        <span className="ml-auto font-weight-bold text-success">{ this.props.item.totalToPayTTC }€</span>
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

const mapStateToProps = state => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated
  });
  
  export default connect(
    mapStateToProps,
    { getItems, deleteItem }
  )(Cart);

// ReactDOM.render(<Cart/>, document.getElementById('cart-summary'));