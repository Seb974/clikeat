import axios from 'axios';
import { GET_PRODUCTS, ADD_PRODUCT, DELETE_PRODUCT, PRODUCTS_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getProducts = () => dispatch => {
  dispatch(setProductsLoading());
  axios
    .get('/api_index')
    .then((res) => {
        console.log(res.data);
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

// export const increaseProductStock = (product, quantity) => (dispatch, getState) => {
//   dispatch({
//     type: INCREASE_PRODUCT_STOCK,
//     payload: {
//       product: product, 
//       quantity: quantity,
//     }
//   })
// //   axios
// //     .post('/api/products', product, tokenConfig(getState))
// //     .then(res =>
// //       dispatch({
// //         type: ADD_PRODUCT,
// //         payload: res.data
// //       })
// //     )
// //     .catch(err =>
// //       dispatch(returnErrors(err.response.data, err.response.status))
// //     );
// };

// export const decreaseProductStock = (product, quantity) => (dispatch, getState) => {
//   dispatch({
//     type: DECREASE_PRODUCT_STOCK,
//     payload: {
//       product: product, 
//       quantity: quantity,
//     }
//   })
// //   axios
// //     .delete(`/api/products/${id}`, tokenConfig(getState))
// //     .then(res =>
// //       dispatch({
// //         type: DELETE_PRODUCT,
// //         payload: id
// //       })
// //     )
// //     .catch(err =>
// //       dispatch(returnErrors(err.response.data, err.response.status))
// //     );
// };

export const setProductsLoading = () => {
  return {
    type: PRODUCTS_LOADING
  };
};