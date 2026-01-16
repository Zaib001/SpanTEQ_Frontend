import apiClient from '../config/api.config';

export interface Timesheet {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        role: string;
    } | null;
    submittedByRole: string;
    from: string;
    to: string;
    filename: string;
    hours: number;
    totalPay: number;
    status: 'pending' | 'approved' | 'rejected' | 'submitted';
    approvedBy?: {
        _id?: string;
        name: string;
    } | null;
    approvedAt?: string;
    calculatedAmount?: number;
    clientBillRate?: number;
    clientBillAmount?: number;
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

export interface CreateTimesheetPayload {
    user: string;
    submittedByRole: 'candidate' | 'recruiter';
    from: string;
    to: string;
    hours: number;
    filename?: string;
    totalPay?: number;
    status?: 'pending' | 'approved' | 'rejected';
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

    async createTimesheet(data: CreateTimesheetPayload): Promise<{ success: boolean; timesheet: Timesheet }> {
        const response = await apiClient.post('/api/admin/timesheets', data);
        return response.data;
    },

    async updateTimesheet(id: string, data: any): Promise<any> {
        const response = await apiClient.put(`/api/admin/timesheets/${id}`, data);
        return response.data;
    },

    async approveTimesheet(id: string): Promise<any> {
        return this.updateTimesheet(id, { status: 'approved' });
    },

    async rejectTimesheet(id: string): Promise<any> {
        return this.updateTimesheet(id, { status: 'rejected' });
    },

    async deleteTimesheet(id: string): Promise<any> {
        const response = await apiClient.delete(`/api/admin/timesheets/${id}`);
        return response.data;
    },

    async exportReport(params: any = {}): Promise<void> {
        const response = await apiClient.get('/api/admin/timesheets/export', {
            params,
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Timesheet_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    },

    async generatePDF(userId: string, month: string): Promise<void> {
        const response = await apiClient.get(`/api/admin/timesheets/${userId}/${month}`, {
            responseType: 'blob'
        });

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Timesheet_${userId}_${month}.pdf`);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode?.removeChild(link);
    }
};

export default TimesheetService;
