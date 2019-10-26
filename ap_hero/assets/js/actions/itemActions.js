import axios from 'axios';
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING, INCREASE_PRODUCT_STOCK, DECREASE_PRODUCT_STOCK } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import userExtractor from '../helpers/userExtractor';

export const getItems = () => dispatch => {

    const storedToken = localStorage.getItem('token') || "";
    const currentUserCart = storedToken !== "" ? (userExtractor(storedToken).cart || [] ) : [];
    dispatch({
        type: GET_ITEMS,
        payload: currentUserCart,
    });
};

export const addItem = item => (dispatch, getState) => {
    dispatch({
        type: ADD_ITEM,
        payload: {
            product: item.variant, 
            quantity: item.quantity,
            isPaid: false,
            parent: item.product,
        },
    });
    alert("passage dans addItem de itemActions");
    dispatch({
      type: DECREASE_PRODUCT_STOCK,
      payload: {
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
      }
    })
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