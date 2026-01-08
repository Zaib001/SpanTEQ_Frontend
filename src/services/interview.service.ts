import apiClient from '../config/api.config';

export interface Interview {
    id: string;
    submissionId: string;
    candidateName: string;
    recruiterName: string;
    client: string;
    position: string;
    roundNumber: number;
    party: 'CLIENT' | 'PRIME_VENDOR' | 'VENDOR';
    vendorType: 'AMERICAN_VENDOR' | 'NON_AMERICAN_VENDOR' | null;
    stageLabel: string;
    mode: 'PHONE' | 'VIDEO' | 'IN_PERSON';
    scheduledAt: string;
    completedAt?: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    interviewerName?: string;
    notes?: string;
}

const InterviewService = {
    async getAllInterviews() {
        const response = await apiClient.get<{ success: boolean; data: Interview[] }>('/api/interviews');
        return response.data.data;
    },

    async getSubmissionInterviews(submissionId: string) {
        const response = await apiClient.get<{ success: boolean; data: Interview[] }>(`/api/submissions/${submissionId}/interviews`);
        return response.data.data;
    },

    async createInterview(submissionId: string, interviewData: Partial<Interview>) {
        const response = await apiClient.post(`/api/submissions/${submissionId}/interviews`, interviewData);
        return response.data;
    },

    async updateInterview(submissionId: string, interviewId: string, interviewData: Partial<Interview>) {
        const response = await apiClient.patch(`/api/submissions/${submissionId}/interviews/${interviewId}`, interviewData);
        return response.data;
    },

    async deleteInterview(submissionId: string, interviewId: string) {
        const response = await apiClient.delete(`/api/submissions/${submissionId}/interviews/${interviewId}`);
        return response.data;
    }
};

export default InterviewService;
