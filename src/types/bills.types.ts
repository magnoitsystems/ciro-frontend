import type { CurrencyType, PaymentMethod, BillStatus, BillType, OriginType } from './enums.types';

export interface BillCreateDTO {
    employeeId?: number; 
    supplierId?: number; 
    billDate: string;  
    amount: number;
    description: string;
    status: BillStatus;
    paymentMethod: PaymentMethod;
    currencyType: CurrencyType;
    from: OriginType;
    billType: BillType;
}

export interface BillResponseDTO {
    id: number;
    entityName: string;
    employeeId?: number;
    employeeFullName?: string;
    supplierId?: number;
    supplierFullName?: string;
    billDate: string;
    amount: number;
    description: string;
    status: BillStatus;
    paymentMethod: PaymentMethod;
    currencyType: CurrencyType;
    from: OriginType;
    billType: BillType;
}