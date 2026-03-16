import type { PatientCreateDTO, PatientDebtorDTO, PatientResponseDTO, PatientSearchParams, PatientUpdateDTO } from '../types/patients.types';
import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';

export const patientService = {
    
    /**
     * Crea un paciente nuevo en el sistema.
     */
    createPatient: async (patientData: PatientCreateDTO): Promise<PatientResponseDTO> => {
        try {
            const response = await api.post<PatientResponseDTO>(API_ENDPOINTS.PATIENTS.BASE, patientData);
            return response.data;
        } catch (error) {
            console.error("Error en createPatient:", error);
            throw error;
        }
    },

    /**
     * Obtiene la lista completa de todos los pacientes.
     */
    getAllPatients: async (): Promise<PatientResponseDTO[]> => {
        try {
            const response = await api.get<PatientResponseDTO[]>(API_ENDPOINTS.PATIENTS.BASE);
            return response.data;
        } catch (error) {
            console.error("Error en getAllPatients:", error);
            throw error;
        }
    },

    /**
     * Obtiene los datos de un paciente específico por su ID.
     */
    getPatientById: async (id: number): Promise<PatientResponseDTO> => {
        try {
            const response = await api.get<PatientResponseDTO>(API_ENDPOINTS.PATIENTS.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error(`Error en getPatientById (ID: ${id}):`, error);
            throw error;
        }
    },

    /**
     * Busca pacientes aplicando filtros opcionales (dni, nombre, ciudad).
     */
    searchPatients: async (params: PatientSearchParams): Promise<PatientResponseDTO[]> => {
        try {
            const response = await api.get<PatientResponseDTO[]>(API_ENDPOINTS.PATIENTS.SEARCH, { params });
            return response.data;
        } catch (error) {
            console.error("Error en searchPatients con parámetros:", params, error);
            throw error;
        }
    },

    /**
     * Actualiza la información de un paciente existente.
     */
    updatePatient: async (id: number, updateData: PatientUpdateDTO): Promise<PatientResponseDTO> => {
        try {
            const response = await api.put<PatientResponseDTO>(API_ENDPOINTS.PATIENTS.BY_ID(id), updateData);
            return response.data;
        } catch (error) {
            console.error(`Error en updatePatient (ID: ${id}):`, error);
            throw error;
        }
    },

    /**
     * Elimina un paciente de la base de datos
     */
    deletePatient: async (id: number): Promise<void> => {
        try {
            await api.delete(API_ENDPOINTS.PATIENTS.BY_ID(id));
        } catch (error) {
            console.error(`Error en deletePatient (ID: ${id}):`, error);
            throw error;
        }
    },

    /**
     * Obtiene la lista de pacientes que registran deudas en sus cuentas corrientes.
     */
    getDebtorPatients: async (): Promise<PatientDebtorDTO[]> => {
        try {
            const response = await api.get<PatientDebtorDTO[]>(API_ENDPOINTS.PATIENTS.DEBTORS);
            return response.data;
        } catch (error) {
            console.error("Error en getDebtorPatients:", error);
            throw error;
        }
    }
};