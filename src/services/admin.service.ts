import apiClient from '../config/api.config';

export interface DashboardStats {
    recruiters: number;
    candidates: number;
    pendingPTO: number;
    totalSubmissions: number;
    approvedTimesheets: number;
    pendingTimesheets: number;
    totalPayouts: number;
    payoutCount: number;
    totalRevenue: number;
    monthlyGrowth: number;
    avgMargin: number;
    revenueForecast: number;
    recentActivities: any[];
    dateRange: {
        from: string;
        to: string;
        period: string;
    };
}

export interface DashboardChartData {
    chartData?: any[];
    revenueData?: any[];
    submissionData?: any[];
    submissionStatus?: any[];
    topPerformers?: any[];
    peakMonth?: string;
    dateRange: {
        from: string;
        to: string;
        period: string;
    };
}

export const AdminService = {

    async getDashboardStats(params: any = {}): Promise<{ success: boolean; stats: DashboardStats }> {
        const response = await apiClient.get('/api/admin/admin', { params });
        return response.data;
    },

    async getDashboardCharts(params: any = {}): Promise<DashboardChartData & { success: boolean }> {
        const response = await apiClient.get('/api/admin/charts', { params });
        return response.data;
    }
};

export default AdminService;
