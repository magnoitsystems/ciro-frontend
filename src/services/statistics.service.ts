import axios from 'axios';
import type { StatisticsResponseDTO } from '../types/statistics.types';
import { API_ENDPOINTS } from './api.endpoints';

class StatisticsService {
    
    /**
     * Obtiene todas las estadísticas complejas del dashboard general.
     * Trae datos financieros del mes actual y anterior, métricas de pacientes deudores y más.
     */
    async getDashboardStats(): Promise<StatisticsResponseDTO> {
        const response = await axios.get<StatisticsResponseDTO>(API_ENDPOINTS.STATISTICS.DASHBOARD);
        return response.data;
    }

}

export const statisticsService = new StatisticsService();