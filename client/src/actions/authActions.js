import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// Register user
export const registerUser = (userData, history) => dispatch => {
    axios.post('api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
        );
};

// Login - get user token
export const loginUser = (userData) => dispatch => {
    axios.post('api/users/login', userData)
        .then(res => {
            // Save token to local storage and set authorization header
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);

            // Decode user data from jwt
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
};

// Set currently logged in user
export const setCurrentUser = decodedToken => {
    return {
        type: SET_CURRENT_USER,
        payload: decodedToken
    }
};