import apiClient from '../config/api.config';
import type { Submission } from './submission.service';
import type { Timesheet } from './timesheet.service';

export interface CandidateDashboardData {
    name: string;
    email: string;
    submissions: number;
    approvedTimesheets: number;
    ptoUsed: number;
    ptoBalance: number;
}

export interface CandidateProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    skills?: string;
}

export const CandidateService = {

    async getDashboard(): Promise<CandidateDashboardData> {
        const response = await apiClient.get<CandidateDashboardData>('/api/candidate/dashboard');
        return response.data;
    },

    async getProfile(): Promise<CandidateProfile> {
        const response = await apiClient.get<CandidateProfile>('/api/candidate/profile');
        return response.data;
    },

    async updateProfile(data: Partial<CandidateProfile>): Promise<{ message: string; user: CandidateProfile }> {
        const response = await apiClient.put<{ message: string; user: CandidateProfile }>('/api/candidate/profile', data);
        return response.data;
    },

    async getMySubmissions(): Promise<Submission[]> {
        const response = await apiClient.get<Submission[]>('/api/candidate/submissions');
        return response.data;
    },

    async createSubmission(data: {
        recruiter: string;
        client: string;
        vendor?: string;
        role?: string;
        technology?: string;
        notes?: string;
        date: string;
        status?: string;
        customFields?: Record<string, string>;
    }): Promise<Submission> {
        const response = await apiClient.post<Submission>('/api/candidate/submissions', data);
        return response.data;
    },

    async updateSubmission(id: string, data: {
        recruiter?: string;
        client?: string;
        vendor?: string;
        role?: string;
        technology?: string;
        notes?: string;
        date?: string;
        status?: string;
        customFields?: Record<string, string>;
    }): Promise<Submission> {
        const response = await apiClient.put<Submission>(`/api/candidate/submissions/${id}`, data);
        return response.data;
    },

    async withdrawSubmission(id: string): Promise<Submission> {
        const response = await apiClient.delete<Submission>(`/api/candidate/submissions/${id}`);
        return response.data;
    },

    async getRecruiters(): Promise<Array<{ _id: string; name: string; email: string }>> {
        const response = await apiClient.get<Array<{ _id: string; name: string; email: string }>>('/api/candidate/submissions/recruiters');
        return response.data;
    },

    async getMyTimesheets(): Promise<Timesheet[]> {
        const response = await apiClient.get<Timesheet[]>('/api/candidate/timesheet');

        return response.data;
    },

    async submitTimesheet(data: FormData): Promise<Timesheet> {
        const response = await apiClient.post<Timesheet>('/api/candidate/timesheet', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }
};

export default CandidateService;
