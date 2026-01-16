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

export interface BillingProfile {
    _id: string;
    clientName: string;
    billingEmails: {
        to: string[];
        cc: string[];
    };
    paymentTerms: number;
    currency: string;
    billingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    logo?: string;
    status: 'active' | 'inactive';
    activeContracts?: number;
    totalRevenue?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Invoice {
    _id: string;
    invoiceNumber: string;
    clientId: string | any;
    clientName: string;
    status: 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'VOID';
    invoicePeriod: {
        type: 'MONTH' | 'CUSTOM';
        month?: string;
        startDate?: string;
        endDate?: string;
    };
    dueDate: string;
    totalBilledAmount: number;
    amountReceived: number;
    outstandingAmount: number;
    lineItems: any[];
    sentAt?: string;
    createdAt: string;
}

export interface RevenueLedgerReport {
    summary: {
        totalBilled: number;
        totalReceived: number;
        totalOutstanding: number;
        totalPaidOut: number;
        marginSnapshot: number;
        cashMargin: number;
        overdueAmount: number;
    };
    monthly: any[];
    byClient: any[];
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

    // Billing Profiles
    async getClientBillingProfiles(): Promise<BillingProfile[]> {
        const response = await apiClient.get('/api/admin/billing-profiles');
        return response.data.data.billingProfiles;
    }

    async createBillingProfile(data: any): Promise<BillingProfile> {
        const response = await apiClient.post('/api/admin/billing-profiles', data);
        return response.data.data.billingProfile;
    }

    async updateBillingProfile(id: string, data: any): Promise<BillingProfile> {
        const response = await apiClient.put(`/api/admin/billing-profiles/${id}`, data);
        return response.data.data.billingProfile;
    }

    // Invoices
    async getInvoices(params: any = {}): Promise<{ invoices: Invoice[], total: number }> {
        // Filter out undefined values to prevent "undefined" strings in query params
        const filteredParams: Record<string, string> = {};
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                filteredParams[key] = String(value);
            }
        });

        const searchParams = new URLSearchParams(filteredParams);
        const response = await apiClient.get(`/api/admin/invoices?${searchParams.toString()}`);
        const data = response.data.data;
        return {
            invoices: data.invoices,
            total: data.count || data.total || 0
        };
    }

    async getInvoiceById(id: string): Promise<Invoice> {
        const response = await apiClient.get(`/api/admin/invoices/${id}`);
        return response.data.data.invoice;
    }

    async createInvoice(data: any): Promise<Invoice> {
        const response = await apiClient.post('/api/admin/invoices', data);
        return response.data.data.invoice;
    }

    async sendInvoice(id: string, note?: string): Promise<any> {
        const response = await apiClient.post(`/api/admin/invoices/${id}/send`, { note });
        return response.data.data;
    }

    async downloadInvoicePDF(id: string): Promise<Blob> {
        const response = await apiClient.get(`/api/admin/invoices/${id}/pdf`, {
            responseType: 'blob'
        });
        return response.data;
    }

    async downloadInvoiceZip(id: string): Promise<Blob> {
        const response = await apiClient.get(`/api/admin/invoices/${id}/zip`, {
            responseType: 'blob'
        });
        return response.data;
    }

    async recordInvoicePayment(id: string, data: any): Promise<any> {
        const response = await apiClient.post(`/api/admin/invoices/${id}/payments`, data);
        return response.data.data.payment;
    }

    async getInvoicePayments(id: string): Promise<any[]> {
        const response = await apiClient.get(`/api/admin/invoices/${id}/payments`);
        return response.data.data.payments;
    }

    // Revenue Ledger
    async getRevenueLedgerReport(from: string, to: string): Promise<RevenueLedgerReport> {
        const response = await apiClient.get(`/api/reports/revenue-ledger?from=${from}&to=${to}`);
        return response.data.data;
    }
}

export default new FinanceService();
