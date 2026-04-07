import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';
import type { TaskResponseDTO, TaskCreateDTO } from "../types/management.types";


export const taskService = {
    getAll: async (): Promise<TaskResponseDTO[]> => {
        const response = await api.get<TaskResponseDTO[]>(API_ENDPOINTS.TASKS.BASE);
        return response.data;
    },

    getById: async (id: number): Promise<TaskResponseDTO> => {
        const response = await api.get<TaskResponseDTO>(API_ENDPOINTS.TASKS.BY_ID(id));
        return response.data;
    },

    getByUserId: async (userId: number): Promise<TaskResponseDTO[]> => {
        const response = await api.get<TaskResponseDTO[]>(API_ENDPOINTS.TASKS.BY_USER(userId));
        return response.data;
    },

    getByStatus: async (status: string): Promise<TaskResponseDTO[]> => {
        const response = await api.get<TaskResponseDTO[]>(API_ENDPOINTS.TASKS.BY_STATUS(status));
        return response.data;
    },

    create: async (data: TaskCreateDTO): Promise<TaskResponseDTO> => {
        const response = await api.post<TaskResponseDTO>(API_ENDPOINTS.TASKS.BASE, data);
        return response.data;
    },

    update: async (id: number, data: Partial<TaskCreateDTO>): Promise<TaskResponseDTO> => {
        const response = await api.put<TaskResponseDTO>(API_ENDPOINTS.TASKS.BY_ID(id), data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(API_ENDPOINTS.TASKS.BY_ID(id));
    }
};