import axios from 'axios';
import { API_ENDPOINTS } from './api.endpoints';
import type { CurrentAccountType } from '../types/enums.types';
import type { CurrentAccountResponseDTO, ReceiptCreateDTO, ReceiptResponseDTO, VoucherCreateDTO, VoucherDTO, VoucherResponseDTO } from '../types/currentAccount.types';

class CurrentAccountService {

    /**
     * Obtiene la cuenta corriente completa de un paciente
     */
    async getPatientCurrentAccount(patientId: number, type?: CurrentAccountType): Promise<CurrentAccountResponseDTO> {
        const params = type ? { type } : {};
        const response = await axios.get<CurrentAccountResponseDTO>(
            API_ENDPOINTS.CURRENT_ACCOUNTS.BY_PATIENT(patientId), 
            { params }
        );
        return response.data;
    }

    /**
     * Cancela la deuda actual de un paciente
     */
    async cancelPatientDebt(patientId: number): Promise<void> {
        await axios.put(API_ENDPOINTS.CURRENT_ACCOUNTS.CANCEL_DEBT(patientId));
    }

    /**
     * permite descargar un pdf con el historial de cuenta corriente de un paciente
     */
    async downloadPatientCurrentAccountPdf(patientId: number): Promise<Blob> {
        const response = await axios.get(
            API_ENDPOINTS.CURRENT_ACCOUNTS.PDF_BY_PATIENT(patientId), 
            { responseType: 'blob' }
        );
        return response.data;
    }

    /**
     * Crea un recibo de dinero
     */
    async createReceipt(data: ReceiptCreateDTO): Promise<ReceiptResponseDTO> {
        const response = await axios.post<ReceiptResponseDTO>(API_ENDPOINTS.RECEIPTS.BASE, data);
        return response.data;
    }

    /**
     * obtiene un recibo por su ID
     */
    async getReceiptById(id: number): Promise<ReceiptResponseDTO> {
        const response = await axios.get<ReceiptResponseDTO>(API_ENDPOINTS.RECEIPTS.BY_ID(id));
        return response.data;
    }

    /**
     * obtiene los recibos de un paciente
     */
    async getPatientReceipts(patientId: number): Promise<ReceiptResponseDTO[]> {
        const response = await axios.get<ReceiptResponseDTO[]>(API_ENDPOINTS.RECEIPTS.BY_PATIENT(patientId));
        return response.data;
    }

    /**
     * Permite descargar en formato PDF la información de un recibo
     */
    async downloadReceiptPdf(id: number): Promise<Blob> {
        const response = await axios.get(
            API_ENDPOINTS.RECEIPTS.PDF_BY_ID(id), 
            { responseType: 'blob' }
        );
        return response.data;
    }

    /**
     * Crea un nuevo comprobante/deuda
     */
    async createVoucher(data: VoucherCreateDTO): Promise<VoucherResponseDTO> {
        const response = await axios.post<VoucherResponseDTO>(API_ENDPOINTS.VOUCHERS.BASE, data);
        return response.data;
    }

    /**
     * Obtiene un comprobante por su ID
     */
    async getVoucherById(id: number): Promise<VoucherDTO> {
        const response = await axios.get<VoucherDTO>(API_ENDPOINTS.VOUCHERS.BY_ID(id));
        return response.data;
    }

    /**
     * Obtiene todos los comprobantes de un paciente
     */
    async getPatientVouchers(patientId: number): Promise<VoucherDTO[]> {
        const response = await axios.get<VoucherDTO[]>(API_ENDPOINTS.VOUCHERS.BY_PATIENT(patientId));
        return response.data;
    }
}

export const currentAccountService = new CurrentAccountService();