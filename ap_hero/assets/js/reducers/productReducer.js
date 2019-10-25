import { GET_PRODUCTS, INCREASE_PRODUCT_STOCK, DECREASE_PRODUCT_STOCK } from '../actions/types';
  
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
      case DECREASE_PRODUCT_STOCK:
      case INCREASE_PRODUCT_STOCK:
          let pIndex = 0;
          for (let i = 0; i < state.products.length; i++) {
            if (state.products[i].id === action.payload.product.id) {
              pIndex = i;
              break;
            }
          }
          let vIndex = state.products[pIndex].variants.indexOf(action.payload.variant);
          let initialQty = state.products[pIndex].variants[vIndex].stock.quantity;
          let newVariants = [];
          for (let i = 0; i < state.products[pIndex].variants.length; i++) {
              newVariants[i] = state.products[pIndex].variants[i];
              if (i === vIndex) {
                action.type === DECREASE_PRODUCT_STOCK ? newVariants[i].stock.quantity = initialQty - action.payload.quantity
                                                       : newVariants[i].stock.quantity = initialQty + action.payload.quantity;
              }
          }
          let newProducts = state.products.map(
            (product, index) => {
              return index === pIndex ? {...product, variants: newVariants} : product;
            }
          );
          return {
            ...state,
            products: newProducts
          }
      

          
        

      // case INCREASE_PRODUCT_STOCK:
      //     let pIndex = state.products.indexOf(action.payload.product);
      //     let vIndex = state.products[pIndex].variants.indexOf(action.payload.variant);
      //     let initialQty = state.products[pIndex].variants[vIndex].stock.quantity;
      //     let newVariants = [];
      //     for (let i = 0; i < state.products[pIndex].variants.length; i++) {
      //         newVariants[i] = state.products[pIndex].variants[i];
      //         if (i === vIndex) {
      //           newVariants[i].stock.quantity = initialQty + action.payload.quantity;
      //         }
      //     }
      //     let newProducts = state.products.map(
      //       (product, index) => {
      //         return index === pIndex ? {...product, variants: newVariants} : product;
      //       }
      //     );
      //     return {
      //       ...state,
      //       products: newProducts
      //     }
      default:
        return state;
    }
  }