import { createStore, combineReducers } from 'redux';
import userState from './Reducers/userReducer';
import cartState from './Reducers/cartReducer';

const combinedReducers = combineReducers({
    user: userState,
    cart: cartState
});

export default createStore(combinedReducers);