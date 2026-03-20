import type { ReceiptCreateDTO, ReceiptResponseDTO } from '../types/currentAccount.types';
import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';

export const receiptService = {

    /**
     * Crea un nuevo recibo de pago asociado a un paciente.
     */
    createReceipt: async (receiptData: ReceiptCreateDTO): Promise<ReceiptResponseDTO> => {
        try {
            const response = await api.post<ReceiptResponseDTO>(API_ENDPOINTS.RECEIPTS.BASE, receiptData);
            return response.data;
        } catch (error) {
            console.error("Error al crear el recibo:", error);
            throw error;
        }
    },

    /**
     * Obtiene el historial completo de recibos de un paciente en particular.
     */
    getReceiptsByPatient: async (patientId: number): Promise<ReceiptResponseDTO[]> => {
        try {
            const response = await api.get<ReceiptResponseDTO[]>(API_ENDPOINTS.RECEIPTS.BY_PATIENT(patientId));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener los recibos del paciente ${patientId}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene el detalle de un recibo específico por su ID.
     */
    getReceiptById: async (id: number): Promise<ReceiptResponseDTO> => {
        try {
            const response = await api.get<ReceiptResponseDTO>(API_ENDPOINTS.RECEIPTS.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener el recibo con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Descarga el recibo en formato PDF.
     */
    downloadReceiptPdf: async (id: number): Promise<void> => {
        try {
            const response = await api.get(API_ENDPOINTS.RECEIPTS.PDF_BY_ID(id), {
                responseType: 'blob' 
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `recibo_${id}.pdf`); 
            
            document.body.appendChild(link);
            link.click();
            
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(`Error al descargar el PDF del recibo ${id}:`, error);
            throw error;
        }
    }
};