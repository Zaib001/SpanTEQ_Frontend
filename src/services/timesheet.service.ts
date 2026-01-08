import apiClient from '../config/api.config';

export interface Timesheet {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    submittedByRole: string;
    from: string;
    to: string;
    filename: string;
    hours: number;
    totalPay: number;
    status: 'pending' | 'approved' | 'rejected' | 'submitted';
    approvedBy?: {
        name: string;
    };
    approvedAt?: string;
    calculatedAmount?: number;
    createdAt: string;
    updatedAt: string;

    notes?: string;
    project?: string;
    client?: string;
}

export interface GetTimesheetsResponse {
    success: boolean;
    count: number;
    timesheets: Timesheet[];
}

export const TimesheetService = {
    async getAllTimesheets(params: any = {}): Promise<GetTimesheetsResponse> {
        const response = await apiClient.get<GetTimesheetsResponse>('/api/admin/timesheets', { params });
        return response.data;
    },

    async getTimesheetById(id: string): Promise<Timesheet> {
        const response = await apiClient.get<{ success: boolean; timesheet: Timesheet }>(`/api/admin/timesheets/${id}`);
        return response.data.timesheet;
    },

    async updateTimesheet(id: string, data: any): Promise<any> {
        const response = await apiClient.put(`/api/admin/timesheets/${id}`, data);
        return response.data;
    },

    async deleteTimesheet(id: string): Promise<any> {
        const response = await apiClient.delete(`/api/admin/timesheets/${id}`);
        return response.data;
    },

    async generatePDF(userId: string, month: string): Promise<Blob> {
        const response = await apiClient.get(`/api/admin/timesheets/${userId}/${month}`, {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default TimesheetService;
