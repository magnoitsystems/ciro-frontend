import type { HealthInsurance, PatientFrom, DocumentType } from "./enums.types";

export interface Label {
    id: number;
    label: string;
}

export interface PatientCreateDTO {
    fullName: string;
    address?: string;
    city?: string;
    phone?: string;
    birthDate?: string; 
    documentType?: DocumentType;
    dni: string;
    obraSocial?: HealthInsurance;
    from?: PatientFrom;
    observations?: string;
    createdById: number;
}

export interface PatientUpdateDTO {
    fullName: string;
    address?: string;
    city?: string;
    phone?: string;
    birthDate?: string;
    obraSocial?: HealthInsurance;
    from?: PatientFrom;
    observations?: string;
}

export interface PatientResponseDTO {
    id: number;
    fullName: string;
    address?: string;
    city?: string;
    phone?: string;
    birthDate?: string;
    documentType?: DocumentType;
    dni: string;
    obraSocial?: HealthInsurance;
    from?: PatientFrom;
    observations?: string;
    createdById?: number;
    createdByName?: string; 
}

export interface PatientDebtorDTO {
    id: number;
    dni?: string;
    fullName?: string;
    debtPesos?: number;
    debtDolares?: number;
}

export interface StatisticsDTO {
    count: number;
    patients: PatientResponseDTO[];
}

export interface PatientSearchParams {
    dni?: string;
    fullName?: string;
    city?: string;
}