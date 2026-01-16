import apiClient from '../config/api.config';

export interface Submission {
    _id: string;
    candidate: string | { _id: string; name: string; email?: string; phone?: string };
    recruiter: string | { _id: string; name: string; email?: string };
    reviewer?: string | { _id: string; name: string; email?: string };
    client: string;
    vendor?: string;
    clientNameNormalized?: string;
    vendorNameNormalized?: string;
    primeVendorNameNormalized?: string;
    technology: string;
    role: string;
    submissionDate: string;
    date?: string; // Legacy, aliased to submissionDate
    formattedDate?: string; // From backend transformation
    status: 'SUBMITTED' | 'ON_HOLD' | 'INTERVIEWING' | 'REJECTED' | 'PLACED' | 'CLOSED' | 'WITHDRAWN' | 'OFFERED';
    statusHistory?: {
        status: string;
        changedBy: string | { _id: string; name: string };
        changedAt: string;
        note?: string;
    }[];
    notes?: string;
    interviews?: {
        roundNumber?: number;
        party: 'CLIENT' | 'PRIME_VENDOR' | 'VENDOR';
        vendorType?: 'AMERICAN_VENDOR' | 'NON_AMERICAN_VENDOR' | null;
        stageLabel?: string;
        mode: 'PHONE' | 'VIDEO' | 'IN_PERSON';
        scheduledAt?: string;
        completedAt?: string;
        status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
        interviewerName?: string;
        notes?: string;
        _id?: string;
    }[];
    interviewCount?: number;
    lastInterviewStatus?: string | null;
    nextInterviewDate?: string | null;
    customFields?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetSubmissionsParams {
    page?: number;
    limit?: number;
    search?: string;
    recruiterId?: string; // Backend expects recruiterId
    client?: string; // Frontend filter
    vendor?: string; // Frontend filter
    technology?: string;
    status?: string; // Frontend filter
    startDate?: string; // Backend expects startDate
    endDate?: string; // Backend expects endDate
    mode?: 'detailed' | 'summary';
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

    async deleteMultipleSubmissions(ids: string[]): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.delete('/api/admin/submissions', { data: { ids } });
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
