import axios from 'axios';
import { GET_PRODUCTS, ADD_PRODUCT, DELETE_PRODUCT, PRODUCTS_LOADING, GET_PRODUCT } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import productReducer from '../reducers/productReducer';

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

export const getProduct = id => dispatch => {

  let storedProducts = localStorage.getItem('products') || "";
  if (storedProducts !== "") {
    storedProducts = JSON.parse(storedProducts);
    for(let i = 0; i < storedProducts.length; i++) {
      if (storedProducts[i].id == id) {
          dispatch({
            type: GET_PRODUCT,
            payload: storedProducts[i]
          })
          break;
      }
    }
  } else {
    dispatch(setProductsLoading());
    axios
      .get('/product/api/' + id)
      .then((res) => {
        dispatch({
          type: GET_PRODUCT,
          payload: res.data
        })
      })
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  }
};

export const setProductsLoading = () => {
  return {
    type: PRODUCTS_LOADING
  };
};