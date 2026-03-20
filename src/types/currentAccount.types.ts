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
}

export interface ReceiptCreateDTO {
    receiptDate?: string; 
    amount: number;
    observations?: string;
    currencyType: CurrencyType;
    patientId: number;
    userId: number;
    exchangeRate?: number;
    paymentMethod: PaymentMethod;
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
}

export interface VoucherDetailDTO {
    detail: string;
    unitPrice: number;
    currency: CurrencyType;
    amount: number; 
}

export interface VoucherCreateDTO {
    patientId: number;
    userId: number;
    voucherDate?: string;
    observations?: string;
    details: VoucherDetailDTO[];
}

export interface VoucherDTO {
    id: number;
    patientFullName: string;
    professionalFullName: string;
    voucherDate: string;
    currency: CurrencyType;
    observations?: string;
    totalAmountPesos: number;
    totalAmountDollars: number;
    details: VoucherDetailDTO[];
}

export interface VoucherResponseDTO {
    voucherId: number;
    date: string;
    totalAmountPesos: number;
    totalAmountDollars: number;
}