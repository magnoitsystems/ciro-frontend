import type { ShiftResponseDTO, ShiftCreateDTO, ShiftWidgetDTO } from '../types/clinical.types';
import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';

export const shiftService = {
    /**
     * obtenemos todos los turnos
     */
    getAll: async (): Promise<ShiftResponseDTO[]> => {
        const response = await api.get<ShiftResponseDTO[]>(API_ENDPOINTS.SHIFTS.BASE);
        return response.data;
    },

    /**
     * Obtenemos los datos de un turno por su ID
     */
    getById: async (id: number): Promise<ShiftResponseDTO> => {
        const response = await api.get<ShiftResponseDTO>(API_ENDPOINTS.SHIFTS.BY_ID(id));
        return response.data;
    },

    /**
     * Obtenemos los turnos de un doctor
     */
    getByDoctorId: async (doctorId: number): Promise<ShiftResponseDTO[]> => {
        const response = await api.get<ShiftResponseDTO[]>(API_ENDPOINTS.SHIFTS.BY_DOCTOR(doctorId));
        return response.data;
    },

    /**
     * Obtenemos los turnos de un paciente
     */
    getByPatientDni: async (dni: string): Promise<ShiftResponseDTO[]> => {
        const response = await api.get<ShiftResponseDTO[]>(API_ENDPOINTS.SHIFTS.BY_PATIENT(dni));
        return response.data;
    },

    /**
     * Creamos un turno con posibilidad de crear una nota
     */
    create: async (data: ShiftCreateDTO): Promise<ShiftResponseDTO> => {
        const response = await api.post<ShiftResponseDTO>(API_ENDPOINTS.SHIFTS.BASE, data);
        return response.data;
    },

    /**
     * 
     * actualizamos un turno
     */
    update: async (id: number, data: Partial<ShiftCreateDTO>): Promise<ShiftResponseDTO> => {
        const response = await api.put<ShiftResponseDTO>(API_ENDPOINTS.SHIFTS.BY_ID(id), data);
        return response.data;
    },

    /**
     * eliminamos un turno
     */
    delete: async (id: number): Promise<void> => {
        await api.delete(API_ENDPOINTS.SHIFTS.BY_ID(id));
    },

    /**
     * Obtiene todos los turnos dentro de un rango de fechas.
     * Las fechas deben enviarse en formato: '2026-04-10T00:00:00'
     */
    getByDateRange: async (startDate: string, endDate: string): Promise<ShiftResponseDTO[]> => {
        const response = await api.get<ShiftResponseDTO[]>(
            API_ENDPOINTS.SHIFTS.BY_DATE_RANGE(startDate, endDate)
        );
        return response.data;
    },

    /**
     * Método para el dashboard (widget) para la parte de cantidad de turnos restantes del día y a qué hora es el próximo
     */
    getDashboardWidget: async (): Promise<ShiftWidgetDTO> => {
        try {
            const response = await api.get<ShiftWidgetDTO>(API_ENDPOINTS.SHIFTS.WIDGET_DASHBOARD);
            return response.data;
        } catch (error) {
            console.error("Error al obtener el widget de turnos:", error);
            throw error;
        }
    }
};