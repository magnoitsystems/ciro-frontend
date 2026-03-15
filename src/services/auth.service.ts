// src/services/auth.service.ts

import type { AuthResponseDTO, LoginRequestDTO, RefreshTokenRequestDTO } from '../types/auth.types';
import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';

export const authService = {
    /**
     * Inicia sesión y guarda los tokens y datos del usuario en el navegador
     */
    login: async (credentials: LoginRequestDTO): Promise<AuthResponseDTO> => {
        const response = await api.post<AuthResponseDTO>(API_ENDPOINTS.AUTH.LOGIN, credentials);
        
        const authData = response.data;
        localStorage.setItem('accessToken', authData.accessToken);
        localStorage.setItem('refreshToken', authData.refreshToken);
        
        localStorage.setItem('userId', authData.userId.toString());
        localStorage.setItem('userName', authData.name);
        if (authData.color) {
            localStorage.setItem('userColor', authData.color);
        }

        return authData;
    },

    /**
     * Pide un nuevo token de acceso usando el Refresh Token
     */
    refreshToken: async (request: RefreshTokenRequestDTO): Promise<AuthResponseDTO> => {
        const response = await api.post<AuthResponseDTO>(API_ENDPOINTS.AUTH.REFRESH, request);
        
        const authData = response.data;
        localStorage.setItem('accessToken', authData.accessToken);
        localStorage.setItem('refreshToken', authData.refreshToken);
        
        return authData;
    },

    /**
     * Cierra la sesión en el backend y limpia el navegador
     */
    logout: async (): Promise<void> => {
        try {
            await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error("Error al hacer logout en el servidor", error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userColor');
        }
    },

    /**
     * Helper para saber si hay un usuario logueado actualmente
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('accessToken');
    }
};