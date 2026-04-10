import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';
import type { BudgetCreateDTO, BudgetResponseDTO } from '../types/budgets.types';

export const budgetService = {
    
    /**
     * Obtiene todos los presupuestos del sistema
     */
    findAll: async (): Promise<BudgetResponseDTO[]> => {
        const response = await api.get<BudgetResponseDTO[]>(API_ENDPOINTS.BUDGETS.BASE);
        return response.data;
    },

    /**
     * Obtiene los presupuestos de un paciente específico
     */
    findByPatientId: async (patientId: number): Promise<BudgetResponseDTO[]> => {
        const response = await api.get<BudgetResponseDTO[]>(API_ENDPOINTS.BUDGETS.BY_PATIENT(patientId));
        return response.data;
    },

    /**
     * Crea un nuevo presupuesto (con envío de archivo sí o sí)
     */
    createBudget: async (dto: BudgetCreateDTO): Promise<BudgetResponseDTO> => {
        const formData = new FormData();
        formData.append('patientId', dto.patientId.toString());
        formData.append('status', dto.status);
        formData.append('date', dto.date);
        
        if (dto.uploadedDate) {
            formData.append('uploadedDate', dto.uploadedDate);
        }
        if (dto.file) {
            formData.append('file', dto.file);
        }

        const response = await api.post<BudgetResponseDTO>(API_ENDPOINTS.BUDGETS.BASE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Actualiza un presupuesto existente, pudiendo cambiar el archivo
     */
    updateBudget: async (id: number, dto: Partial<BudgetCreateDTO>): Promise<BudgetResponseDTO> => {
        const formData = new FormData();
        
        if (dto.patientId) {
            formData.append('patientId', dto.patientId.toString());
        }
        if (dto.uploadedDate) {
            formData.append('uploadedDate', dto.uploadedDate);
        }
        if (dto.status) {
            formData.append('status', dto.status);
        }
        if (dto.date) {
            formData.append('date', dto.date);
        }
        if (dto.file) {
            formData.append('file', dto.file);
        }

        const response = await api.put<BudgetResponseDTO>(API_ENDPOINTS.BUDGETS.BY_ID(id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Elimina un presupuesto
     */
    deleteBudget: async (id: number): Promise<BudgetResponseDTO> => {
        const response = await api.delete<BudgetResponseDTO>(API_ENDPOINTS.BUDGETS.BY_ID(id));
        return response.data;
    }
};