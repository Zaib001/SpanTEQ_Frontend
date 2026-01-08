import apiClient from '../config/api.config';
import type { Submission } from './submission.service';
import type { Timesheet } from './timesheet.service';
import type { PTORequest } from './pto.service';
import type { User } from './user.service';

export const RecruiterService = {

    async getDashboardStats(): Promise<any> {
        const response = await apiClient.get('/api/recruiter/dashboard');
        return response.data;
    },

    async getMyCandidates(): Promise<User[]> {
        const response = await apiClient.get<any>('/api/recruiter/candidates');

        if (response.data && Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data)) return response.data;
        return [];
    },

    async createCandidate(data: any): Promise<User> {
        const response = await apiClient.post<User>('/api/recruiter/candidates', data);
        return response.data;
    },

    async updateCandidate(id: string, data: any): Promise<User> {
        const response = await apiClient.put<User>(`/api/recruiter/candidates/${id}`, data);
        return response.data;
    },

    async deleteCandidate(id: string): Promise<any> {
        const response = await apiClient.delete(`/api/recruiter/candidates/${id}`);
        return response.data;
    },

    async getSubmissions(): Promise<Submission[]> {
        const response = await apiClient.get<any>('/api/recruiter/submissions');

        if (response.data && Array.isArray(response.data.submissions)) return response.data.submissions;
        if (response.data && Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data)) return response.data;
        return [];
    },

    async createSubmission(data: any): Promise<Submission> {
        const response = await apiClient.post<Submission>('/api/recruiter/submissions', data);
        return response.data;
    },

    async updateSubmission(id: string, data: any): Promise<Submission> {
        const response = await apiClient.put<Submission>(`/api/recruiter/submissions/${id}`, data);
        return response.data;
    },

    async deleteSubmission(id: string): Promise<any> {
        const response = await apiClient.delete(`/api/recruiter/submissions/${id}`);
        return response.data;
    },

    async getCandidateTimesheets(): Promise<Timesheet[]> {
        const response = await apiClient.get<any>('/api/recruiter/timesheets/candidates');
        if (response.data && Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data)) return response.data;
        return [];
    },

    async approveTimesheet(id: string): Promise<Timesheet> {
        const response = await apiClient.patch<Timesheet>(`/api/recruiter/timesheets/${id}/approve`);
        return response.data;
    },

    async rejectTimesheet(id: string, reason: string): Promise<Timesheet> {
        const response = await apiClient.patch<Timesheet>(`/api/recruiter/timesheets/${id}/reject`, { reason });
        return response.data;
    },

    async getPTORequests(): Promise<PTORequest[]> {
        const response = await apiClient.get<any>('/api/recruiter/pto/candidates');
        if (response.data && Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data)) return response.data;
        return [];
    },

    async updatePTOStatus(id: string, status: 'approved' | 'rejected'): Promise<PTORequest> {

        const response = await apiClient.patch<PTORequest>(`/api/recruiter/pto/${id}`, { status });
        return response.data;
    }
};

export default RecruiterService;
