import apiClient from '../config/api.config';

export interface RevenueData {
    monthly: {
        month: string;
        revenue: number;
        payout: number;
        vendorPayouts: number;
        margin: number;
        salaryPayout: number;
    }[];
    totals: {
        totalRevenue: number;
        totalPayout: number;
        totalMargin: number;
    };
}

export interface Payout {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    payPeriod: {
        from: string;
        to: string;
    };
    totalHours: number;
    hourlyRate: number;
    totalAmount: number;
    currency: string;
    status: 'pending' | 'processed' | 'cancelled';
    paymentMethod: string;
    paymentReference?: string;
    processedAt?: string;
    processedBy?: {
        _id: string;
        name: string;
    };
    createdAt: string;
}

export interface PayoutsResponse {
    success: true;
    count: number;
    total: number;
    totalPages: number;
    currentPage: number;
    payouts: Payout[];
}

export interface VendorPayoutStats {
    totalPayouts: number;
    totalAmount: number;
    byStatus: Record<string, number>;
    byMonth: Record<string, number>;
}

class FinanceService {
    async getRevenueLedger(fromMonth: string, toMonth: string): Promise<RevenueData> {
        const response = await apiClient.get(`/api/salary/reports/revenue-vs-payout?fromMonth=${fromMonth}&toMonth=${toMonth}`);
        return response.data.data;
    }

    async getPayrollSnapshots(params: { userId?: string; role?: string; month?: string; fromMonth?: string; toMonth?: string } = {}): Promise<any> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) searchParams.append(key, value.toString());
        });
        const response = await apiClient.get(`/api/salary/snapshots?${searchParams.toString()}`);
        return response.data.data;
    }

    async getPayouts(params: { userId?: string; status?: string; from?: string; to?: string; page?: number; limit?: number } = {}): Promise<PayoutsResponse> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) searchParams.append(key, value.toString());
        });
        const response = await apiClient.get(`/api/payouts?${searchParams.toString()}`);
        return response.data;
    }

    async getVendorPayoutStats(fromDate?: string, toDate?: string): Promise<VendorPayoutStats> {
        const query = fromDate && toDate ? `?fromDate=${fromDate}&toDate=${toDate}` : '';
        const response = await apiClient.get(`/api/vendor-payouts/statistics${query}`);
        return response.data.data;
    }

    async getSubmissions(): Promise<any[]> {
        const response = await apiClient.get(`/api/admin/submissions`);
        return response.data.submissions || response.data.data || response.data;
    }

    async getInvoices() {
        return { success: true, invoices: [] };
    }

    async getClientBillingProfiles() {
        return { success: true, profiles: [] };
    }
}

export default new FinanceService();
