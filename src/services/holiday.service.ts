import apiClient from '../config/api.config';

export interface Holiday {
    id?: string;
    _id?: string;
    name: string;
    date: string;
    country: 'IN' | 'US';
    holidayType: 'COMPANY' | 'PUBLIC';
}

export const HolidayService = {
    async getAllHolidays(): Promise<Holiday[]> {
        const response = await apiClient.get<Holiday[]>('/api/holidays');

        return (response.data as any).data || response.data;
    },

    async createHoliday(holiday: Omit<Holiday, 'id' | '_id'>): Promise<Holiday> {
        const response = await apiClient.post<Holiday>('/api/holidays', holiday);
        return (response.data as any).data || response.data;
    },

    async updateHoliday(id: string, holiday: Partial<Holiday>): Promise<Holiday> {
        const response = await apiClient.patch<Holiday>(`/api/holidays/${id}`, holiday);
        return (response.data as any).data || response.data;
    },

    async deleteHoliday(id: string): Promise<void> {
        await apiClient.delete(`/api/holidays/${id}`);
    }
};

export default HolidayService;
