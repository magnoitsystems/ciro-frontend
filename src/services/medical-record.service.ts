import type { MedicalRecordCreateDTO, MedicalRecordResponseDTO } from '../types/clinical.types';
import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';

export const medicalRecordService = {

    /**
     * Obtiene una historia clínica por su ID
     */
    getById: async (id: number): Promise<MedicalRecordResponseDTO> => {
        const response = await api.get<MedicalRecordResponseDTO>(API_ENDPOINTS.MEDICAL_RECORDS.BY_ID(id));
        return response.data;
    },

    /**
     * Obtiene todas las historias clínicas atendidas por un doctor
     */
    getByDoctorId: async (doctorId: number): Promise<MedicalRecordResponseDTO[]> => {
        const response = await api.get<MedicalRecordResponseDTO[]>(API_ENDPOINTS.MEDICAL_RECORDS.BY_DOCTOR(doctorId));
        return response.data;
    },

    /**
     * Obtiene todas las historias clínicas de un paciente por su DNI
     */
    getByPatientDni: async (dni: string): Promise<MedicalRecordResponseDTO[]> => {
        const response = await api.get<MedicalRecordResponseDTO[]>(API_ENDPOINTS.MEDICAL_RECORDS.BY_PATIENT(dni));
        return response.data;
    },

    /**
     * Crea un nuevo registro en la historia clínica (con soporte para archivos)
     */
    create: async (dto: MedicalRecordCreateDTO): Promise<MedicalRecordResponseDTO> => {
        const formData = new FormData();
        
        formData.append('patientDni', dto.patientDni);
        formData.append('doctorId', dto.doctorId.toString());
    
        if (dto.recordDate) {
            formData.append('recordDate', dto.recordDate);
        }
        if (dto.evaluation) {
            formData.append('evaluation', dto.evaluation);
        }
        if (dto.file) {
            formData.append('file', dto.file);
        }

        const response = await api.post<MedicalRecordResponseDTO>(API_ENDPOINTS.MEDICAL_RECORDS.BASE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Actualiza un registro existente (con soporte para actualizar el archivo)
     */
    update: async (id: number, dto: Partial<MedicalRecordCreateDTO>): Promise<MedicalRecordResponseDTO> => {
        const formData = new FormData();
        
        if (dto.patientDni) {
            formData.append('patientDni', dto.patientDni);
        }
        if (dto.doctorId) {
            formData.append('doctorId', dto.doctorId.toString());
        }
        if (dto.recordDate) {
            formData.append('recordDate', dto.recordDate);
        }
        if (dto.evaluation) {
            formData.append('evaluation', dto.evaluation);
        }
        if (dto.file) {
            formData.append('file', dto.file);
        }

        const response = await api.put<MedicalRecordResponseDTO>(API_ENDPOINTS.MEDICAL_RECORDS.BY_ID(id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Elimina un registro de la historia clínica
     */
    delete: async (id: number): Promise<void> => {
        await api.delete(API_ENDPOINTS.MEDICAL_RECORDS.BY_ID(id));
    }
};