import axios from 'axios';
import { GET_PRODUCTS, ADD_PRODUCT, DELETE_PRODUCT, PRODUCTS_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getProducts = () => dispatch => {
  dispatch(setProductsLoading());
  axios
    .get('/api_index')
    .then((res) => {
        dispatch({
          type: GET_PRODUCTS,
          payload: res.data
        })
    }
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const setProductsLoading = () => {
  return {
    type: PRODUCTS_LOADING
  };
};