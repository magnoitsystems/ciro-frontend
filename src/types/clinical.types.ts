import type { ShiftStatus } from "./enums.types";
import type { PatientResponseDTO } from "./patients.types";
import type { UserResponseDTO } from "./users.types";

export interface Shift {
  id?: number;
  patient: PatientResponseDTO;
  doctor: UserResponseDTO;
  shiftDate: string;
  status: ShiftStatus;
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
