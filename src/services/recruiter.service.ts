import apiClient from '../config/api.config';
import type { Submission } from './submission.service';
import type { Timesheet } from './timesheet.service';
import type { PTORequest } from './pto.service';
import type { User } from './user.service';

export const RecruiterService = {
    // --- Dashboard & Charts ---
    async getDashboardStats(): Promise<any> {
        const response = await apiClient.get('/api/recruiter/dashboard');
        return response.data;
    },

    async getDashboardStatsDetails(params?: any): Promise<any> {
        const response = await apiClient.get('/api/recruiter/dashboard/stats', { params });
        return response.data;
    },

    async getDashboardCharts(params?: any): Promise<any> {
        const response = await apiClient.get('/api/recruiter/dashboard/charts', { params });
        return response.data;
    },

    // --- Import ---
    async importSubmissions(data: any): Promise<any> {
        const response = await apiClient.post('/api/recruiter/import', data);
        return response.data;
    },

    async bulkImportSubmissions(formData: FormData): Promise<any> {
        const response = await apiClient.post('/api/recruiter/submissions/bulk', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // --- Candidates (Recruiter's candidates) ---
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

    // --- Submissions (Recruiter's submissions) ---
    async getSubmissions(params?: any): Promise<Submission[]> {
        const response = await apiClient.get<any>('/api/recruiter/submissions', { params });
        if (response.data && Array.isArray(response.data.submissions)) return response.data.submissions;
        if (response.data && Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data)) return response.data;
        return [];
    },

    async getSubmissionById(id: string): Promise<Submission> {
        const response = await apiClient.get<{ success: boolean; data: Submission }>(`/api/recruiter/submissions/${id}`);
        return response.data.data;
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

    async exportSubmissionsCSV(params?: any): Promise<Blob> {
        const response = await apiClient.get('/api/recruiter/submissions/export/csv', { params, responseType: 'blob' });
        return response.data;
    },

    async exportSubmissionsPDF(): Promise<Blob> {
        const response = await apiClient.get('/api/recruiter/submissions/export/pdf', { responseType: 'blob' });
        return response.data;
    },

    // --- Timesheets (Recruiter's own) ---
    async getMyTimesheets(params?: any): Promise<Timesheet[]> {
        const response = await apiClient.get<any>('/api/recruiter/timesheets', { params });

        // Comprehensive data check
        if (response.data) {
            // Check for structured { success: true, timesheets: [] }
            if (response.data.success && Array.isArray(response.data.timesheets)) {
                return response.data.timesheets;
            }
            // Check for { timesheets: [] }
            if (Array.isArray(response.data.timesheets)) {
                return response.data.timesheets;
            }
            // Check for { data: [] }
            if (Array.isArray(response.data.data)) {
                return response.data.data;
            }
            // Check for direct array []
            if (Array.isArray(response.data)) {
                return response.data;
            }
        }
        return [];
    },

    async submitMyTimesheet(data: any): Promise<Timesheet> {
        const response = await apiClient.post<any>('/api/recruiter/timesheets', data);
        return response.data.timesheet || response.data;
    },

    // --- PTO (Recruiter's own) ---
    async getMyPTORequests(params?: any): Promise<PTORequest[]> {
        const response = await apiClient.get<any>('/api/recruiter/pto', { params });
        if (response.data && Array.isArray(response.data.requests)) return response.data.requests;
        if (response.data && Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data)) return response.data;
        return [];
    },

    async submitMyPTORequest(data: any): Promise<PTORequest> {
        const response = await apiClient.post<any>('/api/recruiter/pto', data);
        return response.data.request || response.data;
    },

    // --- Candidate Management (Helper/Legacy Actions by recruiter on candidates) ---
    async getCandidateTimesheets(): Promise<Timesheet[]> {
        const response = await apiClient.get<any>('/api/recruiter/timesheets/candidates'); // Verify if this matches actual backend if needed
        if (response.data && Array.isArray(response.data.data)) return response.data.data;
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

    async updatePTOStatus(id: string, status: 'approved' | 'rejected'): Promise<PTORequest> {
        const response = await apiClient.patch<PTORequest>(`/api/recruiter/pto/${id}`, { status });
        return response.data;
    },

    // --- Performance ---
    async getRecruiterPerformance(recruiterId: string): Promise<any> {
        const response = await apiClient.get<any>(`/api/performance/recruiter/${recruiterId}`);
        return response.data;
    }
};

export default RecruiterService;
