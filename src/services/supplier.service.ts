import type { SupplierResponseDTO, SupplierCreateDTO } from '../types/supplier.types';
import { api } from './api'; 
import { API_ENDPOINTS } from './api.endpoints';

export const supplierService = {
    getAll: async (): Promise<SupplierResponseDTO[]> => {
        const response = await api.get<SupplierResponseDTO[]>(API_ENDPOINTS.SUPPLIERS.BASE);
        return response.data;
    },

    getById: async (id: number): Promise<SupplierResponseDTO> => {
        const response = await api.get<SupplierResponseDTO>(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
        return response.data;
    },

    create: async (data: SupplierCreateDTO): Promise<SupplierResponseDTO> => {
        const response = await api.post<SupplierResponseDTO>(API_ENDPOINTS.SUPPLIERS.BASE, data);
        return response.data;
    },

    update: async (id: number, data: Partial<SupplierCreateDTO>): Promise<SupplierResponseDTO> => {
        const response = await api.put<SupplierResponseDTO>(API_ENDPOINTS.SUPPLIERS.BY_ID(id), data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
    }
};