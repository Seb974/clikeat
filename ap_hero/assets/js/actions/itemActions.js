import axios from 'axios';
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING, INCREASE_PRODUCT_STOCK, DECREASE_PRODUCT_STOCK } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import userExtractor from '../helpers/userExtractor';
import store from '../store';

export const getItems = () => dispatch => {
  let storedCart = localStorage.getItem('cart') || {};
  if (Object.keys(storedCart).length > 0) {
    storedCart = JSON.parse(storedCart);
    dispatch({
      type: GET_ITEMS,
      payload: storedCart
    })
  } else {
    const storedToken = localStorage.getItem('token') || "";
    const currentUserCart = storedToken !== "" ? (userExtractor(storedToken).cart || [] ) : [];
    dispatch({
        type: GET_ITEMS,
        payload: currentUserCart,
    });
  }
};

export const addItem = item => (dispatch, getState) => {
  const config = { headers: { 'Content-Type': 'application/json' } };
  const body = JSON.stringify( { action: DECREASE_PRODUCT_STOCK, id: item.variant.id, quantity: item.quantity } )
    dispatch({
        type: ADD_ITEM,
        payload: {
            product: item.variant, 
            quantity: item.quantity,
            isPaid: false,
            parent: item.product,
        },
    });
    dispatch({
      type: DECREASE_PRODUCT_STOCK,
      payload: {
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
      }
    });
    axios.post('/app/ping', body, config)
         .catch(err => {
          dispatch(
            returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')       
          )
          });
};

export const deleteItem = item => (dispatch, getState) => {
  dispatch({
    type: DELETE_ITEM,
    payload: item
  });
  dispatch({
    type: INCREASE_PRODUCT_STOCK,
    payload: {
      product: item.parent, 
      variant: item.product,
      quantity: item.quantity,
    }
  })

  // axios
  //   .delete(`/api/items/${id}`, tokenConfig(getState))
  //   .then(res =>
  //     dispatch({
  //       type: DELETE_ITEM,
  //       payload: id
  //     })
  //   )
  //   .catch(err =>
  //     dispatch(returnErrors(err.response.data, err.response.status))
  //   );
};

export const setItemsLoading = () => {
  return {
    type: ITEMS_LOADING
  };
};