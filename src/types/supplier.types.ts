export interface SupplierCreateDTO {
    fullName: string;
    address: string;
    city: string;
    dni: string;
    observations?: string;
}

export interface SupplierResponseDTO {
    id: number;
    fullName: string;
    address: string;
    city: string;
    dni: string;
    observations?: string;
}