import apiClient from '../config/api.config';

export interface Salary {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    month: string;
    base: number;
    finalAmount: number;
    hourlyRate: number;
    bonus: number;
    currency: string;
    payType: string;
    salaryMode: string;
    workingDays: number;
    workedDays: number;
    offDays: number;
    unpaidDays: number;
    status: 'pending' | 'processed' | 'paid';
    bankAccount?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const SalaryService = {
    async getAllSalaries(month?: string): Promise<Salary[]> {
        const response = await apiClient.get<Salary[]>('/api/admin/salary', {
            params: { month }
        });
        return response.data;
    },

    async addSalary(data: any): Promise<any> {
        const response = await apiClient.post('/api/admin/salary', data);
        return response.data;
    },

    async updateSalary(id: string, data: any): Promise<any> {
        const response = await apiClient.put(`/api/admin/salary/${id}`, data);
        return response.data;
    },

    async deleteSalary(id: string): Promise<any> {
        const response = await apiClient.delete(`/api/admin/salary/${id}`);
        return response.data;
    },

    async sendSlip(id: string): Promise<any> {
        const response = await apiClient.post(`/api/admin/salary/${id}/send-slip`);
        return response.data;
    },

    async exportCSV(): Promise<Blob> {
        const response = await apiClient.get('/api/admin/salary/export/csv', {
            responseType: 'blob'
        });
        return response.data;
    },

    async exportPDF(): Promise<Blob> {
        const response = await apiClient.get('/api/admin/salary/export/pdf', {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default SalaryService;
