import apiClient from '../config/api.config';

export interface SalarySnapshot {
    _id: string;
    userId: string;
    month: string; // YYYY-MM
    year: number;
    monthNumber: number;
    totalPayout: number;
    currency: string;
    breakdown: {
        baseSalary: number;
        overtime: number;
        bonuses: number;
        deductions: number;
    };
    status: 'DRAFT' | 'FINALIZED' | 'PAID';
    createdAt: string;
}

export interface Salary {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email?: string;
        role?: string;
    } | string;
    month: string;
    base?: number;
    baseSalary?: number;
    finalAmount?: number;
    finalPay?: number;
    bonus?: number;
    currency?: string;
    createdAt?: string;
    role?: string;
    payModel?: string;
    bankAccount?: string;
    salaryDeduction?: number;
    details?: {
        incentiveTotal?: number;
    };
    isLocked?: boolean;
    processedAt?: string;
    approvedHours?: number;
    clientBillRate?: number;
    hourlyRate?: number;
    percentage?: number;
    excessPtoDays?: number;
}

export const SalaryService = {
    // Note: Verify the correct endpoint prefix. Based on routes check it was /api/salary-calculation
    async getSnapshots(): Promise<SalarySnapshot[]> {
        const response = await apiClient.get<any>('/api/salary/snapshots');
        const snapshots = response.data.data || [];

        // Map backend structure to frontend interface
        return snapshots.map((snap: any) => ({
            _id: snap._id,
            userId: snap.userId?._id || snap.userId,
            month: snap.month, // YYYY-MM
            year: parseInt(snap.month.split('-')[0]),
            monthNumber: parseInt(snap.month.split('-')[1]),
            totalPayout: snap.finalPay || 0,
            currency: snap.currency || 'USD',
            breakdown: {
                baseSalary: snap.baseSalary || 0,
                overtime: 0, // Not explicitly tracked in current backend model
                bonuses: snap.details?.incentiveTotal || 0,
                deductions: snap.salaryDeduction || 0,
            },
            status: snap.isLocked ? 'FINALIZED' : 'DRAFT', // Mapping isLocked to status
            createdAt: snap.createdAt || new Date().toISOString()
        }));
    },

    async getSnapshot(id: string): Promise<SalarySnapshot> {
        const response = await apiClient.get<any>(`/api/salary/snapshots/${id}`);
        const snap = response.data.data;

        if (!snap) throw new Error("Snapshot not found");

        return {
            _id: snap._id,
            userId: snap.userId?._id || snap.userId,
            month: snap.month,
            year: parseInt(snap.month.split('-')[0]),
            monthNumber: parseInt(snap.month.split('-')[1]),
            totalPayout: snap.finalPay || 0,
            currency: snap.currency || 'USD',
            breakdown: {
                baseSalary: snap.baseSalary || 0,
                overtime: 0,
                bonuses: snap.details?.incentiveTotal || 0,
                deductions: snap.salaryDeduction || 0,
            },
            status: snap.isLocked ? 'FINALIZED' : 'DRAFT',
            createdAt: snap.createdAt || new Date().toISOString()
        };
    },

    // Helper to get specific month snapshot if needed
    async getMyMonthSnapshot(month: string): Promise<SalarySnapshot> {
        // Assuming usage of current user ID from token
        // Backend route: /user/:userId/month/:month
        // We might need to decode token to get ID, or the backend might allow 'me' alias. 
        // For now, let's assume we rely on the generic list or pass ID if available in context.
        // Actually, let's stick to the list for now as per plan.
        throw new Error("Method not fully implemented without user ID context");
    },

    // Get all salaries (legacy endpoint)
    async getAllSalaries(): Promise<any[]> {
        const response = await apiClient.get<any>('/api/admin/salary');
        return response.data || [];
    },

    // Get user salary history
    async getSalaryHistory(userId: string): Promise<any> {
        const response = await apiClient.get<any>(`/api/admin/users/${userId}/salary-history`);
        return response.data || {};
    },

    // Calculate salary for a specific user and month
    async getSalaryCalculation(userId: string, month: string): Promise<any> {
        const response = await apiClient.get<any>(`/api/salary/calculate/${userId}/${month}`);
        return response.data || {};
    },

    // Export salaries to CSV
    async exportCSV(): Promise<Blob> {
        const response = await apiClient.get('/api/admin/salary/export/csv', {
            responseType: 'blob',
        });
        return response.data;
    },

    // Export salaries to PDF
    async exportPDF(): Promise<Blob> {
        const response = await apiClient.get('/api/admin/salary/export/pdf', {
            responseType: 'blob',
        });
        return response.data;
    }
};

export default SalaryService;
