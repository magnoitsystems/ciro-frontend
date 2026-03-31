import axios from 'axios';
import { API_ENDPOINTS } from './api.endpoints';
import type { TariffCreateDTO, TariffFilters, TariffResponseDTO, TariffUpdateDTO } from '../types/tariffs.types';

class TariffService {
    
    /**
     * Crea un nuevo arancel.
     */
    async createTariff(data: TariffCreateDTO): Promise<TariffResponseDTO> {
        const response = await axios.post<TariffResponseDTO>(API_ENDPOINTS.TARIFFS.BASE, data);
        return response.data;
    }

    /**
     * Obtiene la lista de aranceles. Soporta filtros opcionales.
     */
    async getTariffs(filters?: TariffFilters): Promise<TariffResponseDTO[]> {
        const response = await axios.get<TariffResponseDTO[]>(API_ENDPOINTS.TARIFFS.BASE, {
            params: filters 
        });
        return response.data;
    }

    /**
     * Actualiza un arancel existente. 
     * Solo se enviarán los campos que vengan definidos en el DTO.
     */
    async updateTariff(id: number, data: TariffUpdateDTO): Promise<TariffResponseDTO> {
        const response = await axios.put<TariffResponseDTO>(API_ENDPOINTS.TARIFFS.BY_ID(id), data);
        return response.data;
    }

    /**
     * Elimina un arancel por su ID.
     */
    async deleteTariff(id: number): Promise<void> {
        await axios.delete(API_ENDPOINTS.TARIFFS.BY_ID(id));
    }
}

export const tariffService = new TariffService();