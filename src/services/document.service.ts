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
    };
    type: string;
    status: 'PENDING' | 'UPLOADED' | 'APPROVED' | 'REJECTED' | 'REVIEWED';
    notes?: string;
    rejectionReason?: string;
    fileRef?: string;
    createdAt: string;
    updatedAt: string;
}

export const DocumentService = {
    // Get document requests (admin sees all, candidates see only their own)
    async getDocumentRequests(): Promise<DocumentRequest[]> {
        const response = await apiClient.get<{ success: boolean; data: DocumentRequest[] }>('/api/documents/requests');
        return response.data.data;
    },

    // Get my document requests (candidate-specific)
    async getMyRequests(): Promise<DocumentRequest[]> {
        const response = await apiClient.get<{ success: boolean; data: DocumentRequest[] }>('/api/documents/requests');
        return response.data.data;
    },

    async uploadDocument(payload: { requestId: string; candidateId: string; documentType: string }): Promise<{ success: boolean; data: any }> {
        const response = await apiClient.post<{ success: boolean; data: any }>('/api/documents/upload', payload);
        return response.data;
    },

    async getDownloadUrl(requestId: string): Promise<{ success: boolean; data: { downloadUrl: string } }> {
        const response = await apiClient.get<{ success: boolean; data: { downloadUrl: string } }>(`/api/documents/download/${requestId}`);
        return response.data;
    },

    // Create document request (admin/recruiter)
    async createDocumentRequest(payload: { requestedFrom: string; type: string; notes?: string }): Promise<{ success: boolean; data: DocumentRequest }> {
        const response = await apiClient.post<{ success: boolean; data: DocumentRequest }>('/api/documents/request', payload);
        return response.data;
    },

    // Update document request status (admin/recruiter)
    async updateDocumentRequest(requestId: string, payload: { status?: string; notes?: string; rejectionReason?: string }): Promise<{ success: boolean; data: DocumentRequest }> {
        const response = await apiClient.patch<{ success: boolean; data: DocumentRequest }>(`/api/documents/requests/${requestId}`, payload);
        return response.data;
    },

    // Download document file
    async downloadFile(requestId: string): Promise<void> {
        const response = await apiClient.get(`/api/documents/download/${requestId}/file`, {
            responseType: 'blob',
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `document-${requestId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};

export default DocumentService;
