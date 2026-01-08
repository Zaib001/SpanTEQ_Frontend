import apiClient from '../config/api.config';

export interface Submission {
    _id: string;
    candidate: string | { _id: string; name: string; email?: string; phone?: string };
    recruiter: string | { name: string; email?: string };
    client: string;
    vendor: string;
    technology: string;
    role: string;
    date: string;
    status: 'SUBMITTED' | 'ON_HOLD' | 'INTERVIEWING' | 'REJECTED' | 'PLACED' | 'CLOSED' | 'WITHDRAWN' | 'OFFERED' | 'pending' | 'submitted' | 'interview' | 'offered' | 'placed' | 'rejected';
    notes?: string;
    rate?: string;
    interviews?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetSubmissionsParams {
    page?: number;
    limit?: number;
    search?: string;
    recruiter?: string;
    client?: string;
    vendor?: string;
    technology?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface GetSubmissionsResponse {
    success: boolean;
    count: number;
    total: number;
    totalPages: number;
    currentPage: number;
    submissions: Submission[];
}

export const SubmissionService = {
    
    async getAllSubmissions(params: GetSubmissionsParams = {}): Promise<GetSubmissionsResponse> {
        const response = await apiClient.get<GetSubmissionsResponse>('/api/admin/submissions', { params });
        return response.data;
    },

    async getAnalytics(): Promise<any> {
        const response = await apiClient.get('/api/admin/submissions/analytics');
        return response.data;
    },

    async updateSubmission(id: string, data: Partial<Submission>): Promise<{ success: boolean; message: string; submission: Submission }> {
        const response = await apiClient.put(`/api/admin/submissions/${id}`, data);
        return response.data;
    },

    async deleteSubmission(id: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.delete(`/api/admin/submissions/${id}`);
        return response.data;
    },

    async assignReviewer(id: string, reviewerId: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.put(`/api/admin/submissions/${id}/reviewer`, { reviewerId });
        return response.data;
    },

    async importSubmissions(file: File): Promise<{ success: boolean; message: string; imported: number }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/api/admin/submissions/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async exportCSV(params: GetSubmissionsParams = {}): Promise<Blob> {
        const response = await apiClient.get('/api/admin/submissions/export/csv', {
            params,
            responseType: 'blob',
        });
        return response.data;
    },

    async exportPDF(params: GetSubmissionsParams = {}): Promise<Blob> {
        const response = await apiClient.get('/api/admin/submissions/export/pdf', {
            params,
            responseType: 'blob',
        });
        return response.data;
    },
};

export default SubmissionService;
