import apiClient from '../config/api.config';
import type { Submission } from './submission.service';
import type { Timesheet } from './timesheet.service';

export const CandidateService = {

    async getMySubmissions(): Promise<Submission[]> {
        const response = await apiClient.get<Submission[]>('/api/candidate/submissions');
        return response.data;
    },

    async createSubmission(data: {
        client: string;
        vendor?: string;
        date: string;
        status?: string;
    }): Promise<Submission> {
        const response = await apiClient.post<Submission>('/api/candidate/submissions', data);
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
