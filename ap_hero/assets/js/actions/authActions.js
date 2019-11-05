import axios from 'axios';
import { returnErrors } from './errorActions';

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
} from './types';

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });
  axios
    .get('/user/current', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

// Register User
export const register = ({ name, email, password }) => dispatch => {

  const config = {
    headers: {'Content-Type': 'application/json'}
  };

  const body = JSON.stringify({ name, email, password });
  axios.post('/api/users', body, config)
       .then(res =>
          dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
          })
       )
       .catch(err => {
          dispatch(
            returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
          );
          dispatch({
            type: REGISTER_FAIL
          });
       });
};

export const login = ({ email, password }) => dispatch => {
  const config = { headers: { 'Content-Type': 'application/json' } };
  const body = JSON.stringify({ username: email, password: password });

  axios
    .post('/api/login_check', body, config)
    .then((res) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        })
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
        
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

export const tokenConfig = getState => {

  const token = getState().auth.token;
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }

  return config;
};

export const updateUser = userDetails => (dispatch, getState) => {

  const phone_number = userDetails.user.metadata.find(metadata => (metadata.type === 'phone_number'));
  const delivery_line_1 = userDetails.user.metadata.find(metadata => (metadata.type === 'delivery_line_1'));
  const delivery_line_2 = userDetails.user.metadata.find(metadata => (metadata.type === 'delivery_line_2'));
  const delivery_city = userDetails.user.metadata.find(metadata => (metadata.type === 'delivery_city'));
  const billing_line_1 = userDetails.user.metadata.find(metadata => (metadata.type === 'billing_line_1'));
  const billing_line_2 = userDetails.user.metadata.find(metadata => (metadata.type === 'billing_line_2'));
  const billing_city = userDetails.user.metadata.find(metadata => (metadata.type === 'billing_city'));
  const phone_number_id = typeof phone_number !== 'undefined' ? phone_number.id : -1;
  const delivery_line_1_id = typeof delivery_line_1 !== 'undefined' ? delivery_line_1.id : -1;
  const delivery_line_2_id = typeof delivery_line_2 !== 'undefined' ? delivery_line_2.id : -1;
  const delivery_city_id = typeof delivery_city !== 'undefined' ? delivery_city.id : -1;
  const billing_line_1_id = typeof billing_line_1 !== 'undefined' ? billing_line_1.id : -1;
  const billing_line_2_id = typeof billing_line_2 !== 'undefined' ? billing_line_2.id : -1;
  const billing_city_id = typeof billing_city !== 'undefined' ? billing_city.id : -1;

  if ((typeof phone_number === 'undefined' || phone_number.field !== userDetails.phone) && userDetails.phone !== '') {
      if (phone_number_id === -1)
          axios.post('/api/metadata', JSON.stringify({type:'phone_number', field: userDetails.phone, user: '/api/users/' + userDetails.user.id}), tokenConfig(getState))
      else
          axios.put('/api/metadata/' + phone_number_id, JSON.stringify({field: userDetails.phone}), tokenConfig(getState))
  }

  if ((typeof delivery_line_1 === 'undefined' || delivery_line_1.field !== userDetails.d_address) && userDetails.d_address !== '') {
    if (delivery_line_1_id === -1) {
        axios.post('/api/metadata', JSON.stringify({type:'delivery_line_1', field: userDetails.d_address, user: '/api/users/' + userDetails.user.id}), tokenConfig(getState))
    } else {
        axios.put('/api/metadata/' + delivery_line_1_id, JSON.stringify({field: userDetails.d_address}), tokenConfig(getState))
    }
  }

  if ((typeof delivery_line_2 === 'undefined' || delivery_line_2.field !== userDetails.d_address2) && userDetails.d_address2 !== '') {
    if (delivery_line_2_id === -1) {
        axios.post('/api/metadata', JSON.stringify({type:'delivery_line_2', field: userDetails.d_address2, user: '/api/users/' + userDetails.user.id}), tokenConfig(getState))
    } else {
        axios.put('/api/metadata/' + delivery_line_2_id, JSON.stringify({field: userDetails.d_address2}), tokenConfig(getState))
    }
  }

  if ((typeof delivery_city === 'undefined' || delivery_city.field !== userDetails.d_zipCode) && userDetails.d_zipCode !== '') {
    if (delivery_city_id === -1) {
        axios.post('/api/metadata', JSON.stringify({type:'delivery_city', field: userDetails.d_zipCode, user: '/api/users/' + userDetails.user.id}), tokenConfig(getState))
    } else {
        axios.put('/api/metadata/' + delivery_city_id, JSON.stringify({field: userDetails.d_zipCode}), tokenConfig(getState))
    }
  }

  if ((typeof billing_line_1 === 'undefined' || billing_line_1.field !== userDetails.b_address) && userDetails.b_address !== '') {
    if (billing_line_1_id === -1) {
        axios.post('/api/metadata', JSON.stringify({type:'billing_line_1', field: userDetails.b_address, user: '/api/users/' + userDetails.user.id}), tokenConfig(getState))
    } else {
        axios.put('/api/metadata/' + billing_line_1_id, JSON.stringify({field: userDetails.b_address}), tokenConfig(getState))
    }
  }

  if ((typeof billing_line_2 === 'undefined' || billing_line_2.field !== userDetails.b_address2) && userDetails.b_address2 !== '') {
    if (billing_line_2_id === -1) {
        axios.post('/api/metadata', JSON.stringify({type:'billing_line_2', field: userDetails.b_address2, user: '/api/users/' + userDetails.user.id}), tokenConfig(getState))
    } else {
        axios.put('/api/metadata/' + billing_line_2_id, JSON.stringify({field: userDetails.b_address2}), tokenConfig(getState))
    }
  }

  if ((typeof billing_city === 'undefined' || billing_city.field !== userDetails.b_zipCode) && userDetails.b_zipCode !== '') {
    if (billing_city_id === -1) {
        axios.post('/api/metadata', JSON.stringify({type:'billing_city', field: userDetails.b_zipCode, user: '/api/users/' + userDetails.user.id}), tokenConfig(getState))
    } else {
        axios.put('/api/metadata/' + billing_city_id, JSON.stringify({field: userDetails.b_zipCode}), tokenConfig(getState))
    }
  }

  axios.put('/api/users/' + userDetails.user.id, JSON.stringify({ username: userDetails.username, email: userDetails.email}), tokenConfig(getState))
        .then((res) => {
          let refreshBodyRequest = JSON.stringify({id: res.data.id});
          axios.post('/user/updated', refreshBodyRequest, tokenConfig(getState) )
                .then((response) => {
                  dispatch({
                    type: USER_UPDATED,
                    payload: response.data
                  })
                })
          });
}