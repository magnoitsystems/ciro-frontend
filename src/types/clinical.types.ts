import type { ShiftStatus } from "./enums.types";

export interface ShiftCreateDTO {
    patientDni: string;
    doctorId: number;
    shiftDate: string; 
    status: ShiftStatus;
    noteContent?: string; 
}

export interface ShiftResponseDTO {
    id: number;
    shiftDate: string;
    status: ShiftStatus;
    patientDni: string;
    patientFullName: string;
    doctorId: number;
    doctorFullName: string;
    noteDescription?: string;
}

export interface MedicalRecordCreateDTO {
    patientDni: string;
    doctorId: number;
    recordDate?: string; 
    evaluation?: string; 
    file?: File | null;
}

export interface MedicalRecordResponseDTO {
    id: number;
    recordDate: string;
    evaluation: string;
    fileUrl: string; 
    patientDni: string;
    patientFullName: string;
    doctorId: number;
    doctorFullName: string;
    shiftId?: number;
}
