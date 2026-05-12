export interface StatItemDTO {
    label: string;
    amount?: number; 
    count?: number; 
    percentage: number;
    referenceIds?: number[]; 
}

export interface PatientStatsDTO {
    totalPatients: number;
    totalDebtors: number;
    totalNonDebtors: number;
    patientsByOrigin: StatItemDTO[];
    patientsByCity: StatItemDTO[];
    patientsByReason: StatItemDTO[];
    patientsByAppointmentStatus: StatItemDTO[]; 
}

export interface FinancialStatsDTO {
    currentPeriodIncomePesos: number;
    currentPeriodIncomeDollars: number;
    currentPeriodExpensesPesos: number;
    currentPeriodExpensesDollars: number;
    netProfitPesos: number; 
    netProfitDollars: number; 
    previousMonthIncomePesos?: number;
    previousMonthIncomeDollars?: number;
    incomeBreakdown: StatItemDTO[];
    expensesBreakdown: StatItemDTO[]; 
}

export interface StatisticsResponseDTO {
    financial: FinancialStatsDTO;
    patients: PatientStatsDTO;
    implantsThisMonth: number;
}