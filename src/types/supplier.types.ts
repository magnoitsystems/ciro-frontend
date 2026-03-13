export interface Supplier {
    id: number;
    fullName: string;
    address?: string;
    city?: string;
    dni?: string; 
    observations?: string;
}

export interface SupplierDTO {
    fullName: string;
    address?: string;
    city?: string;
    dni?: string;
    observations?: string;
}