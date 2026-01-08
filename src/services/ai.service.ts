import apiClient from '../config/api.config';

export interface AISession {
    id: string;
    candidateName: string;
    clientName: string;
    position: string;
    recruiter: string;
    interviewDate: string;
    usedOn: string;
    sessionStatus: 'Completed' | 'Active' | 'Incomplete';
    purpose: string;
    duration: number;
    tokensUsed: number;
    aiScore: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyTopics: string[];
    cost: number;
    notes: string;
}

export interface AIAnalytics {
    totalSessions: number;
    completedSessions: number;
    totalDuration: number;
    totalTokens: number;
    totalCost: number;
    avgScore: number;
    activeCandidates: number;
    activeRecruiters: number;
}

const AIService = {
    
    async getAISessions(filters?: { candidateName?: string; fromDate?: string; toDate?: string }) {
        const response = await apiClient.get<{ success: boolean; data: AISession[] }>('/api/ai/sessions', {
            params: filters
        });
        return response.data.data;
    },

    async getAIAnalytics() {
        const response = await apiClient.get<{ success: boolean; data: AIAnalytics }>('/api/ai/analytics');
        return response.data.data;
    }
};

export default AIService;
