import type { HealthInsurance, PatientFrom, DocumentType, ReasonForConsultation, AppointmentStatus } from "./enums.types";

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
    reasonForConsultation?: ReasonForConsultation;
    appointmentStatus?: AppointmentStatus;
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
    reasonForConsultation?: ReasonForConsultation;
    appointmentStatus?: AppointmentStatus;
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
    reasonForConsultation?: ReasonForConsultation;
    appointmentStatus?: AppointmentStatus;
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