import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';
import type { BillCreateDTO, BillResponseDTO } from '../types/bills.types';
import type { BillType, OriginType, ReportPeriod } from '../types/enums.types';

export const billService = {

    /**
     * Crea un nuevo sueldo o gasto/servicio.
     */
    createBill: async (billData: BillCreateDTO): Promise<BillResponseDTO> => {
        try {
            const response = await api.post<BillResponseDTO>(API_ENDPOINTS.BILLS.BASE, billData);
            return response.data;
        } catch (error) {
            console.error("Error al crear el gasto/sueldo:", error);
            throw error;
        }
    },

    /**
     * Actualiza un gasto o sueldo existente.
     */
    updateBill: async (id: number, billData: BillCreateDTO): Promise<BillResponseDTO> => {
        try {
            const response = await api.put<BillResponseDTO>(API_ENDPOINTS.BILLS.BY_ID(id), billData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar el gasto/servicio con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene todos los gastos/sueldos. 
     * Soporta filtros opcionales por tipo y origen.
     */
    getAllBills: async (type?: BillType, origin?: OriginType): Promise<BillResponseDTO[]> => {
        try {
            const response = await api.get<BillResponseDTO[]>(API_ENDPOINTS.BILLS.BASE, {
                params: { type, origin }
            });
            return response.data;
        } catch (error) {
            console.error("Error al obtener la lista de gastos/servicios:", error);
            throw error;
        }
    },

    /**
     * Descarga un reporte en formato PDF de los gastos pagados.
     */
    downloadBillsReport: async (period: ReportPeriod, date?: string): Promise<void> => {
        try {
            const response = await api.get(API_ENDPOINTS.BILLS.REPORT_PDF, {
                params: { period, date },
                responseType: 'blob' 
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            
            link.setAttribute('download', `reporte_gastos_${period.toLowerCase()}.pdf`); 
            
            document.body.appendChild(link);
            link.click();
            
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error al descargar el reporte PDF:", error);
            throw error;
        }
    }
};