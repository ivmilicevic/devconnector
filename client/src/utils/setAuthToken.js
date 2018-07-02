// Function sets request header to bearer token if it's passed in

import axios from 'axios';

const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
    }
    else {
        delete axios.defaults.common['Authorization'];
    }
}

export default setAuthToken;