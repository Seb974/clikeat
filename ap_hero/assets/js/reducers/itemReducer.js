import userExtractor from '../helpers/userExtractor';
import { getTotalTTC, getTotalTax, getTotalHT } from '../helpers/taxCalculator';
import {
    GET_ITEMS,
    ADD_ITEM,
    DELETE_ITEM,
    ITEMS_LOADING
  } from '../actions/types';
  
  //const storedCart = localStorage.getItem('cart') || [];
  const initialState = {
    items: [],
    totalToPayTTC: 0,   //getTotalTTC(storedCart),
    totalToPayHT: 0,    //getTotalHT(storedCart),
    totalTax: 0,        //getTotalTax(storedCart),
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
          items: reducedCart,                            //state.items.filter(item => item !== action.payload),
          totalToPayTTC: getTotalTTC(reducedCart),       //getTotalTTC(state.items.filter(item => item !== action.payload)),
          totalTax: getTotalTax(reducedCart),            //getTotalTax(state.items.filter(item => item !== action.payload)),
          totalToPayHT: getTotalHT(reducedCart)          //getTotalHT(state.items.filter(item => item !== action.payload)),
        };
      case ADD_ITEM:
        state.items.forEach(element => {
          if (element.product.name == action.payload.product.name && element.parent.name == action.payload.parent.name ) {
            element.quantity += action.payload.quantity;
            action.payload.quantity = 0;
            return state;
          }
        })
        // ATTENTION : Vérifier Impact
        const enlargedCart = action.payload.quantity !== 0 ? [action.payload, ...state.items] : state.items;
        // FIN de modification susceptible de perturber le bon fonctionnement

          //action.payload.quantity !== 0 ? localStorage.setItem('cart', JSON.stringify([action.payload, ...state.items])) : localStorage.setItem('cart', JSON.stringify(state.items));
        localStorage.setItem('cart', JSON.stringify(enlargedCart));
        return {
          ...state,
          items: enlargedCart,                            //(action.payload.quantity == 0) ? state.items :[action.payload, ...state.items],
          totalToPayTTC: getTotalTTC(enlargedCart),       //getTotalTTC([action.payload, ...state.items]),
          totalTax: getTotalTax(enlargedCart),            //getTotalTax([action.payload, ...state.items]),
          totalToPayHT: getTotalHT(enlargedCart)          //getTotalHT([action.payload, ...state.items]),
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