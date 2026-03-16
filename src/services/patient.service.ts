import type { PatientCreateDTO, PatientDebtorDTO, PatientResponseDTO, PatientSearchParams, PatientUpdateDTO } from '../types/patients.types';
import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';

export const patientService = {
    
    createPatient: async (patientData: PatientCreateDTO): Promise<PatientResponseDTO> => {
        const response = await api.post<PatientResponseDTO>(API_ENDPOINTS.PATIENTS.BASE, patientData);
        return response.data;
    },

    getAllPatients: async (): Promise<PatientResponseDTO[]> => {
        const response = await api.get<PatientResponseDTO[]>(API_ENDPOINTS.PATIENTS.BASE);
        return response.data;
    },

    getPatientById: async (id: number): Promise<PatientResponseDTO> => {
        const response = await api.get<PatientResponseDTO>(API_ENDPOINTS.PATIENTS.BY_ID(id));
        return response.data;
    },

    searchPatients: async (params: PatientSearchParams): Promise<PatientResponseDTO[]> => {
        const response = await api.get<PatientResponseDTO[]>(API_ENDPOINTS.PATIENTS.SEARCH, { params });
        return response.data;
    },

    updatePatient: async (id: number, updateData: PatientUpdateDTO): Promise<PatientResponseDTO> => {
        const response = await api.put<PatientResponseDTO>(API_ENDPOINTS.PATIENTS.BY_ID(id), updateData);
        return response.data;
    },

    deletePatient: async (id: number): Promise<void> => {
        await api.delete(API_ENDPOINTS.PATIENTS.BY_ID(id));
    },

    getDebtorPatients: async (): Promise<PatientDebtorDTO[]> => {
        const response = await api.get<PatientDebtorDTO[]>(API_ENDPOINTS.PATIENTS.DEBTORS);
        return response.data;
    }
};