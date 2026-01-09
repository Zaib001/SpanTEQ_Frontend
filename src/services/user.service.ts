import apiClient from '../config/api.config';

export interface User {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: 'admin' | 'recruiter' | 'candidate';
    status: 'active' | 'inactive';
    isVerified: boolean;
    createdAt: string;
    assignedBy?: {
        name: string;
        email: string;
    };

    firstName?: string;
    lastName?: string;
    department?: string;
    location?: string;
    phone?: string;
    permissions?: string[];
    experience?: string;
    tech?: string;
    dob?: string;
    currency?: string;
    ptoLimit?: number;
    workingDays?: number;
    joiningDate?: string;
    payCycleChangeMonth?: number;

    currentContract?: {
        payType: string;
        baseRate: number;
        commissionShare: number;
        currency: string;
        active: boolean;
    };
}

export interface UserStats {
    total: number;
    totalUsers?: number;
    recruiters: number;
    candidates: number;
    active: number;
    activeUsers?: number;
    pendingPTO?: number;
    pendingDocRequests?: number;
    totalSubmissions?: number;
    pendingSubmissionsCount?: number;
    pendingTimesheets?: number;
    newCandidatesCount?: number;
    newRecruitersCount?: number;
}

export interface CreateUserPayload {
    name: string;
    email: string;
    password?: string;
    role: string;
    department?: string;
    location?: string;
    phone?: string;

    annualSalary?: number;
    vendorBillRate?: number;
    candidateShare?: number;
    currency?: string;
    ptoLimit?: number;
    workingDays?: number;
    joiningDate?: string;
    payCycleChangeMonth?: number;
    assignedRecruiter?: string;
    recruiterBonusEnabled?: boolean;

}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
    status?: 'active' | 'inactive';
    permissions?: string[];
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    isVerified?: boolean;
}

export interface GetUsersResponse {
    success: boolean;
    count: number;
    total: number;
    totalPages: number;
    currentPage: number;
    users: User[];
}

export const UserService = {

    async getAllUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
        const response = await apiClient.get<GetUsersResponse>('/api/admin/users', { params });
        return response.data;
    },

    async getUser(id: string): Promise<{ success: boolean; user: User }> {
        const response = await apiClient.get<{ success: boolean; user: User }>(`/api/admin/users/${id}`);
        return response.data;
    },

    async createUser(data: CreateUserPayload): Promise<{ success: boolean; message: string; user: User }> {
        const response = await apiClient.post('/api/admin/users', data);
        return response.data;
    },

    async updateUser(id: string, data: UpdateUserPayload): Promise<{ success: boolean; message: string; user: User }> {
        const response = await apiClient.put(`/api/admin/users/${id}`, data);
        return response.data;
    },

    async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.delete(`/api/admin/users/${id}`);
        return response.data;
    },

    async getUserStats(): Promise<UserStats> {
        const response = await apiClient.get('/api/admin/admin');
        const stats = response.data.stats;

        return {
            total: stats.totalUsers || 0,
            totalUsers: stats.totalUsers || 0,
            recruiters: stats.recruiters || 0,
            candidates: stats.candidates || 0,
            active: stats.activeUsers || 0,
            activeUsers: stats.activeUsers || 0,
            pendingPTO: stats.pendingPTO || 0,
            pendingDocRequests: stats.pendingDocRequests || 0,
            totalSubmissions: stats.totalSubmissions || 0,
            pendingSubmissionsCount: stats.pendingSubmissionsCount || 0,
            pendingTimesheets: stats.pendingTimesheets || 0,
            newCandidatesCount: stats.newCandidatesCount || 0,
            newRecruitersCount: stats.newRecruitersCount || 0
        };
    },

    async toggleVerification(id: string): Promise<{ success: boolean; message: string; isVerified: boolean }> {
        const response = await apiClient.patch(`/api/admin/users/${id}/verify`);
        return response.data;
    },

    async exportUsers(): Promise<void> {
        try {
            const response = await this.getAllUsers({ limit: 1000 }); // Fetch up to 1000 users for export
            const users = response.users;

            if (!users || users.length === 0) {
                throw new Error('No users to export');
            }

            const headers = ['Name', 'Email', 'Role', 'Status', 'Verified', 'Phone', 'Department', 'Location', 'Joined Date'];
            const csvContent = [
                headers.join(','),
                ...users.map(user => [
                    `"${user.name}"`,
                    `"${user.email}"`,
                    user.role,
                    user.status,
                    user.isVerified ? 'Yes' : 'No',
                    `"${user.phone || ''}"`,
                    `"${(user as any).department || ''}"`,
                    `"${(user as any).location || ''}"`,
                    new Date(user.createdAt).toLocaleDateString()
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
            throw error;
        }
    }
};

export default UserService;
