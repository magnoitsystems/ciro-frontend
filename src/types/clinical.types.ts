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

export interface Budget {
    id?: number;
    uploadedDate: string;
    patient: PatientResponseDTO;
    file_url?: string;
}