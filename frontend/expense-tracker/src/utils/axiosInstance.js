import axios from 'axios';
import { BASE_URL} from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Adding a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Adding a response interceptor to handle responses globally

axiosInstance.interceptors.response.use(
    (response) => {
        return response;    
    },
    (error) => {
        if (error.response) {
           
            if (error.response.status === 401) {
               window.location.href = '/login'; // Redirect to login on 401 Unauthorized
            }else if (error.response.status === 500) {
                console.error('Server error:', error.response.data);
            }
        }
        else if(error.code === 'ECONNABORTED'){
            console.error('Request timeout. Please try again.', error.message);
        }
        return Promise.reject(error);
    }
);











export default axiosInstance;
