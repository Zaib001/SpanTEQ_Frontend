import apiClient from '../config/api.config';

export interface DocumentRequest {
    _id: string;
    requestedBy: {
        _id: string;
        name: string;
        email: string;
    };
    requestedFrom: {
        _id: string;
        name: string;
        email: string;
        assignedRecruiter?: string;
    };
    relatedSubmissionId?: {
        _id: string;
        client?: string;
        vendor?: string;
    };
    type: 'ID_PROOF' | 'W2' | 'OFFER' | 'TIMESHEET' | 'OTHER';
    status: 'PENDING' | 'UPLOADED' | 'REVIEWED' | 'REJECTED';
    fileRef?: string;
    notes?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDocumentRequestPayload {
    requestedFrom: string;
    type: string;
    relatedSubmissionId?: string;
    notes?: string;
}

export const DocumentService = {
    async getDocumentRequests(filters?: any): Promise<DocumentRequest[]> {
        const response = await apiClient.get('/api/documents/requests', { params: filters });
        return response.data.data;
    },

    async getDocumentRequest(id: string): Promise<DocumentRequest> {
        const response = await apiClient.get(`/api/documents/requests/${id}`);
        return response.data.data;
    },

    async createDocumentRequest(payload: CreateDocumentRequestPayload): Promise<DocumentRequest> {
        const response = await apiClient.post('/api/documents/request', payload);
        return response.data.data;
    },

    async updateDocumentRequest(id: string, payload: Partial<DocumentRequest>): Promise<DocumentRequest> {
        const response = await apiClient.patch(`/api/documents/requests/${id}`, payload);
        return response.data.data;
    },

    async getDownloadUrl(requestId: string): Promise<{ downloadUrl: string; expiresAt: string }> {
        const response = await apiClient.get(`/api/documents/download/${requestId}`);
        return response.data.data;
    },

    async downloadFile(requestId: string): Promise<void> {
        const { downloadUrl } = await this.getDownloadUrl(requestId);

        window.open(downloadUrl, '_blank');
    }
};

export default DocumentService;
