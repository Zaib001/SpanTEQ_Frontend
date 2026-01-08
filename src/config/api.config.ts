import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {

        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('authUser');

            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        const errorMessage = error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred';

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

export default apiClient;
export { API_BASE_URL };
