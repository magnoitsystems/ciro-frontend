import type { ImplantType, ShiftStatus, SurgeryType } from "./enums.types";
import type { Patient } from "./patients.types";
import type { User } from "./users.types";

export interface Shift {
    id?: number;
    patient: Patient;
    doctor: User;
    shiftDate: string; 
    status: ShiftStatus;
}

export interface Practice {
    id?: number;
    patient: Patient;
    doctor: User;
    practiceDate: string;
    surgeryType?: SurgeryType;
    implantType?: ImplantType;
    reimplantation?: boolean;
    amount?: number;
}

export interface Budget {
    id?: number;
    uploadedDate: string;
    patient: Patient;
    file_url?: string;
}