/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CashMovementType, CurrencyType, PaymentMethod } from './enums.types';

export interface PercentageSplitDTO {
    label: string;          
    doctorAmount: number; 
    clinicAmount: number;   
}

export interface CashMovementDetailDTO {
    id?: number;
    amount: number;
    currencyType: CurrencyType;
    paymentMethod: PaymentMethod;
    movementDate: string; 
    type: CashMovementType;
    observations?: string;
    doctorId?: number;
    relatedEntity?: any; 
    suggestedSplits?: PercentageSplitDTO[];
}