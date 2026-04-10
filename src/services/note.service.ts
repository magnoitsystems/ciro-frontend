import type { NoteResponseDTO, NoteCreateDTO } from '../types/management.types';
import { api } from './api'; 
import { API_ENDPOINTS } from './api.endpoints';

export const noteService = {
    
    getAll: async (): Promise<NoteResponseDTO[]> => {
        const response = await api.get<NoteResponseDTO[]>(API_ENDPOINTS.NOTES.BASE);
        return response.data;
    },

    getById: async (id: number): Promise<NoteResponseDTO> => {
        const response = await api.get<NoteResponseDTO>(API_ENDPOINTS.NOTES.BY_ID(id));
        return response.data;
    },

    getByTask: async (taskId: number): Promise<NoteResponseDTO[]> => {
        const response = await api.get<NoteResponseDTO[]>(API_ENDPOINTS.NOTES.BY_TASK(taskId));
        return response.data;
    },

    getIndependentByDate: async (date: string): Promise<NoteResponseDTO[]> => {
        const response = await api.get<NoteResponseDTO[]>(API_ENDPOINTS.NOTES.INDEPENDENT_BY_DATE(date));
        return response.data;
    },

    create: async (data: NoteCreateDTO): Promise<NoteResponseDTO> => {
        const response = await api.post<NoteResponseDTO>(API_ENDPOINTS.NOTES.BASE, data);
        return response.data;
    },

    update: async (id: number, data: Partial<NoteCreateDTO>): Promise<NoteResponseDTO> => {
        const response = await api.put<NoteResponseDTO>(API_ENDPOINTS.NOTES.BY_ID(id), data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(API_ENDPOINTS.NOTES.BY_ID(id));
    }
};