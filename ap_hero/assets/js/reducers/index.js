import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import productReducer from './productReducer';

export default combineReducers({
  product: productReducer,
  error: errorReducer,
  auth: authReducer
});