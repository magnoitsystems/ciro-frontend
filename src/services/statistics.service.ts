import { api } from './api';
import { API_ENDPOINTS } from './api.endpoints';
import type { StatisticsResponseDTO } from '../types/statistics.types';

class StatisticsService {
    async getDashboardStats(startDate?: string, endDate?: string): Promise<StatisticsResponseDTO> {
        try {
            const params: Record<string, string> = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await api.get<StatisticsResponseDTO>(
                API_ENDPOINTS.STATISTICS.DASHBOARD, 
                { params }
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener las estadísticas:", error);
            throw error;
        }
    }
}

export const statisticsService = new StatisticsService();