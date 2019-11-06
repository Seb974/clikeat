import userExtractor from '../helpers/userExtractor';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_UPDATED,
  } from '../actions/types';
  
  const storedToken = localStorage.getItem('token') || "";
  const initialState = {
    token: storedToken || "",
    isAuthenticated: storedToken !== "" ? true : false,
    isLoading: false,
    user: storedToken !== "" ? userExtractor(storedToken) : null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case USER_LOADING:
        return {
          ...state,
          isLoading: true
        };
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          isLoading: false,
           user: userExtractor(action.payload.token)
        };
      case USER_UPDATED:
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      case LOGIN_SUCCESS:
      case REGISTER_SUCCESS:
        let user = userExtractor(action.payload.token);
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', user);
        return {
          ...state,
          ...action.payload,
          isAuthenticated: true,
          isLoading: false,
          user: user
        };
      case LOGOUT_SUCCESS:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (localStorage.getItem('products')) {
             localStorage.removeItem('products')
          }
      case AUTH_ERROR:
      case LOGIN_FAIL:
      case REGISTER_FAIL:
        return {
          ...state,
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false
        };
      default:
        return state;
    }
  }