import axios from 'axios';
import { API_ENDPOINTS } from './api.endpoints';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9091';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    console.log("Intentando refrescar el token de acceso...");

                    const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
                        refreshToken: refreshToken
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    return api(originalRequest);

                } catch (refreshError) {
                    console.error("El Refresh Token expiró. Cerrando sesión...");
                    localStorage.clear();
                    window.location.href = '/';
                    return Promise.reject(refreshError);
                }
            } else {
                localStorage.clear();
                window.location.href = '/';
            }
        }
        
        return Promise.reject(error);
    }
);