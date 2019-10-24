import {
    GET_PRODUCTS,
    // ADD_PRODUCT,
    // DELETE_PRODUCT,
    // PRODUCTS_LOADING
  } from '../actions/types';
  
  const initialState = {
    products: [],
    loading: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_PRODUCTS:
        return {
          ...state,
          products: action.payload,
          loading: false
        };
    //   case DELETE_ITEM:
    //     return {
    //       ...state,
    //       items: state.items.filter(item => item._id !== action.payload)
    //     };
    //   case ADD_ITEM:
    //     return {
    //       ...state,
    //       items: [action.payload, ...state.items]
    //     };
    //   case ITEMS_LOADING:
    //     return {
    //       ...state,
    //       loading: true
    //     };
      default:
        return state;
    }
  }