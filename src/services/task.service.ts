import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';
import type { TaskResponseDTO, TaskCreateDTO, TaskWidgetDTO} from "../types/management.types";


export const taskService = {
    /**
     * Obtiene todas las tareas sin importar de qué usuario son
     */
    getAll: async (): Promise<TaskResponseDTO[]> => {
        const response = await api.get<TaskResponseDTO[]>(API_ENDPOINTS.TASKS.BASE);
        return response.data;
    },

    /**
     * Obtiene por ID tarea
     */
    getById: async (id: number): Promise<TaskResponseDTO> => {
        const response = await api.get<TaskResponseDTO>(API_ENDPOINTS.TASKS.BY_ID(id));
        return response.data;
    },

    /**
     * Obtiene ahora sí las de un usuario específico
     */
    getByUserId: async (userId: number): Promise<TaskResponseDTO[]> => {
        const response = await api.get<TaskResponseDTO[]>(API_ENDPOINTS.TASKS.BY_USER(userId));
        return response.data;
    },

    /**
     * Obtiene filtrando por un status específico
     */
    getByStatus: async (status: string): Promise<TaskResponseDTO[]> => {
        const response = await api.get<TaskResponseDTO[]>(API_ENDPOINTS.TASKS.BY_STATUS(status));
        return response.data;
    },

    /**
     *Crear una tarea, ver objeto TaskCreateDTO
     */
    create: async (data: TaskCreateDTO): Promise<TaskResponseDTO> => {
        const response = await api.post<TaskResponseDTO>(API_ENDPOINTS.TASKS.BASE, data);
        return response.data;
    },

    /**
     * Actualiza una tarea, no es necesario enviar todos los campos
     */
    update: async (id: number, data: Partial<TaskCreateDTO>): Promise<TaskResponseDTO> => {
        const response = await api.put<TaskResponseDTO>(API_ENDPOINTS.TASKS.BY_ID(id), data);
        return response.data;
    },

    /**
     * Elimina una tarea por su ID
     */
    delete: async (id: number): Promise<void> => {
        await api.delete(API_ENDPOINTS.TASKS.BY_ID(id));
    },

    /**
     * Método para el dashboard (widgets), obtiene las tareas pendientes y cuántas son
     */
    getPendingWidget: async (): Promise<TaskWidgetDTO> => {
        const response = await api.get<TaskWidgetDTO>(API_ENDPOINTS.TASKS.WIDGET_PENDING);
        return response.data;
    }
};