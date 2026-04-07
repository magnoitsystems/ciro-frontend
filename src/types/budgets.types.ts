export interface BudgetCreateDTO {
    patientId: number;
    uploadedDate?: string;
    file?: File | null; 
}

export interface BudgetResponseDTO {
    id: number;
    uploadedDate: string;
    patientId: number;
    patientFullName: string;
    fileUrl: string;
}