export interface StatItemDTO {
    label: string;
    amount?: number; 
    count?: number; 
    percentage: number;
}

export interface PatientStatsDTO {
    totalPatients: number;
    totalDebtors: number;
    totalNonDebtors: number;
    patientsByOrigin: StatItemDTO[];
    patientsByCity: StatItemDTO[];
}

export interface FinancialStatsDTO {
    currentMonthIncomePesos: number;
    currentMonthIncomeDollars: number;
    currentMonthExpensesPesos: number;
    currentMonthExpensesDollars: number;
    
    previousMonthIncomePesos: number;
    previousMonthIncomeDollars: number;
    
    incomeBreakdown: StatItemDTO[];
}

export interface StatisticsResponseDTO {
    financial: FinancialStatsDTO;
    patients: PatientStatsDTO;
    implantsThisMonth: number;
}