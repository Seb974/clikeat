import axios from 'axios';
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from './types';
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
};

export const deleteItem = item => (dispatch, getState) => {
  dispatch({
    type: DELETE_ITEM,
    payload: item
});
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