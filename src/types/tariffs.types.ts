export interface TariffCreateDTO {
    name: string;
    tariffDate?: string;
    amountDollars?: number;
    amountPesos?: number;
    tc?: number;
}

export interface TariffUpdateDTO {
    name?: string;
    tariffDate?: string;
    amountDollars?: number;
    amountPesos?: number;
    tc?: number;
}

export interface TariffResponseDTO {
    id: number;
    name: string;
    tariffDate: string;
    amountDollars: number;
    amountPesos: number;
    tc: number;
}

export interface TariffFilters {
    keyword?: string;
    minPesos?: number;
    minDollars?: number;
}