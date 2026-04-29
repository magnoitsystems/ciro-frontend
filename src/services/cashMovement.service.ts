/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'; 
import { API_ENDPOINTS } from './api.endpoints';
import type { CashMovementDetailDTO } from '../types/cash.types';

class CashMovementService {
    
    // Obtiene la lista de cash movements - Soporta filtros opcionales
    async getCashMovements(doctorId?: number, period?: string): Promise<any[]> {
        const params: Record<string, any> = {};
        if (doctorId) params.doctorId = doctorId;
        if (period) params.period = period;

        const response = await api.get(API_ENDPOINTS.CASH_MOVEMENTS.BASE, { params });
        return response.data;
    }

    // Obtiene el detalle de un movimiento específico con la información del objeto (receipt o bill) asociado
    async getMovementDetail(id: number): Promise<CashMovementDetailDTO> {
        const response = await api.get<CashMovementDetailDTO>(API_ENDPOINTS.CASH_MOVEMENTS.BY_ID(id));
        return response.data;
    }

    // Descarga el PDF del reporte
    async downloadCashReportPdf(doctorId?: number, period?: string): Promise<Blob> {
        const params: Record<string, any> = {};
        if (doctorId) params.doctorId = doctorId;
        if (period) params.period = period;

        const response = await api.get(API_ENDPOINTS.CASH_MOVEMENTS.REPORT_PDF, { 
            params,
            responseType: 'blob' 
        });
        return response.data;
    }

    // Asigna un doctor a un movimiento
    async assignDoctor(id: number, doctorId: number): Promise<void> {
        await api.patch(API_ENDPOINTS.CASH_MOVEMENTS.ASSIGN_DOCTOR(id), null, {
            params: { doctorId }
        });
    }
}

export const cashMovementService = new CashMovementService();