import type { HealthInsurance, PatientFrom } from "./enums.types";
import type { User } from "./users.types";

export interface Label {
    id: number;
    label: string;
}

export interface Patient {
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
    createdBy?: User;
}

export interface PatientDTO {
    fullName: string;
    address?: string;
    city?: string;
    phone?: string;
    birthDate?: string;
}

export interface PatientUpdateDTO extends PatientDTO {
    obraSocial?: HealthInsurance;
    from?: PatientFrom;
    observations?: string;
}

export interface StatisticsDTO {
    count: number;
    patients: Patient[];
}