import userExtractor from '../helpers/userExtractor';
import { getTotalTTC, getTotalTax, getTotalHT } from '../helpers/taxCalculator';
import {
    GET_ITEMS,
    ADD_ITEM,
    DELETE_ITEM,
    ITEMS_LOADING
  } from '../actions/types';
  
  const initialState = {
    items: [],
    totalToPayHT: 0,
    totalToPayTTC: 0,
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
        return {
          ...state,
          items: state.items.filter(item => item !== action.payload),
          totalToPayTTC: getTotalTTC(state.items.filter(item => item !== action.payload)),
          totalTax: getTotalTax(state.items.filter(item => item !== action.payload)),
          totalToPayHT: getTotalHT(state.items.filter(item => item !== action.payload)),
        };
      case ADD_ITEM:
        state.items.forEach(element => {
          if (element.product.name == action.payload.product.name && element.parent.name == action.payload.parent.name ) {
            element.quantity += action.payload.quantity;
            action.payload.quantity = 0;
          }
          return state;
        })
        return {
          ...state,
          items: (action.payload.quantity == 0) ? state.items :[action.payload, ...state.items],
          totalToPayTTC: getTotalTTC([action.payload, ...state.items]),
          totalTax: getTotalTax([action.payload, ...state.items]),
          totalToPayHT: getTotalHT([action.payload, ...state.items]),
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