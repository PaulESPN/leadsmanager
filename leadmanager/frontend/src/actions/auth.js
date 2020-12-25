import axios from 'axios';
import { returnErrors } from './messages';

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
} from './types';

// CHECK TOKEN AND LOAD USER
export const loadUser = () => (dispatch, getState) => {
  //USER LOADING
  dispatch({type: USER_LOADING});

  axios.get('/api/auth/user', tokenConfig(getState))
    .then(res =>{
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    }).catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      })
  });
}

//Login User
export const login = (username, password) => dispatch => {
  //Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // Request body
  const body = JSON.stringify({username, password});

  axios.post('/api/auth/login', body, config)
    .then(res =>{
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    }).catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: LOGIN_FAIL
      })
  });
}

export const register = ({username, password, email}) => dispatch => {
  //Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // Request body
  const body = JSON.stringify({username, email, password});

  axios.post('/api/auth/register', body, config)
    .then(res =>{
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    }).catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: REGISTER_FAIL
      })
  });
}

//Logout User
export const logout = () => (dispatch, getState) => {
  axios.post('/api/auth/logout/',null, tokenConfig(getState))
    .then(res =>{
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    }).catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
  });
}

// Setup Config w/ token
export const tokenConfig = getState => {
  const token = getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if(token){
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
}
