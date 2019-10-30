import userExtractor from '../helpers/userExtractor';
import { getTotalTTC, getTotalTax, getTotalHT } from '../helpers/taxCalculator';
import {
    GET_ITEMS,
    ADD_ITEM,
    DELETE_ITEM,
    UPDATE_ITEM,
    ITEMS_LOADING
  } from '../actions/types';
  
  const initialState = {
    items: [],
    totalToPayTTC: 0,
    totalToPayHT: 0,
    totalTax: 0,
    loading: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_ITEMS:
        return {
          ...state,
          items: action.payload,
          totalToPayTTC: getTotalTTC(action.payload),
          totalTax: getTotalTax(action.payload),
          totalToPayHT: getTotalHT(action.payload),
          loading: false
        };
      case DELETE_ITEM:
        const reducedCart = state.items.filter(item => item !== action.payload);
        localStorage.setItem('cart', JSON.stringify(reducedCart));
        return {
          ...state,
          items: reducedCart,
          totalToPayTTC: getTotalTTC(reducedCart),
          totalTax: getTotalTax(reducedCart),
          totalToPayHT: getTotalHT(reducedCart)
        };
      case ADD_ITEM:
        state.items.forEach(element => {
          if (element.product.name == action.payload.product.name && element.parent.name == action.payload.parent.name ) {
            element.quantity += action.payload.quantity;
            action.payload.quantity = 0;
            return state;
          }
        })
        const enlargedCart = action.payload.quantity !== 0 ? [action.payload, ...state.items] : state.items;
        localStorage.setItem('cart', JSON.stringify(enlargedCart));
        return {
          ...state,
          items: enlargedCart,
          totalToPayTTC: getTotalTTC(enlargedCart),
          totalTax: getTotalTax(enlargedCart),
          totalToPayHT: getTotalHT(enlargedCart)
        };

      case UPDATE_ITEM:
          localStorage.setItem('cart', JSON.stringify(state.items));
          return {
            ...state,
            totalToPayTTC: getTotalTTC(state.items),
            totalTax: getTotalTax(state.items),
            totalToPayHT: getTotalHT(state.items)
          };

      case ITEMS_LOADING:
        return {
          ...state,
          loading: true
        };
      default:
        return state;
    }
  }