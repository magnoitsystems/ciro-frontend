import type { CurrencyType, CurrentAccountType, PaymentMethod } from "./enums.types";

export interface CurrentAccountMovementDTO {
    id: number;
    date: string; 
    type: CurrentAccountType;
    detail: string;
    transactionAmountPesos: number;
    transactionAmountDollars: number;
    balancePesos: number;
    balanceDollars: number;
    canceled: boolean;
    receiptId?: number;
    voucherId?: number;
}

export interface CurrentAccountResponseDTO {
    patientId: number;
    patientFullName: string;
    debtInPesos: number;
    debtInDollars: number;
    movements: CurrentAccountMovementDTO[];
}

export interface PatientDebtorDTO {
    id: number;
    dni: string;
    fullName: string;
    debtPesos: number;
    debtDolares: number;
    doctorId?: number;
    doctorName?: string;
    overdue: boolean; 
}

export interface ReceiptCreateDTO {
    receiptDate?: string; 
    amount: number;
    observations?: string;
    currencyType: CurrencyType;
    patientId: number;
    doctorId: number;
    exchangeRate?: number;
    paymentMethod: PaymentMethod;
    payDollarDebtWithPesos: boolean; 
    voucherId?: number; 
    voucherDetailId?: number; 
}

export interface ReceiptResponseDTO {
    id: number;
    receiptDate: string;
    amount: number;
    currencyType: CurrencyType;
    exchangeRate?: number;
    convertedAmount?: number;
    patientFullName: string; 
    patientDni: string;
    doctorFullName: string;
    paymentMethod: PaymentMethod;
    observations: string;
    voucherId?: number; 
    voucherDetailId?: number; 
}

export interface VoucherDetailDTO {
    id?: number; 
    detail: string;
    unitPrice: number;
    amount: number; 
    dueDate?: string; 
}

export interface VoucherCreateDTO {
    patientId: number;
    userId: number;
    voucherDate?: string;
    observations?: string;
    currencyType: CurrencyType; 
    details: VoucherDetailDTO[];
}

export interface VoucherDTO {
    id: number;
    patientFullName: string;
    professionalFullName: string;
    voucherDate: string;
    currency: CurrencyType;
    observations?: string;
    totalAmount: number; 
    details: VoucherDetailDTO[];
}

export interface VoucherResponseDTO {
    voucherId: number;
    date: string;
    totalAmount: number;
    currencyType: CurrencyType; 
}

export interface RevenueWidgetDTO {
    totalPesos: number;
    totalDollars: number;
}