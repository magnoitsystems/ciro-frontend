import type { UserCreateDTO, UserResponseDTO } from '../types/users.types';
import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';

export const userService = {
    
    /**
     * Crea un usuario nuevo en el sistema.
     */
    createUser: async (userData: UserCreateDTO): Promise<UserResponseDTO> => {
        try {
            const response = await api.post<UserResponseDTO>(API_ENDPOINTS.USERS.BASE, userData);
            return response.data;
        } catch (error) {
            console.error("Error al crear usuario:", error);
            throw error;
        }
    },

    /**
     * Obtiene la lista completa de todos los usuarios registrados.
     */
    getAllUsers: async (): Promise<UserResponseDTO[]> => {
        try {
            const response = await api.get<UserResponseDTO[]>(API_ENDPOINTS.USERS.BASE);
            return response.data;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            throw error;
        }
    },

    /**
     * Elimina un usuario de la base de datos por su ID.
     */
    deleteUser: async (id: number): Promise<void> => {
        try {
            await api.delete(API_ENDPOINTS.USERS.BY_ID(id));
        } catch (error) {
            console.error(`Error al eliminar el usuario con ID ${id}:`, error);
            throw error;
        }
    }
};