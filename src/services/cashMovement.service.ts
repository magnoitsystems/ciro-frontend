/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'; 
import { API_ENDPOINTS } from './api.endpoints';
import type { CashMovementDetailDTO } from '../types/cash.types';
import type { RevenueWidgetDTO } from '../types/currentAccount.types';

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

    
   /**
     * Método para el dashboard (widget), trae el ingreso NETO (ingresos - egresos).
     * Soporta rango de fechas opcional. Si no se envían, el backend calcula la semana actual.
     */
    async getWeeklyRevenueWidget(startDate?: string, endDate?: string): Promise<RevenueWidgetDTO> {
        try {
            const params: Record<string, string> = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await api.get<RevenueWidgetDTO>(API_ENDPOINTS.CASH_MOVEMENTS.WIDGET_WEEKLY_REVENUE, { params });
            return response.data;
        } catch (error) {
            console.error("Error al obtener el widget de ingresos netos:", error);
            throw error;
        }
    }
}

export const cashMovementService = new CashMovementService();