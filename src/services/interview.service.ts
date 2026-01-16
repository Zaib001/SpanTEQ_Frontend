import apiClient from '../config/api.config';

export interface Interview {
    _id: string; // Backend uses _id
    roundNumber: number;
    party: 'CLIENT' | 'PRIME_VENDOR' | 'VENDOR';
    vendorType: 'AMERICAN_VENDOR' | 'NON_AMERICAN_VENDOR' | null;
    stageLabel?: string;
    mode: 'PHONE' | 'VIDEO' | 'IN_PERSON';
    scheduledAt: string;
    completedAt?: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    interviewerName?: string;
    notes?: string;
    createdAt?: string; // Often returned by backend
    updatedAt?: string; // Often returned by backend
}

const InterviewService = {
    // NOTE: There is no global getAllInterviews endpoint in the backend. 
    // Interviews must be derived from Submissions.

    async getSubmissionInterviews(submissionId: string) {
        const response = await apiClient.get<{ success: boolean; data: Interview[] }>(`/api/submissions/${submissionId}/interviews`);
        return response.data.data;
    },

    async createInterview(submissionId: string, interviewData: Partial<Interview>) {
        const response = await apiClient.post<{ success: boolean; message: string; data: Interview }>(`/api/submissions/${submissionId}/interviews`, interviewData);
        return response.data.data;
    },

    async updateInterview(submissionId: string, interviewId: string, interviewData: Partial<Interview>) {
        const response = await apiClient.patch<{ success: boolean; message: string; data: Interview }>(`/api/submissions/${submissionId}/interviews/${interviewId}`, interviewData);
        return response.data.data;
    },

    async deleteInterview(submissionId: string, interviewId: string) {
        const response = await apiClient.delete<{ success: boolean; message: string }>(`/api/submissions/${submissionId}/interviews/${interviewId}`);
        return response.data;
    }
};

export default InterviewService;
