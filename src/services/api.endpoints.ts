export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        REFRESH: '/api/v1/auth/refresh',
        LOGOUT: '/api/v1/auth/logout',
    },
    BILLS: {
        BASE: '/api/v1/bills',
        BY_ID: (id: number) => `/api/v1/bills/${id}`,
        REPORT_PDF: '/api/v1/bills/report/pdf',
    },
    BUDGETS: {
        BASE: '/api/v1/budgets',
        BY_ID: (id: number) => `/api/v1/budgets/${id}`,
        BY_PATIENT: (patientId: number) => `/api/v1/budgets/patient/${patientId}`,
    },
    CASH_MOVEMENTS: {
        BASE: '/api/v1/cash-movements',
        REPORT_PDF: '/api/v1/cash-movements/report/pdf',
        ASSIGN_DOCTOR: (id: number) => `/api/v1/cash-movements/${id}/assign-doctor`,
    },
    CURRENT_ACCOUNTS: {
        BASE: '/api/v1/current-accounts',
        BY_PATIENT: (patientId: number) => `/api/v1/current-accounts/patient/${patientId}`,
        PDF_BY_PATIENT: (patientId: number) => `/api/v1/current-accounts/patient/${patientId}/pdf`,
        CANCEL_DEBT: (patientId: number) => `/api/v1/current-accounts/patient/${patientId}/cancel-debt`,
    },
    LABELS: {
        BASE: '/api/v1/labels',
        BY_ID: (id: number) => `/api/v1/labels/${id}`,
    },
    LABEL_PATIENTS: {
        BASE: '/api/v1/labelPatients',
        BY_ID: (id: number) => `/api/v1/labelPatients/${id}`,
        BY_PATIENT: (patientId: number) => `/api/v1/labelPatients/patient/${patientId}`,
        BY_LABEL: (labelId: number) => `/api/v1/labelPatients/label/${labelId}`,
        BY_PATIENT_AND_LABEL: (patientId: number, labelId: number) => `/api/v1/labelPatients/patient/${patientId}/label/${labelId}`,
    },
    MEDICAL_RECORDS: {
        BASE: '/api/v1/medicalRecords',
        BY_ID: (id: number) => `/api/v1/medicalRecords/${id}`,
        BY_DOCTOR: (doctorId: number) => `/api/v1/medicalRecords/doctor/${doctorId}`,
        BY_PATIENT_DNI: (dni: string) => `/api/v1/medicalRecords/patient/${dni}`,
    },
    NOTES: {
        BASE: '/api/v1/notes',
        BY_ID: (id: number) => `/api/v1/notes/${id}`,
        BY_TASK: (taskId: number) => `/api/v1/notes/task/${taskId}`,
    },
    PATIENTS: {
        BASE: '/api/v1/patients',
        BY_ID: (id: number) => `/api/v1/patients/${id}`,
        SEARCH: '/api/v1/patients/search',
        ADD_LABEL: (patientId: number, labelId: number) => `/api/v1/patients/${patientId}/labels/${labelId}`,
        STATISTICS: (label: string) => `/api/v1/patients/statistics/${label}`,
        DEBTORS: '/api/v1/patients/debtors',
    },
    PRACTICES: {
        BASE: '/api/v1/practices',
        BY_ID: (id: number) => `/api/v1/practices/${id}`,
        BY_DOCTOR: (doctorId: number) => `/api/v1/practices/doctor/${doctorId}`,
        BY_PATIENT: (patientId: number) => `/api/v1/practices/patient/${patientId}`,
    },
    RECEIPTS: {
        BASE: '/api/v1/receipts',
        BY_ID: (id: number) => `/api/v1/receipts/${id}`,
        BY_PATIENT: (patientId: number) => `/api/v1/receipts/patient/${patientId}`,
        PDF_BY_ID: (id: number) => `/api/v1/receipts/${id}/pdf`,
    },
    SHIFTS: {
        BASE: '/api/v1/shifts',
        BY_ID: (id: number) => `/api/v1/shifts/${id}`,
        BY_DOCTOR: (doctorId: number) => `/api/v1/shifts/doctor/${doctorId}`,
        BY_PATIENT_DNI: (dni: string) => `/api/v1/shifts/patient/${dni}`,
    },
    SUPPLIERS: {
        BASE: '/api/v1/suppliers',
        BY_ID: (id: number) => `/api/v1/suppliers/${id}`,
    },
    TASKS: {
        BASE: '/api/v1/tasks',
        BY_ID: (id: number) => `/api/v1/tasks/${id}`,
        BY_USER: (userId: number) => `/api/v1/tasks/user/${userId}`,
        BY_STATUS: (status: string) => `/api/v1/tasks/status/${status}`,
    },
    USERS: {
        BASE: '/api/v1/users',
        BY_ID: (id: number) => `/api/v1/users/${id}`
    },
    VOUCHERS: {
        BASE: '/api/v1/vouchers',
        BY_ID: (id: number) => `/api/v1/vouchers/${id}`,
        BY_PATIENT: (patientId: number) => `/api/v1/vouchers/patient/${patientId}`,
    }
};