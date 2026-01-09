import apiClient from '../config/api.config';

export interface PTORequest {
    _id: string;
    requestedBy: {
        _id: string;
        name: string;
        email: string;
    };
    role: 'recruiter' | 'candidate' | 'admin';
    from: string;
    to: string;
    days: number;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;

    // Legacy mapping support 
    startDate?: string;
    endDate?: string;
    type?: string;
    totalDays?: number;
}

export const PTOService = {
    async getAllRequests(): Promise<PTORequest[]> {
        const response = await apiClient.get<PTORequest[]>('/api/admin/pto');
        return response.data;
    },

    async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<any> {
        const response = await apiClient.patch(`/api/admin/pto/${id}`, { status });
        return response.data;
    }
};

export default PTOService;
