import type { BudgetStatus } from "./enums.types";

export interface BudgetCreateDTO {
    patientId: number;
    uploadedDate?: string;
    date: string; 
    status: BudgetStatus;
    file?: File | null; 
}

export interface BudgetResponseDTO {
    id: number;
    uploadedDate: string;
    date: string; 
    status: BudgetStatus; 
    patientId: number;
    patientFullName: string;
    fileUrl: string;
}